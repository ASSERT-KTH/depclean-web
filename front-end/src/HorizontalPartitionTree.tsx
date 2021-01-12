import React, { useState } from 'react';
import { Col } from 'antd';
import * as d3 from 'd3';
import { v4 as uuidv4 } from 'uuid';
import { Squares } from './vizUtils/Squares';
import { Tooltip } from './vizUtils/tooltip';
// import { DelaunayGrid } from 'src/vizUtils/Delaunay';
// import { useAppState } from "./AppStateContext";
import {
    getParitionTree, getSizeHierarchy, addPadding, filterOmmitedandTest
} from "src/utils/horizontalTree";
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
        setToolTipPos({ x: (d.y0 + (d.y1 - d.y0) / 2) + dimensions.marginTop, y: d.x0 + dimensions.marginTop })
        setTpOpacity(1);
    }
    const mouseLeave = () => setTpOpacity(0);


    //must have hierarchy data and make the sum of the size
    const partitionData = getSizeHierarchy(data);
    //get the partition  tree
    const treeSize: number[] = [
        dimensions.boundedHeight - dimensions.marginBottom - dimensions.marginTop,
        dimensions.boundedWidth - dimensions.marginBottom - dimensions.marginTop
    ]
    const paritionTree = getParitionTree(treeSize, 10)


    //GET ALL THE NODES WITH A TREE STRUCTURE
    const treeNodes = paritionTree(partitionData).descendants();
    //filter the nodes that are ommitted and whose type are test
    const nodes = treeNodes
        .filter(filterOmmitedandTest)
        .map(addPadding(20));

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
                            xAccessor={yAccessor}
                            yAccessor={xAccessor}
                            widthAccessor={hAccessor}
                            heightAccessor={wAccessor}
                            nameAccessor={nameAccessor}
                            onEnter={mouseEnter}
                            onLeave={mouseLeave}
                            valueAccessor={tittleAccessor}
                            colorAccessor={colorAccessor}
                            showText={false}
                        />

                    </g>

                </svg>
            </div>
        </Col>
    )
}