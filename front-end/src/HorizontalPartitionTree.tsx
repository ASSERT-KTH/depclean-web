import React, { useMemo } from 'react';
import { Col } from 'antd';
import { v4 as uuidv4 } from 'uuid';
import { ToolTipContainer } from 'src/ToolTipContainer';
import { useAppState } from "src/AppStateContext";
import { PartitionNode } from 'src/vizUtils/ParitionNode';
import { PartitionLinks } from 'src/vizUtils/PartitionLinks';
import { Links } from 'src/vizUtils/Links';
import { getLinkColorGenerator } from 'src/utils/treeAccess';
import { getColor, getNodesFromParitionTree } from "src/utils/horizontalTree";
import { sizeAccesorMin } from 'src/accessors/treeAccessors'
import {
    linkAccesor, linksClassAccessor,
    radialClassAccessor, linkradial
} from 'src/accessors/partitionTreeAccessor';
import { dimension } from 'src/interfaces/interfaces';
import { parseOmitedLinks, getOmmitedLinks } from "src/utils/horizontalTree";
import { DelaunayGrid } from 'src/vizUtils/Delaunay';
import { midXAccessor, midYAccessor } from 'src/accessors/treeAccessors';
import { PartitionAreaNode } from 'src/PartitionAreaNode';


interface HorizontalTreeProps {
    dimensions: dimension,
}

const heightPercent = 0.8;

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
    const ommitedLinks = viewOmitted ? getOmmitedLinks(filtered.sum(sizeAccesorMin).descendants()) : <></>;
    const ommitedLabels = viewOmitted ? parseOmitedLinks(ommitedLinks) : <></>

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
                                linkAccesor={linkAccesor(heightPercent)}
                                classAccessor={linksClassAccessor}
                                colorAccessor={getLinkColorGenerator(colorSelected)}
                            />}

                        <PartitionNode
                            data={nodes}
                            colorAccessor={colorSelected === "USAGE_RATIO" ? getColor("TRANSPARENT", nodes) : color}
                        />
                        {colorSelected === "USAGE_RATIO" ?
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

                        {ommitedLabels}
                    </g>

                    <DelaunayGrid
                        data={nodes}
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