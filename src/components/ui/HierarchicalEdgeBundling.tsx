// HierarchicalEdgeBundling.tsx
import React, { useRef, useEffect } from "react";
import * as d3 from "d3";
import { EdgeBundling } from "@/utils/tagClustering";

// Función que establece relaciones bidireccionales entre los nodos.
function bilink(root: d3.HierarchyNode<EdgeBundling>) {
  const map = new Map(root.leaves().map(d => [d.data.name, d]));
  for (const d of root.leaves()) {
    d.data.incoming = [];
    d.data.outgoing = d.data.connections.map((i) => [d, map.get(i.name)]);
    for (const o of d.data.outgoing) {
      o[1].incoming.push(o);
    }
  }
  return root;
}

interface Props {
  data: EdgeBundling;
}

const HierarchicalEdgeBundling: React.FC<Props> = ({ data }) => {
  const ref = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (ref.current) {

      // Define las dimensiones del gráfico.
      const width = 954;
      const radius = width / 2;

      // Define un clúster con d3 usando el tamaño especificado.
      const tree = d3.cluster<EdgeBundling>().size([2 * Math.PI, radius - 100]);

      // Genera un árbol a partir de los datos y lo ordena por color
      const root = tree(
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
        .attr("style", "max-width: 100%; height: auto; font: 10px sans-serif;");

      // Genera nodos del árbol como elementos de texto en el SVG.
      const node = svg
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
        .text((d) => d.data.name)
        .each(function (d) {
          d.text = this;
        })
        .on("mouseover", overed)
        .on("mouseout", outed)
        .call((text) =>
          text.append("title").text((d) => d.data.name)
        );

      // Define el tipo de línea para los enlaces entre nodos.
      const line = d3
        .lineRadial()
        .curve(d3.curveBundle.beta(0.85))
        .radius((d) => d.y)
        .angle((d) => d.x);

      // Genera enlaces entre nodos en el SVG.
      const link = svg
        .append("g")
        .attr("stroke", colornone)
        .attr("fill", "none")
        .selectAll()
        .data(root.leaves().flatMap((leaf) => leaf.outgoing))
        .join("path")
        .style("mix-blend-mode", "multiply")
        .attr("d", ([i, o]) => line(i.path(o)))
        .each(function (d) {
          d.path = this;
        });

      // Función que resalta los enlaces y nodos relacionados cuando se pasa el ratón sobre un nodo.
      function overed(event, d) {
        link.style("mix-blend-mode", null);
        d3.select(this).attr("font-weight", "bold");
        d3.selectAll(d.incoming.map((d) => d.path))
          .attr("stroke", colorin)
          .raise();
        d3.selectAll(d.incoming.map(([d]) => d.text))
          .attr("fill", colorin)
          .attr("font-weight", "bold");
        d3.selectAll(d.outgoing.map((d) => d.path))
          .attr("stroke", colorout)
          .raise();
        d3.selectAll(d.outgoing.map(([, d]) => d.text))
          .attr("fill", colorout)
          .attr("font-weight", "bold");
      }

      // Función que elimina el resaltado de los enlaces y nodos relacionados cuando el ratón sale de un nodo.
      function outed(event, d) {
        link.style("mix-blend-mode", "multiply");
        d3.select(this).attr("font-weight", null);
        d3.selectAll(d.incoming.map((d) => d.path)).attr("stroke", null);
        d3.selectAll(d.incoming.map(([d]) => d.text))
          .attr("fill", null)
          .attr("font-weight", null);
        d3.selectAll(d.outgoing.map((d) => d.path)).attr("stroke", null);
        d3.selectAll(d.outgoing.map(([, d]) => d.text))
          .attr("fill", null)
          .attr("font-weight", null);
      }

      return () => {
        svg.selectAll("*").remove();
      };
    }
  }, [data]);

  return <svg ref={ref} width={500} height={500}></svg>;
};

export default HierarchicalEdgeBundling;
