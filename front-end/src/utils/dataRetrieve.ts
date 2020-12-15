import { sampleJson } from './sampleJason';
import * as d3 from 'd3';

function resolveData() {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(sampleJson[4]);
        }, 500);
    });
}

export async function fetchData() {
    const result = await resolveData();
    console.log(result);
}
interface ResponseData {
    features: any[];
}
//Interface for an artifact in the POM XML
interface artifact {
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


export const createProject = (data: any): artifact => {

    const project: artifact = {
        coordinates: data.coordinates,
        groupId: data.groupId,
        artifactId: data.artifactId,
        version: data.version,
        scope: data.scope,
        packaging: data.packaging,
        omitted: data.omitted === "true" ? true : false,
        classifier: data.classifier,
        parent: data.parent,
        size: data.size === null ? 0 : parseFloat(data.size),
        status: data.status === "unknown" || data.status === "used" ? "used" : "bloated",
        type: data.type === "unknown" ? "parent" : data.type,
        children: data.children.map((p: any) => {
            return createProject(p);
        }),
        highlight: false,
        visible: true,
    }
    return project;
}

// const getSize = (d: any) => {
//     const getSize = ((size: number, node: any) => {
//         return node.size === null ? size : size + parseFloat(node.size);
//     })
//     return d.reduce(getSize, 0);
// }


//load the data from a file
//give the proper format to the json 
export async function fetchFromFile(fileName: string) {
    const url = './files/' + fileName;
    return await d3.json<ResponseData>(url);
}

//check if an artifact has all the valid structure
export const projectIsValid = (project: artifact) => {
    return project.coordinates === undefined ||
        project.groupId === undefined ||
        project.artifactId === undefined ||
        project.version === undefined ||
        project.scope === undefined ||
        project.packaging === undefined ||
        project.omitted === undefined ||
        project.size === undefined ||
        project.status === undefined ||
        project.type === undefined ||
        project.artifactId === undefined ? false : true
}



