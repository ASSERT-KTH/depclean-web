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
    const [toolTipValue, setToolTipValue] = useState(<div></div>);
    const [toolTipPos, setToolTipPos] = useState({ x: 0, y: 0 });
    const [tpOpacity, setTpOpacity] = useState(0)

    //get the main state
    //Get all the nodes

    //treemapSliceDice

    const treeViz = useRef(null);
    const treemap = d3.treemap()
        .tile(d3.treemapBinary)
        .size([dimensions.boundedWidth, dimensions.boundedHeight])
        .padding(10)

    const nodes = treemap(data).descendants();

    const mouseEnter = (d: any) => {
        setToolTipValue(
            <div>
                <div className="toolTip-tittle">{d.data.artifactId}</div>
                <div className="toolTip-sub"><span className="toolTip-value">{d3.format(".2f")(d.value) + "Mb"}</span></div>
            </div>
        )
        setToolTipPos({ x: d.x0 + ((d.x1 - d.x0) / 2), y: d.y0 + dimensions.marginTop })
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
    const tittleAccessor = (d: any) => d.data.parent !== null ? d.data.parent : d.data.artifactId;
    const depthAccessor = (d: any) => d.depth;
    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const colorAccessor = (d: any) => color(depthAccessor(d));

    return (
        <div className="flex flex-justify-center" ref={treeViz}>
            <div className="wrapper tree-map">
                <Tooltip value={toolTipValue} position={toolTipPos} opacity={tpOpacity} />
                <svg
                    width={dimensions.boundedWidth}
                    height={dimensions.height}
                >
                    <g transform={"translate(" + 0 + "," + dimensions.marginTop + ")"}  >
                        {/* transform={"translate(" + dimensions.marginLeft + "," + dimensions.marginTop + ")"} */}
                        <Squares
                            data={nodes}
                            keyNumber={uuidv4()}
                            xAccessor={xAccessor}
                            yAccessor={yAccessor}
                            widthAccessor={wAccessor}
                            heightAccessor={hAccessor}
                            nameAccessor={nameAccessor}
                            onEnter={mouseEnter}
                            onLeave={mouseLeave}
                            valueAccessor={tittleAccessor}
                            colorAccessor={colorAccessor}
                            showText={false}
                        />

                        {/* <Texts
                    data={nodes.descendants()}
                    keyAccessor={keyAccessor}
                    xAccessor={xAccessor}
                    yAccessor={yAccessor}
                    tittleAccessor={tittleAccessor}
                /> */}

                    </g>
                </svg>
            </div>
        </div>

    )
}

