import React, {useEffect, useState} from 'react';
import {HierarchyGraphContainer} from './containers/HierarchyGraphContainer';
import Toolbar from '../../components/Toolbar';
import './Graph.css';
import Sidebar from '../../components/Sidebar';
import SidebarContentContainer from './containers/SidebarContentContainer';
import useDrawerControls from './hooks/useDrawerControls';
import useHierarchyGraph from './hooks/useHierarchyGraph';

export default function Graph() {
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