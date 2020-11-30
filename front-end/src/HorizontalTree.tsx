import React, { useState } from 'react';
import { Col } from 'antd';
import * as d3 from 'd3';
import { v4 as uuidv4 } from 'uuid';
import { Links } from './vizUtils/Links';
import { Nodes } from './vizUtils/Nodes';
import { Tooltip } from './vizUtils/tooltip';

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

export const HorizontalTree = ({
    data,
    dimensions
}: React.PropsWithChildren<HorizontalTreeProps>) => {
    const [toolTipValue, setToolTipValue] = useState("");
    const [toolTipPos, setToolTipPos] = useState({ x: 0, y: 0 });
    const [tpOpacity, setTpOpacity] = useState(0)

    const mouseEnter = (d: any) => {
        setToolTipValue(d.data.artifactId + " " + d.data.size)
        setToolTipPos({ x: d.y, y: d.x })
        setTpOpacity(1);
        // console.log({d.x,d.y})
    }
    const mouseLeave = () => {
        setTpOpacity(0);
    }
    const rectNode = {
        width: 5,
        height: 5,
        textMargin: 5,
    }

    //Path to draw the links
    const linkAccesor = (d: any) => {
        return "M" + d.y + "," + d.x
            + "C" + (d.y + d.parent.y + rectNode.width) / 2 + "," + d.x
            + " " + (d.y + d.parent.y + rectNode.width) / 2 + "," + d.parent.x
            + " " + (d.parent.y + rectNode.width) + "," + d.parent.x;
    };
    //CREATE the tree structure  and the hierarchy
    const tree = d3.tree()
        .nodeSize([30, 100])
        .separation((a, b) => a.depth)
        .size([dimensions.boundedHeight - dimensions.marginBottom - dimensions.marginTop, dimensions.boundedWidth - dimensions.marginBottom - dimensions.marginTop])

    //NodeSize nullifies the .size
    // .size([dimensions.boundedHeight, dimensions.boundedWidth])

    //GET ALL THE NODES WITH A TREE STRUCTURE
    const nodes = tree(data).descendants();

    // const totalSize = d3.sum(nodes, (d: any) => d.data.size)
    const sizeExtent = d3.extent(nodes.slice(1), (d: any) => d.data.size)


    //transform circular pie to rectangular
    const sizeScale = d3.scaleLinear()
        .domain([sizeExtent[0], sizeExtent[1]])
        .range([8, 18])



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
                        <Links
                            data={nodes.slice(1)}
                            linkAccesor={linkAccesor}
                            key={uuidv4()}
                        />
                        <Nodes
                            data={nodes}
                            size={5}
                            key={uuidv4()}
                            onEnter={mouseEnter}
                            onLeave={mouseLeave}
                            sizeScalar={sizeScale}
                        />
                    </g>
                </svg>
            </div>
        </Col>
    )
}