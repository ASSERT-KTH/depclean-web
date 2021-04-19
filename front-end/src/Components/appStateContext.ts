import { hierarchy } from 'd3';
import { flink as data } from 'src/utils/dataDummy';
import { childrenAccessor } from 'src/accessors/treeAccessors';
import { cloneProject, debloatAll, debloatDirect } from "src/utils/treeAccess";
import { AppState, artifact } from 'src/interfaces/interfaces';
import { filter } from 'lodash';

//Data state for all the application
export const dependCheckGroup: string[] = ["direct", "transitive", "inherited"];
export const bloatedCheckGroup: string[] = ["direct", "transitive", "inherited"];//"direct", "transitive", "inherited"

export const viewText: string[] = ["groupid", "artifactid", "version"];
export const nodes = hierarchy(data, childrenAccessor);
export const scopeCheckGroup: string[] = ["compile", "test", "provided", "runtime", "system"]

//APP INITIAL STATE
export const appData: AppState = {

    project: data, //the original data only changes when you load a new project
    nodes: nodes, //all the nodes of the filtered project
    filteredProject: cloneProject(data),// is a copy of the projec which will be modified
    filtered: nodes,

    filteredDependencies: dependCheckGroup,
    filteredBloated: bloatedCheckGroup,
    filteredScope: scopeCheckGroup,

    colorSelected: "DEPENDENCY_TYPE",
    viewOmitted: false,
    viewLinks: true,

    debloatNum: 0,
    textDisplay: viewText,
    messageState: "ORIGINAL",
}


export const filterByArray = (boolArr: boolean[]) => {
    return (el: string, i: number) => boolArr[i] === true;
}

export const getMessageAndFiltered = (debState: number, project: artifact): { message: "ORIGINAL" | "DEBLOAT_DIRECT" | "DEBLOAT_ALL", children: artifact[] } => {
    switch (debState) {
        case 0:
            return {
                message: "ORIGINAL",
                children: project.children,
            }

        case 50:
            return {
                message: "DEBLOAT_DIRECT",
                children: debloatDirect(project.children),
            }
        // code block

        case 100:
            return {
                message: "DEBLOAT_ALL",
                children: debloatAll(project.children, ["direct", "transitive"]),
            }
        // code block

        default:
            return {
                message: "ORIGINAL",
                children: project.children,
            }

    }
}