import MagicString from 'magic-string'
import path from 'node:path'
import { cwd } from 'node:process'
import { type Plugin } from 'vite'
import {
  ExportAllDeclaration,
  ExportNamedDeclaration,
  Identifier,
  ModuleDeclaration,
  Statement,
  VariableDeclaration,
  VariableDeclarator,
  parse as ast,
} from 'acorn'

let entry: string[]

enum ExpType {
  ExportNamedDeclaration = 'ExportNamedDeclaration',
  ExportDefaultDeclaration = 'ExportDefaultDeclaration',
  ExportAllDeclaration = 'ExportAllDeclaration',
}

export function cjs(): Plugin {
  return {
    name: 'vite-plugin-cjs-default-export',

    async config({ build }) {
      if (!build?.lib) return

      const resolvedEntry = typeof build.lib.entry == 'object' ? Object.values(build.lib.entry) : [build.lib.entry]

      // TODO: 路径兼容问题
      entry = resolvedEntry.map((it) => {
        if (it.startsWith('.')) {
          return path.join(cwd(), it).replace(new RegExp(`\\${path.sep}`, 'g'), '/')
        }
        return it.replace(new RegExp(`${path.sep}`, 'g'), '/')
      })
    },

    async transform(code, id) {
      if (!entry || !entry.includes(id)) return
      const s = new MagicString(code)
      const { body } = ast(code, {
        ecmaVersion: 'latest',
        sourceType: 'module',
      })

      let hostName: string | undefined
      let exports: (ExportNamedDeclaration | ExportAllDeclaration)[] = []

      /**
       * // TODO: 多次从同一模块导入导出
        export { help } from './helper'
        export * as helper from './helper'

        import helper from './helper'
        host.${helper} = helper
        host.${help} = helper.help
      */
      let imports = []

      for (const node of body) {
        if (node.type == ExpType.ExportDefaultDeclaration) {
          hostName = (node.declaration as any).name
        } else if (node.type == ExpType.ExportNamedDeclaration || node.type == ExpType.ExportAllDeclaration) {
          exports.push(node)
        }
      }

      if (!hostName) return null

      let gen = '\r\n'

      exports.map((node) => {
        if (node.type == ExpType.ExportAllDeclaration) {
          s.remove(node.start, node.end)
          if (node.source) {
            s.append(`import ${(node.exported as Identifier).name} from '${node.source.value}'\r\n`)
            gen += `${hostName}.${(node.exported as Identifier).name} = ${(node.exported as Identifier).name}\r\n`
          }
        } else if (node.declaration) {
          // export var
          s.remove(node.start, node.start + 'export'.length + 1)

          const declarationName = (
            ((node.declaration as VariableDeclaration).declarations as VariableDeclarator[])[0].id as Identifier
          ).name
          gen += `${hostName}.${declarationName} = ${declarationName}\r\n`
        } else {
          s.remove(node.start, node.end)
          // export x from 'x'
          node.specifiers.map((sp) => {
            gen += `${hostName}.${(sp.exported as Identifier).name} = ${(sp.local as Identifier).name}\r\n`
          })

          if (node.source) {
            s.append(
              `import { ${node.specifiers.map((sp) => (sp.local as Identifier).name)} } from '${node.source.value}'`
            )
          }
        }
      })

      s.append(gen)

      return {
        code: s.toString(),
        map: s.generateMap(),
      }
    },
  }
}
