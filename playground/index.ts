const time = Date.now()

const obj = {
  name: 1,
}

// function name readonly
// export var name = 'name'

export const fire = () => {
  console.log('fire', time)
}

// TODO
// export const o = obj.name

export { time, time as time3 }

export { time as time2 }

// TODO: tother
export { help } from './helper'
// export * as helper from './helper'

export default fire
