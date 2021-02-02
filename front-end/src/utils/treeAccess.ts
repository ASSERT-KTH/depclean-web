
import * as d3 from 'd3';
// import { isConstructorDeclaration } from 'typescript';
import { v4 as uuidv4 } from 'uuid';
import { artifact, colorPallete } from 'src/interfaces/interfaces';
import { formatFileSize } from 'src/Components/tooltip';
// import { getNodes } from 'src/utils/TreeToArray';
//Creates a new type that includes depClean
export const getNodesWithDepCategory = (nodes: any): object[] => {
    return nodes.map((d: any) => {
        d.data.dependencyUsage = d.data.type + "-" + d.data.status;
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

export const filterArifactByType = (data: artifact[], scopeType: string[], filter: string[], type: "used" | "bloated") => {
    const unFiltered = data.map((node: artifact) => {
        //two cases
        //Do not filter if is is in the filter and has the type
        //if it is not in the filter and has the type
        node.visible = filter.includes(node.type) === true && node.status === type ? true :
            filter.includes(node.type) === false && node.status === type ? false : node.visible;
        node.children = filterArifactByType(node.children, scopeType, filter, type);
        return node;
    });
    return unFiltered;
}


export const filterArtifacts = (data: artifact[], scopeType: string[], filterType: string[]): artifact[] => {

    //if the node is filtered then stop and return
    // if(!scopeType.includes(data.type) return;
    const unFiltered = data.map((node: artifact) => {
        node.visible = scopeType.includes(node.scope) && filterType.includes(node.type);
        node.children = node.visible ? filterArtifacts(node.children, scopeType, filterType) : setValueToChildren(node.children, "visible", node.visible)
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
            deleted: d.deleted,
        }
        return n;
    });
    return obj;
}

export const reduceChildren = (children: [], node: any) => {
    const nodeChildren = node.children.reduce(reduceChildren, [])
    return [...children, node, ...nodeChildren]
}
export const filterDeleted = (deleted: boolean) => {
    return (d: any) => d.deleted === deleted;
}
export const mapKey = (d: any) => d.key;

//DIFFERENT COLOR GENERATORS
const noColor = () => {
    // // const data: any = nodes;
    // const extent: any = d3.extent(data, (node: any) => node.depth);
    // const colorGenerator = d3.scaleOrdinal()
    //     .domain(extent)
    //     .range(["#64C19A", "#2F4858"]);
    // return (val: number) => colorGenerator(val.toString());
    return "#64C19A"
}
const noLinkColor = (d: any) => "#eef3f6";

const linkBloatedColor = (d: any) => {
    return d.data.status === "bloated" ? "#FFD8D8" : "#eef3f6"
};

export const getLinkColorGenerator = (colorSelected: "NONE" | "DEPENDENCY_TYPE" | "USAGE_RATIO" | "GROUP_ID") => {
    switch (colorSelected) {
        case "DEPENDENCY_TYPE":
            return linkBloatedColor;
        default:
            return noLinkColor;
    }
}


export const dependencyPallete: colorPallete[] = [
    {
        tittle: "direct-used",
        color: "#006AD2"
    },
    {
        tittle: "direct-bloated",
        color: "#F8514A"
    },
    {
        tittle: "transitive-used",
        color: "#9ACAFF"
    },
    {
        tittle: "transitive-bloated",
        color: "#F05D00"
    },
    {
        tittle: "inherited-used",
        color: "#F3EED9"
    },
    {
        tittle: "inherited-bloated",
        color: "#FFE5DD"
    }
]
//returns a color depending on the artifact type
export const dependencytypeColor = (type: string) => {
    switch (type) {
        case "parent-used":
            return "#006AD2";
        case "direct-used":
            return "#006AD2";
        case "transitive-used":
            return "#9ACAFF";
        case "inherited-used":
            return "#F3EED9";
        case "direct-bloated":
            return "#F8514A";
        case "transitive-bloated":
            return "#F05D00";
        case "inherited-bloated":
            return "#FFE5DD";
        default:
            return "#000000";
    }
}

export const ratioColor: colorPallete[] = [
    {
        tittle: "0%",
        color: "#F05D00"
    },
    {
        tittle: "100%",
        color: "#006AD2"
    }
]
const usageRagioColor = (nodes: any) => {
    // const data: any = nodes.slice(1);
    const max: any = 1;//d3.max(data, (node: any) => node.data.usageRatio)

    return (val: number) => {

        switch (val) {
            case -1:
                return ratioColor[1].color;
            case undefined:
                return "grey";

            default:
                const col = d3.scaleOrdinal()
                    .domain([0, max])
                    .range([ratioColor[0].color, ratioColor[1].color]);
                return col(val.toString());
        }
    }

}

const getUniqueArray = (data: any) => {
    const groupId: string[] = data.map((d: any) => d.data.groupId);
    return Array.from(new Set(groupId))
}

const groupIDColor = (data: any) => {
    //get array with unique d.data.groupId
    const groupIds = getUniqueArray(data);

    //make the calculus according to that
    const total: any = groupIds.length - 1;
    const colors = groupIds.map((d: string, i: number) => {
        return d3.interpolateSpectral(i / total);
    })
    return d3.scaleOrdinal()
        .domain(groupIds)
        .range(colors);
}

//Returns an color generator according to the color selected
export const getCGenerator = (colorSelected: string, nodes: any) => {
    switch (colorSelected) {
        case "NONE":
            return noColor;
        case "DEPENDENCY_TYPE":
            return dependencytypeColor;
        case "USAGE_RATIO":
            return usageRagioColor(nodes);
        case "GROUP_ID":
            return groupIDColor(nodes);
        default:
            return noColor;
    }
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

//returns color depending on type
export const getColorByType = (type: string) => {
    switch (type) {
        case 'parent':
            return "#30611E";
        case 'direct':
            return "#98BC8B";
        case 'omitted':
            return "#30611E";
        case 'transitive':
            return "#7EBEE9";
        case 'inherited':
            return "#EAD17A";
        default:
            return "#30611E";
    }
}

//Returns an color data accessor according to the color selected
export const getColorDataAccessor = (colorSelected: string) => {
    switch (colorSelected) {
        case "NONE":
            return ((d: any): string => d.depth);
        case "DEPENDENCY_TYPE":
            return ((d: any): string => {

                return d.data.type + "-" + d.data.status
            });
        case "USAGE_RATIO":
            return ((d: any): string => d.data.usageRatio);
        case "GROUP_ID":
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

//hightlight all the direct dependencies and all its transitive that are bloated
export const debloatDirect = (children: artifact[]): artifact[] => {
    //get all the direct bloated
    const artifacts = children.map((d: artifact) => {
        //  d.status === "bloated" && d.type === "direct"
        const isBloated = d.status === "bloated" && d.type === "direct";
        // d.highlight = false;
        d.deleted = isBloated;
        d.children = isBloated ? debloatTransitive(d.children) : d.children;
        return d;
    })
    return [...artifacts]
}

const debloatTransitive = (children: artifact[]): artifact[] => {
    const artifacts = children.map((d: artifact) => {
        const isBloated = d.status === "bloated" && d.type === "transitive" ? true : false;
        // d.highlight = false;
        d.deleted = isBloated;
        d.children = debloatTransitive(d.children);
        return d;
    })
    return [...artifacts];
}

//get a depClean pom.XML and filter it according to the type array
//filter if they are bloated
//if filterType includes the type of the artifact
//and if status == bloated
export const deleteBloat = (data: artifact[], filterType: string[]): artifact[] => {
    const unFiltered = data.map((node: artifact) => {
        const isDebloated = filterType.includes(node.type) && node.status === "bloated";
        node.highlight = isDebloated;
        node.deleted = isDebloated;
        node.children = deleteBloat(node.children, filterType)
        return node;
    });
    return unFiltered;
}

export const debloatAll = (data: artifact[], filterType: string[]): artifact[] => {
    const unFiltered = data.map((node: artifact) => {
        const isBloated = filterType.includes(node.type) && node.status === "bloated";
        node.highlight = isBloated;
        node.deleted = isBloated;
        const filteredChildren = node.children.filter((d: artifact) => filterType.includes(node.type))
        const filteredInherited = node.children.filter((d: artifact) => node.type === "inherited")
        node.children = [...filteredInherited, ...deleteBloat(filteredChildren, filterType)]
        return node;
    });
    return unFiltered;
}



//get the toal size of a tree
export const getTreeSize = (nodes: any) => {
    const totalSize: number = d3.sum(nodes, (d: any) => d.data.size)
    return [{
        name: "",
        num: formatFileSize(totalSize, 2)
    }];
}


