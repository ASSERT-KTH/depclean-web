// import * as d3 from 'd3';
import React from 'react';
import { v4 as uuidv4 } from 'uuid';


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
            source: { x: parent.x, y: parent.y }, //parents position
            target: { x: replacement.x, y: replacement.y }, // replacement position
            version: node.data.version
        };
        //if either of the source or target are not visible then it should not pain it
        return (parent.data.deleted === false && replacement.data.deleted === false) || (parent.data.visible === false && replacement.data.visible === false) ? [...linksMap, link] : [...linksMap];
    }
    return nodes
        .filter(filterOmmited)
        .reduce(createLinks, [])
}