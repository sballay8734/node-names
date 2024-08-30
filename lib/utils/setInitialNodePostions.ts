import * as d3 from "d3";

import { WindowSize } from "@/lib/types/misc";

import { MIN_SPACE_BETWEEN_NODES } from "../constants/styles";
import { RawNode, RawEdge } from "../types/graph";

export interface D3Node extends RawNode, d3.SimulationNodeDatum {}
export interface D3Edge extends RawEdge {}

export function setInitialNodePositions(
  nodes: RawNode[],
  edges: RawEdge[],
  windowSize: WindowSize,
): { positionedNodes: D3Node[]; positionedEdges: D3Edge[] } {
  // make copies to allow d3 to take advantage of indexing
  const nodesCopy = nodes.map((v) => v);
  const edgesCopy = edges.map((v) => v);

  const simulation = d3
    .forceSimulation<D3Node>(nodesCopy)
    .force(
      "center",
      d3.forceCenter(windowSize.windowCenterX, windowSize.windowCenterY),
    )
    // .force("customRadial", customRadialForce)
    .force(
      "collision",
      d3
        .forceCollide()
        .radius((node) =>
          (node as D3Node).is_user ? 100 : MIN_SPACE_BETWEEN_NODES,
        )
        .strength(0.3),
    )
    .force(
      "charge",
      d3
        .forceManyBody()
        .strength((nodet) => ((nodet as D3Node).is_user ? 100 : -20)),
    );

  // Run the simulation synchronously
  simulation.tick(300);

  // Stop the simulation
  simulation.stop();

  return {
    positionedNodes: nodes,
    positionedEdges: edges,
  };
}
