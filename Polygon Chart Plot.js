import { useEffect } from 'react';
import * as d3 from 'd3';

const PolygonPolarPlot = () => {
  useEffect(() => {
    const numSides = 5;
    const width = 500;
    const height = 500;
    const radius = Math.min(width, height) / 2;

    // Generate random coordinates for the polygon vertices
    const points = Array.from({ length: numSides }, () => [
      Math.random() * 2 * Math.PI,
      Math.random() * radius
    ]);

    // Create SVG element
    const svg = d3.select('#polarPlot')
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);

    // Create a scale for the radial distance
    const rScale = d3.scaleLinear()
      .domain([0, 1])
      .range([0, radius]);

    // Create a line generator for the polar plot
    const lineGenerator = d3.lineRadial()
      .angle(d => d[0])
      .radius(d => rScale(d[1]))
      .curve(d3.curveLinearClosed);

    // Add the polygon to the plot
    svg.append('path')
      .datum(points)
      .attr('d', lineGenerator)
      .attr('fill', 'none')
      .attr('stroke', 'black');
  }, []);

  return <div id="polarPlot"></div>;
};

export default PolygonPolarPlot;
