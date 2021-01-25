import React, { createContext, useReducer, useContext } from "react";
import {
    filterArtifacts, getTreeHierarchy, cloneProject,
    highlightBloat, debloatDirect, debloatAll,
    filterArifactByType
} from "./utils/treeAccess";
// import { fetchFromFile } from './utils/dataRetrieve';
import { artifact, AppState } from 'src/interfaces/interfaces';
import * as d3 from 'd3';
import { data } from 'src/utils/dataDummy';

interface AppStateContextProps {
    state: AppState,
    dispatch: React.Dispatch<Action>,
}

type Action =
    | {
        type: "SELECT_DEPENDENCY"
        payload: string[]
    }
    | {
        type: "SELECT_BLOAT"
        payload: string[]
    }
    | {
        type: "SELECT_VIEW"
        payload: string[]
    }
    | {
        type: "SELECT_SCOPE"
        payload: string[]
    }
    | {
        type: "SELECT_COLOR"
        payload: "NONE" | "DEPENDENCY_TYPE" | "USAGE_RATIO" | "GROUP_ID",
    }
    | {
        type: "LOAD_LOCAL_FILE"
        payload: any
    }
    | {
        type: "VIEW_DEPENDENCY_LIST"
        payload: boolean
    }
    | {
        type: "RESET_FILTERS"
        payload: null
    }
    | {
        type: "VIEW_OMITTED"
        payload: boolean
    }
    | {
        type: "DEBLOAT_PROJECT"
        payload: number
    }
    | {
        type: "HIDE_MENU"
        payload: boolean
    } | {
        type: "FILTER_USED_DEPENDENCIES"
        payload: string[]
    } | {
        type: "FILTER_BLOATED_DEPENDENCIES"
        payload: string[]
    }




//accessor to get the data
const childrenAccessor = (d: any) => d.children;
//Data state for all the application
const dependCheckGroup: string[] = ["direct", "transitive", "inherited"];
const bloatedCheckGroup: string[] = ["direct", "transitive", "inherited"];//"direct", "transitive", "inherited"

const viewText: string[] = ["groupid", "artifactid", "version"];
const nodes = d3.hierarchy(data, childrenAccessor);
const scopeCheckGroup: string[] = ["compile", "test", "provided", "runtime", "system"]

const appData: AppState = {

    project: data, //the original data only changes when you load a new project
    nodes: nodes, //all the nodes of the filtered project
    filteredProject: cloneProject(data),// is a copy of the projec which will be modified
    filtered: nodes,

    filteredDependencies: dependCheckGroup,
    filteredBloated: bloatedCheckGroup,
    filteredScope: scopeCheckGroup,

    textDisplay: viewText,
    colorSelected: "NONE",

    viewDependencyList: false,
    viewOmitted: true,

    debloatNum: 0,

    messageState: "ORIGINAL",

    hideMenu: true,
}


