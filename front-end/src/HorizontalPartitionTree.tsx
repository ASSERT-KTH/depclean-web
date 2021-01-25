import React, { useState } from 'react';
import { Col } from 'antd';
import * as d3 from 'd3';
import { v4 as uuidv4 } from 'uuid';
import { Tooltip } from './vizUtils/tooltip';
import { useAppState } from "src/AppStateContext";
import { PartitionNode } from 'src/vizUtils/ParitionNode';
import { PartitionLinks } from 'src/vizUtils/PartitionLinks';
import { Links } from './vizUtils/Links';
import { getColorDataAccessor, getCGenerator, noColorNode } from 'src/utils/treeAccess';
import {
    getParitionTree, getSizeHierarchy, filterOmmitedandTest, addNewSize
} from "src/utils/horizontalTree";
import { linkAccesor, linksClassAccessor } from 'src/accessors/partitionTreeAccessor';
import { formatFileSize } from 'src/Components/tooltip';
import { dimension } from 'src/interfaces/interfaces';
import { parseOmitedLinks, getOmmitedLinks } from "src/utils/horizontalTree";
// import { DelaunayGrid } from 'src/vizUtils/Delaunay';
// import { useAppState } from "./AppStateContext";


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
        colorSelected,
        viewLinks,
        viewOmitted
    } = state;

    const [toolTipValue, setToolTipValue] = useState(<div></div>);
    const [toolTipPos, setToolTipPos] = useState({ x: 0, y: 0 });
    const [tpOpacity, setTpOpacity] = useState(0)


    const mouseEnter = (d: any) => {
        setToolTipValue(
            <div>
                <div className="toolTip-tittle">{d.data.artifactId}</div>
                <div className="toolTip-sub">{d.data.version}</div>
                <div className="toolTip-sub">{d.data.groupId}</div>
                <div className="toolTip-sub">Scope: {d.data.scope}</div>
                <div className="toolTip-sub">Usage ratio: {d.data.usageRatio === 0 ? 0 : d3.format(".5f")(d.data.usageRatio)}%</div>
                <div className="toolTip-sub">Size: <span className="toolTip-value">{formatFileSize(d.data.size, 2)}</span></div>
            </div>)
        setToolTipPos({ x: dimensions.marginLeft + (d.y0 + d.h), y: d.x0 + d.y + dimensions.marginTop + (d.w / 2) })
        setTpOpacity(1);
    }
    //hide the tooltip on mouse leave
    const mouseLeave = () => setTpOpacity(0);


    //must have hierarchy data and make the sum of the size
    const partitionData = getSizeHierarchy(data);
    //get the partition  tree
    const treeSize: number[] = [
        dimensions.boundedHeight - dimensions.marginTop - dimensions.marginBottom,
        dimensions.boundedWidth * 1
    ]
    const partitionTree = getParitionTree(treeSize, 1)
    //GET ALL THE NODES WITH A TREE STRUCTURE
    //filter the nodes that are ommitted and whose type are test
    const heightPercent = 0.8;
    const nodes = partitionTree(partitionData)
        .descendants()
        .filter(filterOmmitedandTest)
        .map(addNewSize(heightPercent, 80, dimensions.boundedHeight))

    // const getIds = getArtifactsId(nodes)
    const colorDataAccessor: (d: any) => string = getColorDataAccessor(colorSelected)
    const colorGenerator: any = getCGenerator(colorSelected, nodes);
    const color: any = (d: any) => colorGenerator(colorDataAccessor(d));

    const links = !viewLinks ?
        (<></>) :
        <PartitionLinks
            data={nodes.slice(1)}
            linkAccesor={linkAccesor(heightPercent)}
            classAccessor={linksClassAccessor}
            colorAccessor={noColorNode}
        />

    const linkradial = d3.linkVertical()
        .x(function (d: any) { return d.y; })
        .y(function (d: any) { return d.x; });
    const radialClassAccessor = () => "treeLink treeLink-ommited"

    const ommitedLinks = viewOmitted ? getOmmitedLinks(partitionData.descendants()) : <React.Fragment />;
    const ommitedLabels = viewOmitted ? parseOmitedLinks(ommitedLinks) : <React.Fragment />
    const omittedLinksLines = viewOmitted ?
        <Links
            data={ommitedLinks}
            linkAccesor={linkradial}
            classAccessor={radialClassAccessor}
            key={uuidv4()}
        /> : <React.Fragment />

    return (
        <Col span="20" >
            <div className="wrapper">
                <Tooltip value={toolTipValue} position={toolTipPos} opacity={tpOpacity} display={"LEFT"} />
                <svg width={dimensions.boundedWidth} height={dimensions.boundedHeight} key={uuidv4()} >
                    <g className="bounds"
                        transform={"translate(" + dimensions.marginLeft + "," + dimensions.marginTop + ")"}
                        key={uuidv4()}>

                        {links}
                        <PartitionNode
                            data={nodes}
                            onEnter={mouseEnter}
                            onLeave={mouseLeave}
                            colorAccessor={color}
                        />
                        {/* OMITTED LINKS */}
                        {omittedLinksLines}
                        {ommitedLabels}
                    </g>

                </svg>
            </div>
        </Col>
    )
}