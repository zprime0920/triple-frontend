import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { select } from '@storybook/addon-knobs'
import { Tabs } from '@titicaca/core-elements'

storiesOf('Core-Elements | Tabs', module)
  .add('이근처장소', () => (
    <Tabs
      value={select('현재 탭', ['attractions', 'restaurants'], 'attractions')}
      options={[
        { label: '관광지', value: 'attractions' },
        { label: '맛집', value: 'restaurants' },
      ]}
      onChange={action('change')}
    />
  ))
  .add('라인 탭', () => {
    const options = [
      { label: '투어티켓', value: '투어티켓' },
      { label: '호텔', value: '호텔' },
    ]

    const options2 = [
      { label: '투어티켓1', value: '투어티켓' },
      { label: '호텔2', value: '호텔2' },
      { label: '투어티켓3', value: '투어티켓3' },
      { label: '호텔4', value: '호텔4' },
      { label: '투어티켓5', value: '투어티켓5' },
      { label: '호텔6', value: '호텔6' },
      { label: '투어티켓7', value: '투어티켓7' },
      { label: '호텔8', value: '호텔8' },
    ]

    const values = options.map(({ value }) => value)
    const values2 = options2.map(({ value }) => value)

    return (
      <>
        <Tabs
          type="pointing"
          options={options}
          onChange={action('change')}
          value={select('버튼 크기', values, values[0])}
        />
        <br /> <br /> <br /> <br />
        <Tabs
          scroll
          type="pointing"
          options={options2}
          onChange={action('change')}
          value={select('버튼 크기2', values2, values2[0])}
        />
      </>
    )
  })
