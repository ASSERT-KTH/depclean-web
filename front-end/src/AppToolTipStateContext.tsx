import React, { createContext, useReducer, useContext } from "react";

interface position {
    x: number, y: number
}

interface AppState {
    toolTipValue: any,
    toolTipPos: position,
    toolTipOpacity: 0 | 1
}

export type Action =
    | {
        type: "UPDATE_INFO"
        payload: any
    }
    | {
        type: "UPDATE_POSITION"
        payload: { x: number, y: number }
    }
    | {
        type: "UPDATE_OPACITY"
        payload: 0 | 1
    }

interface AppStateContextProps {
    toolTipState: AppState,
    toolTipDispatch: React.Dispatch<Action>,
}

//APP INITIAL STATE
const appData: AppState = {
    toolTipValue: <div></div>,
    toolTipPos: { x: 0, y: 0 },
    toolTipOpacity: 0
}


//REDUCER
const appStateReducer = (state: AppState, action: Action): AppState => {

    switch (action.type) {
        case "UPDATE_INFO": {

            return {
                ...state,
                toolTipValue: action.payload
            }
        }
        //HIDE OR SHOW THE MENU
        case 'UPDATE_POSITION':
            return {
                ...state,
                toolTipPos: action.payload
            }
        case 'UPDATE_OPACITY':
            return {
                ...state,
                toolTipOpacity: action.payload
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
export const useToolTipAppState = () => {
    return useContext(AppStateContext);
}


export const AppToolTipStateProvider = ({ children }: React.PropsWithChildren<{}>) => {
    const [toolTipState, toolTipDispatch] = useReducer(appStateReducer, appData)
    return (
        <AppStateContext.Provider value={{ toolTipState, toolTipDispatch }}>
            {children}
        </AppStateContext.Provider>
    )
}