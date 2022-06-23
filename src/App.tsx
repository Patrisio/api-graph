import React from 'react';
import {Routes, Route} from 'react-router-dom';
import Graph from './pages/graph/Graph';
import Test from './pages/test/Test';
import './App.css';

export default function App() {
	return (
		<Routes>
			<Route path='/' element={<Graph />} />
			<Route path='/test' element={<Test />} />
		</Routes>
	);
}