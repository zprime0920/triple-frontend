import * as React from 'react'
import styled, { css } from 'styled-components'
import Container from './container'
import {
  GetGlobalColor,
  GlobalColors,
  MarginPadding,
  GlobalSizes,
} from '../commons'

export type LabelColor = GlobalColors | 'purple'

type Color = { rgb: string; a: number }

const GetLabelColors: Partial<
  Record<LabelColor, { background: Color; text: Color }>
> = {
  blue: {
    background: { rgb: GetGlobalColor('blue'), a: 0.1 },
    text: { rgb: GetGlobalColor('blue'), a: 1 },
  },
  red: {
    background: { rgb: '253, 46, 105', a: 0.1 },
    text: { rgb: '253, 46, 105', a: 1 },
  },
  purple: {
    background: { rgb: '151, 95, 255', a: 0.1 },
    text: { rgb: '151, 95, 255', a: 1 },
  },
  gray: {
    background: { rgb: '58, 58, 58', a: 0.05 },
    text: { rgb: '58, 58, 58', a: 0.7 },
  },
}

interface RadioLabelProps {
  selected?: boolean
  margin?: MarginPadding
}

const RadioLabel = styled.div<RadioLabelProps>`
  display: inline-block;
  padding-left: 9px;
  font-size: 14px;
  line-height: 17px;
  color: ${({ selected }) => (selected ? '#3a3a3a' : 'rgba(58, 58, 58, 0.3)')};
  background-image: url(${({ selected }) =>
    `https://assets.triple.guide/images/img-search-select-${
      selected ? 'on' : 'off'
    }@4x.png`});
  background-size: 5px 5px;
  background-position: left center;
  background-repeat: no-repeat;
  cursor: pointer;

  ${({ margin }) =>
    margin &&
    css`
      margin-top: ${margin.top || 0}px;
      margin-bottom: ${margin.bottom || 0}px;
      margin-left: ${margin.left || 0}px;
      margin-right: ${margin.right || 0}px;
    `};
`

const PROMO_SIZES: Partial<
  Record<
    GlobalSizes,
    { fontSize: number; borderRadius: number; height: number; padding: string }
  >
> = {
  small: {
    fontSize: 11,
    borderRadius: 1,
    height: 20,
    padding: '0 6px',
  },
  medium: {
    fontSize: 12,
    borderRadius: 2,
    height: 26,
    padding: '0 10px',
  },
  large: {
    fontSize: 13,
    borderRadius: 4,
    height: 30,
    padding: '0 13px',
  },
}

interface PromoLabelProps {
  size?: GlobalSizes
  emphasized?: boolean
  color?: LabelColor
  margin?: MarginPadding
}

export const PromoLabel = styled.div<PromoLabelProps>`
  display: inline-block;

  padding: ${({ size }) => PROMO_SIZES[size || 'small'].padding};
  border-radius: ${({ size }) => PROMO_SIZES[size || 'small'].borderRadius}px;
  line-height: ${({ size }) => PROMO_SIZES[size || 'small'].height}px;
  height: ${({ size }) => PROMO_SIZES[size || 'small'].height}px;
  font-size: ${({ size }) => PROMO_SIZES[size || 'small'].fontSize}px;

  ${({ emphasized }) =>
    emphasized
      ? css`
          font-weight: bold;
          background-color: rgba(
            ${({ color }) => GetLabelColors[color].background.rgb},
            1
          );
          color: white;
        `
      : css`
          font-weight: normal;
          ${({ color }) => {
            const {
              [color]: {
                background: { rgb: backgroundRgb, a: backgroundA },
                text: { rgb: textRgb, a: textA },
              },
            } = GetLabelColors
            return css`
              background-color: rgba(${backgroundRgb}, ${backgroundA});
              color: rgba(${textRgb}, ${textA});
            `
          }}
        `};

  ${({ margin }) =>
    margin &&
    css`
      margin-top: ${margin.top || 0}px;
      margin-bottom: ${margin.bottom || 0}px;
      margin-left: ${margin.left || 0}px;
      margin-right: ${margin.right || 0}px;
    `};
`

interface LabelProps extends PromoLabelProps, RadioLabelProps {
  radio?: boolean
  promo?: boolean
  children?: React.ReactNode
}

const LabelGroup = styled(Container)<{ horizontalGap?: number }>`
  div:not(:first-child) {
    ${({ horizontalGap }) => css`
      margin-left: ${horizontalGap || 0}px;
    `};
  }
`
export default class Label extends React.PureComponent<
  LabelProps,
  React.HTMLAttributes<HTMLElement>
> {
  static Group = LabelGroup

  render() {
    const {
      props: {
        radio,
        selected,
        margin,
        children,
        promo,
        size,
        emphasized,
        color,
        ...props
      },
    } = this

    if (radio) {
      return (
        <RadioLabel {...props} selected={selected} margin={margin}>
          {children}
        </RadioLabel>
      )
    } else if (promo) {
      return (
        <PromoLabel
          {...props}
          size={size}
          emphasized={emphasized}
          color={color || 'purple'}
          margin={margin}
        >
          {children}
        </PromoLabel>
      )
    } else {
      return children
    }
  }
}
