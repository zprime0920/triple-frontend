import * as React from 'react'
import styled, { css } from 'styled-components'
import { formatNumber } from '@titicaca/view-utilities'
import {
  Container,
  Text,
  Drawer,
  GlobalSizes,
  GlobalColors,
  MarginPadding,
  Tooltip,
} from '@titicaca/core-elements'

export type BasePrice = number | null

interface RegularPricingProps {
  basePrice?: BasePrice
  salePrice: number
}

interface RichPricingProps {
  basePrice?: BasePrice
  salePrice: number
  label?: React.ReactNode
  pricingNote?: string
  description?: React.ReactNode
}

interface FixedPricingProps {
  active?: boolean
  label?: React.ReactNode
  description?: React.ReactNode
  buttonText?: string
  salePrice: number
  tooltipLabel?: string
  onClick?: (e?: React.SyntheticEvent) => any
  onTooltipClick?: (e?: React.SyntheticEvent) => any
}

type PricingProps =
  | ({ rich: true; fixed?: false } & RichPricingProps)
  | ({ rich?: false; fixed: true } & FixedPricingProps)
  | ({ rich?: false; fixed?: false } & RegularPricingProps)

const FONT_SIZE: Partial<Record<GlobalSizes, string>> = {
  mini: '12px',
  tiny: '13px',
  small: '14px',
  large: '18px',
  big: '20px',
}

type PricingColors = GlobalColors | 'pink' | 'default'

const COLORS: Partial<Record<PricingColors, string>> = {
  pink: 'rgba(253, 46, 105, 1)',
  gray: 'rgba(58, 58, 58, 0.3)',
  blue: 'rgba(54, 143, 255, 1)',
  white: 'rgba(255, 255, 255, 1)',
  default: 'rgba(58, 58, 58, 1)',
}

const PricingContainer = styled.div<{ padding?: MarginPadding }>`
  clear: both;
  position: relative;
  text-align: right;
  font-size: ${FONT_SIZE.large};
  font-weight: bold;
  color: #3a3a3a;

  ${({ padding }) =>
    padding &&
    css`
      padding-top: ${padding.top || 0}px;
      padding-bottom: ${padding.bottom || 0}px;
      padding-left: ${padding.left || 0}px;
      padding-right: ${padding.right || 0}px;
    `};

  small {
    color: rgba(58, 58, 58, 0.3);
    font-weight: normal;
    font-size: ${FONT_SIZE.mini};
    display: inline-block;
    text-decoration: line-through;
    margin-right: 6px;
  }
`

const Price = styled.span<{
  size?: GlobalSizes
  bold?: boolean
  lineThrough?: boolean
  margin?: MarginPadding
  color?: PricingColors
}>`
  font-weight: normal;
  display: inline-block;
  font-size: ${({ size = 'mini' }) => FONT_SIZE[size]};
  color: ${({ color = 'default' }) => COLORS[color]};
  font-weight: ${({ bold }) => (bold ? 'bold' : 500)};
  ${({ lineThrough }) =>
    lineThrough &&
    css`
      text-decoration: line-through;
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

const Label = styled.div<{ size?: GlobalSizes }>`
  position: absolute;
  left: 0;
  bottom: 0;
  color: ${COLORS.blue};
  font-size: ${({ size }) => FONT_SIZE[size || 'tiny']};
`

function DiscountRate({
  basePrice,
  salePrice,
}: {
  basePrice: number
  salePrice: number
}) {
  const rate = Math.floor(((basePrice - salePrice) / basePrice) * 100)

  return rate > 0 ? (
    <Price color="pink" size="big" margin={{ right: 5 }} bold>
      {rate}%
    </Price>
  ) : null
}

