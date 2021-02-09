import React from 'react';
import { v4 as uuidv4 } from 'uuid';

interface LinkProps {
    data: any[],
    linkAccesor(d: any): any,
    classAccessor(d: any): string,
    colorAccessor: any
}

export const PartitionLinks = React.memo(({
    data,
    linkAccesor,
    classAccessor,
    colorAccessor
}: React.PropsWithChildren<LinkProps>) => {

    return (
        <g>
            {data.map((d, i) => (
                <path
                    style={{ fill: colorAccessor(d) }}
                    className={classAccessor(d)}
                    d={linkAccesor(d)}
                    key={uuidv4()}
                />
            ))}

        </g>
    )
})
