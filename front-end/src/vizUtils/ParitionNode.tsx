import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import { classAccessor, hAccessor, wAccessor, yDisplacedAccessor } from 'src/accessors/partitionNodeAccessor'
import {
    xAccessor, yAccessor
} from 'src/accessors/squareAccessors';
import { PartitionArea } from 'src/vizUtils/PartitionArea';

interface paritionNodeProps {
    data: any[],
    onEnter?: any,
    onLeave?: any,
    colorAccessor: any,
    showTypes?: boolean
}

export const PartitionNode = React.memo(({
    data,
    onEnter,
    onLeave,
    colorAccessor,
    showTypes = true
}: React.PropsWithChildren<paritionNodeProps>) => {

    const nodes = data.map((node) => (
        <g transform={"translate(" + yAccessor(node) + "," + xAccessor(node) + ")"} key={uuidv4()}>

            <rect
                className={classAccessor(node)}
                key={uuidv4()}
                // x={xAccessor(node)}
                y={yDisplacedAccessor(node)}
                // rx={0}
                width={hAccessor(node)}
                height={wAccessor(node)}
                fill={colorAccessor(node)}
            // onMouseEnter={() => onEnter(node)}
            // onMouseLeave={() => onLeave(node)}
            />
            {!showTypes ? <></> :
                <PartitionArea
                    types={node.data.allTypes}
                    usedTypes={node.data.usedTypes}
                    height={node.h}
                    width={node.w}
                    yDisplacement={yDisplacedAccessor(node)}
                />}
        </g>
    ))

    //render the data with the shape accessor
    return <>
        {nodes}
    </>
})