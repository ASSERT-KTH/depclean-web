import React, { useRef, useState } from 'react';
import * as d3 from 'd3';
import { countCategories } from './utils/CountCategories';
import { Squares } from './vizUtils/Squares';
import { Legend } from './vizUtils/Legend';
import { v4 as uuidv4 } from 'uuid';
import { Tooltip } from './vizUtils/tooltip';

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
}

export const Chart = ({ nodes, dimensions, category }: React.PropsWithChildren<ChartProps>) => {
    const [toolTipValue, setToolTipValue] = useState("");
    const [toolTipPos, setToolTipPos] = useState({ x: 0, y: 0 });
    const [tpOpacity, setTpOpacity] = useState(0)

    const chartViz = useRef(null);
    const categories = countCategories(nodes, category);
    const chartSize = (dimensions.boundedWidth);

    const chartHeight = 300;
    //Create accessor
    //ACCESSORS FOR SQUARES
    const xAccessor = (d: any) => d.items;

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
        .nice()



    const yAccessor = (d: any) => dimensions.boundedHeight - chartHeight;
    const posAccessor = (d: any) => xScalePie(d.startAngle);
    const wAccessorPie = (d: any) => xScalePie(d.endAngle) - xScalePie(d.startAngle);
    const hAccessorPie = (d: any) => chartHeight;
    const nameAccessorPie = (d: any) => d.data.category;
    const valueAccesor = (d: any) => "(" + d.value + ")";
    const total = d3.sum(pieData, (d: any) => d.value)
    const valueAccessorPie = (d: any) => d3.format(".2f")((d.value / total) * 100) + "%";
    // const indexAccessor = (d: any) => d.index;
    const colorInterpolator = d3.interpolate("red", "blue")
    const color = d3.scaleSequential()
        .domain([0, 5])
        .interpolator(colorInterpolator);
    //LEGEND DATA
    const initialPos = [chartSize, dimensions.boundedHeight - chartHeight]

    const mouseEnter = (d: any) => {
        setToolTipValue(nameAccessorPie(d))
        setToolTipPos({ x: posAccessor(d), y: dimensions.boundedHeight - chartHeight })
        setTpOpacity(1);
    }
    const mouseLeave = (d: any) => {
        setTpOpacity(0);
    }


    return (

        <div className="Chart" ref={chartViz}>
            <div className="wrapper">
                <Tooltip value={toolTipValue} position={toolTipPos} opacity={tpOpacity} />
                <svg width={dimensions.width} height={dimensions.height} >

                    <g transform={"translate(" + dimensions.marginLeft + "," + dimensions.marginTop + ")"}>
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
                            color={color}
                        />

                        <Legend
                            data={pieData}
                            nameAccessor={nameAccessorPie}
                            initialPos={initialPos}
                            color={color}
                        />
                    </g>
                </svg>
            </div>
        </div >
    )
}