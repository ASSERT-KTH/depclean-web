
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
}