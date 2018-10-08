import 'core-js/es7/reflect';

// import 'web-animations-js';  // Run `npm install --save web-animations-js`.

declare global {
  interface Window {
    __Zone_disable_requestAnimationFrame: boolean;
    __Zone_disable_on_property: boolean;
    __zone_symbol__BLACK_LISTED_EVENTS: (keyof HTMLElementEventMap)[];
  }
}

window.__Zone_disable_requestAnimationFrame = true; // disable patch requestAnimationFrame
window.__Zone_disable_on_property = true; // disable patch onProperty such as onclick
window.__zone_symbol__BLACK_LISTED_EVENTS = ['scroll', 'mousemove', 'touchmove']; // disable patch specified eventNames

import 'zone.js/dist/zone';
import 'zone.js/dist/zone-patch-user-media';
import 'zone.js/dist/webapis-rtc-peer-connection';
