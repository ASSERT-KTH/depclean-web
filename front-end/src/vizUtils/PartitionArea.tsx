import React from 'react';
import { mapToPartition } from "src/utils/horizontalTree";
import {
    xAccessor, yAccessor, valueAccessor, wAccessor, hAccessor
} from 'src/accessors/squareAccessors';
import * as d3 from 'd3';
import { v4 as uuidv4 } from 'uuid';

import { yDisplacedAccessor } from 'src/accessors/partitionNodeAccessor'
import { ratioColor } from 'src/utils/treeAccess';
interface PartitionAreaProps {
    node: any,
}

export const PartitionArea = ({ node }: React.PropsWithChildren<PartitionAreaProps>) => {

    const allTypes = node.data.allTypes
        .map(mapToPartition(node.data.usedTypes));

    //first get the hierarchy
    const data = d3.hierarchy({
        name: "root",
        children: allTypes
    })
        .sum(valueAccessor)
        .sort((a: any, b: any) => a.value - b.value)
    //we can sort it if needed
    //get the partition tree
    const treeMap = d3.treemap()
        .tile(d3.treemapBinary)
        .size([node.h, node.w])
        .round(true)
        .padding(1)

    //get all the nodes descendants
    const treeNodes = treeMap(data)
        .descendants()
        .slice(1)

    const rendernodes = treeNodes.map((node: any) =>
        <rect
            // className={classAccessor(node)}
            key={uuidv4()}
            x={xAccessor(node)}
            y={yAccessor(node)}
            // rx={0}
            width={wAccessor(node)}
            height={hAccessor(node)}
            fill={node.data.used ? ratioColor[1].color : ratioColor[0].color}
        />
    )
    return <g key={uuidv4()} transform={"translate(" + 0 + "," + yDisplacedAccessor(node) + ")"} >
        {rendernodes}
    </g>
}