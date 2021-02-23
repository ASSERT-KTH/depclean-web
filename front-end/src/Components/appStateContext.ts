import { hierarchy } from 'd3';
import { flink as data } from 'src/utils/dataDummy';
import { childrenAccessor } from 'src/accessors/treeAccessors';
import { cloneProject } from "src/utils/treeAccess";
import { AppState } from 'src/interfaces/interfaces';

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

    colorSelected: "NONE",
    viewOmitted: false,
    viewLinks: true,

    debloatNum: 0,
    textDisplay: viewText,
    messageState: "ORIGINAL",
}
