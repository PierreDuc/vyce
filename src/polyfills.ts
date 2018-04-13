import 'core-js/es7/reflect';

// import 'web-animations-js';  // Run `npm install --save web-animations-js`.

(window as any).__Zone_disable_requestAnimationFrame = true; // disable patch requestAnimationFrame
(window as any).__Zone_disable_on_property = true; // disable patch onProperty such as onclick
(window as any).__zone_symbol__BLACK_LISTED_EVENTS = ['scroll', 'mousemove']; // disable patch specified eventNames

import 'zone.js/dist/zone';
import 'zone.js/dist/zone-patch-user-media';
import 'zone.js/dist/webapis-rtc-peer-connection';
