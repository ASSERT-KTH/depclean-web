import React from 'react';

interface tooltipProps {
    value: string
    position: {
        x: number,
        y: number
    },
    opacity: number
}
export const Tooltip = ({ value, position, opacity }: React.PropsWithChildren<tooltipProps>) => {

    return (
        <div id="tooltip" className="tooltip" style={{ transform: `translate(calc( 0% + ${position.x}px),calc( 0% + (${position.y}px))`, opacity: opacity }}>
            <div className="tooltip-value">
                {value}
            </div>
        </div>
    )
}