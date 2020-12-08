import * as d3 from 'd3';
// import { isConstructorDeclaration } from 'typescript';
import { v4 as uuidv4 } from 'uuid';


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

//Creates a new type that includes depClean
export const getNodesWithDepCategory = (nodes: any): object[] => {
    return nodes.map((d: any) => {
        d.data.dependencyUsage = `${d.data.status} - ${d.data.type}`;
        return d;
    })
}

//return the basic root info
export const getRootInfo = (root: any): object[] => {
    let info: object[] = [];
    //get all the nodes but remove the father
    const nodes = root.descendants().splice(1).filter((d: any) => d.data.type !== "omitted" && d.data.type !== "test");
    let dependencies: number = 0;
    let groupId: string[] = [];
    let size: number = 0;

    nodes.forEach((n: any) => {
        //add node group id if it does not exist in the groupId array
        if (!groupId.includes(n.data.groupId)) groupId.push(n.data.groupId);
        //add the size of the node
        size = size + n.data.size;
        //add the dependency if it is not omitted
        if (n.data.type !== "Omitted") dependencies = dependencies + 1;
    });
    info.push({
        name: "Dependencies",
        num: dependencies
    });
    info.push({
        name: "GroupID",
        num: groupId.length
    });
    info.push({
        name: "size",
        num: d3.format(".2f")(size)
    });
    return info;
}


//Gets the root and returns all the information needed form it
export const getTreeInfo = (root: any): object[] => {
    let infoArr: object[] = [];
    const info: object = {
        name: "Depth",
        num: root.height
    }
    infoArr.push(info);

    return infoArr;
}

//Counts all the dependencies
//returns an array with the dependencies name and number
export const countDependencies = (nodes: any): object[] => {
    let dependencies: any = {};
    let depArr = [];
    nodes.forEach((d: any) => {
        const type = d.data.type;

        if (dependencies[type] === undefined && type !== "Parent") {
            dependencies[type] = 1;
        } else if (type !== "Parent") {
            dependencies[type]++;
        }
    })

    for (let key in dependencies) {
        depArr.push({
            name: key,
            num: dependencies[key]
        })
    }

    return depArr;
}



export const countBloated = (nodes: any): object[] => {

    let dependencies: any = {};
    let depArr = [];
    nodes.forEach((d: any) => {

        const type = d.data.type;
        const status = d.data.status;

        if (dependencies[type] === undefined && status === "bloated") {
            dependencies[type] = 1;
        } else if (status === "bloated") {
            dependencies[type]++;
        }
    })

    for (let key in dependencies) {
        depArr.push({
            name: key,
            num: dependencies[key]
        })
    }
    return depArr;
}

//get a depClean pom.XML and filter it according to the type array
//filter if they are bloated
//if filterType includes the type of the artifact
//and if status == bloated
export const highlightBloat = (data: artifact[], filterType: string[]): artifact[] => {
    const unFiltered = data.map((node: artifact) => {
        node.highlight = filterType.includes(node.type) && node.status === "bloated";
        node.children = highlightBloat(node.children, filterType)
        return node;
    });
    return unFiltered;
}
//get a depClean pom.XML and filter it according to the type array
export const filterByType = (data: artifact[], filterType: string[]): artifact[] => {
    //if the node is filtered then stop and return
    // if(!filterType.includes(data.type) return;
    const unFiltered = data.map((node: artifact) => {
        node.visible = filterType.includes(node.type);
        node.children = node.visible ? filterByType(node.children, filterType) : setValueToChildren(node.children, "visible", node.visible)
        return node;
    });
    return unFiltered;
}
//set
const setValueToChildren = (data: artifact[], field: "highlight" | "visible", value: boolean): artifact[] => {
    return data.map((node: artifact) => {
        node[field] = value;
        node.children = setValueToChildren(node.children, field, value);
        return node;
    });
}

//clones a project 
export const cloneProject = (project: artifact) => {
    const _ = require('lodash');
    return _.cloneDeep(project);
}

export const getTreeHierarchy = (data: artifact, accessor: any) => {
    return d3.hierarchy(data, accessor);;
}


//Gets a json and returns a node array formated for the ANT tree structure
export const formatTree = (project: any) => {
    const obj = project.map((d: any) => {
        const name = "+-" + d.coordinates;
        const key = uuidv4();
        const children = d.children;
        let n = {
            title: name,
            key: key,
            children: children.length > 0 ? formatTree(children) : [],
        }
        return n;
    });
    return obj;
}

//Returns an color generator according to the color selected
export const getColorGenerator = (colorSelected: string, data: string[]) => {
    switch (colorSelected) {
        case "color-type":
            return d3.scaleOrdinal(["#30611E", "#98BC8B", "#7EBEE9", "#EAD17A"]);
        case "color-artifact-id":
            const total = data.length;
            const colors = data.map((d: string, i: number) => {
                return d3.interpolateSpectral(i / total);
            })
            return d3.scaleOrdinal()
                .domain(data)
                .range(colors);
        default:
            return d3.scaleOrdinal(d3.schemeCategory10);
    }
}

//Returns an color data accessor according to the color selected
export const getColorDataAccessor = (colorSelected: string) => {
    switch (colorSelected) {
        case "color-type":
            return ((d: any): string => d.data.type);
        case "color-artifact-id":
            return ((d: any): string => { return d.data.groupId });
        default:
            return ((d: any): string => d.data.type);
    }
}

export const getArtifactsId = (nodes: d3.HierarchyRectangularNode<unknown>[]): string[] => {
    //CREATE THE OBJECT
    const countCategories = (categoryArr: any, node: any) => {
        const dId = node.data.groupId;
        return categoryArr.includes(dId) ? categoryArr : [...categoryArr, dId];
    }
    //GET ALL THE CATEGORIES AND COUNTED ITEMS
    return nodes.reduce(countCategories, [])
}