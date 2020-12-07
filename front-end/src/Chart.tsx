import React, { useState } from 'react';
import * as d3 from 'd3';
import { countCategories } from './utils/CountCategories';
import { Squares } from './vizUtils/Squares';
import { Legend } from './vizUtils/Legend';
import { v4 as uuidv4 } from 'uuid';
import { Tooltip } from './vizUtils/tooltip';
import { AxisHorizontal } from 'src/vizUtils/AxisHorizontal';
import { AxisVertical } from 'src/vizUtils/AxisVertical';

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

interface ChartProps {
    nodes: any[],
    dimensions: dimension,
    category: string
    labelX?: string,
    labelY?: string,
    colorInterpolator: any
}

export const Chart = ({ nodes, dimensions, category, labelX, labelY, colorInterpolator }: React.PropsWithChildren<ChartProps>) => {
    const [toolTipValue, setToolTipValue] = useState(<div></div>);
    const [toolTipPos, setToolTipPos] = useState({ x: 0, y: 0 });
    const [tpOpacity, setTpOpacity] = useState(0)

    //Get all the categories
    const categories = countCategories(nodes, category);
    //declare chart width and height
    const chartSize = (dimensions.boundedWidth * 0.7);
    const chartHeight = 300;
    const chartDimensions = {
        ...dimensions,
        boundedWidth: chartSize,
        height: chartHeight
    }

    //Create accessor
    //ACCESSORS FOR SQUARES
    const xAccessor = (d: any) => d.items;

    //GET THE TOTAL
    const chartTotal: number = d3.sum(categories, xAccessor);
    const percentageAccessor = (d: any): number => (d.items / chartTotal) / 100;

    const chartXScale = d3.scaleLinear()
        .domain([0, 100])
        .range([0, chartSize])
        .nice()


    // Compute the position of each group on the pie:
    const pie = d3.pie()
        .value(xAccessor)
        .sort((a: any, b: any) => {
            return a.category.localeCompare(b.category)
        })
    let pieData = pie(categories).sort((a: any, b: any) => {
        return a.data.category.localeCompare(b.data.category)
    });



    const maxAngle = d3.max(pieData, (d: any) => d.endAngle);
    //transform circular pie to rectangular
    const xScalePie = d3.scaleLinear()
        .domain([0, maxAngle])
        .range([0, chartSize])




    const numTick = 5;

    const scaleAxis = d3.scaleLinear()
        .domain([0, numTick - 1])
        .range([0, 100])


    // console.log("logs", xScalePie(maxAngle), 0, maxAngle, 0, chartSize)


    const formatTick = (d: any) => d + "%";
    const yAccessor = (d: any) => 0; //dimensions.boundedHeight - chartHeight
    const posAccessor = (d: any) => dimensions.marginLeft + xScalePie(d.startAngle);
    const wAccessorPie = (d: any) => xScalePie(d.endAngle) - xScalePie(d.startAngle);
    const hAccessorPie = (d: any) => chartHeight;
    const nameAccessorPie = (d: any) => d.data.category;
    const valueAccesor = (d: any) => "(" + d.value + ")";
    const total = d3.sum(pieData, (d: any) => d.value)
    const valueAccessorPie = (d: any) => d3.format(".2f")((d.value / total) * 100) + "%";
    // const indexAccessor = (d: any) => d.index;
    // const colorInterpolator = d3.interpolate("red", "blue")

    const color = d3.scaleSequential()
        .domain([0, 5])
        .interpolator(colorInterpolator);
    const indexAccesor = (d: any) => d.index;
    const colorAccessor = (d: any) => color(indexAccesor(d))
    //LEGEND DATA
    const initialPos = [chartSize + dimensions.marginLeft + 10, dimensions.marginTop]

    const mouseEnter = (d: any) => {
        // console.log(d, valueAccessorPie(d))
        setToolTipValue(
            <div>
                <div className="toolTip-tittle">{nameAccessorPie(d)}</div>
                <div className="toolTip-sub"><span className="toolTip-value">{valueAccessorPie(d)}</span></div>
                <div className="toolTip-sub"><span className="toolTip-value">{valueAccesor(d)}</span></div>
            </div>)
        setToolTipPos({ x: posAccessor(d), y: dimensions.marginTop })
        setTpOpacity(1);
    }
    const mouseLeave = (d: any) => {
        setTpOpacity(0);
    }


    return (

        <div className="flex flex-justify-center" >
            <div className="wrapper">
                <Tooltip value={toolTipValue} position={toolTipPos} opacity={tpOpacity} />
                <svg width={dimensions.boundedWidth} height={dimensions.height} >

                    <g transform={"translate(" + 0 + "," + dimensions.marginTop + ")"} >

                        <Squares
                            data={pieData}
                            keyNumber={uuidv4()}
                            xAccessor={posAccessor}
                            yAccessor={yAccessor}
                            widthAccessor={wAccessorPie}
                            heightAccessor={hAccessorPie}
                            nameAccessor={valueAccessorPie}
                            onEnter={mouseEnter}
                            onLeave={mouseLeave}
                            valueAccessor={valueAccesor}
                            // indexAccessor ={}
                            colorAccessor={colorAccessor}
                        />
                    </g>

                    <Legend
                        data={pieData}
                        nameAccessor={nameAccessorPie}
                        initialPos={initialPos}
                        color={color}
                    />
                    <AxisHorizontal
                        dimensions={chartDimensions}
                        formatTick={formatTick}
                        scale={chartXScale}
                        numTicks={numTick}
                    />
                    <AxisVertical
                        dimensions={chartDimensions}
                        label={labelY}
                        showAxis={false}
                        formatTick={formatTick}
                        scale={chartXScale}
                        numTicks={numTick}
                    />
                </svg>
            </div>
        </div >
    )
}