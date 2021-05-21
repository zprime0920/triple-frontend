import React, {
  ComponentType,
  createContext,
  PropsWithChildren,
  useContext,
  useMemo,
  useState,
} from 'react'
import {
  useEventTrackingContext,
  useHistoryFunctions,
  useURIHash,
  useUserAgentContext,
} from '@titicaca/react-contexts'
import semver from 'semver'

import { Confirm, Alert } from './modals'

export const LOGIN_CTA_MODAL_HASH = 'login-cta-modal'

const WITH_LOGIN_PATH_APP_VERSION = '5.0.0'

const LoginCTAContext = createContext<
  | {
      setReturnUrl?: (url: string) => void
    }
  | undefined
>(undefined)

export function LoginCTAModalProvider({ children }: PropsWithChildren<{}>) {
  const uriHash = useURIHash()
  const { trackEvent } = useEventTrackingContext()
  const { back, navigate } = useHistoryFunctions()
  const hasParentModal = useContext(LoginCTAContext)
  const { isPublic, os, app } = useUserAgentContext()
  const appVersion = semver.coerce(app?.version)
  const open = uriHash === LOGIN_CTA_MODAL_HASH
  const [returnUrl, setReturnUrl] = useState<string | undefined>()

  if (hasParentModal) {
    return <>{children}</>
  }

  const isLegacyAndroidApp = Boolean(
    !isPublic &&
      os?.name === 'Android' &&
      appVersion &&
      semver.lt(appVersion, WITH_LOGIN_PATH_APP_VERSION),
  )

  return (
    <LoginCTAContext.Provider value={{ setReturnUrl }}>
      {children}

      {isLegacyAndroidApp ? (
        <Alert open={open} title="로그인이 필요합니다." onConfirm={back}>
          로그인하고 트리플을
          <br />더 편하게 이용하세요🙂
        </Alert>
      ) : (
        <Confirm
          open={open}
          title="로그인이 필요합니다."
          onClose={back}
          onCancel={back}
          onConfirm={() => {
            trackEvent({
              ga: ['로그인유도팝업_선택'],
              fa: {
                action: '로그인유도팝업_선택',
              },
            })

            navigate(
              `/login?returnUrl=${encodeURIComponent(
                returnUrl || document.location.href,
              )}`,
            )
          }}
        >
          로그인하고 트리플을
          <br />더 편하게 이용하세요🙂
        </Confirm>
      )}
    </LoginCTAContext.Provider>
  )
}

export function withLoginCTAModal<P>(Component: ComponentType<P>) {
  return function WithLoginCTAModal(props: P) {
    return (
      <LoginCTAModalProvider>
        <Component {...props} />
      </LoginCTAModalProvider>
    )
  }
}

export function useLoginCTAModal() {
  const { push } = useHistoryFunctions()
  const contextValue = useContext(LoginCTAContext)

  return useMemo(
    () => ({
      show: (returnUrl?: string) => {
        if (contextValue?.setReturnUrl && returnUrl) {
          contextValue.setReturnUrl(returnUrl)
        }

        push(LOGIN_CTA_MODAL_HASH)
      },
    }),
    [push, contextValue],
  )
}
