import * as d3 from "d3";

import { MIN_SPACE_BETWEEN_NODES } from "@/lib/constants/variables";
import { WindowSize } from "@/lib/types/misc";

import { RawVertex, RawEdge } from "../types/graph";

export interface D3Vertex extends RawVertex, d3.SimulationNodeDatum {}
export interface D3Edge extends RawEdge {}

export function setInitialVertexPositions(
  vertices: RawVertex[],
  edges: RawEdge[],
  windowSize: WindowSize,
): { positionedVertices: D3Vertex[]; positionedEdges: D3Edge[] } {
  // make copies to allow d3 to take advantage of indexing
  const verticesCopy = vertices.map((v) => v);
  const edgesCopy = edges.map((v) => v);

  const simulation = d3
    .forceSimulation<D3Vertex>(verticesCopy)
    .force(
      "center",
      d3.forceCenter(windowSize.windowCenterX, windowSize.windowCenterY),
    )
    // .force("customRadial", customRadialForce)
    .force(
      "collision",
      d3
        .forceCollide()
        .radius((vertex) =>
          (vertex as D3Vertex).is_user ? 100 : MIN_SPACE_BETWEEN_NODES,
        )
        .strength(0.3),
    )
    .force(
      "charge",
      d3
        .forceManyBody()
        .strength((vertext) => ((vertext as D3Vertex).is_user ? 100 : -20)),
    );

  // Run the simulation synchronously
  simulation.tick(300);

  // Stop the simulation
  simulation.stop();

  return {
    positionedVertices: vertices,
    positionedEdges: edges,
  };
}
