import React, { useEffect, useRef } from 'react'
import * as d3 from 'd3'
import { CirclePackaging } from '@/utils/tagClustering'

interface CirclePackagingProps {
  data: CirclePackaging
}

export const CirclePacking: React.FC<CirclePackagingProps> = (props) => {
  const ref = useRef<SVGSVGElement | null>(null)

  useEffect(() => {
    if (!ref.current) return

    const fontSize = (d: d3.HierarchyCircularNode<CirclePackaging>) =>
      Math.min((2 * d.r) / (d.data.name.length * 0.5), d.r * 0.7) + 'px'
    const fontAndStrokeColor = (d: d3.HierarchyCircularNode<CirclePackaging>) =>
      `hsl(${d.data.color}, 100%, 70%)`
    const backgroundColor = (d: d3.HierarchyCircularNode<CirclePackaging>) =>
      `hsla(${d.data.color}, 100%, 15%, 0.5)`

    // Specify the dimensions of the chart.
    const width = 928
    const height = width
    const margin = 1 // to avoid clipping the root circle stroke

    // Specify the number format for values.
    const format = d3.format(',d')

    // Create the pack layout.
    const pack = d3
      .pack<CirclePackaging>()
      .size([width - margin * 2, height - margin * 2])
      .padding(3)

    // Compute the hierarchy from the JSON data; recursively sum the
    // values for each node; sort the tree by descending value; lastly
    // apply the pack layout.
    const root = pack(
      d3
        .hierarchy(props.data)
        .sum((d) => d.appearances)
        .sort((a, b) => Number(b.value) - Number(a.value)),
    )

    // Create the SVG container.
    const svg = d3
      .select(ref.current)
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', [-margin, -margin, width, height])
      .attr('style', 'width: 100%; height: auto; max-height: 100vh;')
      .attr('text-anchor', 'middle')

    // Place each node according to the layout’s x and y values.
    const node = svg
      .append('g')
      .selectAll()
      .data(root.descendants())
      .join('g')
      .attr('transform', (d) => `translate(${d.x},${d.y})`)

    // Add a title.
    node
      .append('title')
      .text((d) => `${d.data.name} (${format(Number(d.value))})`)

    // Add a filled or stroked circle.
    node
      .append('circle')
      .attr('fill', backgroundColor)
      .attr('stroke', fontAndStrokeColor)
      .attr('stroke-width', '2')
      .attr('r', (d) => d.r)

    // Add a label to leaf nodes.
    const text = node
      .filter((d) => !d.children && d.r > 10)
      .append('text')
      .attr('clip-path', (d) => `circle(${d.r})`)
      .style('font-size', fontSize) // Aquí establecemos el tamaño de la fuente
      .attr('fill', fontAndStrokeColor)

    // Add a tspan for each CamelCase-separated word.
    text
      .selectAll()
      .data((d) => d.data.name.split(/(?=[A-Z][^A-Z])/g))
      .join('tspan')
      .attr('x', 0)
      .attr('y', (_d, i, nodes) => `${i - nodes.length / 2 + 0.35}em`)
      .text((d) => d)

    // Add a tspan for the node’s value.
    text
      .append('tspan')
      .attr('x', 0)
      .attr(
        'y',
        (d) => `${d.data.name.split(/(?=[A-Z][^A-Z])/g).length / 2 + 0.35}em`,
      )
      .attr('fill-opacity', 0.7)
      .text((d) => format(Number(d.value)))

    return () => {
      svg.selectAll('*').remove()
    }
  }, [props.data])

  return <svg ref={ref} />
}
