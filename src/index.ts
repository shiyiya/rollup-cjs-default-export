import MagicString from 'magic-string'
import path from 'node:path'
import { cwd } from 'node:process'
import { type Plugin } from 'vite'
import { ExportAllDeclaration, ExportNamedDeclaration, Identifier, VariableDeclaration, parse as ast } from 'acorn'

let entry: string[]

enum ExpType {
  ExportNamedDeclaration = 'ExportNamedDeclaration',
  ExportDefaultDeclaration = 'ExportDefaultDeclaration',
  ExportAllDeclaration = 'ExportAllDeclaration',
}

export function plugin(): Plugin {
  return {
    name: 'vite-plugin-merge-exports',

    apply: 'build',

    configResolved({ build }) {
      if (!build.lib) return

      const resolvedEntry = typeof build.lib.entry == 'object' ? Object.values(build.lib.entry) : [build.lib.entry]

      entry = resolvedEntry.map((it) => {
        if (!path.isAbsolute(it)) {
          return path.normalize(path.join(cwd(), it)).replace(new RegExp(`\\${path.sep}`, 'g'), '/')
        }
        return path.normalize(it).replace(new RegExp(`\\${path.sep}`, 'g'), '/')
      })
    },

    async transform(code, id) {
      if (!entry || !entry.includes(id.replace(new RegExp(`\\${path.sep}`, 'g'), '/'))) return

      const { body } = ast(code, {
        ecmaVersion: 'latest',
        sourceType: 'module',
      })

      const gen: string[] = []
      const s = new MagicString(code)

      let hostName: string | undefined
      let exports: (ExportNamedDeclaration | ExportAllDeclaration)[] = []

      for (const node of body) {
        if (node.type == ExpType.ExportDefaultDeclaration) {
          hostName = (node.declaration as Identifier).name
        } else if (node.type == ExpType.ExportAllDeclaration) {
          exports.push(node)
        } else if (node.type == ExpType.ExportNamedDeclaration) {
          const { specifiers } = node
          // export { name as default, name }
          const withoutDefaultNamedDeclaration = specifiers.filter(({ exported, local, start, end }) => {
            if (exported.type == 'Identifier' && local.type == 'Identifier' && exported.name == 'default') {
              hostName = local.name
              s.remove(start, end)
              gen.push(`export { ${local.name} as default };`)
              return false
            }

            return true
          })
          node.specifiers = withoutDefaultNamedDeclaration
          exports.push(node)
        }
      }

      // no default exported
      if (!hostName) return

      exports.map((node) => {
        // @ts-ignore
        const { type, start, end, source, exported } = node

        if (type == ExpType.ExportAllDeclaration) {
          s.remove(start, end)

          if (!exported) {
            // export * from ''
            const moduleId = `__VITE__PLUGIN__MERGE_EXPORTS__${Date.now()}`
            gen.push(`import * as ${moduleId} from '${source.value}'`)
            gen.push(`Object.assign(${hostName}, ${moduleId})`)
          } else {
            // export * as x from ''
            gen.push(`import * as ${(exported as Identifier).name} from '${source.value}'`)
            gen.push(`${hostName}.${(exported as Identifier).name} = ${(exported as Identifier).name}`)
          }

          return
        }

        const { declaration, specifiers } = node

        if (declaration) {
          // export var
          s.remove(start, start + 'export'.length + 1)

          const declarationName = ((declaration as VariableDeclaration).declarations[0].id as Identifier).name
          gen.push(`${hostName}.${declarationName} = ${declarationName}`)
        } else {
          // export x from 'x'
          s.remove(start, end)

          if (source) {
            gen.push(`import { ${specifiers.map((sp) => (sp.local as Identifier).name)} } from '${source.value}'`)
          }

          specifiers.map((sp) => {
            gen.push(`${hostName}.${(sp.exported as Identifier).name} = ${(sp.local as Identifier).name}`)
          })
        }
      })

      s.append(gen.join('\r\n'))

      return {
        code: s.toString(),
        map: s.generateMap(),
      }
    },

    buildEnd() {
      entry = []
    },
  }
}
