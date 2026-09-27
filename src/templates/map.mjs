import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { geoNaturalEarth1, geoPath, geoGraticule10 } from 'd3-geo';
import { feature } from 'topojson-client';
import { offices } from '../content/collections.mjs';
import { esc, L } from './helpers.mjs';

const require = createRequire(import.meta.url);
const topo = JSON.parse(readFileSync(require.resolve('world-atlas/countries-110m.json'), 'utf8'));
const land = feature(topo, topo.objects.countries);
land.features = land.features.filter(f => f.properties.name !== 'Antarctica');

const W = 1000, H = 520;
const projection = geoNaturalEarth1().fitExtent([[8, 8], [W - 8, H - 8]], land);
const path = geoPath(projection);
const round = d => d.replace(/(\d+\.\d{1})\d+/g, '$1');

const officeCountries = new Set(['Uganda', 'Kenya', 'Burkina Faso', 'Malawi', "Côte d'Ivoire", 'Nigeria', 'Guinea-Bissau']);
const countriesSvg = land.features.map(f => `<path d="${round(path(f))}" class="${officeCountries.has(f.properties.name) ? 'c-office' : ''}"/>`).join('');
const graticule = round(path(geoGraticule10()));

/** Land layer as a standalone, cacheable SVG (shared by every page with a map). */
export function landSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}"><style>path{fill:#03127a;stroke:#ffffff;stroke-opacity:.55;stroke-width:.5;vector-effect:non-scaling-stroke}.c-office{fill:#1d6a8d;stroke-opacity:.9}.g{fill:none;stroke:#389DC9;stroke-opacity:.18;stroke-width:.5}</style><path class="g" d="${graticule}"/>${countriesSvg}</svg>`;
}

const [[ax0, ay0], [ax1, ay1]] = [projection([-22, 38]), projection([56, -36])];
export const views = {
  world: [0, 0, W, H].join(' '),
  africa: [ax0 - 10, ay0, ax1 - ax0 + 20, ay1 - ay0].map(n => n.toFixed(1)).join(' ')
};

export function officePoints() {
  return offices.map(o => { const [x, y] = projection([o.lon, o.lat]); return { ...o, x: +x.toFixed(1), y: +y.toFixed(1) }; });
}

function arc(a, b) {
  const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
  const dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy);
  const lift = Math.min(40, d * 0.35);
  const cx = mx - (dy / d) * lift, cy = my + (dx / d) * lift * -1;
  return `M${a.x} ${a.y}Q${cx.toFixed(1)} ${cy.toFixed(1)} ${b.x} ${b.y}`;
}

export function mapSvg(c) {
  const pts = officePoints();
  const hq = pts.find(p => p.hq);
  const lines = pts.filter(p => !p.hq).map((p, i) => `<path d="${arc(hq, p)}" style="--i:${i}" pathLength="1"/>`).join('');
  const nodes = pts.map((p, i) => `<g class="m-node" data-office="${p.id}" data-i="${i}" transform="translate(${p.x} ${p.y})" tabindex="0" role="button" aria-label="${esc(p.city)}, ${esc(L(p.country, c.lang))}" style="--i:${i}">
      <circle class="m-pulse" r="9"/><circle class="m-halo" r="9"/><circle class="m-dot" r="${p.hq ? 5.2 : 4.2}"/>
    </g>`).join('');
  return `<svg class="map-svg" viewBox="${views.world}" data-views='${JSON.stringify(views)}' role="group" aria-label="World map of CERFODES offices">
    <image class="m-land" href="${c.asset('img/world-land.svg')}" x="0" y="0" width="${W}" height="${H}"/>
    <g class="m-lines">${lines}</g>
    <g class="m-nodes">${nodes}</g>
  </svg>`;
}
