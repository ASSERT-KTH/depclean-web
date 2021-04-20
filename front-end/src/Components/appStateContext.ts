import { hierarchy } from 'd3';
import { flink as data } from 'src/utils/dataDummy';
import { childrenAccessor } from 'src/accessors/treeAccessors';
import { cloneProject, debloatAll, debloatDirect } from "src/utils/treeAccess";
import { AppState, artifact, colortype } from 'src/interfaces/interfaces';
// import { filter } from 'lodash';

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

export const getMessageStateNumber = (message: "ORIGINAL" | "DEBLOAT_DIRECT" | "DEBLOAT_ALL"): string => {
    switch (message) {
        case "ORIGINAL":
            return `0`

        case "DEBLOAT_DIRECT":
            return `1`
        // code block

        case "DEBLOAT_ALL":
            return `2`;
        // code block

        default:
            return `0`
    }
}

const getColorStateNumber = (color: colortype): string => {
    switch (color) {
        case "NONE":
            return `0`

        case "DEPENDENCY_TYPE":
            return `1`
        // code block

        case "USAGE_RATIO":
            return `2`;
        // code block
        case "GROUP_ID":
            return `3`;

        default:
            return `0`
    }
}

const getNumberExistingNum = (original: string[], copy: string[]): string => {
    return original.map((el: string, i: number): number => copy.includes(el) ? 1 : 0)
        .join('');
}

export const getStateNumber = (message: "ORIGINAL" | "DEBLOAT_DIRECT" | "DEBLOAT_ALL", filteredDependencies: string[], filteredBloated: string[], viewLinks: boolean, viewOmitted: boolean, colorSelected: colortype) => {

    const msgNum: string = getMessageStateNumber(message);
    const usedDNum: string = getNumberExistingNum(dependCheckGroup, filteredDependencies);
    const bloatDNum: string = getNumberExistingNum(bloatedCheckGroup, filteredBloated);
    const linkNum: string = viewLinks ? `1` : `0`;
    const omitNum: string = viewOmitted ? `1` : `0`;
    const colorNum: string = getColorStateNumber(colorSelected)

    return `${msgNum}${usedDNum}${bloatDNum}${linkNum}${omitNum}${colorNum}`
}