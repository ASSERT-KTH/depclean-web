export interface dimension {
    width: number,
    height: number,
    marginTop: number,
    marginRight: number,
    marginBottom: number,
    marginLeft: number,
    boundedHeight: number,
    boundedWidth: number,
}

export interface reportI {
    direct: number,
    inherited: number,
    transitive: number
}

export interface artifactResume {
    tittle: string,
    id: number,
    version: string,
    normalReport: reportI,
    depcleanRport: reportI
    data: artifact
}


export interface scanProjectI {
    tittle: string,
    id: number,
    version: string,
    img: string,
    normalReport: reportI,
    depCleanReport: reportI,
    description: string,
    project: artifact
}


//Interface for an artifact in the POM XML
export interface artifact {
    coordinates: string,
    groupId: string,
    artifactId: string,
    version: string,
    scope: "compile" | "provided" | "runtime" | "test" | "sytem" | "import" | "null",
    packaging: "jar" | "war"
    omitted: boolean,
    classifier: string,
    parent: string,
    size: number,
    status: "used" | "bloated"
    type: "parent" | "direct" | "omitted" | "transitive" | "inherited"
    children: artifact[],
    highlight: boolean,
    visible: boolean,
    deleted: boolean,
    allTypes: string[],
    usedTypes: string[],
    usageRatio: number,
}

export interface AppState {
    project: artifact,
    filteredProject: artifact,
    nodes: any,
    filtered: any,
    filteredDependencies: string[],
    filteredBloated: string[],
    colorSelected: colortype,
    textDisplay: string[],
    filteredScope: string[],
    viewOmitted: boolean
    debloatNum: number
    messageState: messageType,
    viewLinks: boolean
}

export interface colorPallete {
    tittle: string,
    color: string
}


export interface legendColorInterface {
    pallete: colorPallete[],
    tittle?: string
}

export interface report {
    direct: number,
    inherited: number,
    transitive: number
}

export interface project {
    tittle: string,
    id: number,
    version: string,
    cleanURL: string,
    gitURL: string,
    img: string,
    normalReport: report,
    depCleanReport: report,
    description: string,
}

export interface groupId {
    name: string,
    dependencies: number
}

export type Action =
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
        payload: colortype,
    }
    | {
        type: "LOAD_LOCAL_FILE"
        payload: any
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
        type: "VIEW_LINKS"
        payload: boolean
    }
    | {
        type: "DEBLOAT_PROJECT"
        payload: number
    }
    | {
        type: "FILTER_USED_DEPENDENCIES"
        payload: string[]
    } | {
        type: "FILTER_BLOATED_DEPENDENCIES"
        payload: string[]
    }
    | {
        type: "FILTER_ALL"
        payload: null
    }
    | {
        type: "SET_MESSAGE"
        payload: "ORIGINAL" | "DEBLOAT_DIRECT" | "DEBLOAT_ALL"
    }
    | {
        type: "SET_MENU_STATE"
        payload: newState
    }


export interface AppStateContextProps {
    state: AppState,
    dispatch: React.Dispatch<Action>,
    viewMenu: boolean
    setViewMenu: React.Dispatch<React.SetStateAction<boolean>>
}

export interface providersKey {
    name: string,
    nodeNames: string[]
}

export interface ResultType {
    id: string | undefined,
    appState: string | undefined,
    action: "LD" | "RD" | undefined
}
export type colortype = "NONE" | "DEPENDENCY_TYPE" | "USAGE_RATIO" | "GROUP_ID" | "TRANSPARENT";

export type messageType = "ORIGINAL" | "DEBLOAT_DIRECT" | "DEBLOAT_ALL";

export type MenuStateI = [
    0 | 50 | 100, //debloat state
    boolean, //dep UD
    boolean, //UT
    boolean, //UI
    boolean, //BD
    boolean, //BT
    boolean, //BI
    boolean, //RL
    boolean, //RO
    colortype]//Color

export interface newState {
    artifact: artifact,
    menuState: MenuStateI
}
