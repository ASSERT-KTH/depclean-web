import React, { useMemo } from 'react';
import { getTreeMap } from "src/utils/horizontalTree";
import {
    xAccessor, yAccessor, wAccessor, hAccessor
} from 'src/accessors/squareAccessors';
import { v4 as uuidv4 } from 'uuid';
import { ratioColor } from 'src/utils/treeAccess';
//import { yDisplacedAccessor } from 'src/accessors/partitionNodeAccessor'

interface PartitionAreaProps {
    types: string[]
    usedTypes: string[],
    height: number,
    width: number,
    yDisplacement: number
}

export const PartitionArea = React.memo(({
    types,
    usedTypes,
    height,
    width,
    yDisplacement
}: React.PropsWithChildren<PartitionAreaProps>) => {
    //get all the nodes descendants
    const treeNodes = useMemo(() => {
        return getTreeMap(types, usedTypes, height, width)
    },
        [types, usedTypes, height, width]
    );

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
    //yDisplacedAccessor(node)
    return <g key={uuidv4()} transform={"translate(" + 0 + "," + yDisplacement + ")"} >
        {rendernodes}
    </g>
})