function RichPricing({
  basePrice,
  salePrice,
  label,
  pricingNote,
  description,
}: RichPricingProps) {
  const pricingDescription = description ? (
    typeof description === 'string' ? (
      <Text size="tiny" alpha={0.8} margin={{ top: 3 }}>
        {description}
      </Text>
    ) : (
      description
    )
  ) : null

  const hasBasePrice = typeof basePrice === 'number' && basePrice > 0

  return (
    <Container textAlign="right">
      <PricingContainer>
        {label ? <Label> {label} </Label> : null}
        {(pricingNote || hasBasePrice) && (
          <Container margin={{ bottom: 1 }}>
            {pricingNote && (
              <Text alpha={0.3} size="mini" inlineBlock margin={{ right: 3 }}>
                {pricingNote}
              </Text>
            )}
            {hasBasePrice && (
              <Text alpha={0.3} size="mini" strikethrough inline>
                {formatNumber(basePrice)}
              </Text>
            )}
          </Container>
        )}

        {hasBasePrice ? (
          <DiscountRate basePrice={basePrice as number} salePrice={salePrice} /> // HACK: hasBasePrice가 true면 basePrice는 무조건 number이다.
        ) : null}

        <Price size="big" bold>
          {formatNumber(salePrice)}원
        </Price>
      </PricingContainer>
      {pricingDescription}
    </Container>
  )
}

const RegularPricing = ({ basePrice, salePrice }: RegularPricingProps) => {
  const hasBasePrice = typeof basePrice === 'number' && basePrice > 0

  return (
    <PricingContainer padding={{ top: 18 }}>
      {hasBasePrice && (
        <Price color="gray" lineThrough margin={{ right: 5 }}>
          {formatNumber(basePrice)}
        </Price>
      )}
      <Price size="large" bold>
        {formatNumber(salePrice)}원
      </Price>
    </PricingContainer>
  )
}

const FloatedFrame = styled(Container)`
  border-top: 1px solid #efefef;
  background: #fff;
  @supports (padding: max(0px)) and (padding: env(safe-area-inset-bottom)) {
    padding-bottom: max(14px, env(safe-area-inset-bottom, 14px));
  }
`

const FloatedPricingContainer = styled(Container)`
  width: 50%;
`

const PurchaseButton = styled.button`
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 41%;
  height: 47px;
  border-radius: 4px;
  background: ${COLORS.blue};
  color: ${COLORS.white};
  font-size: ${FONT_SIZE.small};
  font-weight: bold;
  border: none;
  cursor: pointer;
`

function FixedPricing({
  active,
  label,
  buttonText,
  description,
  salePrice,
  tooltipLabel,
  onClick,
  onTooltipClick,
}: FixedPricingProps) {
  const pricingLabel = label ? (
    typeof label === 'string' ? (
      <Text color="gray" alpha={0.5} size="mini">
        {label}
      </Text>
    ) : (
      label
    )
  ) : null

  const pricingDescription = description ? (
    typeof description === 'string' ? (
      <Text size="mini" alpha={0.5} margin={{ top: 1 }}>
        {description}
      </Text>
    ) : (
      description
    )
  ) : null

  return (
    <Drawer active={active} overflow="visible">
      <FloatedFrame
        padding={{
          top: 14,
          right: 20,
          bottom: 14,
          left: 20,
        }}
      >
        {active && tooltipLabel && (
          <Tooltip
            borderRadius="30"
            positioning={{ top: -20 }}
            label={tooltipLabel}
            onClick={onTooltipClick}
          />
        )}

        <Container position="relative" clearing>
          <FloatedPricingContainer floated="left">
            {pricingLabel}
            <Text size="huge" bold>
              {formatNumber(salePrice)}원
            </Text>
            {pricingDescription}
          </FloatedPricingContainer>
          <PurchaseButton onClick={onClick}>{buttonText}</PurchaseButton>
        </Container>
      </FloatedFrame>
    </Drawer>
  )
}

export default function Pricing(props: PricingProps) {
  const { salePrice } = props

  if (props.rich) {
    const { basePrice, label, pricingNote, description } = props

    return (
      <RichPricing
        basePrice={basePrice}
        salePrice={salePrice}
        label={label}
        pricingNote={pricingNote}
        description={description}
      />
    )
  } else if (props.fixed) {
    const {
      active,
      label,
      buttonText,
      description,
      onClick,
      tooltipLabel,
      onTooltipClick,
    } = props

    return (
      <FixedPricing
        active={active}
        label={label}
        buttonText={buttonText}
        salePrice={salePrice}
        description={description}
        onClick={onClick}
        tooltipLabel={tooltipLabel}
        onTooltipClick={onTooltipClick}
      />
    )
  } else {
    const { basePrice } = props

    return <RegularPricing basePrice={basePrice} salePrice={salePrice} />
  }
}
