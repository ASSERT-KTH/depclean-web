import React from 'react';
import { getBoxPosition, getClassType } from 'src/Components/tooltip';

interface tooltipProps {
    value: React.ReactNode
    position: {
        x: number,
        y: number
    },
    opacity: number,
    display?: "TOP" | "LEFT" | "BOTTOM" | "RIGHT",
}
export const Tooltip = ({ value, position, opacity, display }: React.PropsWithChildren<tooltipProps>) => {
    //check the position is not undefined
    const pos: "TOP" | "LEFT" | "BOTTOM" | "RIGHT" = display === undefined ? "TOP" : display;

    return (
        <div id="tooltip"
            className={"tooltip " + getClassType(pos)}
            style={{ transform: getBoxPosition(pos, position), opacity: opacity }}>
            <div className="tooltip-value">
                {value}
            </div>
        </div>
    )
}