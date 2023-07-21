import styled from "styled-components";

export const FlexSection = styled.div<{ gutter?: number; direction?: 'row' | 'column' }>`
  display: flex;
  flex-direction: ${props => props.direction || 'row'};
  gap: ${props => props.gutter || 20}px;
`

export const Grid = styled.div<{ minColWidth: number; gap?: number }>`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(${props => props.minColWidth}px, 1fr));
  gap: ${props => props.gap || 20}px;
`
