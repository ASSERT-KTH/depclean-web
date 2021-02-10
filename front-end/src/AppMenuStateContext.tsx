import React, { createContext, useReducer, useContext, useState } from "react";

interface AppState {
    viewFilter: boolean,
    viewDependencyList: boolean
}

export type Action =
    | {
        type: "VIEW_FILTER"
        payload: boolean
    }
    | {
        type: "VIEW_DEPENDENCY_LIST"
        payload: boolean
    }

interface AppStateContextProps {
    menuState: AppState,
    menuDispatch: React.Dispatch<Action>,
}

//APP INITIAL STATE
const appData: AppState = {
    viewFilter: true,
    viewDependencyList: false
}


//REDUCER
const appStateReducer = (state: AppState, action: Action): AppState => {

    switch (action.type) {
        case "VIEW_FILTER": {

            return {
                ...state,
                viewFilter: action.payload
            }
        }
        //HIDE OR SHOW THE MENU
        case 'VIEW_DEPENDENCY_LIST':
            return {
                ...state,
                viewDependencyList: action.payload
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



export const AppMenuStateProvider = ({ children }: React.PropsWithChildren<{}>) => {
    const [menuState, menuDispatch] = useReducer(appStateReducer, appData)
    return (
        <AppStateContext.Provider value={{ menuState, menuDispatch }}>
            {children}
        </AppStateContext.Provider>
    )
}