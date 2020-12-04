import React from 'react';

interface tooltipProps {
    value: React.ReactNode
    position: {
        x: number,
        y: number
    },
    opacity: number
}
export const Tooltip = ({ value, position, opacity }: React.PropsWithChildren<tooltipProps>) => {

    return (
        <div id="tooltip" className="tooltip" style={{ transform: `translate(calc( -50% + ${position.x}px),calc( -100% + (${position.y}px))`, opacity: opacity }}>
            <div className="tooltip-value">
                {value}
            </div>
        </div>
    )
}