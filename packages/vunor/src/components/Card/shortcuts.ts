const headers = [
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'subheading',
  'body-l',
  'body',
  'body-s',
  'callout',
]

export const cardShortcuts = {
  card: `data-[rounded=true]:rounded-$card-spacing data-[dense=true]:card-dense! border-scope-color-100 dark:border-scope-color-800 ${headers
    .map(h => `data-[level=${h}]:card-${h}`)
    .join(' ')}`,
}
