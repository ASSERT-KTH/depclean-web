import React from 'react';
import { useAppState } from "src/AppStateContext";
import { dependencyPallete } from "src/utils/treeAccess";
import { LegendColor } from "src/LegendColor";

export const Legend = () => {
    //get the main state
    const { state } = useAppState();
    //Get all the nodes
    const { colorSelected } = state;

    const colorLegend = colorSelected === "DEPENDENCY_TYPE" ?
        <LegendColor pallete={dependencyPallete} /> :
        colorSelected === "USAGE_RATIO" ?
            <div>Usage ratio</div> :
            <></>

    return <div
        id={"legend"}
        className={"flex"}>

        {colorLegend}
    </div>
}