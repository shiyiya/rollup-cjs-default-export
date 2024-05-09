const time = Date.now()

const obj = {
  name: 1,
}

// function name readonly
// export var name = 'name'

export const fire = () => {
  console.log('fire', time)
}

// TODO: export member
// export const o = obj.name

export { time, time as time3 }
export { time as time2 }

export { help, helphelp } from './helper'
export * as helper from './helper'
export * from './helper'

export default fire
