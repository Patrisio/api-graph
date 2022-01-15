import React, {useEffect, useState} from 'react';
import * as d3 from 'd3';
import HierarchyGraph from './graph/HierarchyGraph';
import {HierarchyGraph as HierarchyGraphComponent} from './components/HierarchyGraph';
import Drawer from './components/Drawer';
import Toolbar from './components/Toolbar';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import {NODE_SIZE} from './graph/constants';
import './App.css';
import { curveBasisClosed } from 'd3';

let prevEntityName: string;

function App() {
  const [frontApi, setFrontApi] = useState<any>(null);
  const [graphData, setGraphData] = useState<any>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [nodeName, setNodeName] = useState<string>('');
  const [prevHighlightedNodes, setPrevHighlightedNodes] = useState<{color: string, id: string, scrollTop: number}[]>([]);
  const [foundEntitiesCount, setFoundEntitiesCount] = useState<number | null>(null);
  const [currentPointerIndex, setCurrentPointerIndex] = useState<number | null>(null);
  // const [isSearching, setSearching] = useState<boolean>(false);

  const handleDrawerOpen = () => {
      setOpen(true);
   };

   const handleDrawerClose = () => {
      setOpen(false);
   };

   const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setNodeName(event.target.value);
   };

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

   const makeNodesTransparent = (
      id: string,
      {
         circle = true,
         link = true,
         text = true
      }: any
   ) => {
      circle ?
         d3.select(`#circle-${id}`)
            .transition()
            .duration(700)
            .style('opacity', '.2') :
         d3.select(`#circle-${id}`)
            .transition()
            .duration(700)
            .style('opacity', '1');
      
      link ?
         d3.select(`#link-${id}`)
            .transition()
            .duration(700)
            .style('opacity', '.2') :
         d3.select(`#link-${id}`)
            .transition()
            .duration(700)
            .style('opacity', '1');

      text ?
         d3.select(`#text-${id}`)
            .transition()
            .duration(700)
            .style('opacity', '.2') :
         d3.select(`#text-${id}`)
            .transition()
            .duration(700)
            .style('opacity', '1');
   }

   const highlightCircleNodeById = (id: string) => {
      d3.select(`#circle-${id}`)
         .each(function highlightFoundNode() {
            (this as Element).setAttribute('style', `stroke: black; fill: black;`);
         });
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

   const returnCicleNodesToInitialStyles = () => {
      for (let {color, id} of prevHighlightedNodes) {
         d3.select(`#circle-${id}`)
            .style('stroke', color)
            .style('fill', color)
      }
   };

   const highlightGraphLinksByNodeName = (e: any) => {
      if (e.key === 'Enter') {
         e.preventDefault();
         const entityName = e.target.value;

         if (entityName === '') {
            resetGraph();
            return;
         }

         if (prevEntityName === entityName) {
            if (foundEntitiesCount) {
               currentPointerIndex === prevHighlightedNodes.length - 1 ?
                  setCurrentPointerIndex(0) :
                  setCurrentPointerIndex((prev) => prev !== null ? ++prev : prev);
               return;
            }

            setCurrentPointerIndex(null);
            return;
         }

         if (prevHighlightedNodes.length !== 0) {
            returnCicleNodesToInitialStyles();

            if (currentPointerIndex !== null) {
               disableAnimationToSelectedCircleNode(prevHighlightedNodes[(currentPointerIndex as number)].id);
            }

            if (currentPointerIndex === 0) {
               disableAnimationToSelectedCircleNode(prevHighlightedNodes[(currentPointerIndex as number)].id);
            }

            setPrevHighlightedNodes([]);
         }
         
         const foundNode = findNodeByName(entityName, graphData);
         console.log(foundNode, '__FOUND_NODE__');
         if (foundNode) {
            updateGraph(foundNode);
            setCurrentPointerIndex(null);
         } else {
            returnCicleNodesToInitialStyles();
            resetOpacityForAllNodes();
            setFoundEntitiesCount(0);
            setPrevHighlightedNodes([]);
         }

         prevEntityName = entityName;

         console.log(foundNode, '__FOUND__');
         console.log(graphData, 'graphData');
      }
   }

   const resetOpacityForAllNodes = () => {
      d3.selectAll('text').each((d: any, i: number) => {
         makeNodesTransparent(d.data.id, {
            circle: false,
            link: false,
            text: false,
         });
      })
   };

   const resetGraph = () => {
      returnCicleNodesToInitialStyles();
      resetOpacityForAllNodes();
      setFoundEntitiesCount(null);
      setNodeName('');
      setPrevHighlightedNodes([]);
      disableAnimationToSelectedCircleNode(prevHighlightedNodes[(currentPointerIndex as number)].id);
   };

   const getCurrentPointerIndex = () => {
      if (currentPointerIndex !== null) {
         return currentPointerIndex + 1;
      }
   };

   const activateAnimationToSelectedCircleNode = (id: string) => {
      d3.select(`#circle-${id}`)
         .style('animation', 'scaleUp 0.6s ease infinite');
   };

   const disableAnimationToSelectedCircleNode = (id: string) => {
      d3.select(`#circle-${id}`)
         .style('animation', 'none');
   };

	// const highlightSelectedNodeDeps = (children: any) => {
	// 	for (let node of children) {

	// 	}
	// };

   useEffect(() => {
      const getFrontApi = async () => {
         const response = await fetch('getData');
         const data = await response.json();
         setFrontApi(data);
      };

      getFrontApi();
   }, []);

   useEffect(() => {
      if (frontApi) {
         const hierarchyGraphData = HierarchyGraph.generateSchema(frontApi);
         setGraphData(hierarchyGraphData);
      }
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
			console.log(selectedNode, '__selectedNode__');
			if (currentPointerIndex > 0) disableAnimationToSelectedCircleNode(prevHighlightedNodes[currentPointerIndex - 1].id);
			activateAnimationToSelectedCircleNode(selectedNode.id);
			// highlightSelectedNodeDeps(selectedNode.children);
		}
   }, [currentPointerIndex]);

  return (
    <div className='outer'>
      <Toolbar
         handleOpen={handleDrawerOpen}
         open={open}
      />
      <Drawer
         handleClose={handleDrawerClose}
         open={open}
      >
         <Box
            component="form"
            sx={{
            '& > :not(style)': { ml: 3, width: '40ch' },
            }}
            noValidate
            autoComplete="off"
         >
            <TextField
               label="Введите название/описание сущности"
               variant="outlined"
               onChange={handleChange}
               value={nodeName}
               onKeyPress={highlightGraphLinksByNodeName}
              //  disabled={isSearching}
            />
            {
							foundEntitiesCount !== null /*&& !isSearching*/ ?
							foundEntitiesCount > 0 ?
								(
										<Typography variant="body2" gutterBottom>
											Найдено {foundEntitiesCount} совпадений ({getCurrentPointerIndex()}/{foundEntitiesCount})
										</Typography>
								) :
								(
										<Typography variant="body2" gutterBottom>
											Cовпадений не найдено
										</Typography>
								) :
							null
            }
            <Button
               variant="text"
               onClick={resetGraph}
               disabled={prevHighlightedNodes.length === 0}
            >
               Reset
            </Button>
         </Box>
      </Drawer>
      <HierarchyGraphComponent
         graphWidth={open ? 1350 : 1800}
         data={graphData}
      />
    </div>
  );
}

export default App;
