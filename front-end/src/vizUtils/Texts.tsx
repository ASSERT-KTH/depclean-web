import React from 'react';


interface TextProps {
    data: any[],
    keyAccessor(d: any, i: number): number,
    xAccessor(d: any): number,
    yAccessor(d: any): number,
    tittleAccessor(d: any): string
}

export const Texts = ({
    data,
    keyAccessor,
    xAccessor,
    yAccessor,
    tittleAccessor
}: React.PropsWithChildren<TextProps>) => {

    const margin = {
        top: 15,
        left: 5,
    };
    return (
        <React.Fragment>
            {data.map((d, i) => (
                <g
                    transform={"translate(" + xAccessor(d) + "," + yAccessor(d) + ")"}
                >
                    <text
                        key={keyAccessor(d, i)}
                        x={margin.left}
                        y={margin.top}
                        fill="black"
                        text-anchor="start"
                    >
                        {tittleAccessor(d)}
                    </text>

                </g>
            ))}
        </React.Fragment>
    )
}