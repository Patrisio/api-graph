import React, {useEffect, useRef} from 'react';
import * as d3 from 'd3';
import useD3Selection from './useD3Selection';

export default function useD3GraphRendering(graphRootNode: string, graphWidth: number, data: any) {
    const { current: graphData } = useRef<any>({
        margin: {
            top: 20,
            right: 90,
            bottom: 30,
            left: 90,
        },
        dimensions: {
            width: null,
            height: null,
        },
        treeMap: null,
        nodes: null,
        groupElement: null,
        nodeElement: null,
    });

    const {setGraphWidth} = useD3Selection();

    const setDimensionsAndMarginsToGraph = (graphWidth: number) => {
        let {
            margin,
        } = graphData;

        graphData.dimensions.width = graphWidth - margin.left - margin.right; // 1800
        graphData.dimensions.height = 26000 - margin.top - margin.bottom;

        const treemap = d3
            .tree()
            .size([graphData.dimensions.height, graphData.dimensions.width])
            .separation((a, b) =>  10);
            
        graphData.treeMap = treemap;
    };

    const assignDataToGraph = () => {
        const nodes: any = d3.hierarchy(data, (d: any) => d.children);
        graphData.nodes = graphData.treeMap(nodes);
    };

    const renderGraphContainer = () => {
        let {
            dimensions: {
                width,
                height,
            },
            margin,
        } = graphData;

        const svg = d3
            .select(`.${graphRootNode}`).append('svg')
            .attr('class', 'graph')
            .attr('viewBox', [0, 0, 2000, height + 20])
            .attr('width', width + margin.left + margin.right);

        graphData.groupElement = svg
            .append('g')
            .attr('transform',
                `translate(${margin.left},${margin.top})`);
        
    };

    const addLinksBetweendNodes = () => {
        graphData.groupElement
            .selectAll('.link')
            .data(graphData.nodes.descendants().slice(1))
            .enter().append('path')
            .attr('id', (d: any, i: any): any => `link-${d.data.id}`)
            .attr('class', 'link')
            .style('stroke', (d: any) => d.data.level)
            .attr('d', (d: any) => 
                `M${d.y},${d.x} C${(d.y + d.parent.y) / 2},${d.x} ${(d.y + d.parent.y) / 2},${d.parent.x} ${d.parent.y},${d.parent.x}`
            );
    };

    const addEachNodeAsGroup = () => {
        graphData.nodeElement = graphData.groupElement
            .selectAll('.node')
            .data(graphData.nodes.descendants())
            .enter().append('g')
            .attr('id', (d: any, i: any): any => `group-${d.data.id}`)
            .attr('class', (d: any) => 'node' + (d.children ? ' node--internal' : ' node--leaf'))
            .attr('transform', (d: any) => `translate(${d.y},${d.x})`);
    };

    const addCircleToNode = () => {
        graphData.nodeElement
            .append('circle')
            .attr('id', (d: any, i: any): any => `circle-${d.data.id}`)
            .attr('r', (d: any) => d.data.value)
            .style('stroke', (d: any) => d.data.type)
            .style('fill', (d: any) => d.data.level);
    };

    const addTextToNode = () => {
        graphData.nodeElement
            .append('text')
            .attr('id', (d: any, i: any): any => `text-${d.data.id}`)
            .attr('dy', '.35em')
            .attr('x', (d: any) => d.children ? (d.data.value + 5) * -1 : d.data.value + 5)
            .attr('y', (d: any) => d.children && d.depth !== 0 ? -(d.data.value + 5) : d)
            .style('text-anchor', (d: any) => d.children ? 'end' : 'start')
            .text((d: any) => d.data.name);
    };

    const renderGraph = () => {
        setDimensionsAndMarginsToGraph(graphWidth);
        assignDataToGraph();
        renderGraphContainer();
        addLinksBetweendNodes();
        addEachNodeAsGroup();
        addCircleToNode();
        addTextToNode();
    };

    useEffect(() => {
        if (!data) return;
        renderGraph();
    }, [data]);

    useEffect(() => {
        if (!data) return;
        setGraphWidth(graphWidth);
    }, [graphWidth]);
}