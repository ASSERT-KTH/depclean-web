import React, { useState } from 'react';
import { Col } from 'antd';
import * as d3 from 'd3';
import { v4 as uuidv4 } from 'uuid';
import { Links } from './vizUtils/Links';
import { Nodes } from './vizUtils/Nodes';
import { Squares } from './vizUtils/Squares';
import { Tooltip } from './vizUtils/tooltip';
// import { DelaunayGrid } from 'src/vizUtils/Delaunay';
import { useAppState } from "./AppStateContext";
import { parseOmitedLinks, getOmmitedLinks, getParitionTree, getSizeHierarchy } from "src/utils/horizontalTree";
import {
    xAccessor, yAccessor, wAccessor, hAccessor, nameAccessor, tittleAccessor, colorAccessor
} from 'src/accessors/squareAccessors';

interface dimension {
    width: number,
    height: number,
    marginTop: number,
    marginRight: number,
    marginBottom: number,
    marginLeft: number,
    boundedHeight: number,
    boundedWidth: number,
}

interface HorizontalTreeProps {
    data: d3.HierarchyNode<object[]>,
    dimensions: dimension,
}

export const HorizontalPartitionTree = ({
    data,
    dimensions
}: React.PropsWithChildren<HorizontalTreeProps>) => {
    const [toolTipValue, setToolTipValue] = useState(<div></div>);
    const [toolTipPos, setToolTipPos] = useState({ x: 0, y: 0 });
    const [tpOpacity, setTpOpacity] = useState(0)

    //get the main state
    const { state } = useAppState();
    //Get all the nodes
    const {
        viewOmitted
    } = state;

    const mouseEnter = (d: any) => {
        // setToolTipValue(
        //     <div>
        //         <div className="toolTip-tittle">ArtifactId: {d.data.artifactId}</div>
        //         <div className="toolTip-sub">GroupId: {d.data.groupId}</div>
        //         <div className="toolTip-sub">Version: {d.data.version}</div>
        //         <div className="toolTip-sub">Scope: {d.data.scope}</div>
        //         <div className="toolTip-sub">Size: <span className="toolTip-value">{d3.format(".4f")(d.data.size)}</span></div>
        //     </div>)
        // setToolTipPos({ x: d.y + dimensions.marginTop, y: d.x + dimensions.marginTop })
        // setTpOpacity(1);
    }
    const mouseLeave = () => {
        // setTpOpacity(0);
    }
    const rectNode = {
        width: 5,
        height: 5,
        textMargin: 5,
    }

    //ACCESSORS
    //Path to draw the links
    const linkAccesor = (d: any) => {
        return "M" + d.y + "," + d.x
            + "C" + (d.y + d.parent.y + rectNode.width) / 2 + "," + d.x
            + " " + (d.y + d.parent.y + rectNode.width) / 2 + "," + d.parent.x
            + " " + (d.parent.y + rectNode.width) + "," + d.parent.x;
    };

    const linksClassAccessor = (d: any) => {
        return "treeLink " +
            (d.data.highlight || d.parent.data.highlight ? " treeLink-highlight" : "") +
            (d.data.visible ? " treeLink-visible" : " treeLink-invisible") +
            (d.data.deleted || d.parent.data.deleted ? " treeLink-deleted" : "")
    }

    const linkradial = d3.linkVertical()
        .x(function (d: any) { return d.y; })
        .y(function (d: any) { return d.x; });

    // const linkradial = d3.linkRadial()
    // .angle(function (d: any) { return d.x; })
    // .radius(function (d: any) { return d.y; });

    const radialClassAccessor = () => "treeLink treeLink-ommited"

    // const xAccessor = (d: any) => d.x;
    // const yAccessor = (d: any) => d.y;

    // onEnter={ void}
    // onLeave={ void}

    //must have hierarchy data and make the sum of the size
    const partitionData = getSizeHierarchy(data);
    //get the partition  tree
    const treeSize: number[] = [dimensions.boundedHeight - dimensions.marginBottom - dimensions.marginTop, dimensions.boundedWidth - dimensions.marginBottom - dimensions.marginTop]
    const paritionTree = getParitionTree(treeSize)

    //CREATE the tree structure  and the hierarchy
    // const tree = d3.tree()
    //     .nodeSize([30, 100])
    //     .separation((a, b) => a.depth)
    //     .size([dimensions.boundedHeight - dimensions.marginBottom - dimensions.marginTop, dimensions.boundedWidth - dimensions.marginBottom - dimensions.marginTop])
    //GET ALL THE NODES WITH A TREE STRUCTURE
    const treeNodes = paritionTree(data).descendants();
    console.log("tree nodes", treeNodes, data)

    // const ommitedLinks = viewOmitted ? getOmmitedLinks(treeNodes) : <React.Fragment />;
    // const ommitedLabels = viewOmitted ? parseOmitedLinks(ommitedLinks) : <React.Fragment />
    // const omittedLinksLines = viewOmitted ?
    //     <Links
    //         data={ommitedLinks}
    //         linkAccesor={linkradial}
    //         classAccessor={radialClassAccessor}
    //         key={uuidv4()}
    //     /> : <React.Fragment />

    const nodes = treeNodes.filter((d: any) => d.data.type !== "omitted" && d.data.type !== "test");

    // const totalSize = d3.sum(nodes, (d: any) => d.data.size)
    // const sizeExtent = d3.extent(nodes, (d: any) => d.data.size)
    //transform circular pie to rectangular
    // const sizeScale = d3.scaleLinear()
    //     .domain([sizeExtent[0], sizeExtent[1]])
    //     .range([6, 20])




    return (
        <Col span="20">
            <div className="wrapper">
                <Tooltip value={toolTipValue} position={toolTipPos} opacity={tpOpacity} />
                <svg width={dimensions.boundedWidth} height={dimensions.boundedHeight} key={uuidv4()} >
                    <g
                        className="bounds"
                        transform={"translate(" + dimensions.marginLeft + "," + dimensions.marginTop + ")"}
                        key={uuidv4()}
                    >
                        <Squares
                            data={nodes}
                            keyNumber={uuidv4()}
                            xAccessor={xAccessor}
                            yAccessor={yAccessor}
                            widthAccessor={wAccessor}
                            heightAccessor={hAccessor}
                            nameAccessor={nameAccessor}
                            onEnter={mouseEnter}
                            onLeave={mouseLeave}
                            valueAccessor={tittleAccessor}
                            colorAccessor={colorAccessor}
                            showText={false}
                        />
                        {/* <Links
                            data={nodes.slice(1)}
                            linkAccesor={linkAccesor}
                            classAccessor={linksClassAccessor}
                            key={uuidv4()}
                        /> */}
                        {/* OMITTED LINKS */}
                        {/* {omittedLinksLines} */}
                        {/* {ommitedLabels} */}

                        {/* <Nodes
                            data={nodes}
                            size={5}
                            key={uuidv4()}
                            onEnter={mouseEnter}
                            onLeave={mouseLeave}
                            sizeScalar={sizeScale}
                        /> */}

                        {/* <DelaunayGrid
                            data={nodes}
                            dimensions={dimensions}
                            xAccessor={xAccessor}
                            yAccessor={yAccessor}
                            onEnter={mouseEnter}
                            onLeave={mouseLeave}
                        /> */}

                    </g>

                </svg>
            </div>
        </Col>
    )
}