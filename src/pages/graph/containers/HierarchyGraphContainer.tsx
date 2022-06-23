import React, { memo } from "react";
import HierarchyGraphView from "../views/HierarchyGraphView";
import useD3GraphRendering from "../hooks/useD3GraphRendering";
import { GRAPH_ROOT_CLASS_NAME } from "../common/constants";

export const HierarchyGraphContainer = memo(
  ({ data, graphWidth, graphHeight }: any) => {
    useD3GraphRendering(GRAPH_ROOT_CLASS_NAME, graphWidth, graphHeight, data);

    return <HierarchyGraphView />;
  }
);
