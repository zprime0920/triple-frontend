import React from 'react'
import styled, { css } from 'styled-components'
import Icon from './icon'
import { HR1, HR3 } from './content-elements'

const ListBase = styled.ul`
  li:not(:first-child) {
    ${({ verticalMargin }) => css`
      margin-top: ${verticalMargin || 0}px;
    `};
  }
`

function List({ divided, verticalMargin, children }) {
  if (divided) {
    return (
      <ListBase>
        {children
          .reduce(
            (array, child) => [
              ...array,
              child,
              <HR1
                key={array.length + 1}
                margin={{ top: verticalMargin / 2, bottom: verticalMargin / 2 }}
              />,
            ],
            [],
          )
          .slice(0, -1)}
      </ListBase>
    )
  } else if (verticalMargin) {
    return (
      <ListBase>
        {children
          .reduce(
            (array, child) => [
              ...array,
              child,
              <HR3 key={array.length + 1} height={verticalMargin} />,
            ],
            [],
          )
          .slice(0, -1)}
      </ListBase>
    )
  }

  return <ListBase>{children}</ListBase>
}

const ListIcon = styled(Icon)`
  display: table-cell;
  padding-right: 10px;
`

const ListItem = styled.li`
  clear: both;
  position: relative;
  list-style-type: none;
`

const ListContent = styled.div`
  display: table-cell;
`

const ListActions = styled.div`
  float: right;
`

const ListActionCell = styled.div`
  height: 40px;
  display: table-cell;
  text-align: center;
  vertical-align: middle;
`

const ListActionLabel = styled.div`
  display: inline-block;
  padding-top: 8px;
  padding-bottom: 7px;
  padding-left: 17px;
  padding-right: 17px;
  text-align: center;
  font-family: sans-serif;
  font-size: 12px;
  font-weight: bold;
  color: #3a3a3a;
  border-radius: 17px;
  background-color: #fafafa;
`

function ListAction({ children }) {
  return (
    <ListActions>
      <ListActionCell>
        <ListActionLabel>{children}</ListActionLabel>
      </ListActionCell>
    </ListActions>
  )
}

List.Item = ListItem
List.Icon = ListIcon
List.Content = ListContent
List.Action = ListAction

export default List
