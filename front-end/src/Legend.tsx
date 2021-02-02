import React from 'react';
import { useAppState } from "src/AppStateContext";
import { dependencyPallete, ratioColor, getCGenerator, getUniqueArray } from "src/utils/treeAccess";
import { LegendColor } from "src/LegendColor";
import { LegendRatio } from 'src/LegendRatio';
import { LegendGroup } from 'src/LegendGroup';
import { filterOmmitedandTest, filterDeleted } from 'src/utils/horizontalTree';

export const Legend = () => {
    //get the main state
    const { state } = useAppState();
    //Get all the nodes
    const { colorSelected, filtered } = state;
    const nodes = colorSelected === "GROUP_ID" ? filtered.descendants()
        .filter(filterOmmitedandTest)
        .filter(filterDeleted)
        : null;

    const colorLegend = colorSelected === "DEPENDENCY_TYPE" ?
        <LegendColor pallete={dependencyPallete} /> :
        colorSelected === "USAGE_RATIO" ?
            <LegendRatio pallete={ratioColor} /> :
            colorSelected === "GROUP_ID" ?
                <LegendGroup
                    colorPallete={getCGenerator(colorSelected, nodes)}
                    rectSize={10}
                    groupIds={getUniqueArray(nodes)}
                /> :
                <></>;
    return <div
        id={"legend"}
        className={"flex legend-right"}>

        {colorLegend}
    </div>
}