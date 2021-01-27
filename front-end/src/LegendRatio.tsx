import React from 'react';
import { legendColorInterface } from 'src/interfaces/interfaces';



export const LegendRatio = ({
    pallete
}: React.PropsWithChildren<legendColorInterface>) => {

    const rectSize: { width: number, height: number } = {
        width: 80,
        height: 10,
    };

    return <div className="flex center color-ratio">
        <span style={{ display: "block" }}>{pallete[0].tittle}</span>
        <div ><svg width={rectSize.width} height={rectSize.height}>
            <defs>
                <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" style={{ stopColor: pallete[0].color, stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: pallete[1].color, stopOpacity: 1 }} />
                </linearGradient>
            </defs>
            <rect
                width={rectSize.width}
                height={rectSize.height}
                fill="url(#grad1)"
            />
        </svg>
        </div>
        <span style={{ display: "block" }}>{pallete[1].tittle}</span>
    </div>
}