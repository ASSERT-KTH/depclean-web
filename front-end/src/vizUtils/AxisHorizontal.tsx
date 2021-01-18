import React from 'react';
import { v4 as uuidv4 } from 'uuid';
interface dimension {
    width: number,
    height: number,
    marginTop: number,
    marginRight: number,
    marginBottom: number,
    marginLeft: number,
    boundedHeight: number,
    boundedWidth: number,
}

interface axisHorizontalProps {
    dimensions: dimension,
    label?: string,
    formatTick(d: any): string,
    scale: d3.ScaleLinear<number, number, never>,
    numTicks: number,

}

export const AxisHorizontal = ({
    dimensions,
    label,
    formatTick,
    scale,
    numTicks
}: React.PropsWithChildren<axisHorizontalProps>) => {
    const ticks = scale.ticks(numTicks);
    const textLabel = label ?
        (<text
            key={uuidv4()}
            className="axis_label" transform={`translate(${dimensions.boundedWidth / 2}, 55)`}>
            {label}
        </text>) :
        <React.Fragment></React.Fragment>

    return (
        <g className="axis axisHorizontal" transform={`translate( ${dimensions.marginLeft}, ${dimensions.height - 8
            })`} >

            <line
                className="axis__line" x2={dimensions.boundedWidth}
            />
            {/* RENDER THE TICKS */}
            {ticks.map((tick) => (
                <text
                    key={tick}
                    className="axis__tick" transform={`translate(${scale(tick)}, 25)`}>
                    { formatTick(tick)}
                </text>
            ))}

            {textLabel}
        </g>
    )
}