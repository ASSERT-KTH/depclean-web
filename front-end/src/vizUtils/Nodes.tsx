import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useAppState } from "src/AppStateContext";
// import { getcolor } from 'src/utils/treeAccess'
import * as d3 from 'd3';

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

    let colorGenerator: any = d3.scaleOrdinal(d3.schemeCategory10);
    let colorAccessor = ((d: any) => { return d.data.type });

    switch (colorSelected) {
        case "color-type":
            // create accessor
            //create color
            colorAccessor = ((d: any) => { return d.data.type });
            colorGenerator = d3.scaleOrdinal(["#8EBE86", "#6BBFEE", "#EED16B"]);

            break;
        case "color-artifact-id":
            colorAccessor = ((d: any) => { return d.data.groupId });
            // colorGenerator = d3.scaleOrdinal(["#8EBE86", "#6BBFEE", "#EED16B"]);
            break;
        case "color-group-nodes":
            const variant = d3.extent(data.slice(1).map((d: any) => {
                return d.data.children.length
            }))
            colorAccessor = ((d: any) => { return d.data.children.length });
            colorGenerator = d3.scaleSequential()
                .domain([variant[0], variant[1]])
                .interpolator(d3.interpolateRdYlBu);
            break;

        default:
        // code block
    }



    const classAccessor = (d: any) => {
        //  (d.children ? " node-internal" : " node-leaf") +
        return "node " +
            " node-leaf" +
            (d.data.type === "parent" ? " node-parent" : " ") +
            (d.data.highlight ? " node-highlight" : "") +
            (d.data.visible ? " node-visible" : " node-invisible");
    }



    const mouseEnter = (d: any) => { if (d.data.visible) onEnter(d) }
    const mouseLeave = (d: any) => { if (d.data.visible) onLeave() }



    const shapeAccessor = (d: any) => {
        const type = d.data.type;
        if (type === "parent") {
            return <circle
                key={uuidv4()}
                className={classAccessor(d)}
                r={size * 4}
                onMouseEnter={() => mouseEnter(d)}
                onMouseLeave={() => mouseLeave(d)}

            />;

        } else if (type === "direct") {
            return <circle
                key={uuidv4()}
                className={classAccessor(d)}
                r={sizeScalar(d.data.size)}
                onMouseEnter={() => mouseEnter(d)}
                onMouseLeave={() => mouseLeave(d)}
                style={{ fill: colorGenerator(colorAccessor(d)) }}
            />

        } else if (type === "transitive") {
            const size = sizeScalar(d.data.size);
            return <rect
                className={classAccessor(d)}
                key={uuidv4()}
                y={-size / 2}
                width={size}
                height={size}
                onMouseEnter={() => mouseEnter(d)}
                onMouseLeave={() => mouseLeave(d)}
                style={{ fill: colorGenerator(colorAccessor(d)) }}
            />

        } else if (type === "inherited") {
            const size = sizeScalar(d.data.size);
            return <rect
                className={classAccessor(d)}
                transform={"rotate(45)"}
                key={uuidv4()}
                y={-size}
                width={size}
                height={size}
                onMouseEnter={() => mouseEnter(d)}
                onMouseLeave={() => mouseLeave(d)}
                style={{ fill: colorGenerator(colorAccessor(d)), }}
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
            {data.map((d, i) => (
                <g transform={"translate(" + d.y + "," + d.x + ")"} key={uuidv4()}>
                    {shapeAccessor(d)}
                </g>
            ))
            }
        </g>
    )
}