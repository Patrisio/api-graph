import React, {useEffect, useState, useRef} from 'react';
import HierarchyGraph from './graph/HierarchyGraph';
import {HierarchyGraph as HierarchyGraphComponent} from './components/HierarchyGraph';
import Drawer from './components/Drawer';
import Toolbar from './components/Toolbar';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import './App.css';

function App() {
  const [frontApi, setFrontApi] = useState<any>(null);
  const [graphData, setGraphData] = useState<any>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [nodeName, setNodeName] = useState<string>('');

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

   const highlightGraphLinksByNodeName = (e: any) => {
      if (e.key === 'Enter') {
         e.preventDefault();
         console.log(e.target.value);
      }
   }

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
