import React, { useMemo } from 'react';
import { Col } from 'antd';
import * as d3 from 'd3';
import { v4 as uuidv4 } from 'uuid';
import { ToolTipContainer } from 'src/ToolTipContainer';
import { useAppState } from "src/AppStateContext";
import { PartitionNode } from 'src/vizUtils/ParitionNode';
import { PartitionLinks } from 'src/vizUtils/PartitionLinks';
import { Links } from 'src/vizUtils/Links';
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
    console.log("RENDER HORIZONTAL TREE")
    //get the main state
    const { state } = useAppState();
    const { colorSelected, filtered, viewLinks, viewOmitted } = state;

    //must have hierarchy data and make the sum of the size
    const partitionData = useMemo(
        () => {
            return getSizeHierarchy(filtered, sizeAccesorMin);
        }, [filtered]
    )

    const nodes = useMemo(
        () => {

            //get the partition  tree
            const treeSize: number[] = [
                dimensions.boundedHeight - dimensions.marginTop - dimensions.marginBottom,
                dimensions.boundedWidth * 1
            ]
            const partitionTree = getParitionTree(treeSize, 1)
            //GET ALL THE NODES WITH A TREE STRUCTURE
            //filter the nodes that are ommitted and whose type are test

            return partitionTree(partitionData)
                .descendants()
                .filter(filterOmmitedandTest)
                .map(addNewSize(heightPercent, 80, dimensions.boundedHeight))

        }
        , [dimensions, partitionData])

    // const getIds = getArtifactsId(nodes)
    const color = useMemo(
        () => {
            const colorDataAccessor: (d: any) => string = getColorDataAccessor(colorSelected)
            const colorGenerator: any = getCGenerator(colorSelected, nodes);
            return (d: any) => colorGenerator(colorDataAccessor(d));
        }, [colorSelected, nodes]
    )

    const linkColorGenerator: any = getLinkColorGenerator(colorSelected)

    const linkradial = d3.linkVertical()
        .x(linkXaccessor)
        .y(linkYaccessor);
    // GRAPH LINKS LABLES 
    const ommitedLinks = viewOmitted ? getOmmitedLinks(partitionData.descendants()) : <></>;
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
                                colorAccessor={linkColorGenerator}
                            />}

                        <PartitionNode
                            data={nodes}
                            colorAccessor={color}
                        // onEnter={mouseEnter}
                        // onLeave={mouseLeave}
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
                        hide={false}
                    />
                </svg>
            </div>
        </Col>
    )
}