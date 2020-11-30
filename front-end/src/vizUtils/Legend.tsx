import React from 'react';
import { v4 as uuidv4 } from 'uuid';

interface legendProps {
    data: any[],
    nameAccessor(d: any): string,
    initialPos: number[],
    color: any
}

export const Legend = ({
    data,
    nameAccessor,
    initialPos,
    color
}: React.PropsWithChildren<legendProps>) => {
    const rectSize = 15;
    const padding = 5;
    const dataPos = data.map((d: any, i: number) => {
        d.y = i === 0 ? 0 : data[i - 1].y + rectSize + padding;
        return d;
    })

    return (
        <g
            transform={"translate(" + initialPos[0] + "," + initialPos[1] + ")"}
            key={uuidv4()}
        >
            {dataPos.map((d, i) => (
                <g
                    transform={"translate(" + 0 + "," + d.y + ")"}
                    key={uuidv4()}
                >
                    <rect
                        className="square_legend"
                        key={uuidv4()}
                        width={rectSize}
                        height={rectSize}
                        fill={color(d.index)}

                    />

                    <text
                        key={uuidv4()}
                        fill="black"
                        textAnchor="start"
                        transform={"translate(" + (rectSize + padding) + "," + (rectSize - 3) + ")"}
                    >
                        {`${nameAccessor(d)} `}
                    </text>
                </g>
            ))}

        </g>
    )
}