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
    deleted: boolean
}

export interface AppState {
    project: artifact,
    filteredProject: artifact,
    nodes: any,
    filtered: any,
    filteredDependencies: string[],
    filteredBloated: string[],
    colorSelected: "color-type" | "color-artifact-id",
    textDisplay: string[],
    filteredScope: string[],
    viewDependencyList: boolean,
    viewOmitted: boolean
    debloatNum: number
    messageState: "ORIGINAL" | "DEBLOAT_DIRECT" | "DEBLOAT_ALL",
    hideMenu: boolean
}