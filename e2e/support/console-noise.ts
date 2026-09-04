/**
 * Errores de consola conocidos que NO son fallos de la aplicación y que este WP no puede corregir
 * (archivos ajenos a F0-W1). Cada entrada debe desaparecer junto con su deuda; ver
 * `planning/deuda/f0-w1.md`.
 */
export const IGNORED_CONSOLE_ERRORS: RegExp[] = [
  // panel/activity-chart.component.tsx renderiza <svg height="auto">, atributo inválido en SVG.
  /<svg> attribute height: Expected length/,
]
