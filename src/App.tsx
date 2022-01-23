import React, {useEffect, useState} from 'react';
import * as d3 from 'd3';
import HierarchyGraph from './graph/HierarchyGraph';
import {HierarchyGraph as HierarchyGraphComponent} from './components/HierarchyGraph';
import Toolbar from './components/Toolbar';
import {NODE_SIZE} from './graph/constants';
import './App.css';
import Sidebar from './components/Sidebar';
import SidebarContent from './graphPage/SidebarContent';
import useDrawerControls from './hooks/useDrawerControls';
import useD3Selection from './hooks/useD3Selection';

export default function App() {
	const [frontApi, setFrontApi] = useState<any>(null);
	const [graphData, setGraphData] = useState<any>(null);
	const [prevHighlightedNodes, setPrevHighlightedNodes] = useState<{color: string, id: string, scrollTop: number}[]>([]);
	const [foundEntitiesCount, setFoundEntitiesCount] = useState<number | null>(null);
	const [currentPointerIndex, setCurrentPointerIndex] = useState<number | null>(null);

	const {
		handleDrawerOpen,
		handleDrawerClose,
		isDrawerOpen,
	} = useDrawerControls();

	const {
		makeNodesTransparent,
        highlightCircleNodeById,
        returnCicleNodesToInitialStyles,
        resetOpacityForAllNodes,
        activateAnimationToSelectedCircleNode,
        disableAnimationToSelectedCircleNode,
	} = useD3Selection();

   const findNodeByName = (entityName: string, data: any): any => {
      let foundNode;

      if (!data.children) return foundNode;

      for (let entityContent of data.children) {
         if (entityContent.name === entityName) {
            foundNode = entityContent;
            break;
         } else {
            foundNode = findNodeByName(entityName, entityContent);
         }

         if (foundNode) {
            return foundNode;
         }
      }

      return foundNode;
   };

   const getScrollTop = (node: any) => {
      return (node as Element)?.getBoundingClientRect().y + 
         document.documentElement.scrollTop - (window.innerHeight / 2) - (NODE_SIZE / 2);
   };

    const recursiveTraverse = (depsIds: string[], children: any) => {
        for (let node of children) {
            depsIds.push(node.id);
            recursiveTraverse(depsIds, node.children);
        }
    };

   const updateGraph = (foundNode: any) => {
        const foundNodeDepsIds: string[] = [];
        const filteredNodes = d3.selectAll('text')
            .filter((d: any, i: number): any => {
                if (d.data.name === foundNode.name) {
                    const foundNodeChildren = d.data.children;

                    makeNodesTransparent(d.data.id, {
                        circle: false,
                        link: true,
                        text: false,
                    });

                    if (foundNodeChildren.length > 0) {
                        recursiveTraverse(
                           foundNodeDepsIds,
                           foundNodeChildren,
                        );
                    }
                    
                    return true;
                }

                foundNodeDepsIds.includes(d.data.id) ?
                    makeNodesTransparent(d.data.id, {
                        circle: false,
                        link: false,
                        text: false,
                    }) :
                    makeNodesTransparent(d.data.id, {
                        circle: true,
                        link: true,
                        text: true,
                    });                
            });
      	setFoundEntitiesCount(filteredNodes.size());

      	const nodesList = filteredNodes.nodes();
		filteredNodes.each(({data: d3Node}: any, i: number) => {
        	const currentNode = nodesList[i];
			setPrevHighlightedNodes(prev => ([
				...prev,
				{
					id: d3Node.id,
					color: d3Node.type,
					children: d3Node.children,
					scrollTop: getScrollTop(currentNode),
				}
			]));
			highlightCircleNodeById(d3Node.id);
		});
   	};

	const movePointer = () => {
		if (foundEntitiesCount) {
			currentPointerIndex === prevHighlightedNodes.length - 1 ?
				setCurrentPointerIndex(0) :
				setCurrentPointerIndex((prev) => prev !== null ? ++prev : prev);
			return;
		}

		setCurrentPointerIndex(null);
	};

   const resetGraph = () => {
      returnCicleNodesToInitialStyles(prevHighlightedNodes);
      resetOpacityForAllNodes();
      setFoundEntitiesCount(null);
      setPrevHighlightedNodes([]);
      disableAnimationToSelectedCircleNode(prevHighlightedNodes[(currentPointerIndex as number)].id);
   };

	const resetNodesHighlight = () => {
		if (currentPointerIndex !== null) {
			disableAnimationToSelectedCircleNode(prevHighlightedNodes[(currentPointerIndex as number)].id);
		}
		if (currentPointerIndex === 0) {
			disableAnimationToSelectedCircleNode(prevHighlightedNodes[(currentPointerIndex as number)].id);
		}

		returnCicleNodesToInitialStyles(prevHighlightedNodes);
		setPrevHighlightedNodes([]);
	};

	const handleGraph = (entityName: string) => {
		const foundNode = findNodeByName(entityName, graphData);

		if (foundNode) {
			updateGraph(foundNode);
			setCurrentPointerIndex(null);
		} else {
			returnCicleNodesToInitialStyles(prevHighlightedNodes);
			resetOpacityForAllNodes();
			setFoundEntitiesCount(0);
			setPrevHighlightedNodes([]);
		}
	};

	useEffect(() => {
		const getFrontApi = async () => {
			const response = await fetch('getData');
			const data = await response.json();
			setFrontApi(data);
		};

		getFrontApi();
	}, []);


	useEffect(() => {
		if (!frontApi) return;

		const hierarchyGraphData = HierarchyGraph.generateSchema(frontApi);
		setGraphData(hierarchyGraphData);
	}, [frontApi]);

	useEffect(() => {
		if (prevHighlightedNodes.length > 0) {
			setCurrentPointerIndex(0)
		} 
	}, [prevHighlightedNodes]);

	useEffect(() => {
		if (prevHighlightedNodes.length > 0 && currentPointerIndex !== null) {
			const selectedNode = prevHighlightedNodes[currentPointerIndex];
			window.scroll(0, selectedNode.scrollTop);
			if (currentPointerIndex > 0) disableAnimationToSelectedCircleNode(prevHighlightedNodes[currentPointerIndex - 1].id);
			activateAnimationToSelectedCircleNode(selectedNode.id);
		}
	}, [currentPointerIndex]);

	return (
		<div className='outer'>
			<Toolbar
				handleOpen={handleDrawerOpen}
				open={isDrawerOpen}
			/>
			<Sidebar
				onClose={handleDrawerClose}
				isOpen={isDrawerOpen}
			>
				<SidebarContent
					foundEntitiesCount={foundEntitiesCount}
					prevHighlightedNodes={prevHighlightedNodes}
					currentPointerIndex={currentPointerIndex}
					movePointer={movePointer}
					resetNodesHighlight={resetNodesHighlight}
					handleGraph={handleGraph}
					resetGraph={resetGraph}
				/>
			</Sidebar>
			<HierarchyGraphComponent
				graphWidth={isDrawerOpen ? 1350 : 1800}
				data={graphData}
			/>
		</div>
	);
}