import React from 'react';
import { v4 as uuidv4 } from 'uuid';

interface LinkProps {
    data: any[],
    linkAccesor(d: any): any,
    classAccessor(d: any): string,
}

export const Links = React.memo(({
    data,
    linkAccesor,
    classAccessor
}: React.PropsWithChildren<LinkProps>) => {

    return (
        <g>
            {data.map((d) => (
                <path
                    d={linkAccesor(d)}
                    className={classAccessor(d)}
                    key={uuidv4()}
                />
            ))}

        </g>
    )
})
