import { M as MapLibre, G as GeolocateControl, g as getMapContext, a as prepareSourceContext, s as snapshot, o as onDestroy, b as prepareLayerContext, c as getSourceContext } from './GeolocateControl-Bsy3XtyZ.js';
import { f as bind_props, b as spread_props } from './index2-BRhWf2Gt.js';
import './context-nuHa5tfu.js';

let layerIdCounter = 0;
let sourceIdCounter = 0;
function generateLayerID() {
  return `svmlgl-layer-${layerIdCounter++}`;
}
function generateSourceID() {
  return `svmlgl-source-${sourceIdCounter++}`;
}
function RawSource($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      source = void 0,
      id: _id,
      children,
      $$slots,
      $$events,
      ...spec
    } = $$props;
    spec = spec;
    const mapCtx = getMapContext();
    if (!mapCtx.map) throw new Error("Map instance is not initialized.");
    const id = _id ?? generateSourceID();
    const sourceCtx = prepareSourceContext();
    sourceCtx.id = id;
    mapCtx.waitForStyleLoaded((map) => {
      mapCtx.addSource(id, snapshot(spec));
      source = map.getSource(id);
    });
    onDestroy(() => {
      mapCtx.removeSource(id);
      source = void 0;
    });
    children?.($$renderer2);
    $$renderer2.push(`<!---->`);
    bind_props($$props, { source });
  });
}
function GeoJSONSource($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { source = void 0, id, children, $$slots, $$events, ...spec } = $$props;
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      RawSource($$renderer3, spread_props([
        { id, type: "geojson" },
        spec,
        {
          get source() {
            return source;
          },
          set source($$value) {
            source = $$value;
            $$settled = false;
          },
          children: ($$renderer4) => {
            children?.($$renderer4);
            $$renderer4.push(`<!---->`);
          },
          $$slots: { default: true }
        }
      ]));
    }
    do {
      $$settled = true;
      $$inner_renderer = $$renderer2.copy();
      $$render_inner($$inner_renderer);
    } while (!$$settled);
    $$renderer2.subsume($$inner_renderer);
    bind_props($$props, { source });
  });
}
function RawLayer($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      id: _id,
      source: sourceId,
      beforeId,
      type,
      paint,
      layout,
      filter,
      "source-layer": sourceLayer,
      maxzoom,
      minzoom,
      metadata,
      children,
      // Events
      // https://maplibre.org/maplibre-gl-js/docs/API/type-aliases/MapLayerEventType/
      onclick,
      ondblclick,
      onmousedown,
      onmouseup,
      onmousemove,
      onmouseenter,
      onmouseleave,
      onmouseover,
      onmouseout,
      oncontextmenu,
      ontouchstart,
      ontouchend,
      ontouchcancel
    } = $$props;
    const mapCtx = getMapContext();
    if (!mapCtx.map) throw new Error("Map instance is not initialized.");
    const id = _id ?? generateLayerID();
    const layerCtx = prepareLayerContext();
    layerCtx.id = id;
    const addLayerObj = {
      id,
      type,
      layout: snapshot(layout) ?? {},
      paint: snapshot(paint) ?? {}
    };
    if (addLayerObj.type !== "background") {
      addLayerObj.source = sourceId ?? getSourceContext().id;
    }
    if (maxzoom !== void 0) {
      addLayerObj.maxzoom = maxzoom;
    }
    if (minzoom !== void 0) {
      addLayerObj.minzoom = minzoom;
    }
    if (metadata !== void 0) {
      addLayerObj.metadata = metadata;
    }
    if (addLayerObj.type !== "background") {
      if (sourceLayer) {
        addLayerObj["source-layer"] = sourceLayer;
      }
      if (filter) {
        addLayerObj.filter = snapshot(filter);
      }
    }
    mapCtx.waitForStyleLoaded(() => {
      mapCtx.addLayer(addLayerObj, beforeId);
    });
    snapshot(paint) ?? {};
    snapshot(layout) ?? {};
    onDestroy(() => {
      mapCtx.removeLayer(id);
    });
    children?.($$renderer2);
    $$renderer2.push(`<!---->`);
  });
}
function CircleLayer($$renderer, $$props) {
  let { children, sourceLayer, $$slots, $$events, ...props } = $$props;
  RawLayer($$renderer, spread_props([
    { type: "circle", "source-layer": sourceLayer },
    props,
    {
      children: ($$renderer2) => {
        children?.($$renderer2);
        $$renderer2.push(`<!---->`);
      },
      $$slots: { default: true }
    }
  ]));
}
function SymbolLayer($$renderer, $$props) {
  let { children, sourceLayer, $$slots, $$events, ...props } = $$props;
  RawLayer($$renderer, spread_props([
    { type: "symbol", "source-layer": sourceLayer },
    props,
    {
      children: ($$renderer2) => {
        children?.($$renderer2);
        $$renderer2.push(`<!---->`);
      },
      $$slots: { default: true }
    }
  ]));
}
function Cluster_map($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let cluster = true;
    let clusterMaxZoom = 15;
    let clusterRadius = 200;
    let center = [8.682, 50.11];
    let zoom = 13;
    function metersPerPixel(zoom2, lat) {
      const R = 6378137;
      return Math.cos(lat * Math.PI / 180) * 2 * Math.PI * R / (256 * Math.pow(2, zoom2));
    }
    {
      const lat = Array.isArray(center) ? center[1] : center?.lat ?? 50.11;
      const mpp = metersPerPixel(zoom, lat);
      const pxFor100m = Math.max(6, Math.round(200 / mpp));
      clusterRadius = pxFor100m;
    }
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      MapLibre($$renderer3, {
        style: "https://raw.githubusercontent.com/go2garret/maps/main/src/assets/json/openStreetMap.json",
        class: "w-full h-screen",
        get center() {
          return center;
        },
        set center($$value) {
          center = $$value;
          $$settled = false;
        },
        get zoom() {
          return zoom;
        },
        set zoom($$value) {
          zoom = $$value;
          $$settled = false;
        },
        children: ($$renderer4) => {
          GeolocateControl($$renderer4, {
            position: "top-left",
            positionOptions: { enableHighAccuracy: true },
            trackUserLocation: true,
            showAccuracyCircle: true
          });
          $$renderer4.push(`<!----> `);
          GeoJSONSource($$renderer4, {
            data: { type: "FeatureCollection", features: [] },
            cluster,
            clusterMaxZoom,
            clusterRadius,
            children: ($$renderer5) => {
              CircleLayer($$renderer5, {
                filter: ["has", "point_count"],
                paint: {
                  "circle-color": "rgba(220,20,60,0.35)",
                  "circle-stroke-color": "rgba(220,20,60,0.8)",
                  "circle-stroke-width": 1,
                  "circle-radius": clusterRadius,
                  "circle-opacity": 1
                }
              });
              $$renderer5.push(`<!----> `);
              SymbolLayer($$renderer5, {
                filter: ["has", "point_count"],
                layout: { "text-field": "{point_count_abbreviated}", "text-size": 12 }
              });
              $$renderer5.push(`<!----> `);
              CircleLayer($$renderer5, {
                filter: ["!", ["has", "point_count"]],
                paint: {
                  "circle-color": "rgba(220,20,60,0.35)",
                  "circle-stroke-color": "rgba(220,20,60,0.8)",
                  "circle-stroke-width": 1,
                  "circle-radius": clusterRadius,
                  "circle-opacity": 1
                }
              });
              $$renderer5.push(`<!---->`);
            },
            $$slots: { default: true }
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
function _page($$renderer) {
  $$renderer.push(`<div class="h-full w-full relative">`);
  Cluster_map($$renderer);
  $$renderer.push(`<!----></div>`);
}

export { _page as default };
//# sourceMappingURL=_page.svelte-8zF0KNj9.js.map
