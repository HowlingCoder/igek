import { e as store_get, u as unsubscribe_stores, a as attr_class, f as bind_props, g as ensure_array_like, d as attr, j as clsx, s as sanitize_props, b as spread_props, c as slot } from './index2-BRhWf2Gt.js';
import { w as writable, g as get } from './index-zEcE8mVB.js';
import { M as Map_pin, I as Icon } from './map-pin-riU1R1My.js';
import { M as MapLibre, G as GeolocateControl, g as getMapContext, p as prepareMarkerContext, o as onDestroy } from './GeolocateControl-Bsy3XtyZ.js';
import { W as escape_html } from './context-nuHa5tfu.js';

function Clock($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    ["path", { "d": "M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" }],
    ["path", { "d": "M12 7v5l3 3" }]
  ];
  Icon($$renderer, spread_props([
    { type: "outline", name: "clock" },
    $$sanitized_props,
    {
      iconNode,
      children: ($$renderer2) => {
        $$renderer2.push(`<!--[-->`);
        slot($$renderer2, $$props, "default", {});
        $$renderer2.push(`<!--]-->`);
      },
      $$slots: { default: true }
    }
  ]));
}
const permissionStatus = writable("checking");
class ReportWizard {
  step;
  report;
  selectedLocation;
  selectedTime;
  constructor() {
    this.step = writable(1);
    this.selectedLocation = writable(null);
    this.selectedTime = writable(0);
    this.report = writable({
      id: 0,
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      location: { lat: 0, lng: 0 },
      timeOffsetMinutes: 0
    });
  }
  open() {
    this.step.set(1);
    this.selectedLocation.set(null);
    this.selectedTime.set(0);
    this.report.set({
      id: 0,
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      location: { lat: 0, lng: 0 },
      timeOffsetMinutes: 0
    });
  }
  next() {
    this.step.update((s) => Math.min(3, s + 1));
  }
  prev() {
    this.step.update((s) => Math.max(1, s - 1));
  }
  setLocation(loc) {
    this.selectedLocation.set(loc);
    this.report.update((r) => ({ ...r, location: loc ?? { lat: 0, lng: 0 } }));
  }
  setDetectedLocation(coords) {
    this.setLocation({ lng: coords.longitude, lat: coords.latitude });
  }
  setTime(opt) {
    this.selectedTime.set(opt);
    this.report.update((r) => ({
      ...r,
      timeOffsetMinutes: opt || 0
    }));
  }
  submit() {
    const s = get(this.step);
    if (s !== 3) return null;
    const payload = {
      timeOffsetMinutes: parseInt(String(get(this.selectedTime)), 10),
      location: get(this.selectedLocation),
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    };
    return payload;
  }
}
const wizard = new ReportWizard();
const step = wizard.step;
wizard.report;
const selectedLocation = wizard.selectedLocation;
wizard.selectedTime;
const openReport = () => wizard.open();
function Location_guard($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let { children } = $$props;
    if (store_get($$store_subs ??= {}, "$permissionStatus", permissionStatus) === "granted") {
      $$renderer2.push("<!--[-->");
      children?.($$renderer2);
      $$renderer2.push(`<!---->`);
    } else {
      $$renderer2.push("<!--[!-->");
      if (store_get($$store_subs ??= {}, "$permissionStatus", permissionStatus) === "checking" || true) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div><span class="loading loading-spinner"></span></div>`);
      }
      $$renderer2.push(`<!--]-->`);
    }
    $$renderer2.push(`<!--]-->`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
function Info_step($$renderer) {
  $$renderer.push(`<div class="flex flex-col min-h-full mx-auto mt-3"><h2 class="text-lg text-base-content/70">Danke!</h2> <div class="mt-6 flex items-start gap-3 max-w-lg">`);
  Map_pin($$renderer, { class: "w-6 h-6 text-primary shrink-0 mt-1", size: 24 });
  $$renderer.push(`<!----> <div class="flex-1"><p class="text-sm text-base-content/60">Im folgenden kannst du einen Ort in deiner Umgebung auswählen, von dem du glaubst, dass der Knall dort seinen Ursprung hat. Eine ungefähre Angabe reicht aus.</p> <p class="mt-3 italic text-sm text-base-content/40">Tipp: Du kannst die Karte verschieben und zoomen, um den genauen Ort auszuwählen.</p></div></div> <div class="mt-6 flex items-start gap-3 max-w-lg">`);
  Clock($$renderer, { class: "w-6 h-6 text-primary shrink-0 mt-1", size: 24 });
  $$renderer.push(`<!----> <p class="flex-1 text-sm text-base-content/60">Anschließend sagst du uns noch, wann der Knall war, damit wir dies auch zeitlich zuordnen können.</p></div> <div class="mt-6 max-w-lg p-3 bg-base-200 text-base-content/70 rounded-md"><div class="font-semibold">Hinweis</div> <div class="mt-1 text-sm text-base-content/60"><p class="mt-2">Deine Meldung wird auf der Übersichtkarte nur indirekt angezeigt. Wenn mehrere Meldungen aus einer Region eingehen, wird dies als Hotspot markiert, um Missbrauch zu verhindern.</p></div></div></div>`);
}
function Marker($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      lnglat = void 0,
      class: className = void 0,
      draggable,
      rotation,
      rotationAlignment,
      pitchAlignment,
      opacity,
      color,
      opacityWhenCovered,
      offset,
      subpixelPositioning,
      content,
      children,
      ondrag,
      ondragstart,
      ondragend,
      $$slots,
      $$events,
      ...restOptions
    } = $$props;
    const mapCtx = getMapContext();
    if (!mapCtx.map) throw new Error("Map instance is not initialized.");
    prepareMarkerContext();
    onDestroy(() => {
    });
    if (content) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div>`);
      content($$renderer2);
      $$renderer2.push(`<!----></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> `);
    children?.($$renderer2);
    $$renderer2.push(`<!---->`);
    bind_props($$props, { lnglat });
  });
}
function NavigationControl($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { position, $$slots, $$events, ...options } = $$props;
    const mapCtx = getMapContext();
    if (!mapCtx.map) throw new Error("Map instance is not initialized.");
    onDestroy(() => {
    });
  });
}
function Report_map($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let lnglat = { lng: 139.767052, lat: 35.681167 };
    let map = null;
    function setMarker(e) {
      const newLoc = { lng: e.lngLat.lng, lat: e.lngLat.lat };
      lnglat = newLoc;
      selectedLocation.set(newLoc);
    }
    const onGeolocate = (ev) => {
      try {
        const c = ev.coords ?? ev.coordinate ?? ev;
        const newLoc = {
          lng: c.longitude ?? c.lng ?? c[0],
          lat: c.latitude ?? c.lat ?? c[1]
        };
        lnglat = newLoc;
        selectedLocation.set(newLoc);
        map.flyTo({ center: [newLoc.lng, newLoc.lat], zoom: 14 });
      } catch (err) {
      }
    };
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      MapLibre($$renderer3, {
        style: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
        class: "h-[55vh] min-h-[300px] w-full",
        center: [lnglat.lng, lnglat.lat],
        zoom: 14,
        onclick: setMarker,
        children: ($$renderer4) => {
          Marker($$renderer4, {
            draggable: true,
            get lnglat() {
              return lnglat;
            },
            set lnglat($$value) {
              lnglat = $$value;
              $$settled = false;
            }
          });
          $$renderer4.push(`<!----> `);
          NavigationControl($$renderer4, {});
          $$renderer4.push(`<!----> `);
          GeolocateControl($$renderer4, {
            position: "top-left",
            positionOptions: { enableHighAccuracy: true },
            trackUserLocation: true,
            showAccuracyCircle: true,
            ongeolocate: onGeolocate
          });
          $$renderer4.push(`<!---->`);
        },
        $$slots: { default: true }
      });
    }
    do {
      $$settled = true;
      $$inner_renderer = $$renderer2.copy();
      $$render_inner($$inner_renderer);
    } while (!$$settled);
    $$renderer2.subsume($$inner_renderer);
  });
}
function Map_step($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    $$renderer2.push(`<div class="flex flex-col min-h-full mx-auto w-full mt-3"><div class="space-y-3"><h2 class="text-lg text-base-content/70">Wo hat es geknallt?</h2> <p class="text-sm text-base-content/60">Wähle den Punkt auf der Karte aus, von dem du glaubst, dass der Knall dort seinen Ursprung hat.</p> `);
    {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> <div class="border rounded-md overflow-hidden">`);
    Report_map($$renderer2);
    $$renderer2.push(`<!----></div> `);
    {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<p class="text-xs text-base-content/60">No location selected yet — click the map to pick a spot.</p>`);
    }
    $$renderer2.push(`<!--]--></div></div>`);
  });
}
function Time_step($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let timeOffset = 0;
    const options = [
      { value: 0, label: "Jetzt" },
      { value: 1, label: "Vor 1 Minute" },
      { value: 5, label: "Vor 5 Minuten" },
      { value: 10, label: "Vor 10 Minuten" }
    ];
    $$renderer2.push(`<div class="flex flex-col min-h-full mx-auto mt-3"><h2 class="text-lg text-base-content/70">Wann hast du den Knall gehört?</h2> <div class="grid grid-cols-1 gap-3 mt-6"><!--[-->`);
    const each_array = ensure_array_like(
      // sync store -> local (like in map-step)
      options
    );
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let opt = each_array[$$index];
      $$renderer2.push(`<label${attr_class(clsx(timeOffset === opt.value ? "btn btn-primary flex items-center justify-center gap-2" : "btn btn-outline flex items-center justify-center gap-2"))}><input type="radio" name="time-step"${attr("value", opt.value)} class="hidden"${attr("checked", timeOffset === opt.value, true)}/> ${escape_html(opt.label)}</label>`);
    }
    $$renderer2.push(`<!--]--></div> <div class="mt-6 max-w-lg p-3 bg-base-200 text-base-content/70 rounded-md"><div class="font-semibold">Hinweis</div> <div class="mt-1 text-sm text-base-content/60"><p class="mt-2">Denk bitte daran, dass deine Meldung nicht älter als 15 Minuten sein sollte, um die
				Genauigkeit der Daten zu gewährleisten.</p></div></div></div>`);
  });
}
function Report_modal($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    function openReport$1() {
      openReport();
    }
    $$renderer2.push(`<dialog class="modal" aria-label="Report wizard dialog"><form class="modal-box w-full h-full max-w-3xl flex flex-col" method="dialog"><div class="flex items-start justify-between"><h3 class="text-lg font-bold">Knall melden</h3> <button type="button" class="btn btn-ghost btn-sm">✕</button></div> <div class="mt-4 mb-2"><ul class="steps w-full"><li${attr_class(`step ${store_get($$store_subs ??= {}, "$step", step) === 1 ? "step-primary" : store_get($$store_subs ??= {}, "$step", step) > 1 ? "step-success" : ""}`)}>Info</li> <li${attr_class(`step ${store_get($$store_subs ??= {}, "$step", step) === 2 ? "step-primary" : store_get($$store_subs ??= {}, "$step", step) > 2 ? "step-success" : ""}`)}>Wo?</li> <li${attr_class(`step ${store_get($$store_subs ??= {}, "$step", step) === 3 ? "step-primary" : ""}`)}>Wann?</li></ul></div> <div class="divider my-0"></div> <div class="flex flex-1">`);
    if (store_get($$store_subs ??= {}, "$step", step) === 1) {
      $$renderer2.push("<!--[-->");
      Info_step($$renderer2);
    } else {
      $$renderer2.push("<!--[!-->");
      if (store_get($$store_subs ??= {}, "$step", step) === 2) {
        $$renderer2.push("<!--[-->");
        Location_guard($$renderer2, {
          children: ($$renderer3) => {
            Map_step($$renderer3);
          }
        });
      } else {
        $$renderer2.push("<!--[!-->");
        Time_step($$renderer2);
      }
      $$renderer2.push(`<!--]-->`);
    }
    $$renderer2.push(`<!--]--></div> <div class="divider my-0"></div> <div class="modal-action mt-6">`);
    if (store_get($$store_subs ??= {}, "$step", step) > 1) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<button type="button" class="btn">Zurück</button>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> `);
    if (store_get($$store_subs ??= {}, "$step", step) < 3) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<button type="button" class="btn btn-primary">Weiter</button>`);
    } else {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push(`<button type="button" class="btn btn-primary">Abschicken</button>`);
    }
    $$renderer2.push(`<!--]--></div></form></dialog>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
    bind_props($$props, { openReport: openReport$1 });
  });
}
function _page($$renderer) {
  $$renderer.push(`<div class="w-full h-full flex items-center justify-center p-6 bg-base-200"><div class="flex flex-col i min-h-full"><h1 class="text-3xl font-bold mb-2">Feuerwerks-Meldung</h1> <h2 class="text-lg text-base-content/70 mb-6">Melden Sie Störungen schnell und anonym</h2> `);
  Location_guard($$renderer, {
    children: ($$renderer2) => {
      $$renderer2.push(`<button class="btn btn-primary">🔔 Knall melden</button>`);
    }
  });
  $$renderer.push(`<!----> <p class="text-sm text-base-content/60 max-w-md mt-6">Deine Meldung wird anonym gespeichert und hilft, Hotspots zu erkennen. Öffentliche Daten sind nur
		aggregiert sichtbar, um Missbrauch zu verhindern.</p></div></div> `);
  Report_modal($$renderer, {});
  $$renderer.push(`<!---->`);
}

export { _page as default };
//# sourceMappingURL=_page.svelte-CuYzU8r_.js.map
