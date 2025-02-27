import Router from 'next/router'
import {
  closeWindow as _closeWindow,
  backOrClose as _backOrClose,
  hasAccessibleTripleNativeClients,
} from '@titicaca/triple-web-to-native-interfaces'

import { useHistoryFunctions } from './history-context'

export async function pushRouter(
  path: string,
  asPathOrScrollPosition?: string | [number, number],
  scrollTo?: [number, number],
) {
  const asPath =
    typeof asPathOrScrollPosition === 'string' ? asPathOrScrollPosition : ''
  const scrollPosition: [number, number] = Array.isArray(asPathOrScrollPosition)
    ? asPathOrScrollPosition
    : scrollTo || [0, 0]

  asPath ? await Router.push(path, asPath) : await Router.push(path)

  window.scrollTo(...scrollPosition)
}

export async function replaceRouter(
  path: string,
  asPathOrScrollPosition?: string | [number, number],
  scrollTo?: [number, number],
) {
  const asPath =
    typeof asPathOrScrollPosition === 'string' ? asPathOrScrollPosition : ''
  const scrollPosition: [number, number] = Array.isArray(asPathOrScrollPosition)
    ? asPathOrScrollPosition
    : scrollTo || [0, 0]

  asPath ? await Router.replace(path, asPath) : await Router.replace(path)

  window.scrollTo(...scrollPosition)
}

export function backOrClose() {
  if (!hasAccessibleTripleNativeClients()) {
    return history.back()
  } else {
    return _backOrClose()
  }
}

export function closeWindow() {
  return !hasAccessibleTripleNativeClients() ? window.close() : _closeWindow()
}

export function asyncBack(backer = Router.back): Promise<void> {
  return new Promise((resolve) => {
    const handler = () => {
      Router.events.off('hashChangeComplete', handler)
      resolve()
    }

    Router.events.on('hashChangeComplete', handler)

    backer()
  })
}

export function useIsomorphicNavigation() {
  const { openWindow } = useHistoryFunctions()

  return {
    pushRouter,
    replaceRouter,
    asyncBack,
    backOrClose,
    closeWindow,
    openWindow,
  }
}
