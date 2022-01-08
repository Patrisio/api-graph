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
import './App.css';

let prevEntityName: string;

function App() {
  const [frontApi, setFrontApi] = useState<any>(null);
  const [graphData, setGraphData] = useState<any>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [nodeName, setNodeName] = useState<string>('');
  const [prevHighlightedNodes, setPrevHighlightedNodes] = useState<{color: string, id: string, scrollTop: number}[]>([]);
  const [foundEntitiesCount, setFoundEntitiesCount] = useState<number | null>(null);
  const [currentPointerIndex, setCurrentPointerIndex] = useState<number | null>(null);

  const handleDrawerOpen = () => {
      setOpen(true);
   };

   const handleDrawerClose = () => {
      setOpen(false);
   };

   const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setNodeName(event.target.value);
      console.log(event.target.value);
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
      id: number,
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

   const updateGraph = (foundNode: any) => {
      const filteredNodes = d3.selectAll('text')
         .filter((d: any, i: number): any => {
            if (d.data.name === foundNode.name) {
               makeNodesTransparent(i, {
                  circle: false,
                  link: true,
                  text: false,
               });
               return true;
            }
            makeNodesTransparent(i, {
               circle: true,
               link: true,
               text: true,
            });
         });

      setFoundEntitiesCount(filteredNodes.size());

      const nodesList = filteredNodes.nodes();
      filteredNodes.each(function(node: any, i: number) {
         const textNodeId = (this as Element).getAttribute('id');
         const id = textNodeId?.split('-')[1] || '';
         const currentNode = nodesList[i];
         setPrevHighlightedNodes(prev => ([
            ...prev,
            {
               color: foundNode.type,
               id,
               scrollTop: (currentNode as Element)?.getBoundingClientRect().y + document.documentElement.scrollTop,
            }
         ]));
         highlightCircleNodeById(id);
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
            setPrevHighlightedNodes([]);
         }
         
         const foundNode = findNodeByName(entityName, graphData);
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
         makeNodesTransparent(i, {
            circle: false,
            link: false,
            text: false,
         });
      })
   };

   const resetGraph = () => {
      console.log('reset');
      returnCicleNodesToInitialStyles();
      resetOpacityForAllNodes();
      setFoundEntitiesCount(null);
      setNodeName('');
      setPrevHighlightedNodes([]);
   };

   const getCurrentPointerIndex = () => {
      if (currentPointerIndex !== null) {
         return currentPointerIndex + 1;
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
         console.log(prevHighlightedNodes, 'prevHighlightedNodes');
         console.log(currentPointerIndex, 'currentPointerIndex');
         window.scroll(0, prevHighlightedNodes[currentPointerIndex].scrollTop);
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
            />
            {
               foundEntitiesCount !== null ?
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
