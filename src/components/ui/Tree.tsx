import { Flex } from 'antd'
import React from 'react'
import styled from 'styled-components'

export interface NodeLeaf {
  key: string
  element: React.ReactNode
}

export interface NodeBranch {
  key: string
  title: string
  children: TreeNode[]
}

export type TreeNode = NodeLeaf | NodeBranch

interface StyledProps {
  $depth: number
}

const StyledTree = styled(Flex)<StyledProps>`
  > div {
    padding-left: 32px;
    position: relative;
  }

  > div::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0px;
    width: 32px;
    bottom: 50%;
    border-left: 1px solid gray;
    border-bottom: 1px solid gray;
  }

  > div:not(:last-child)::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 0px;
    width: 32px;
    bottom: -20px;
    border-left: 1px solid gray;
  }

  > h1 {
    position: sticky;
    background-color: black;
    top: ${({ $depth }) => $depth * 42}px;
    z-index: ${({ $depth }) => 10 - $depth};
  }
`

interface Props {
  treeData: TreeNode[]
  depth?: number
}

export function Tree(props: Props) {
  return props.treeData.map((node) =>
    'element' in node ? (
      <div key={node.key}>{node.element}</div>
    ) : (
      <StyledTree
        $depth={props.depth || 0}
        vertical
        key={node.key}
        gap="middle"
      >
        <h1 className="no-margin">{node.title}</h1>
        <Tree treeData={node.children} depth={(props.depth || 0) + 1} />
      </StyledTree>
    ),
  )
}
