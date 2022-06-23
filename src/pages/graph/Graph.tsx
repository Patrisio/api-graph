import React, { useEffect, useState } from "react";
import { HierarchyGraphContainer } from "./containers/HierarchyGraphContainer";
import Toolbar from "../../components/Toolbar";
import "./Graph.css";
import Sidebar from "../../components/Sidebar";
import SidebarContentContainer from "./containers/SidebarContentContainer";
import useDrawerControls from "./hooks/useDrawerControls";
import useHierarchyGraph from "./hooks/useHierarchyGraph";
import { useGraphDimensions } from "./hooks/useGraphDimensions";
import { useYAMLFile } from "./hooks/useYAMLFile";
import {GRAPH_ROOT_CLASS_NAME} from './common/constants';

export default function Graph() {
  // const [frontApi, setFrontApi] = useState<any>(null);
  const [graphData, setGraphData] = useState<any>(null);

  const { handleDrawerOpen, handleDrawerClose, isDrawerOpen } =
    useDrawerControls();

  const { width, height } = useGraphDimensions({ isDrawerOpen, graphData });

  const { getYAMLFile, yaml } = useYAMLFile();

  const {
    handleGraph,
    resetGraph,
    resetNodesHighlight,
    movePointer,
    generateSchema,
    foundEntitiesCount,
    prevHighlightedNodes,
    currentPointerIndex,
  } = useHierarchyGraph(graphData);

  useEffect(() => {
    if (!yaml) return;
    const graphRootElement = document.querySelector(`.${GRAPH_ROOT_CLASS_NAME}`);
    if (graphRootElement) graphRootElement.replaceChildren();

    const hierarchyGraphData = generateSchema(yaml);

    setGraphData(hierarchyGraphData);
  }, [yaml]);

  return (
    <>
      <Toolbar
        handleOpen={handleDrawerOpen}
        open={isDrawerOpen}
        getYAMLFile={getYAMLFile}
      />
      <Sidebar onClose={handleDrawerClose} isOpen={isDrawerOpen}>
        <SidebarContentContainer
          foundEntitiesCount={foundEntitiesCount}
          prevHighlightedNodes={prevHighlightedNodes}
          currentPointerIndex={currentPointerIndex}
          movePointer={movePointer}
          resetNodesHighlight={resetNodesHighlight}
          handleGraph={handleGraph}
          resetGraph={resetGraph}
        />
      </Sidebar>
      <HierarchyGraphContainer
        graphWidth={width}
        graphHeight={height}
        data={graphData}
      />
    </>
  );
}
