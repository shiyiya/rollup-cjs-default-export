var fire = function() {
  "use strict";
  const help = "help module";
  const helphelp = "helphelp";
  const __VITE__PLUGIN__MERGE_EXPORTS__1715247706179 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    help,
    helphelp
  }, Symbol.toStringTag, { value: "Module" }));
  const time = Date.now();
  const fire2 = () => {
    console.log("fire", time);
  };
  fire2.fire = fire2;
  fire2.time = time;
  fire2.time3 = time;
  fire2.time2 = time;
  fire2.help = help;
  fire2.helphelp = helphelp;
  fire2.helper = __VITE__PLUGIN__MERGE_EXPORTS__1715247706179;
  Object.assign(fire2, __VITE__PLUGIN__MERGE_EXPORTS__1715247706179);
  return fire2;
}();
