import { s as sanitize_props, b as spread_props, k as rest_props, l as attributes, g as ensure_array_like, m as element, c as slot, f as bind_props } from './index2-BRhWf2Gt.js';
import { Z as fallback } from './context-nuHa5tfu.js';

const defaultAttributes = {
  outline: {
    xmlns: "http://www.w3.org/2000/svg",
    width: 24,
    height: 24,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    "stroke-width": 2,
    "stroke-linecap": "round",
    "stroke-linejoin": "round"
  },
  filled: {
    xmlns: "http://www.w3.org/2000/svg",
    width: 24,
    height: 24,
    viewBox: "0 0 24 24",
    fill: "currentColor",
    stroke: "none"
  }
};
function Icon($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, ["type", "name", "color", "size", "stroke", "iconNode"]);
  $$renderer.component(($$renderer2) => {
    let type = $$props["type"];
    let name = $$props["name"];
    let color = fallback($$props["color"], "currentColor");
    let size = fallback($$props["size"], 24);
    let stroke = fallback($$props["stroke"], 2);
    let iconNode = $$props["iconNode"];
    $$renderer2.push(`<svg${attributes(
      {
        ...defaultAttributes[type],
        ...$$restProps,
        width: size,
        height: size,
        class: `tabler-icon tabler-icon-${name} ${$$sanitized_props.class ?? ""}`,
        ...type === "filled" ? { fill: color } : { "stroke-width": stroke, stroke: color }
      },
      void 0,
      void 0,
      void 0,
      3
    )}><!--[-->`);
    const each_array = ensure_array_like(iconNode);
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let [tag, attrs] = each_array[$$index];
      element($$renderer2, tag, () => {
        $$renderer2.push(`${attributes({ ...attrs }, void 0, void 0, void 0, 3)}`);
      });
    }
    $$renderer2.push(`<!--]--><!--[-->`);
    slot($$renderer2, $$props, "default", {});
    $$renderer2.push(`<!--]--></svg>`);
    bind_props($$props, { type, name, color, size, stroke, iconNode });
  });
}
function Map_pin($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    ["path", { "d": "M9 11a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" }],
    [
      "path",
      {
        "d": "M17.657 16.657l-4.243 4.243a2 2 0 0 1 -2.827 0l-4.244 -4.243a8 8 0 1 1 11.314 0z"
      }
    ]
  ];
  Icon($$renderer, spread_props([
    { type: "outline", name: "map-pin" },
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

export { Icon as I, Map_pin as M };
//# sourceMappingURL=map-pin-riU1R1My.js.map
