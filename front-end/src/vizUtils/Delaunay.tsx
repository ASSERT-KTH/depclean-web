import React from 'react';
import { Delaunay } from "d3-delaunay";
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
interface delaunayProps {
    data: any,
    dimensions: dimension,
    xAccessor(d: any): number,
    yAccessor(d: any): number,
    onEnter(d: any): void,
    onLeave(d: any): void,

}

export const DelaunayGrid = ({
    data,
    dimensions,
    xAccessor,
    yAccessor,
    onEnter,
    onLeave
}: React.PropsWithChildren<delaunayProps>) => {
    // console.log(data)
    // Create a new Delaunay triangulation passing in our dataset, x accessor function, and y accessor function
    const delaunay = Delaunay.from(data, (d: any) => yAccessor(d), (d: any) => xAccessor(d))

    // Turn our delaunay triangulation into a voronoi diagram
    const voronoi = delaunay.voronoi()

    // Specify the size of our diagram
    voronoi.xmax = dimensions.boundedWidth - dimensions.marginBottom;
    voronoi.ymax = dimensions.boundedHeight - dimensions.marginBottom;

    const mouseEnter = (d: any) => { if (d.data.visible) onEnter(d) }
    const mouseLeave = (d: any) => { if (d.data.visible) onLeave(d) }


    return (
        <g transform={"translate(" + -dimensions.marginLeft / 2 + "," + 0 + ")"}>
            {data.map((d: any, i: number) => {
                return (
                    <path
                        key={uuidv4()}
                        d={voronoi.renderCell(i)}
                        fill="transparent"
                        stroke="transparent"
                        onMouseEnter={() => mouseEnter(d)}
                        onMouseLeave={() => mouseLeave(d)}
                    />
                )
            })}

        </g>
    )
}