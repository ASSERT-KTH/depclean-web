import React from 'react';
import { classAccessor } from 'src/accessors/partitionNodeAccessor'
import { v4 as uuidv4 } from 'uuid';
import { getColorGenerator, getColorDataAccessor, getArtifactsId } from 'src/utils/treeAccess';
import { useAppState } from "src/AppStateContext";
import {
    xAccessor, yAccessor, wAccessor, hAccessor
} from 'src/accessors/squareAccessors';
interface paritionNodeProps {
    data: any[],
    onEnter: any,
    onLeave: any,
}

export const PartitionNode = ({
    data,
    onEnter,
    onLeave
}: React.PropsWithChildren<paritionNodeProps>) => {
    //get the main state
    const { state } = useAppState();
    //Get all the nodes
    const {
        colorSelected
    } = state;

    const getIds = getArtifactsId(data)
    const colorGenerator: d3.ScaleOrdinal<string, unknown, never> = getColorGenerator(colorSelected, getIds);
    const colorDataAccessor: (d: any) => string = getColorDataAccessor(colorSelected)
    const color: any = (d: any) => colorGenerator(colorDataAccessor(d));



    const nodes = data.map((node) => (
        <g transform={"translate(" + node.y0 + "," + node.x0 + ")"} key={uuidv4()}>
            <rect
                className={classAccessor(node)}
                key={uuidv4()}
                cx={yAccessor(node)}
                cy={xAccessor(node)}
                rx={0}
                width={hAccessor(node)}
                height={wAccessor(node)}
                fill={color(node)}
                onMouseEnter={() => onEnter(node)}
                onMouseLeave={() => onLeave(node)}
            />
        </g>
    ))

    //render the data with the shape accessor
    return <>
        {nodes}
    </>
}