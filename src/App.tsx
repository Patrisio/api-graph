import React, {useEffect, useState} from 'react';
import {HierarchyGraphContainer} from './graphPage/containers/HierarchyGraphContainer';
import Toolbar from './components/Toolbar';
import './App.css';
import Sidebar from './components/Sidebar';
import SidebarContentContainer from './graphPage/containers/SidebarContentContainer';
import useDrawerControls from './graphPage/hooks/useDrawerControls';
import useHierarchyGraph from './graphPage/hooks/useHierarchyGraph';

export default function App() {
	const [frontApi, setFrontApi] = useState<any>(null);
	const [graphData, setGraphData] = useState<any>(null);

	const {
		handleDrawerOpen,
		handleDrawerClose,
		isDrawerOpen,
	} = useDrawerControls();

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
		const getFrontApi = async () => {
			const response = await fetch('getData');
			const data = await response.json();
			setFrontApi(data);
		};

		getFrontApi();
	}, []);

	useEffect(() => {
		if (!frontApi) return;

		const hierarchyGraphData = generateSchema(frontApi);
		setGraphData(hierarchyGraphData);
	}, [frontApi]);

	return (
		<>
			<Toolbar
				handleOpen={handleDrawerOpen}
				open={isDrawerOpen}
			/>
			<Sidebar
				onClose={handleDrawerClose}
				isOpen={isDrawerOpen}
			>
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
				graphWidth={isDrawerOpen ? 1350 : 1800}
				data={graphData}
			/>
		</>
	);
}