import React, { useState } from 'react';
import { Col } from 'antd';
import * as d3 from 'd3';
import { v4 as uuidv4 } from 'uuid';
import { Tooltip } from './vizUtils/tooltip';
import { useAppState } from "src/AppStateContext";
import { PartitionNode } from 'src/vizUtils/ParitionNode';
import { PartitionLinks } from 'src/vizUtils/PartitionLinks';
import { getColorDataAccessor, getColorByType } from 'src/utils/treeAccess';
import {
    getParitionTree, getSizeHierarchy, filterOmmitedandTest, addNewSize
} from "src/utils/horizontalTree";
import { linkAccesor, linksClassAccessor } from 'src/accessors/partitionTreeAccessor'
// import { DelaunayGrid } from 'src/vizUtils/Delaunay';
// import { useAppState } from "./AppStateContext";

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
    //get the main state
    const { state } = useAppState();
    //Get all the nodes
    const {
        colorSelected
    } = state;

    const [toolTipValue, setToolTipValue] = useState(<div></div>);
    const [toolTipPos, setToolTipPos] = useState({ x: 0, y: 0 });
    const [tpOpacity, setTpOpacity] = useState(0)

    //get the main state
    // const { state } = useAppState();
    // //Get all the nodes
    // const {
    //     viewOmitted
    // } = state;

    const mouseEnter = (d: any) => {
        setToolTipValue(
            <div>
                <div className="toolTip-tittle">ArtifactId: {d.data.artifactId}</div>
                <div className="toolTip-sub">GroupId: {d.data.groupId}</div>
                <div className="toolTip-sub">Version: {d.data.version}</div>
                <div className="toolTip-sub">Scope: {d.data.scope}</div>
                <div className="toolTip-sub">Size: <span className="toolTip-value">{d3.format(".4f")(d.data.size)}</span></div>
            </div>)
        setToolTipPos({ x: dimensions.marginLeft + (d.y0 + (d.h / 2)), y: d.x0 + d.y + dimensions.marginTop })
        setTpOpacity(1);
    }
    //hide the tooltip on mouse leave
    const mouseLeave = () => setTpOpacity(0);

    //must have hierarchy data and make the sum of the size
    const partitionData = getSizeHierarchy(data);
    //node.height
    //make width according to height so it fits. 


    // const nodeHeight = dimensions.boundedHeight * 0.66;
    // const nodeWidth = 10

    // const treeMapData = d3.treemap()
    //     .size([nodeWidth, nodeHeight])
    //     .tile(d3.treemapSlice)
    //     (partitionData)
    // treeMapData.each(function (d: any) {
    //     d.h = d.y1 - d.y0;
    //     d.w = d.x1 - d.x0;
    // });
    // const treeNodes = d3.partition()(treeMapData).descendants();
    // const nodes = treeNodes
    //     .filter(filterOmmitedandTest)
    //     .map(addNewSize(0.66, nodeWidth, dimensions.boundedHeight))
    // console.log(nodes)


    //get the partition  tree
    const treeSize: number[] = [
        dimensions.boundedHeight - dimensions.marginTop - dimensions.marginBottom,
        dimensions.boundedWidth * 1
    ]
    const partitionTree = getParitionTree(treeSize, 1)
    //GET ALL THE NODES WITH A TREE STRUCTURE
    const treeNodes = partitionTree(partitionData).descendants();
    //filter the nodes that are ommitted and whose type are test
    const heightPercent = 0.9;
    const nodes = treeNodes
        .filter(filterOmmitedandTest)
        .map(addNewSize(heightPercent, 80, dimensions.boundedHeight))

    // const getIds = getArtifactsId(nodes)
    // const colorGenerator: d3.ScaleOrdinal<string, unknown, never> = getColorGenerator(colorSelected, getIds);
    const colorDataAccessor: (d: any) => string = getColorDataAccessor(colorSelected)
    const color: any = (d: any) => getColorByType(colorDataAccessor(d));

    return (
        <Col span="20" >
            <div className="wrapper">
                <Tooltip value={toolTipValue} position={toolTipPos} opacity={tpOpacity} />
                <svg width={dimensions.boundedWidth} height={dimensions.boundedHeight} key={uuidv4()} >
                    <g
                        className="bounds"
                        transform={"translate(" + dimensions.marginLeft + "," + dimensions.marginTop + ")"}
                        key={uuidv4()}
                    >
                        <PartitionLinks
                            data={nodes.slice(1)}
                            linkAccesor={linkAccesor(heightPercent)}
                            classAccessor={linksClassAccessor}
                            colorAccessor={color}
                        />

                        <PartitionNode
                            data={nodes}
                            onEnter={mouseEnter}
                            onLeave={mouseLeave}
                            colorAccessor={color}
                        />
                    </g>

                </svg>
            </div>
        </Col>
    )
}