import React, { useState, useCallback, useEffect } from 'react'
import {
  Text,
  MarginPadding,
  LayeringMixinProps,
} from '@titicaca/core-elements'
import { CSSTransition } from 'react-transition-group'

import {
  BannerExitStrategy,
  EVENT_CHATBOT_CTA_READY,
  FLOATING_BUTTON_CLOSED_STORAGE_KEY,
} from './constants'
import { CTAProps } from './interfaces'
import {
  FloatingButtonContainer,
  InstallDescription,
  InstallAnchor,
  Description,
  GoAppButton,
  CloseButton,
  LeftContainer,
  RightContainer,
  FloatingButton,
} from './elements'

interface FloatingButtonCTAProps extends CTAProps {
  exitStrategy?: BannerExitStrategy
  fixed?: boolean
  appInstallLink?: string
  title?: string
  description?: string
  margin?: MarginPadding
  trackEvent?: any
  trackEventParams?: any
  unmountOnExit?: boolean
}

/**
 * '트리플 앱 설치하기' 하단 플로팅 버튼 CTA
 *
 * @param exitStrategy 이 버튼 컴포넌트가 사라져야하는 조건 또는 전략 (기본값 NONE)
 * @param fixed 스크롤 위치와 관계없이 fixed position 인지의 여부
 * @param appInstallLink 앱 설치 URL
 * @param title 앱 설치 안내 문구 제목
 * @param description 앱 설치 안내 문구 설명
 * @param trackEvent 이벤트 트래킹 함수
 * @param margin 버튼 주변 margin 값 (optional)
 * @param trackEventParams GA/FA 수집 파라미터
 * @param unmountOnExit 버튼이 표시되지 않을 때 컴포넌트 마운트 해제 여부
 */
export default function FloatingButtonCTA({
  exitStrategy = BannerExitStrategy.NONE,
  fixed,
  appInstallLink,
  title = '트리플 앱 설치하기',
  description = '가이드북, 일정짜기, 길찾기, 맛집',
  margin,
  trackEvent,
  trackEventParams,
  onShow,
  onClick,
  onDismiss,
  zTier,
  zIndex,
  unmountOnExit,
}: FloatingButtonCTAProps & LayeringMixinProps) {
  const [buttonVisibility, setButtonVisibility] = useState(false)
  const [available, setAvailable] = useState(true)

  const sendTrackEventRequest = useCallback(
    (param) => {
      trackEvent && param && trackEvent(param)
    },
    [trackEvent],
  )

  useEffect(() => {
    const visitedPages = window.sessionStorage.getItem(
      FLOATING_BUTTON_CLOSED_STORAGE_KEY,
    )
    if (!visitedPages && !buttonVisibility) {
      setButtonVisibility(true)
    }
  }, [buttonVisibility])

  useEffect(() => {
    if (buttonVisibility) {
      sendTrackEventRequest(trackEventParams && trackEventParams.onShow)
      onShow && onShow()
    }
  }, [buttonVisibility, onShow, sendTrackEventRequest, trackEventParams])

  const handleClick = useCallback(() => {
    sendTrackEventRequest(trackEventParams && trackEventParams.onSelect)
    onClick && onClick()

    return true
  }, [onClick, sendTrackEventRequest, trackEventParams])

  const handleDismiss = useCallback(() => {
    setButtonVisibility(false)
    window.sessionStorage.setItem(FLOATING_BUTTON_CLOSED_STORAGE_KEY, 'true')
    sendTrackEventRequest(trackEventParams && trackEventParams.onClose)
    onDismiss && onDismiss()
  }, [onDismiss, sendTrackEventRequest, trackEventParams])

  useEffect(() => {
    if (exitStrategy === BannerExitStrategy.CHATBOT_READY) {
      const onChatbotReady = () => {
        setAvailable(false)
        window.removeEventListener(EVENT_CHATBOT_CTA_READY, onChatbotReady)
      }

      window.addEventListener(EVENT_CHATBOT_CTA_READY, onChatbotReady)

      return () => {
        window.removeEventListener(EVENT_CHATBOT_CTA_READY, onChatbotReady)
      }
    }
  }, [exitStrategy])

  return (
    <CSSTransition
      in={available}
      appear
      classNames="floating-button-slide"
      timeout={500}
      mountOnEnter={unmountOnExit}
      unmountOnExit={unmountOnExit}
    >
      <FloatingButtonContainer
        visibility={buttonVisibility ? 1 : 0}
        fixed={fixed ? 1 : 0}
        margin={margin}
        zTier={zTier}
        zIndex={zIndex}
      >
        <FloatingButton>
          <LeftContainer>
            <InstallAnchor href={appInstallLink} onClick={handleClick}>
              <InstallDescription>
                <Text floated="left" color="white">
                  {title}
                </Text>
                <GoAppButton src="https://assets.triple.guide/images/ico-arrow@4x.png" />
              </InstallDescription>
              <Description>{description}</Description>
            </InstallAnchor>
          </LeftContainer>
          <RightContainer onClick={handleDismiss}>
            <CloseButton src="https://assets.triple.guide/images/btn-closebanner@3x.png" />
          </RightContainer>
        </FloatingButton>
      </FloatingButtonContainer>
    </CSSTransition>
  )
}
