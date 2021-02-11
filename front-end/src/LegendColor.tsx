import React from 'react';
import { legendColorInterface, colorPallete } from 'src/interfaces/interfaces';
import { v4 as uuidv4 } from 'uuid';

const rectSize: number = 10;

export const LegendColor = ({
    pallete,
    tittle
}: React.PropsWithChildren<legendColorInterface>) => {

    return <>
        <span className="tittle"> {tittle}</span>
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