import styled, { css } from 'styled-components'
import { getColor } from '@titicaca/color-palette'
import { Container, Text } from '@titicaca/core-elements'

const ColorFrame = styled.div<{ color: string }>`
  position: relative;
  width: 100%;
  height: 40px;
  background: rgba(${({ color }) => getColor(color)});
  margin-bottom: 2px;
`

const ColorLabel = styled(Text)<{ labelColor: string }>`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: rgba(${({ labelColor }) => getColor(labelColor || 'white')});
`

export const FlexBox = styled(Container)<{
  flex: string
  flexFlow: string
  space: boolean
}>`
  display: flex;
  flex: ${({ flex }) => flex || 0};
  flex-flow: ${({ flexFlow }) => flexFlow || 'row'};

  ${({ space }) =>
    space &&
    css`
      padding-right: 10px;
    `}
`

export function ColorBox({
  color,
  labelColor,
}: {
  color: string
  labelColor: string
}) {
  return (
    <ColorFrame color={color}>
      <ColorLabel labelColor={labelColor}>{color}</ColorLabel>
    </ColorFrame>
  )
}
