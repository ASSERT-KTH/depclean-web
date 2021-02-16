import React, { useState } from 'react';
import * as d3 from 'd3';
import { Squares } from './vizUtils/Squares';
// import { Legend } from './vizUtils/Legend';
import { v4 as uuidv4 } from 'uuid';
import { Tooltip } from './vizUtils/tooltip';
import { AxisHorizontal } from 'src/vizUtils/AxisHorizontal';
import { AxisVertical } from 'src/vizUtils/AxisVertical';
import { dimension } from 'src/interfaces/interfaces'

import {
    nodevValueAccessor,
    formatTick,
    yAccessor,
    posAccessor,
    wAccessor,
    nameAccessor,
    valueAccesor,
    getValueAccessor,
    colorAccessor,
    chart

} from 'src/Components/chart';

interface ChartProps {
    nodes: any[],
    dimensions: dimension,
    category: string
    labelX?: string,
    labelY?: string,
    colorInterpolator?: any,
    numTicks: number,
    tooltipPos?: "TOP" | "LEFT" | "BOTTOM" | "RIGHT"
}

export const Chart = ({
    nodes,
    dimensions,
    category,
    labelX,
    labelY,
    colorInterpolator,
    numTicks,
    tooltipPos
}: React.PropsWithChildren<ChartProps>) => {
    const [toolTipValue, setToolTipValue] = useState(<div></div>);
    const [toolTipPos, setToolTipPos] = useState({ x: 0, y: 0 });
    const [tpOpacity, setTpOpacity] = useState(0)

    //declare chart width and height
    const chartHeight = dimensions.boundedHeight * 0.69;
    const chartDimensions = {
        ...dimensions,
        boundedWidth: dimensions.boundedWidth,
        height: chartHeight
    }

    const toolTip: "TOP" | "LEFT" | "BOTTOM" | "RIGHT" = tooltipPos === undefined ? "TOP" : tooltipPos;

    const chartXScale = d3.scaleLinear()
        .domain([0, 100])
        .range([0, chartDimensions.boundedWidth])
        .nice()

    //Calculate all chart 
    const chartData = chart(nodes, category, chartXScale);
    const total = d3.sum(chartData, nodevValueAccessor)

    const hAccessor = (d: any) => chartHeight;
    const valueAccessor = getValueAccessor(total);
    //LEGEND DATA
    // const initialPos = [chartSize + dimensions.marginLeft + 10, dimensions.marginTop]

    const mouseEnter = (d: any) => {

        setToolTipValue(
            <div>
                <div className="toolTip-tittle">{nameAccessor(d)}</div>
                <div className="toolTip-sub"><span className="toolTip-value">{valueAccessor(d)}</span></div>
                <div className="toolTip-sub"><span className="toolTip-value">{valueAccesor(d)}</span></div>
            </div>)
        setToolTipPos({ x: dimensions.marginLeft + posAccessor(d) + wAccessor(d) / 2, y: dimensions.marginTop + chartHeight })
        setTpOpacity(1);
    }
    const mouseLeave = (d: any) => {
        setTpOpacity(0);
    }


    return (

        <div className="flex flex-justify-center" >
            <div className="wrapper">
                <Tooltip value={toolTipValue} position={toolTipPos} opacity={tpOpacity} display={toolTip} />
                <svg width={dimensions.width} height={dimensions.height} >

                    <g transform={"translate(" + dimensions.marginLeft + "," + 0 + ")"} >

                        <Squares
                            data={chartData}
                            keyNumber={uuidv4()}
                            xAccessor={posAccessor}
                            yAccessor={yAccessor}
                            widthAccessor={wAccessor}
                            heightAccessor={hAccessor}
                            nameAccessor={valueAccessor}
                            onEnter={mouseEnter}
                            onLeave={mouseLeave}
                            valueAccessor={valueAccesor}
                            // indexAccessor ={}
                            colorAccessor={colorAccessor}
                        />
                    </g>

                    <AxisHorizontal
                        dimensions={chartDimensions}
                        formatTick={formatTick}
                        scale={chartXScale}
                        numTicks={numTicks}
                    />
                    <AxisVertical
                        dimensions={chartDimensions}
                        label={labelY}
                        showAxis={false}
                        formatTick={formatTick}
                        scale={chartXScale}
                        numTicks={numTicks}
                    />
                    {/* <Legend
                        data={chartData}
                        nameAccessor={nameAccessor}
                        initialPos={initialPos}
                        color={color}
                    /> */}
                </svg>
            </div>
        </div >
    )
}