import React, { useRef, useState } from 'react';
import * as d3 from 'd3';
import { Squares } from './vizUtils/Squares';
import { v4 as uuidv4 } from 'uuid';
import { Tooltip } from './vizUtils/tooltip';
// import { Texts } from './vizUtils/Texts';

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

interface treeMapProps {
    data: d3.HierarchyNode<object[]>,
    dimensions: dimension,
}

export const TreeMap = ({ data, dimensions }: React.PropsWithChildren<treeMapProps>) => {
    const [toolTipValue, setToolTipValue] = useState("");
    const [toolTipPos, setToolTipPos] = useState({ x: 0, y: 0 });
    const [tpOpacity, setTpOpacity] = useState(0)

    const treeViz = useRef(null);
    const treemap = d3.treemap()
        .tile(d3.treemapBinary)
        .size([dimensions.boundedWidth, dimensions.boundedHeight])
        .padding(6)

    const nodes = treemap(data);

    const mouseEnter = (d: any) => {
        setToolTipValue(d.data.artifactId + " " + d3.format(".2f")(d.value) + "Mb")
        setToolTipPos({ x: d.x0, y: d.y0 })
        setTpOpacity(1);
    }
    const mouseLeave = () => {
        setTpOpacity(0);
    }


    //ACCESSORS FOR SQUARES
    const xAccessor = (d: any) => d.x0;
    const yAccessor = (d: any) => d.y0;
    const wAccessor = (d: any) => d.x1 - d.x0;
    const hAccessor = (d: any) => d.y1 - d.y0;
    const nameAccessor = (d: any) => d.data.parent;
    const tittleAccessor = (d: any) => d.data.artifactId;
    const color = d3.scaleOrdinal(d3.schemeCategory10);

    return (
        <div className="TreeMap" ref={treeViz}>
            <div className="wrapper">
                <Tooltip value={toolTipValue} position={toolTipPos} opacity={tpOpacity} />
                <svg
                    width={dimensions.width}
                    height={dimensions.height}
                    transform={"translate(" + dimensions.marginLeft + "," + dimensions.marginTop + ")"}
                >
                    <Squares
                        data={nodes.descendants()}
                        keyNumber={uuidv4()}
                        xAccessor={xAccessor}
                        yAccessor={yAccessor}
                        widthAccessor={wAccessor}
                        heightAccessor={hAccessor}
                        nameAccessor={nameAccessor}
                        onEnter={mouseEnter}
                        onLeave={mouseLeave}
                        valueAccessor={tittleAccessor}
                        color={color}
                    />

                    {/* <Texts
                    data={nodes.descendants()}
                    keyAccessor={keyAccessor}
                    xAccessor={xAccessor}
                    yAccessor={yAccessor}
                    tittleAccessor={tittleAccessor}
                /> */}

                </svg>
            </div>
        </div>

    )
}

