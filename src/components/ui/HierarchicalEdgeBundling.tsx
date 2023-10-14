// HierarchicalEdgeBundling.tsx
import React, { useRef, useEffect } from "react";
import * as d3 from "d3";
import { EdgeBundling } from "@/utils/tagClustering";

const colornone = "#444"
function colorTag(d: d3.HierarchyNode<EdgeBundling>) {
  return `hsl(${d.data.color}, 100%, 70%)`
}
const colorout = "#ff66b3"

interface ExtendedHierarchyPointNode<T> extends d3.HierarchyPointNode<T> {
  text?: SVGTextElement;
  path: (target: this) => this[]
  pathElement?: SVGPathElement | null;
  outgoing?: Array<this>;
}

interface ExtendedHierarchyNode<T> extends d3.HierarchyNode<T> {
  outgoing?: Array<Array<this>>;
}

// Función que establece relaciones bidireccionales entre los nodos.
function bilink(root: d3.HierarchyNode<EdgeBundling>): ExtendedHierarchyNode<EdgeBundling> {
  const map: Map<string, ExtendedHierarchyNode<EdgeBundling>> = new Map(root.leaves().map(d => [d.data.name, d]));
  for (const d of root.leaves()) {
    (d as ExtendedHierarchyNode<EdgeBundling>).outgoing = d.data.connections.map((i) => [d, map.get(i.name)!]);
  }
  return root;
}

interface Props {
  data: EdgeBundling;
}

const HierarchicalEdgeBundling: React.FC<Props> = ({ data }) => {
  const ref = useRef<SVGSVGElement | null>(null);

  // Función que resalta los enlaces y nodos relacionados cuando se pasa el ratón sobre un nodo.
  function overed(_event: unknown, d: ExtendedHierarchyPointNode<EdgeBundling>) {
    d3.selectAll(d.outgoing?.map((d) => d.pathElement!).filter(Boolean) || [])
      .attr("stroke", colorout)
      .raise();
  }

  function outed(this: SVGTextElement, _event: unknown, d: ExtendedHierarchyPointNode<EdgeBundling>) {
    d3.select(this).attr("font-weight", null).attr("fill", colorTag(d));  // Restablece el color del texto a blanco
    d3.selectAll(d.outgoing?.map(d => d.pathElement!).filter(Boolean) || []).attr("stroke", colornone);  // Restablece el color de los enlaces salientes a gris claro
  }

  useEffect(() => {
    if (ref.current) {

      // Define las dimensiones del gráfico.
      const width = 954;
      const radius = width / 2;

      // Define un clúster con d3 usando el tamaño especificado.
      const tree = d3.cluster<EdgeBundling>().size([2 * Math.PI, radius - 100]);

      // Genera un árbol a partir de los datos y lo ordena por color
      const root: ExtendedHierarchyPointNode<EdgeBundling> = tree(
        bilink(
          d3
            .hierarchy(data)
            .sort(
              (a, b) =>
                d3.ascending(a.height, b.height) ||
                d3.ascending(a.data.color, b.data.color)
            )
        )
      );

      // Crea un elemento SVG con las dimensiones y estilos especificados.
      const svg = d3
        .select(ref.current)
        .attr("width", width)
        .attr("height", width)
        .attr("viewBox", [-width / 2, -width / 2, width, width])
        .attr("style", "width: 100%; height: auto; font-size: 14px; max-height: 100vh;");

      // Genera nodos del árbol como elementos de texto en el SVG.
      svg
        .append("g")
        .selectAll()
        .data(root.leaves())
        .join("g")
        .attr(
          "transform",
          (d) => `rotate(${(d.x * 180) / Math.PI - 90}) translate(${d.y},0)`
        )
        .append("text")
        .attr("dy", "0.31em")
        .attr("x", (d) => (d.x < Math.PI ? 6 : -6))
        .attr("text-anchor", (d) => (d.x < Math.PI ? "start" : "end"))
        .attr("transform", (d) => (d.x >= Math.PI ? "rotate(180)" : null))
        .attr("padding-left", "8px")
        .attr("padding-right", "8px")
        .text((d) => `${d.data.name}${d.data.difference ? ` (${d.data.difference})` : ''}`)
        .attr("fill", colorTag)
        .each(function (d) {
          d.text = this;
        })
        .on("mouseover", overed)
        .on("mouseout", outed)
        .call((text) =>
          text.append("title").text((d) => `${d.data.name}${d.data.difference ? ` (${d.data.difference})` : ''}`)
        );

      // Define el tipo de línea para los enlaces entre nodos.
      const line = d3
        .lineRadial<{ x: number, y: number }>()
        .curve(d3.curveBundle.beta(0.85))
        .radius((d) => d.y)
        .angle((d) => d.x);

      // Genera enlaces entre nodos en el SVG.
      svg
        .append("g")
        .attr("stroke", colornone)
        .attr("fill", "none")
        .selectAll()
        .data(root.leaves().flatMap((leaf) => leaf.outgoing))
        .join("path")
        .attr("d", (d) => {
          if (!d) return null;
          const [i, o] = d;
          return line(i.path(o))
        })
        .each(function (d) {
          if (!d) return;
          d.pathElement = this;
        });



      return () => {
        svg.selectAll("*").remove();
      };
    }
  }, [data]);

  return <svg ref={ref}></svg>;
};

export default HierarchicalEdgeBundling;
