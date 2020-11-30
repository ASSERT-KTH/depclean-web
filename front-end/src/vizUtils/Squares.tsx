import React from 'react';
import { v4 as uuidv4 } from 'uuid';

interface SquaresProps {
    data: any[],
    keyNumber: string,
    xAccessor(d: any): number,
    yAccessor(d: any): number,
    widthAccessor(d: any): number,
    heightAccessor(d: any): number,
    nameAccessor(d: any): string,
    onEnter(d: any): void,
    onLeave(d: any): void,
    valueAccessor(d: any): string,
    color: any
}

export const Squares = ({
    data,
    keyNumber,
    xAccessor,
    yAccessor,
    widthAccessor,
    heightAccessor,
    nameAccessor,
    onEnter,
    onLeave,
    valueAccessor,
    color
}: React.PropsWithChildren<SquaresProps>) => {

    const mouseEnter = (d: any) => {
        onEnter(d)
    }
    const mouseLeave = (d: any) => { onLeave(d) }
    const padding = 15;

    return (
        <React.Fragment>
            {data.map((d, i) => (
                <g
                    transform={"translate(" + xAccessor(d) + "," + yAccessor(d) + ")"}
                    key={uuidv4()}
                >

                    <rect
                        className="square_treemap"
                        key={keyNumber}
                        cx={xAccessor(d)}
                        cy={yAccessor(d)}
                        width={widthAccessor(d)}
                        height={heightAccessor(d)}
                        fill={color(d.index)}
                        onMouseEnter={() => mouseEnter(d)}
                        onMouseLeave={() => mouseLeave(d)}
                    />
                    <foreignObject
                        width={widthAccessor(d)}
                        height={heightAccessor(d)}
                        fill="#d3e2ee"
                        className="foreignobj">

                        <div className="square-text" style={{ width: widthAccessor(d) - padding }}>
                            <span className="title"> {nameAccessor(d)}</span>
                            <span className="sub-title"> {valueAccessor(d)}</span>
                        </div>
                    </foreignObject>
                </g>
            ))}
        </React.Fragment>
    )
}