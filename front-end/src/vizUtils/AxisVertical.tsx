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
    showAxis: boolean
}

export const AxisVertical = ({
    dimensions,
    label,
}: React.PropsWithChildren<axisHorizontalProps>) => {
    // const ticks = scale.ticks(numTicks);
    const textLabel = label ?
        (<text
            key={uuidv4()}
            className="axis_label"
            style={{
                transform: `rotate(-90deg)`,
            }}
            textAnchor="middle"
            alignmentBaseline="central"
        >
            {label}
        </text>) :
        <React.Fragment></React.Fragment>

    return (
        <g className="axis axisVertical"
            transform={`translate(${30}, ${(dimensions.height) / 2 + dimensions.marginTop
                })`}
        >
            {textLabel}
        </g>
    )
}