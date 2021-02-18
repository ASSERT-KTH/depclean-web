import React, { useMemo } from 'react';
import { Col } from 'antd';
import { v4 as uuidv4 } from 'uuid';
import { ToolTipContainer } from 'src/ToolTipContainer';
import { dimension } from 'src/interfaces/interfaces';
import { useAppState } from "src/AppStateContext";

import { getLinkColorGenerator, getColor } from 'src/utils/treeAccess';
import { getNodesFromParitionTree, filterDeleted, filterVisible } from "src/utils/horizontalTree";
import { sizeAccesorMin, midXAccessor, midYAccessor } from 'src/accessors/treeAccessors'
import {
    linkStraightAccesor, linksClassAccessor,
    radialClassAccessor, linkradial
} from 'src/accessors/partitionTreeAccessor';
import { getOmmitedLinks } from "src/utils/horizontalTree";

import { Links } from 'src/vizUtils/Links';
import { PartitionNode } from 'src/vizUtils/ParitionNode';
import { PartitionLinks } from 'src/vizUtils/PartitionLinks';
import { DelaunayGrid } from 'src/vizUtils/Delaunay';
import { PartitionAreaNode } from 'src/PartitionAreaNode';
import { OmmitedLabels } from 'src/vizUtils/Labels';

const heightPercent = 0.8;

interface HorizontalTreeProps {
    dimensions: dimension,
}

export const HorizontalPartitionTree = ({
    dimensions
}: React.PropsWithChildren<HorizontalTreeProps>) => {

    //get the main state
    const { state } = useAppState();
    const { colorSelected, filtered, viewLinks, viewOmitted } = state;
    //get the nodes witht the tree structure
    const nodes = useMemo(() => getNodesFromParitionTree(dimensions, sizeAccesorMin, filtered, heightPercent)
        , [dimensions, filtered])
    //get the correct color generator
    const color = useMemo(() => getColor(colorSelected, nodes)
        , [colorSelected, nodes])
    // GRAPH LINKS LABLES 
    const ommitedLinks = viewOmitted ? getOmmitedLinks(filtered) : <></>;

    return (
        <Col span="20" >
            <div className="wrapper">
                <ToolTipContainer />
                <svg width={dimensions.boundedWidth} height={dimensions.boundedHeight} key={uuidv4()} >
                    <g className="bounds"
                        transform={"translate(" + dimensions.marginLeft + "," + dimensions.marginTop + ")"}
                        key={uuidv4()}>

                        {!viewLinks ? <></> :
                            <PartitionLinks
                                data={nodes.slice(1)}
                                linkAccesor={linkStraightAccesor(heightPercent)}
                                classAccessor={linksClassAccessor}
                                colorAccessor={getLinkColorGenerator(colorSelected)}
                            />}

                        <PartitionNode
                            data={nodes}
                            colorAccessor={colorSelected === "USAGE_RATIO" ? getColor("TRANSPARENT", nodes) : color}
                        />
                        {colorSelected === "USAGE_RATIO" ?
                            <PartitionAreaNode
                                data={nodes
                                    .filter(filterDeleted)
                                    .filter(filterVisible)}
                                colorAccessor={color}
                            /> : <></>
                        }

                        {viewOmitted ?
                            <Links
                                data={ommitedLinks}
                                linkAccesor={linkradial}
                                classAccessor={radialClassAccessor}
                            /> : <></>}

                        {viewOmitted ? <OmmitedLabels data={ommitedLinks} /> : <></>}
                    </g>

                    <DelaunayGrid
                        data={nodes.filter(filterDeleted)}
                        dimensions={dimensions}
                        xAccessor={midXAccessor}
                        yAccessor={midYAccessor}
                        hide={true}
                    />
                </svg>
            </div>
        </Col>
    )
}