const time = Date.now()

// function name readonly
// export var name = 'name'

export const fire = () => {
  console.log('fire', time)
}

export { time, time as time3 }

export { time as time2 }

export { help } from './helper'
// export * as helper from './helper'

export default fire
