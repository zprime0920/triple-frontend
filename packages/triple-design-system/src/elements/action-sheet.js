import React, { createContext } from 'react'
import styled from 'styled-components'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

const { Provider, Consumer } = createContext()

const Overlay = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(58, 58, 58, 0.7);
  z-index: 10;

  &.fade-enter {
    opacity: 0.01;

    & > div {
      margin-bottom: -100px;
    }
  }

  &.fade-enter.fade-enter-active {
    opacity: 1;
    transition: opacity 300ms ease-in;

    & > div {
      margin-bottom: 0;
      transition: margin-bottom 250ms ease-in;
    }
  }

  &.fade-leave {
    opacity: 1;

    & > div {
      margin-bottom: 0;
    }
  }

  &.fade-leave.fade-leave-active {
    opacity: 0.01;
    transition: opacity 300ms ease-in;

    & > div {
      margin-bottom: -100px;
      transition: margin-bottom 250ms ease-in;
    }
  }
`

const Sheet = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 11;
  border-radius: 12px 12px 0 0;
  background-color: #fff;
  box-sizing: border-box;
  padding-top: 30px;
  margin: 0;
  font-family: sans-serif;
`

const Title = styled.div`
  height: 16px;
  font-size: 13px;
  font-weight: bold;
  color: rgba(73, 73, 73, 0.7);
  margin: 0 0 10px 27px;
`

const ContentContainer = styled.div`
  box-sizing: border-box;
  max-height: calc(100vh - 256px);
  overflow: auto;
  padding: 0 25px 13px 25px;

  ::-webkit-scrollbar {
    display: none;
  }
`

const ActionItemContainer = styled.div`
  width: 100%;
  height: 54px;

  &:after {
    content: '';
    display: block;
    clear: both;
  }
`

const ItemText = styled.div`
  display: inline-block;
  width: ${({ width }) => width || '100%'};
  height: 54px;
  line-height: 54px;
  font-size: 16px;
  font-weight: 500;
  color: ${({ checked }) => (checked ? '#368fff' : '#3a3a3a')};
  font-weight: ${({ checked }) => (checked ? 'bold' : 'normal')};
  font-family: sans-serif;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`

const ItemButton = styled.a`
  float: right;
  height: 30px;
  line-height: 30px;
  margin-top: 11px;
  padding: 0 17px;
  text-align: center;
  border-radius: 15px;
  background-color: #fafafa;
  font-size: 12px;
  font-weight: bold;
  text-align: center;
  font-family: sans-serif;
  color: #3a3a3a;
`

const URL_BY_NAMES = {
  save: 'https://assets.triple.guide/images/img-action-save@4x.png',
  schedule: 'https://assets.triple.guide/images/img-action-schedule@4x.png',
  share: 'https://assets.triple.guide/images/img-action-share@4x.png',
  suggest: 'https://assets.triple.guide/images/img-action-suggest@4x.png',
  review: 'https://assets.triple.guide/images/img-action-review@4x.png',
  report: 'https://assets.triple.guide/images/img-action-report@4x.png',
  delete: 'https://assets.triple.guide/images/img-action-delete@4x.png',
}

const CHECKED_ICON_URL = 'https://assets.triple.guide/images/checkbox-on.svg'

const ItemIcon = styled.img`
  float: left;
  margin-top: 12px;
  width: 30px;
  height: 30px;
  margin-right: 9px;
`

const CheckedIcon = styled.div`
  float: right;
  margin-top: 9px;
  margin-right: -5px;
  width: 36px;
  height: 36px;
  background-size: 36px 36px;
  background-image: url(${CHECKED_ICON_URL});
  background-repeat: none;
`

function ActionItem({ buttonLabel, icon, checked, onClick, children }) {
  let textWidth = '100%'
  if (buttonLabel && icon) {
    textWidth = 'calc(100% - 100px)'
  } else if (buttonLabel || checked) {
    textWidth = 'calc(100% - 60px)'
  } else if (icon) {
    textWidth = 'calc(100% - 40px)'
  }

  return (
    <Consumer>
      {({ onClose }) => (
        <ActionItemContainer
          onClick={
            buttonLabel
              ? null
              : () =>
                  onClick
                    ? !onClick() && onClose && onClose()
                    : onClose && onClose()
          }
        >
          {icon ? <ItemIcon src={URL_BY_NAMES[icon]} /> : null}
          <ItemText width={textWidth} checked={checked}>
            {children}
          </ItemText>
          {buttonLabel ? (
            <ItemButton
              onClick={() =>
                onClick
                  ? !onClick() && onClose && onClose()
                  : onClose && onClose()
              }
            >
              {buttonLabel}
            </ItemButton>
          ) : null}
          {checked ? <CheckedIcon /> : null}
        </ActionItemContainer>
      )}
    </Consumer>
  )
}

export default function ActionSheet({ open, onClose, title, children }) {
  return (
    <ReactCSSTransitionGroup
      transitionName="fade"
      transitionEnter={true}
      transitionEnterTimeout={500}
      transitionLeave={true}
      transitionLeaveTimeout={500}
    >
      {open ? (
        <Overlay onClick={onClose}>
          <Sheet onClick={silenceEvent}>
            {title ? <Title>{title}</Title> : null}
            <Provider value={{ onClose }}>
              <ContentContainer>{children}</ContentContainer>
            </Provider>
          </Sheet>
        </Overlay>
      ) : null}
    </ReactCSSTransitionGroup>
  )
}

function silenceEvent(e) {
  return e.stopPropagation()
}

ActionSheet.Item = ActionItem