//REDUCER
const appStateReducer = (state: AppState, action: Action): AppState => {

    switch (action.type) {
        case "FILTER_USED_DEPENDENCIES": {
            //CLONE the filtered project
            //filter all the children necessary
            const filteredProject: artifact = cloneProject(state.filteredProject);
            filteredProject.children = filterArifactByType(state.filteredProject.children, state.filteredScope, action.payload, "used");
            return {
                ...state,
                filteredDependencies: action.payload,
                filteredProject: filteredProject,
                filtered: getTreeHierarchy(filteredProject, childrenAccessor)
            }
        }

        case "FILTER_BLOATED_DEPENDENCIES": {
            //CLONE the filtered project
            //filter all the children necessary
            const filteredProject: artifact = cloneProject(state.filteredProject);
            filteredProject.children = filterArifactByType(state.filteredProject.children, state.filteredScope, action.payload, "bloated");
            return {
                ...state,
                filteredBloated: action.payload,
                filteredProject: filteredProject,
                filtered: getTreeHierarchy(filteredProject, childrenAccessor)
            }
        }
        case "SELECT_DEPENDENCY": {
            //set the filters
            const filteredProject: artifact = cloneProject(state.filteredProject);
            filteredProject.children = filterArtifacts(state.filteredProject.children, state.filteredScope, action.payload);
            // state.filtered = getTreeHierarchy(filteredProject, childrenAccessor);
            return {
                ...state,
                filteredDependencies: action.payload,
                filteredProject: filteredProject,
                filtered: getTreeHierarchy(filteredProject, childrenAccessor)

            }
        }

        case "SELECT_BLOAT": {
            const filteredProject: artifact = cloneProject(state.filteredProject);
            filteredProject.children = highlightBloat(filteredProject.children, action.payload);
            // state.filtered = getTreeHierarchy(state.filteredProject, childrenAccessor);

            return {
                ...state,
                filteredBloated: action.payload,
                filteredProject: filteredProject,
                filtered: getTreeHierarchy(state.filteredProject, childrenAccessor)

            }
        }

        case "SELECT_SCOPE": {
            const filteredScope = [...action.payload, "provided", "runtime", "system"];
            const filteredProject: artifact = cloneProject(state.filteredProject);
            filteredProject.children = filterArtifacts(filteredProject.children, filteredScope, state.filteredDependencies);
            // state.filtered = getTreeHierarchy(state.filteredProject, childrenAccessor);

            return {
                ...state,
                filteredScope: filteredScope,
                filteredProject: filteredProject,
                filtered: getTreeHierarchy(state.filteredProject, childrenAccessor)

            }
        }

        case "SELECT_VIEW": {
            return {
                ...state,
                textDisplay: action.payload
            }
        }
        case "SELECT_COLOR": {
            return {
                ...state,
                colorSelected: action.payload
            }
        }
        case "LOAD_LOCAL_FILE": {
            // state.project = action.payload;
            // state.filteredProject = cloneProject(action.payload);
            const newNodes = d3.hierarchy(action.payload, childrenAccessor);
            // state.nodes = newNodes;
            // state.filtered = newNodes;
            return {
                ...state,
                project: action.payload,
                filteredProject: cloneProject(action.payload),
                nodes: newNodes,
                filtered: newNodes,
            }
        }
        case "VIEW_DEPENDENCY_LIST": {
            return {
                ...state,
                viewDependencyList: action.payload,
            }
        }
        case "RESET_FILTERS": {
            return {
                ...state,
                filteredDependencies: dependCheckGroup,
                filteredBloated: bloatedCheckGroup,
                colorSelected: "NONE",
                filteredScope: scopeCheckGroup,
                viewOmitted: true,
                debloatNum: 0,
            }
        }
        case "VIEW_OMITTED": {
            return {
                ...state,
                viewOmitted: action.payload
            }
        }
        case "DEBLOAT_PROJECT": {

            let messageState: "ORIGINAL" | "DEBLOAT_DIRECT" | "DEBLOAT_ALL" = "ORIGINAL";
            const projectDebloated: artifact = cloneProject(state.project);

            switch (action.payload) {
                case 0:
                    messageState = "ORIGINAL";
                    projectDebloated.children = state.project.children;
                    break;
                case 50:
                    messageState = "DEBLOAT_DIRECT";
                    projectDebloated.children = debloatDirect(projectDebloated.children);
                    // code block
                    break;
                case 100:
                    messageState = "DEBLOAT_ALL";
                    projectDebloated.children = debloatAll(projectDebloated.children, ["direct", "transitive"]);
                    // code block
                    break;
                default:
                    messageState = "ORIGINAL";
                // code block
            }

            const filteredDebloated = getTreeHierarchy(projectDebloated, childrenAccessor);


            return {
                ...state,
                debloatNum: action.payload,
                filteredProject: projectDebloated,
                filtered: filteredDebloated,
                messageState: messageState
            }
        }

        //HIDE OR SHOW THE MENU
        case 'HIDE_MENU':
            return {
                ...state,
                hideMenu: action.payload
            }
        default: {
            console.log("DEFAULT")
            return state
        }

    }
}

//A
const AppStateContext = createContext<AppStateContextProps>({} as AppStateContextProps);

//Retrieve the value from AppStateContext using
//usecontext hook and return the result
export const useAppState = () => {
    return useContext(AppStateContext);
}



export const AppStateProvider = ({ children }: React.PropsWithChildren<{}>) => {
    const [state, dispatch] = useReducer(appStateReducer, appData)
    return (
        <AppStateContext.Provider value={{ state, dispatch }}>
            {children}
        </AppStateContext.Provider>
    )
}