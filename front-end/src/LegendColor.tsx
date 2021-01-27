import React from 'react';
import { legendColorInterface, colorPallete } from 'src/interfaces/interfaces';
import { v4 as uuidv4 } from 'uuid';


export const LegendColor = ({
    pallete
}: React.PropsWithChildren<legendColorInterface>) => {

    const rectSize: number = 10;

    return <>
        {pallete.map((color: colorPallete) => {
            return <div
                key={uuidv4()}
                className="flex center color-legend">
                <div ><svg width={rectSize} height={rectSize}><rect width={rectSize} height={rectSize} fill={color.color} /></svg></div>
                <span style={{ display: "block" }}>{color.tittle}</span>
            </div>
        })}
    </>
}