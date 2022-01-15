import React, { useEffect, memo } from 'react';
import * as d3 from 'd3';

export const HierarchyGraph = memo(function HierarchyGraph({
    data,
    graphWidth,
}: any) {
    const renderGraph = () => {
        // set the dimensions and margins of the diagram
        const margin = {top: 20, right: 90, bottom: 30, left: 90},
        width = graphWidth - margin.left - margin.right, // 1800
        height = 26000 - margin.top - margin.bottom;

        const treemap = d3.tree()
        .size([height, width])
        .separation(function separation(a, b) {
            return 10;
            });
        //  assigns the data to a hierarchy using parent-child relationships
        let nodes: any = d3.hierarchy(data, (d: any) => d.children);
        // maps the node data to the tree layout
        nodes = treemap(nodes);
                
        console.log(nodes, '__NODES__');

        // append the svg object to the body of the page
        // appends a 'group' element to 'svg'
        // moves the 'group' element to the top left margin
        const svg = d3.select(".hierarchy-graph-root").append("svg")
                .attr('class', 'graph')
                .attr("viewBox", [0, 0, 2000, height+20])
                .attr("width", width + margin.left + margin.right),
            //   .attr("height", height + margin.top + margin.bottom),
            g = svg.append("g")
                .attr("transform",
                    "translate(" + margin.left + "," + margin.top + ")");

        // adds the links between the nodes
        const link = g.selectAll(".link")
            .data(nodes.descendants().slice(1))
            .enter().append("path")
            .attr('id', (d: any, i: any): any => `link-${d.data.id}`)
            .attr("class", "link")
            .style("stroke", (d: any) => d.data.level)
            .attr("d", (d: any) => {
                return "M" + d.y + "," + d.x
                + "C" + (d.y + d.parent.y) / 2 + "," + d.x
                + " " + (d.y + d.parent.y) / 2 + "," + d.parent.x
                + " " + d.parent.y + "," + d.parent.x;
            });

        // adds each node as a group
        const node = g.selectAll(".node")
            .data(nodes.descendants())
            .enter().append("g")
            .attr('id', (d: any, i: any): any => `group-${d.data.id}`)
            .attr("class", (d: any) => "node" + (d.children ? " node--internal" : " node--leaf"))
            .attr("transform", (d: any) => "translate(" + d.y + "," + d.x + ")");

        // adds the circle to the node
        node.append("circle")
        .attr('id', (d: any, i: any): any => `circle-${d.data.id}`)
        .attr("r", (d: any) => d.data.value)
        .style("stroke", (d: any) => d.data.type)
        .style("fill", (d: any) => d.data.level);
        
        // adds the text to the node
        node.append("text")
            .attr('id', (d: any, i: any): any => `text-${d.data.id}`)
            .attr("dy", ".35em")
            .attr("x", (d: any) => d.children ? (d.data.value + 5) * -1 : d.data.value + 5)
            .attr("y", (d: any) => d.children && d.depth !== 0 ? -(d.data.value + 5) : d)
            .style("text-anchor", (d: any) => d.children ? "end" : "start")
            .text((d: any) => d.data.name);
    };

    useEffect(() => {
        if (!data) return;
        console.log(data, 'oooooooooooooooooooooo');
        renderGraph();
    }, [data]);

    useEffect(() => {
        if (!data) return;

        d3.select('.graph')
            .transition()
            .duration(230)
            .style('width', `${graphWidth}px`);
    }, [graphWidth]);

    return (
        <div className='hierarchy-graph-root' />
    );
});