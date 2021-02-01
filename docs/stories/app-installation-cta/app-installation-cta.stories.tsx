import React, { useState, useEffect } from 'react'
import { action } from '@storybook/addon-actions'
import { text, boolean } from '@storybook/addon-knobs'
import {
  ImageBanner,
  TextBanner,
  BannerCTA,
  FloatingButtonCTA,
  ArticleCardCTA,
  fetchArticleCardCTA
  
} from '@titicaca/app-installation-cta'
import { Carousel } from '@titicaca/core-elements'

export default {
  title: 'app-installation-cta | AppInstallationCTA',
}

export function FloatingButton() {
  return (
    <FloatingButtonCTA
      appInstallLink={'https://triple.onelink.me/aZP6/21d43a81'}
      fixed={boolean('화면 고정', true)}
      title={text('제목', '제목을 입력하세요.')}
      description={text('설명', '설명 텍스트가 들어갑니다.')}
      trackEvent={action('tracked')}
      trackEventParams={{
        onShow: 'onShow',
        onSelect: 'onSelect(click)',
        onClose: 'onClose(dismiss)',
      }}
      onShow={action('onShow')}
      onClick={action('onClick')}
      onDismiss={action('onDismiss')}
    />
  )
}

FloatingButton.story = {
  name: '트리플 앱 설치하기 버튼',
}

export function BaseImageBanner() {
  return (
    <ImageBanner
      imgUrl={text('이미지 URL', '')}
      installUrl={text('설치 URL', 'https://triple-dev.titicaca-corp.com')}
      onDismiss={action('banner dismissed')}
    />
  )
}

BaseImageBanner.story = {
  name: '이미지 배너',
}

export function BaseTextBanner() {
  return (
    <TextBanner
      message={text('표시할 메시지', '앱 다운로드시 가이드북 무료')}
      installUrl={text('설치 URL', 'https://triple-dev.titicaca-corp.com')}
    />
  )
}

BaseTextBanner.story = {
  name: '텍스트 배너',
}

export function BaseBannerCTA() {
  return (
    <div>
      <BannerCTA
        inventoryId={text(
          '표시할 배너의 인벤토리 ID',
          'app-install-cta-poi-v1',
        )}
        installUrl={text('설치 URL', 'https://triple-dev.titicaca-corp.com')}
      />

      <div style={{ height: '2000px' }} />
    </div>
  )
}

BaseBannerCTA.story = {
  name: '배너 CTA',
}

export function BaseArticleCardCTA() {
  const [articleCTA, setArticleCTA] = useState(null)

  useEffect(() => {
   async function fetchAndSetArticleCardCTA() {
     const response = (await fetchArticleCardCTA({inventoryId: 'd'}))
     setArticleCTA(response[0])
   }

   fetchAndSetArticleCardCTA()
  },[fetchArticleCardCTA])
  return (
    <div>
      <Carousel
        margin={{ top: 20 }}
        containerPadding={{ left: 110, right: 110 }}
      >
        <Carousel.Item key={'d'} size="medium">
          {articleCTA ? <ArticleCardCTA
            cta={articleCTA}
            href={text('설치 URL', 'https://triple-dev.titicaca-corp.com')}
            onCTAClick={action('onCTAClick')}
          /> : null}
        </Carousel.Item>
      </Carousel>
    </div>
  )
}
