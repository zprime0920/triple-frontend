import * as React from 'react'
import styled from 'styled-components'

import Navbar from './navbar'

const InputText = styled.input`
  border-style: none;
  font-size: 17px;
  height: 21px;
  line-height: 21px;
  margin: 6px 34px 0 40px;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: calc(100% - 80px);
  outline: none;
  padding: 0;
`

const MainNavbarFrame = styled(Navbar.NavbarFrame)`
  height: 58px;
  padding: 12px;
`

const Back = styled(Navbar.Item)`
  float: none;
  margin-right: 6px;
  position: absolute;
`

const DeleteIcon = styled(Navbar.Item)<{ visible: boolean }>`
  position: absolute;
  top: 12px;
  right: 12px;
  margin-right: 0px;
  float: none;
  display: ${({ visible }) => (visible ? 'block' : 'none')};
`

interface InputProps {
  placeholder?: string
  onInputChange?: (e: React.SyntheticEvent, value: string) => void
  onBlur?: (e: React.SyntheticEvent) => void
  onFocus?: (e: React.SyntheticEvent) => void
  onKeyUp?: (e: React.KeyboardEvent) => void
  value?: string
}

const Input = React.forwardRef(
  (
    { placeholder, onInputChange, onBlur, onFocus, onKeyUp, value }: InputProps,
    ref?: React.Ref<HTMLInputElement>,
  ) => (
    <InputText
      placeholder={placeholder}
      onChange={(e) => onInputChange && onInputChange(e, e.target.value)}
      onBlur={(e) => onBlur && onBlur(e)}
      onFocus={(e) => onFocus && onFocus(e)}
      onKeyUp={(e) => onKeyUp && onKeyUp(e)}
      value={value}
      ref={ref}
    />
  ),
)

Input.displayName = 'InputText'

export default function SearchNavbar({
  placeholder,
  onBackClick,
  onDeleteClick,
  onInputChange,
  onKeyUp,
  onBlur,
  onFocus,
  value,
  inputRef,
}: {
  onBackClick: (event: React.SyntheticEvent) => void
  onDeleteClick?: (event: React.SyntheticEvent) => void
  inputRef?: React.Ref<HTMLInputElement>
} & InputProps) {
  return (
    <MainNavbarFrame borderless>
      <Back icon="back" onClick={onBackClick} />
      <Input
        placeholder={placeholder}
        onInputChange={onInputChange}
        onBlur={onBlur}
        onKeyUp={onKeyUp}
        onFocus={onFocus}
        value={value}
        ref={inputRef}
      />
      <DeleteIcon icon="delete" onClick={onDeleteClick} visible={!!value} />
    </MainNavbarFrame>
  )
}
