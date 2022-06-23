import { useMemo } from "react";
import { NODE_SIZE, MARGINS } from "../common/constants";

type UseGraphDimensionsType = ({
  isDrawerOpen,
  graphData,
}: {
  isDrawerOpen: boolean;
  graphData: any;
}) => {
  width: number | undefined;
  height: number | undefined;
};

export const useGraphDimensions: UseGraphDimensionsType = ({
  isDrawerOpen,
  graphData,
}) => {
  const width = useMemo(() => {
    if (!graphData) return;

    return isDrawerOpen ? 1350 : 1800;
  }, [isDrawerOpen, graphData]);

  const height = useMemo(() => {
    if (!graphData) return;

    const graphPathListL1 = graphData.children;
    let nodeCount = 0;

    const countAllNodes = (list: any) => {
      nodeCount += list.length;

      for (let item of list) {
        if (!item.children || item.children.length === 0) {
          continue;
        }

        countAllNodes(item.children);
      }
    };

    countAllNodes(graphPathListL1);

    const { TOP, BOTTOM } = MARGINS;

    const totalHeight = nodeCount * (NODE_SIZE + 8) + TOP + BOTTOM;

    return totalHeight;
  }, [graphData]);

  return useMemo(
    () => ({
      width,
      height,
    }),
    [width, height]
  );
};
