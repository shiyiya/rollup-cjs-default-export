var fire = (function () {
  'use strict'
  const i = 'help module',
    t = Date.now(),
    e = () => {
      console.log('fire', t)
    }
  return (e.fire = e), (e.time = t), (e.time3 = t), (e.time2 = t), (e.help = i), e
})()
