import * as d3 from 'd3';

//SQUARE accessors for Horizontal Partition Tree
export const xAccessor = (d: any) => d.x0;
export const yAccessor = (d: any) => d.y0;
export const wAccessor = (d: any) => d.x1 - d.x0;
export const hAccessor = (d: any) => d.y1 - d.y0;
export const nameAccessor = (d: any) => d.data.parent;
export const tittleAccessor = (d: any) => d.data.parent !== null ? d.data.parent : d.data.artifactId;

const depthAccessor = (d: any) => d.depth;
const color = d3.scaleOrdinal(d3.schemeCategory10);
export const colorAccessor = (d: any) => color(depthAccessor(d));

//Partition value accessor
export const valueAccessor = (d: any) => d.value;