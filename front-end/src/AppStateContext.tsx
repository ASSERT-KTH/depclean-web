import React, { createContext, useReducer, useContext, useState } from "react";
import {
    filterArtifacts, getTreeHierarchy, cloneProject,
    highlightBloat, debloatDirect, debloatAll,
    filterArifactByType
} from "src/utils/treeAccess";
// import { fetchFromFile } from './utils/dataRetrieve';
import { artifact, AppState, Action, AppStateContextProps, } from 'src/interfaces/interfaces';
import { hierarchy } from 'd3';
import { childrenAccessor } from 'src/accessors/treeAccessors';
import { dependCheckGroup, bloatedCheckGroup, scopeCheckGroup, appData, filterByArray, getMessageAndFiltered } from 'src/Components/appStateContext';


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
            const newNodes = hierarchy(action.payload, childrenAccessor);
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

        case "RESET_FILTERS": {
            return {
                ...state,
                filteredDependencies: dependCheckGroup,
                filteredBloated: bloatedCheckGroup,
                colorSelected: "DEPENDENCY_TYPE",
                filteredScope: scopeCheckGroup,
                viewOmitted: true,
                debloatNum: 0,
            }
        }

        case "FILTER_ALL": {
            const filteredProject: artifact = cloneProject(state.filteredProject);
            filteredProject.children = filterArifactByType(state.filteredProject.children, state.filteredScope, state.filteredDependencies, "used");
            filteredProject.children = filterArifactByType(state.filteredProject.children, state.filteredScope, state.filteredBloated, "bloated");
            return {
                ...state,
                filteredProject: filteredProject,
                filtered: getTreeHierarchy(filteredProject, childrenAccessor)
            }
        }
        case "VIEW_OMITTED": {
            return {
                ...state,
                viewOmitted: action.payload
            }
        }
        case "VIEW_LINKS": {
            return {
                ...state,
                viewLinks: action.payload
            }
        }
        case "SET_MESSAGE": {
            return {
                ...state,
                messageState: action.payload
            }
        }
        case "DEBLOAT_PROJECT": {

            let messageState: "ORIGINAL" | "DEBLOAT_DIRECT" | "DEBLOAT_ALL" = "ORIGINAL";
            const projectDebloated: artifact = cloneProject(state.project);

            const { message, children } = getMessageAndFiltered(action.payload, projectDebloated)
            messageState = message;
            projectDebloated.children = children;

            const filteredDebloated = getTreeHierarchy(projectDebloated, childrenAccessor);


            return {
                ...state,
                debloatNum: action.payload,
                filteredProject: projectDebloated,
                filtered: filteredDebloated,
                messageState: messageState
            }
        }
        case "SET_MENU_STATE": {
            const newProject: artifact = action.payload.artifact;
            const newFilteredProject: artifact = cloneProject(newProject);
            //MODIFY USED DEPENDENCIES
            const usedParam: boolean[] = [action.payload.menuState[1], action.payload.menuState[2], action.payload.menuState[3]]
            const newUsedDep: string[] = dependCheckGroup.filter(filterByArray(usedParam))
            newFilteredProject.children = filterArifactByType(newFilteredProject.children, state.filteredScope, newUsedDep, "used");
            //MODIFY BLOATED DEPENDENCIES
            const bloatedParam: boolean[] = [action.payload.menuState[4], action.payload.menuState[5], action.payload.menuState[6]]
            const newBloatedDep: string[] = bloatedCheckGroup.filter(filterByArray(bloatedParam))
            newFilteredProject.children = filterArifactByType(newFilteredProject.children, state.filteredScope, newBloatedDep, "bloated");


            let messageState: "ORIGINAL" | "DEBLOAT_DIRECT" | "DEBLOAT_ALL" = "ORIGINAL";
            const { message, children } = getMessageAndFiltered(action.payload.menuState[0], newFilteredProject)
            messageState = message;
            newFilteredProject.children = children;

            const newNodes = hierarchy(newFilteredProject, childrenAccessor);

            return {
                ...state,
                project: newProject, //NEW PROJECT
                filteredProject: newFilteredProject,//NEW PROJECT
                filteredDependencies: newUsedDep,
                filteredBloated: newBloatedDep,
                viewLinks: action.payload.menuState[7],
                viewOmitted: action.payload.menuState[8],
                nodes: newNodes,
                filtered: newNodes,
                colorSelected: action.payload.menuState[9],
                messageState: messageState,
                debloatNum: action.payload.menuState[0],
            }
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
    const [viewMenu, setViewMenu] = useState(false);
    return (
        <AppStateContext.Provider value={{ state, dispatch, viewMenu, setViewMenu }}>
            {children}
        </AppStateContext.Provider>
    )
}