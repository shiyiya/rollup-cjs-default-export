const o = "help module", t = Date.now(), e = () => {
  console.log("fire", t);
};
e.fire = e;
e.time = t;
e.time3 = t;
e.time2 = t;
e.help = o;
export {
  e as default
};
