import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import { classAccessor, hAccessor, wAccessor, yDisplacedAccessor } from 'src/accessors/partitionNodeAccessor'
import { xAccessor, yAccessor } from 'src/accessors/squareAccessors';

interface paritionNodeProps {
    data: any[],
    onEnter?: any,
    onLeave?: any,
    colorAccessor: any,
}

export const PartitionNode = ({
    data,
    onEnter,
    onLeave,
    colorAccessor,
}: React.PropsWithChildren<paritionNodeProps>) => {

    return <>
        {data.map((node) => (
            <g transform={"translate(" + yAccessor(node) + "," + xAccessor(node) + ")"} key={uuidv4()}>

                <rect
                    className={classAccessor(node)}
                    key={uuidv4()}
                    y={yDisplacedAccessor(node)}
                    width={hAccessor(node)}
                    height={wAccessor(node)}
                    fill={colorAccessor(node)}
                // onMouseEnter={() => onEnter(node)}
                // onMouseLeave={() => onLeave(node)}
                />
            </g>
        ))}
    </>
}