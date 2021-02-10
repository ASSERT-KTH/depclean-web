import React, { useCallback, useState, useMemo } from 'react';
import { Col } from 'antd';
import * as d3 from 'd3';
import { v4 as uuidv4 } from 'uuid';
import { Tooltip } from './vizUtils/tooltip';
import { useAppState } from "src/AppStateContext";
import { PartitionNode } from 'src/vizUtils/ParitionNode';
import { PartitionLinks } from 'src/vizUtils/PartitionLinks';
import { Links } from './vizUtils/Links';
import { getColorDataAccessor, getCGenerator, getLinkColorGenerator } from 'src/utils/treeAccess';
import {
    getParitionTree, getSizeHierarchy,
    filterOmmitedandTest, addNewSize,

} from "src/utils/horizontalTree";
import { sizeAccesorMin } from 'src/accessors/treeAccessors'
import {
    linkAccesor, linksClassAccessor,
    radialClassAccessor, linkXaccessor,
    linkYaccessor,
} from 'src/accessors/partitionTreeAccessor';
import { formatFileSize } from 'src/Components/tooltip';
import { dimension } from 'src/interfaces/interfaces';
import { parseOmitedLinks, getOmmitedLinks } from "src/utils/horizontalTree";
import { DelaunayGrid } from 'src/vizUtils/Delaunay';
import { midXAccessor, midYAccessor } from 'src/accessors/treeAccessors';
import { PartitionAreaNode } from 'src/PartitionAreaNode';


interface HorizontalTreeProps {
    dimensions: dimension,
}

export const HorizontalPartitionTree = ({
    dimensions
}: React.PropsWithChildren<HorizontalTreeProps>) => {
    //get the main state
    const { state } = useAppState();
    const { colorSelected, viewLinks, viewOmitted, filtered } = state;

    const [toolTipValue, setToolTipValue] = useState(<div></div>);
    const [toolTipPos, setToolTipPos] = useState({ x: 0, y: 0 });
    const [tpOpacity, setOpacity] = useState(0)

    const mouseEnter = useCallback(
        (d: any) => {
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
            setOpacity(1);
        },
        [dimensions.marginLeft, dimensions.marginTop]
    )
    //hide the tooltip on mouse leave
    const mouseLeave = useCallback(
        () => setOpacity(0), []
    );

    const nodes = useMemo(
        () => {
            //must have hierarchy data and make the sum of the size
            const partitionData = getSizeHierarchy(filtered, sizeAccesorMin);
            //get the partition  tree
            const treeSize: number[] = [
                dimensions.boundedHeight - dimensions.marginTop - dimensions.marginBottom,
                dimensions.boundedWidth * 1
            ]
            const partitionTree = getParitionTree(treeSize, 1)
            //GET ALL THE NODES WITH A TREE STRUCTURE
            //filter the nodes that are ommitted and whose type are test
            const heightPercent = 0.8;
            return partitionTree(partitionData)
                .descendants()
                .filter(filterOmmitedandTest)
                .map(addNewSize(heightPercent, 80, dimensions.boundedHeight))

        }
        , [dimensions, filtered])

    // const getIds = getArtifactsId(nodes)
    const color = useMemo(
        () => {
            const colorDataAccessor: (d: any) => string = getColorDataAccessor(colorSelected)
            const colorGenerator: any = getCGenerator(colorSelected, nodes);
            return (d: any) => colorGenerator(colorDataAccessor(d));
        }, [colorSelected, nodes]
    )

    // const linkColorGenerator: any = getLinkColorGenerator(colorSelected)

    // const linkradial = d3.linkVertical()
    //     .x(linkXaccessor)
    //     .y(linkYaccessor);
    //GRAPH LINKS LABLES 
    // const ommitedLinks = viewOmitted ? getOmmitedLinks(partitionData.descendants()) : <></>;
    // const ommitedLabels = viewOmitted ? parseOmitedLinks(ommitedLinks) : <></>

    return (
        <Col span="20" >
            <div className="wrapper">
                <Tooltip value={toolTipValue} position={toolTipPos} opacity={tpOpacity} display={"LEFT"} />
                <svg width={dimensions.boundedWidth} height={dimensions.boundedHeight} key={uuidv4()} >
                    <g className="bounds"
                        transform={"translate(" + dimensions.marginLeft + "," + dimensions.marginTop + ")"}
                        key={uuidv4()}>

                        {/* {!viewLinks ? <></> :
                            <PartitionLinks
                                data={nodes.slice(1)}
                                linkAccesor={linkAccesor(heightPercent)}
                                classAccessor={linksClassAccessor}
                                colorAccessor={linkColorGenerator}
                            />} */}

                        <PartitionNode
                            data={nodes}
                            colorAccessor={color}
                        // onEnter={mouseEnter}
                        // onLeave={mouseLeave}
                        />
                        {/* {colorSelected === "USAGE_RATIO" ?
                            <PartitionAreaNode
                                data={nodes}
                                colorAccessor={color}
                            /> : <></>
                        }



                        {viewOmitted ?
                            <Links
                                data={ommitedLinks}
                                linkAccesor={linkradial}
                                classAccessor={radialClassAccessor}
                            /> : <></>}

                        {ommitedLabels} */}
                    </g>

                    {/* <DelaunayGrid
                        data={nodes}
                        dimensions={dimensions}
                        xAccessor={midXAccessor}
                        yAccessor={midYAccessor}
                        onEnter={mouseEnter}
                        onLeave={mouseLeave}
                        hide={false}
                    /> */}

                </svg>
            </div>
        </Col>
    )
}