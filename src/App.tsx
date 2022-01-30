import React from 'react';
import {Routes, Route} from 'react-router-dom';
import Graph from './pages/graph/Graph';
import './App.css';

export default function App() {
	return (
		<Routes>
			<Route path='/' element={<Graph />} />
		</Routes>
	);
}