import { Flex } from 'antd'
import React from 'react'
import styled, { css } from 'styled-components'

interface NodeLeaf {
  key: string
  element: React.ReactNode
}

export interface NodeBranch {
  key: string
  title: React.ReactNode
  extra?: React.ReactNode
  children: TreeNode[]
}

export type TreeNode = NodeLeaf | NodeBranch

interface StyledProps {
  $depth: number
}

const treeLine = css`
  content: '';
  position: absolute;
  left: 0px;
  width: 32px;
  border-left: 1px solid gray;
`

const StyledTree = styled(Flex)<StyledProps>`
  > .tree-node {
    padding-left: 32px;
    position: relative;

    &::before {
      ${treeLine}
      top: 0;
      bottom: 50%;
      border-bottom: 1px solid gray;
    }

    &:not(:last-child)::after {
      ${treeLine}
      top: 50%;
      bottom: -20px;
    }
  }

  > .tree-header {
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
      <div key={node.key} className="tree-node">
        {node.element}
      </div>
    ) : (
      <StyledTree
        $depth={props.depth || 0}
        vertical
        key={node.key}
        gap="middle"
        className="tree-node"
      >
        <Flex
          gap="middle"
          align="center"
          justify="space-between"
          className="tree-header"
        >
          <h1 className="no-margin">{node.title}</h1>
          {node.extra}
        </Flex>
        <Tree treeData={node.children} depth={(props.depth || 0) + 1} />
      </StyledTree>
    ),
  )
}
