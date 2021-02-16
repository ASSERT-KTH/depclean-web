import React from 'react';
import { v4 as uuidv4 } from 'uuid';

interface ommitedLabelsProps {
    data: any
}

export const OmmitedLabels = ({
    data
}: React.PropsWithChildren<ommitedLabelsProps>) => {

    return (
        data.map((d: any) => <text
            key={uuidv4()}
            x={d.target.y + (d.source.y - d.target.y) / 2}
            y={d.target.x + (d.source.x - d.target.x) / 2}
            textAnchor="middle"
            className="omitted-label"
        >
            {d.version}
        </text>)
    )
}