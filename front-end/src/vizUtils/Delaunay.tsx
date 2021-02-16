import React, { useCallback, useMemo } from 'react';
import { Delaunay } from "d3-delaunay";
import { v4 as uuidv4 } from 'uuid';
import { dimension } from 'src/interfaces/interfaces';
import { useToolTipAppState } from 'src/AppToolTipStateContext';
import { formatFileSize } from 'src/Components/tooltip';
import { format } from 'd3';

interface delaunayProps {
    data: any,
    dimensions: dimension,
    xAccessor(d: any): number,
    yAccessor(d: any): number,
    hide?: boolean

}

export const DelaunayGrid = ({
    data,
    dimensions,
    xAccessor,
    yAccessor,
    hide = true
}: React.PropsWithChildren<delaunayProps>) => {

    const { toolTipDispatch } = useToolTipAppState();

    // Turn our delaunay triangulation into a voronoi diagram
    const voronoi = useMemo(
        () => {
            // Create a new Delaunay triangulation passing in our dataset, x accessor function, and y accessor function
            const delaunay = Delaunay.from(data, (d: any) => yAccessor(d), (d: any) => xAccessor(d))
            const verono = delaunay.voronoi()
            // Specify the size of our diagram
            verono.xmax = dimensions.boundedWidth;
            verono.ymax = dimensions.boundedHeight;
            return verono;
        }, [data, dimensions.boundedHeight, dimensions.boundedWidth, xAccessor, yAccessor]
    )

    const mouseEnter = useCallback(
        (d: any) => {
            if (d.data.visible) {
                toolTipDispatch({
                    type: "UPDATE_INFO", payload: <div>
                        <div className="toolTip-tittle">{d.data.artifactId}</div>
                        <div className="toolTip-sub">{d.data.version}</div>
                        <div className="toolTip-sub">{d.data.groupId}</div>
                        <div className="toolTip-sub">Scope: {d.data.scope}</div>
                        <div className="toolTip-sub">Usage ratio: {d.data.usageRatio === 0 ? 0 : format(".5f")(d.data.usageRatio)}%</div>
                        <div className="toolTip-sub">Size: <span className="toolTip-value">{formatFileSize(d.data.size, 2)}</span></div>
                    </div>
                })
                toolTipDispatch({ type: "UPDATE_POSITION", payload: { x: dimensions.marginLeft + (d.y0 + d.h), y: d.x0 + d.y + dimensions.marginTop + (d.w / 2) } })
                toolTipDispatch({ type: "UPDATE_OPACITY", payload: 1 })

            }
        },
        [dimensions.marginLeft, dimensions.marginTop, toolTipDispatch]
    )
    //hide the tooltip on mouse leave
    const mouseLeave = useCallback(
        (d: any) => {
            if (d.data.visible) {
                toolTipDispatch({ type: "UPDATE_OPACITY", payload: 0 })
            }
        }, [toolTipDispatch]
    );

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