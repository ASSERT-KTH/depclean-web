import React from 'react';
import { useAppState } from "src/AppStateContext";
import { dependencyPallete, ratioColor, getCGenerator, sortByNumDependencies, getProviders, mapGroupId } from "src/utils/treeAccess";
import { LegendColor } from "src/LegendColor";
import { LegendGroup } from 'src/LegendGroup';
import { filterOmmitedandTest, filterDeleted } from 'src/utils/horizontalTree';

export const Legend = () => {
    //get the main state
    const { state } = useAppState();
    const { colorSelected, filtered } = state;

    const nodes = colorSelected === "GROUP_ID" ?
        filtered.descendants()
            .filter(filterOmmitedandTest)
            .filter(filterDeleted)
        : null;

    return <div id={"legend"} className={"flex legend-right"}>
        {colorSelected === "DEPENDENCY_TYPE" ?
            <LegendColor pallete={dependencyPallete} tittle="Dependencies" /> :
            colorSelected === "USAGE_RATIO" ?
                <LegendColor pallete={ratioColor} tittle="Types" /> :
                colorSelected === "GROUP_ID" ?
                    <LegendGroup
                        colorPallete={getCGenerator(colorSelected, nodes)}
                        rectSize={10}
                        groupIds={Object.entries(nodes //reduce the nodes to an object with the number of times a groupId repeats
                            .reduce(getProviders, {})) //transform it into an array
                            .map(mapGroupId) //map it to resestructure the info into an array with objects
                            .sort(sortByNumDependencies)} //sort it from highest to lowest
                    /> :
                    <></>
        }
    </div>
}