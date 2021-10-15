import { parseUrl } from '../url'

const PUBLIC_ROUTELIST_REGEXES = [
  /^\/login$/,
  /^\/regions\/[^/]+\/(attractions|restaurants|articles)\/[^/]+$/,
  /^\/regions\/[^/]+\/hotels(\/.*)?$/,
  /^\/(attractions|restaurants|hotels|articles)\/[^/]+$/,
  /^\/hotels\/?$/,
  /^\/hotels\/list(\/.+)?$/,
  /^\/hotels\/curation(\/.+)?$/,
  /^\/hotels\/[^/]+\/rate(\/.+?)?$/,
  /^(\/hotels)?\/regions\/[^/]+\/hotel-areas$/,
  /^\/tna\/regions\/[^/]+\/products\/[^/]+$/,
  /^\/tna\/products\/[^/]+$/,
  /^\/tna\/products\/[^/]+\/display$/,
]

export function checkIfRoutable({ href }: { href: string }) {
  const { host, path } = parseUrl(href)

  if (!host && path) {
    return PUBLIC_ROUTELIST_REGEXES.some((regex) => path.match(regex))
  }

  return true
}
