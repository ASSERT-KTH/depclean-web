import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useAppState } from "src/AppStateContext";
// import { getcolor } from 'src/utils/treeAccess'
import { getColorGenerator, getColorDataAccessor, countCategories } from 'src/utils/treeAccess';
// import * as d3 from 'd3';

interface LinkProps {
    data: any[],
    size: number,
    onEnter: any,
    onLeave: any,
    sizeScalar: any,
}

export const Nodes = ({
    data,
    size,
    onEnter,
    onLeave,
    sizeScalar
}: React.PropsWithChildren<LinkProps>) => {
    //get the main state
    const { state } = useAppState();
    //Get all the nodes
    const {
        colorSelected
    } = state;

    // let colorGenerator: any = d3.scaleOrdinal(d3.schemeCategory10);
    // let colorAccessor = ((d: any) => { return d.data.type });
    const getIds = data.reduce(countCategories, [])
    const colorGenerator: d3.ScaleOrdinal<string, unknown, never> = getColorGenerator(colorSelected, getIds);
    const colorDataAccessor: (d: any) => string = getColorDataAccessor(colorSelected)
    const color: any = (d: any) => colorGenerator(colorDataAccessor(d));


    const classAccessor = (d: any) => {
        return "node " +
            " node-leaf" +
            (d.data.type === "parent" ? " node-parent" : " ") +
            (d.data.highlight ? " node-highlight" : "") +
            (d.data.visible ? " node-visible" : " node-invisible") +
            (d.data.deleted ? " node-deleted" : "")
    }



    const mouseEnter = (d: any) => {
        // if (d.data.visible) onEnter(d) 
    }
    const mouseLeave = (d: any) => {
        // if (d.data.visible) onLeave() 
    }

    const shapeAccessor = (d: any) => {
        const type = d.data.type;
        // console.log(d.data.scope)
        if (type === "parent") {
            return <circle
                key={uuidv4()}
                className={classAccessor(d)}
                r={size * 6}
                onMouseEnter={() => mouseEnter(d)}
                onMouseLeave={() => mouseLeave(d)}
                fill={color(d)}

            />;

        } else if (type === "direct") {
            return <circle
                key={uuidv4()}
                className={classAccessor(d)}
                r={sizeScalar(d.data.size)}
                onMouseEnter={() => mouseEnter(d)}
                onMouseLeave={() => mouseLeave(d)}
                fill={color(d)}

            />

        } else if (type === "transitive") {
            const size = sizeScalar(d.data.size);
            return <rect
                className={classAccessor(d)}
                // transform={"translate(" + (-size / 2) + "," + 0 + ")"}
                key={uuidv4()}
                y={-size / 2}
                width={size}
                height={size}
                onMouseEnter={() => mouseEnter(d)}
                onMouseLeave={() => mouseLeave(d)}
                fill={color(d)}
            />

        }
        else if (type === "inherited") {
            const size = sizeScalar(d.data.size);
            return <rect
                className={classAccessor(d)}
                transform={"rotate(45), translate(" + (-size / 2) + "," + (size / 2) + ")"}
                key={uuidv4()}
                y={-size}
                width={size}
                height={size}
                onMouseEnter={() => mouseEnter(d)}
                onMouseLeave={() => mouseLeave(d)}
                fill={color(d)}

            />

        }

        return <circle
            key={uuidv4()}
            className={classAccessor(d)}
            r={sizeScalar(d.data.size)}
            onMouseEnter={() => mouseEnter(d)}
            onMouseLeave={() => mouseLeave(d)}
        />
    }



    return (
        <g>
            {data.map((d) => (
                <g transform={"translate(" + d.y + "," + d.x + ")"} key={uuidv4()}>
                    {shapeAccessor(d)}
                </g>
            ))
            }
        </g>
    )
}