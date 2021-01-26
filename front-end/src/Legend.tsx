import React from 'react';
import { useAppState } from "src/AppStateContext";
import { dependencyPallete, ratioColor } from "src/utils/treeAccess";
import { LegendColor } from "src/LegendColor";
import { LegendRatio } from 'src/LegendRatio';

export const Legend = () => {
    //get the main state
    const { state } = useAppState();
    //Get all the nodes
    const { colorSelected } = state;

    const colorLegend = colorSelected === "DEPENDENCY_TYPE" ?
        <LegendColor pallete={dependencyPallete} /> :
        colorSelected === "USAGE_RATIO" ?
            <LegendRatio pallete={ratioColor} /> :
            <></>

    return <div
        id={"legend"}
        className={"flex"}>

        {colorLegend}
    </div>
}