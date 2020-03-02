import { css } from 'styled-components'
import CSS from 'csstype'

export const userSelect = (defaultValue?: CSS.UserSelectProperty) => css<{
  userSelect?: boolean
}>`
  ${({ userSelect = defaultValue }) => {
    return userSelect
      ? `
        -webkit-user-select: ${userSelect};
        -user-select: ${userSelect};
        `
      : ''
  }}
`
