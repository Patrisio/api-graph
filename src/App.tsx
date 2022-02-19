import React from 'react';
import {Routes, Route} from 'react-router-dom';
import Graph from './pages/graph/Graph';
import BotConstructor from './pages/botConstructor/BotConstructor';
import './App.css';

export default function App() {
	return (
		<Routes>
			<Route path='/' element={<Graph />} />
			<Route path='/bot' element={<BotConstructor />} />
		</Routes>
	);
}