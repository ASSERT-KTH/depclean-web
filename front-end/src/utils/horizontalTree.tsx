// import * as d3 from 'd3';
import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import * as d3 from 'd3';
import { valueAccessor } from 'src/accessors/squareAccessors';

export const parseOmitedLinks = (data: any) => {
    return data.map((d: any) => <text
        key={uuidv4()}
        x={d.target.y + (d.source.y - d.target.y) / 2}
        y={d.target.x + (d.source.x - d.target.x) / 2}
        textAnchor="middle"
        className="omitted-label"
    >
        {d.version}
    </text>)
}

export const parseOmitedParitionLinks = (data: any) => {
    return data.map((d: any) => <text
        key={uuidv4()}
        x={d.target.y + (d.source.y - d.target.y) / 2}
        y={d.target.x + (d.source.x - d.target.x) / 2}
        textAnchor="middle"
        className="omitted-label"
    >
        {d.version}
    </text>)
}

//returns all the links of the ommited
export const getOmmitedLinks = (nodes: any) => {
    //get all the ommited
    const filterOmmited = (d: any) => d.data.omitted === true;
    const findNode = (node: any) => ((d: any) =>
        d.data.groupId === node.data.groupId
        && d.data.artifactId === node.data.artifactId
        && d.data.omitted === false)
    //get the target for each of the ommited
    const createLinks = (linksMap: any, node: any) => {
        const parent = node.parent;
        const replacement = nodes.find(findNode(node));
        const link = {
            source: { x: parent.x0 + parent.w / 2, y: parent.y0 + parent.h / 2 }, //parents position
            target: { x: replacement.x0 + parent.w / 2, y: replacement.y0 + parent.h / 2 }, // replacement position
            version: node.data.version
        };
        //if either of the source or target are not visible then it should not pain it
        return (parent.data.deleted === false && replacement.data.deleted === false) || (parent.data.visible === false && replacement.data.visible === false) ? [...linksMap, link] : [...linksMap];
    }
    return nodes
        .filter(filterOmmited)
        .reduce(createLinks, [])
}

export const getParitionTree = (size: number[], padding: number) => {
    return d3.partition()
        .size([size[0], size[1]])
        .round(true)
        .padding(padding) //modify this to give the proper dimensions
}

//Sum the data and sort 
export const getSizeHierarchy = (data: any, accessor: any) => {
    return data
        .sum(accessor)
    // .sort((a: any, b: any) => a.height - b.height || a.value - b.value)
}

export const recordHeightWidth = (node: any) => {

    return node;
}

//filter ommited nodes and test
export const filterOmmitedandTest = (node: any) => node.data.type !== "omitted" && node.data.type !== "test";

export const filterDeleted = (node: any) => node.data.deleted === false;


//adds padding to the Partition nodes in betweeen
export const addNewSize = (hightPercent: number, width: number, height: number) => {
    //return mapping function
    return (node: any) => {
        const minHeight = 1;
        // node.y = ((node.x1 - node.x0) * height - node.h) / 2

        // modify height .h and width .w
        node.h = width;
        // make the node visible if it is less than 1
        const nHeight = (node.x1 - node.x0) * hightPercent;
        node.w = nHeight < minHeight ? minHeight : nHeight;
        // add property Y with new position
        node.y = ((node.x1 - node.x0) * (1 - hightPercent) / 2);
        return node;
    }
}


//adds padding to the Partition nodes in betweeen
export const addPadding = (padding: number) => {
    //return mapping function
    return (node: any) => {
        //the tree is inverted. Therefore y is the one to recalculate
        const nodeWidth = node.y1 - node.y0;
        const baseWidth = nodeWidth + padding;
        node.y0 = node.depth === 0 ? node.y0 : (baseWidth * node.depth);
        node.y1 = node.depth === 0 ? node.y1 : node.y0 + nodeWidth;
        return node;
    }
}
//gets a type with string and returns an object with the name:string and value:1
export const mapToPartition = ((usedTypes: string[]) => {
    return ((type: string) => {
        return {
            name: type,
            used: usedTypes.includes(type),
            value: 1
        }
    })
})


export const getTreeMap = (types: string[], usedTypes: string[], height: number, width: number) => {

    const allTypes = types
        .map(mapToPartition(usedTypes));
    //first get the hierarchy
    const data = d3.hierarchy({
        name: "root",
        children: allTypes
    })
        .sum(valueAccessor)
        .sort((a: any, b: any) => a.value - b.value)
    //we can sort it if needed
    //get the partition tree
    const treeMap = d3.treemap()
        .tile(d3.treemapBinary)
        .size([height, width])
        .round(true)
        .padding(1)

    //get all the nodes descendants
    return treeMap(data)
        .descendants()
        .slice(1)
}