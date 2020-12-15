import { sampleJson } from './sampleJason';
import * as d3 from 'd3';
import { artifact, reportI, artifactResume } from 'src/interfaces/interfaces'
import { getAllTransitive } from 'src/utils/message';

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

//reportMap is the objecto witht the report interface
//a is an artifact
const countDirectBloated = (reportMap: any, a: any) => {
    const direct = a.type === "direct" ? reportMap.direct + 1 : reportMap.direct;
    const inherited = a.type === "inherited" ? reportMap.inherited + 1 : reportMap.inherited;
    const transitive = a.type === "transitive" ? reportMap.transitive + 1 : reportMap.transitive;
    return {
        ...reportMap,
        direct: direct,
        inherited: inherited,
        transitive: transitive
    }
}

const countBloated = (reportMap: any, a: any) => {
    const direct = a.type === "direct" && a.status === "bloated" ? reportMap.direct + 1 : reportMap.direct;
    const inherited = a.type === "inherited" && a.status === "bloated" ? reportMap.inherited + 1 : reportMap.inherited;
    const transitive = a.type === "transitive" && a.status === "bloated" ? reportMap.transitive + 1 : reportMap.transitive;
    return {
        ...reportMap,
        direct: direct,
        inherited: inherited,
        transitive: transitive
    }
}

//send a report of the project
export const getReport = (project: artifact): artifactResume => {
    const dependencies = [...project.children, ...getAllTransitive(project.children)]
    const normalReport: reportI = dependencies.reduce(countDirectBloated, {
        direct: 0,
        inherited: 0,
        transitive: 0
    })

    const bloatedReport: reportI = dependencies.reduce(countBloated, {
        direct: 0,
        inherited: 0,
        transitive: 0
    })

    return {
        tittle: project.artifactId,
        id: 0,
        version: project.version,
        normalReport: normalReport,
        depcleanRport: bloatedReport,
        data: project,
    }
}



