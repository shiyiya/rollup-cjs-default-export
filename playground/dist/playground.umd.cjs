(function(global, factory) {
  typeof exports === "object" && typeof module !== "undefined" ? module.exports = factory() : typeof define === "function" && define.amd ? define(factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, global.fire = factory());
})(this, function() {
  "use strict";
  const help = "help module";
  const helphelp = "helphelp";
  const __VITE__PLUGIN__MERGE_EXPORTS__1715247706179 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    help,
    helphelp
  }, Symbol.toStringTag, { value: "Module" }));
  const time = Date.now();
  const fire = () => {
    console.log("fire", time);
  };
  fire.fire = fire;
  fire.time = time;
  fire.time3 = time;
  fire.time2 = time;
  fire.help = help;
  fire.helphelp = helphelp;
  fire.helper = __VITE__PLUGIN__MERGE_EXPORTS__1715247706179;
  Object.assign(fire, __VITE__PLUGIN__MERGE_EXPORTS__1715247706179);
  return fire;
});
