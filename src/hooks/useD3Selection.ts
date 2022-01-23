import React from 'react';
import * as d3 from 'd3';

export default function useD3Selection() {
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

     const returnCicleNodesToInitialStyles = (nodes: any) => {
        for (let {color, id} of nodes) {
           d3.select(`#circle-${id}`)
              .style('stroke', color)
              .style('fill', color)
        }
     };
  
     const resetOpacityForAllNodes = () => {
        d3.selectAll('text').each((d: any, i: number) => {
           makeNodesTransparent(d.data.id, {
              circle: false,
              link: false,
              text: false,
           });
        })
     };

     const activateAnimationToSelectedCircleNode = (id: string) => {
        d3.select(`#circle-${id}`)
           .style('animation', 'scaleUp 0.6s ease infinite');
     };
  
     const disableAnimationToSelectedCircleNode = (id: string) => {
        d3.select(`#circle-${id}`)
           .style('animation', 'none');
     };

    return {
        makeNodesTransparent,
        highlightCircleNodeById,
        returnCicleNodesToInitialStyles,
        resetOpacityForAllNodes,
        activateAnimationToSelectedCircleNode,
        disableAnimationToSelectedCircleNode,
    };
}