import React from 'react';
import { Delaunay } from "d3-delaunay";
import { v4 as uuidv4 } from 'uuid';
import { dimension } from 'src/interfaces/interfaces';


interface delaunayProps {
    data: any,
    dimensions: dimension,
    xAccessor(d: any): number,
    yAccessor(d: any): number,
    onEnter(d: any): void,
    onLeave(d: any): void,
    hide?: boolean

}

export const DelaunayGrid = ({
    data,
    dimensions,
    xAccessor,
    yAccessor,
    onEnter,
    onLeave,
    hide = true
}: React.PropsWithChildren<delaunayProps>) => {
    console.log("render DELAUNAY")
    // Create a new Delaunay triangulation passing in our dataset, x accessor function, and y accessor function
    const delaunay = Delaunay.from(data, (d: any) => yAccessor(d), (d: any) => xAccessor(d))

    // Turn our delaunay triangulation into a voronoi diagram
    const voronoi = delaunay.voronoi()

    // Specify the size of our diagram
    voronoi.xmax = dimensions.boundedWidth;
    voronoi.ymax = dimensions.boundedHeight;

    const mouseEnter = (d: any) => { if (d.data.visible) onEnter(d) }
    const mouseLeave = (d: any) => { if (d.data.visible) onLeave(d) }


    return (
        <g transform={"translate(" + dimensions.marginLeft / 2 + "," + dimensions.marginTop + ")"}>
            {data.map((d: any, i: number) => {
                return (
                    <path
                        key={uuidv4()}
                        d={voronoi.renderCell(i)}
                        fill="transparent"
                        stroke={hide ? "transparent" : "red"}
                        onMouseEnter={() => mouseEnter(d)}
                        onMouseLeave={() => mouseLeave(d)}
                    />
                )
            })}

        </g>
    )
}