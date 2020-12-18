import { useCallback } from 'react'
import qs, { ParsedQs } from 'qs'
import { useEnv, useUserAgentContext } from '@titicaca/react-contexts'
import {
  checkIfRoutable,
  generateUrl,
  parseUrl,
} from '@titicaca/view-utilities'

import { TargetType } from './target'
import { AllowSource } from './router-guarded-link'

/**
 * 주어진 href가 절대 경로일 때 트리플의 URL이면 상대 경로로 바꿉니다.
 */
function removeTripleDomain({
  href,
  webUrlBase,
}: {
  href: string
  webUrlBase: string
}): string {
  const { host } = parseUrl(href)
  const { host: webUrlBaseHost } = parseUrl(webUrlBase)

  if (!host) {
    return href
  }

  // 절대 경로
  if (host === webUrlBaseHost) {
    // 트리플 URL
    return generateUrl(
      {
        scheme: undefined,
        host: undefined,
      },
      href,
    )
  }

  // 외부 URL
  return href
}

/**
 * query 파라미터의 타입을 string | undefined 타입으로 좁히는 함수
 * @param value query 파라미터로 들어있던 값
 */
function stringifyParsedQuery(
  value: string | string[] | ParsedQs | ParsedQs[] | undefined,
): string | undefined {
  if (Array.isArray(value)) {
    return stringifyParsedQuery(value)
  }

  if (typeof value === 'object') {
    throw new Error(`Query parameter is not string type. ${value}`)
  }

  return value
}

/**
 * inlink, outlink 등 앱 브릿지로 사용하는 URL의 query 속 실제 URL을 반환합니다.
 * 그 외의 URL은 원본을 그대로 반환합니다.
 */
function stripAppBridge(href: string): string {
  const { path, query } = parseUrl(href)

  if (path === '/inlink') {
    const { path } = qs.parse(query || '')

    const normalizedPath = stringifyParsedQuery(path)

    if (!normalizedPath) {
      throw new Error('inlink has no path.')
    }
    return normalizedPath
  }

  if (path === '/outlink') {
    const { url } = qs.parse(query || '')

    const normalizedUrl = stringifyParsedQuery(url)

    if (!normalizedUrl) {
      throw new Error('outlink has no url.')
    }
    return normalizedUrl
  }

  return href
}

/**
 * 다양한 종류의 URL을 a tag에 사용할 수 있는 값으로 다듬습니다.
 * @param href
 */
function canonizeHref({
  href,
  webUrlBase,
}: {
  href: string
  webUrlBase: string
}) {
  return removeTripleDomain({ href: stripAppBridge(href), webUrlBase })
}

/**
 * URL이 열리는 target을 설정합니다.
 *
 * * 'browser': 앱 내 브라우저가 아닌 앱 기본 브라우저에서 열립니다. 웹에선 새 창으로 열립니다.
 * * 'new': 새 창에서 열립니다.
 * * 'current': 현재 창에서 열립니다.
 *
 * outlink의 target search param이 browser로 설정되어 있으면 browser를 반환합니다.
 * 웹에선 현재창, 앱에선 새 창으로 설정합니다.
 * `navigate` 함수의 작동 방식을 옮겨온 것이기 때문에 이렇게 정해져있습니다.
 */
function getTarget({
  href,
  isPublic,
}: {
  href: string
  isPublic: boolean
}): TargetType {
  const { path, query } = parseUrl(href)

  if (path === '/outlink') {
    const { target } = qs.parse(query || '')

    return target === 'browser' ? 'browser' : 'new'
  }

  return isPublic ? 'current' : 'new'
}

/**
 * inlink일 때 allowSource를 결정합니다.
 *
 * inlink는 원칙적으로 앱에서만 열 수 있습니다.
 * 단, 웹에서 열리는 URL이고, _web_expand 파라미터가 설정되어있다면 웹에서도 열립니다.
 */
function getInlinkAllowSource(href: string): AllowSource {
  const { path, query } = parseUrl(href)

  if (path === '/inlink') {
    const { _web_expand: expandable } = qs.parse(query || '')

    if (checkIfRoutable({ href: stripAppBridge(href) })) {
      return expandable ? 'all' : 'app'
    }

    return 'app-with-session'
  }

  return 'all'
}

export function useHrefToProps(params?: {
  onError?: (error: Error) => void
}): (
  href: string,
) => {
  href: string
  target: TargetType
  allowSource: AllowSource
} {
  const { webUrlBase } = useEnv()
  const { isPublic } = useUserAgentContext()

  const { onError } = params || {}

  return useCallback(
    (href) => {
      try {
        return {
          href: canonizeHref({ href, webUrlBase }),
          target: getTarget({ href, isPublic }),
          allowSource: getInlinkAllowSource(href),
        }
      } catch (error) {
        if (onError) {
          onError(error)
        }

        return { href, target: 'new', allowSource: 'app-with-session' }
      }
    },
    [isPublic, onError, webUrlBase],
  )
}
