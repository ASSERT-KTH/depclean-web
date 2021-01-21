// import * as d3 from 'd3';
import { formatFileSize } from 'src/Components/tooltip';
import { artifact } from 'src/interfaces/interfaces';


export const getGeneralReport = (project: artifact) => {

    //MAIN DEPENDENCIES
    const artifactChildren: artifact[] = project.children;
    const direct: artifact[] = artifactChildren
        .filter(filterDeleted(false))
        .filter(filterChildren("direct"));
    const inherited: artifact[] = artifactChildren
        .filter(filterDeleted(false))
        .filter(filterChildren("inherited"));
    const nodes: artifact[] = getAllTransitive(project.children)
        .filter(filterDeleted(false))
        .filter(removeOmmited)
    //COUNT USED
    const directUsed: artifact[] = direct
        .filter(filterBloated("direct", "used"))
    const transitiveUsed: artifact[] = nodes
        .filter(filterBloated("transitive", "used"))
    const inheritedUsed: artifact[] = artifactChildren
        .filter(filterBloated("inherited", "used"))
    //COUNT BLOATED
    const directBloated: artifact[] = direct
        .filter(filterBloated("direct", "bloated"))
    const transitiveBloated: artifact[] = nodes
        .filter(filterBloated("transitive", "bloated"))
    const inheritedBloated: artifact[] = artifactChildren
        .filter(filterBloated("inherited", "bloated"))

    //inherited transitive blaoted
    //TOTAL SIZE
    const treeTotalSize = [project, ...direct, ...inherited, ...nodes]
        .reduce(treeSize, 0)

    return {
        dependencies: {
            title: "Used",
            direct: {
                name: "direct",
                num: directUsed.length
            },
            inherited: {
                name: "inherited",
                num: inheritedUsed.length,
            },
            transitive: {
                name: "transitive",
                num: transitiveUsed.length
            }
        },
        bloated: {
            title: "Bloated",
            direct: {
                name: "direct",
                num: directBloated.length
            },
            transitive: {
                name: "transitive",
                num: transitiveBloated.length
            },
            inherited: {
                name: "inherited",
                num: inheritedBloated.length
            },

        },
        size: {
            title: "Project size",
            totalSize: {
                name: "",
                num: formatFileSize(treeTotalSize, 2)
            }
        }
    }

}

export const getDeletedDirectReport = (project: artifact) => {
    //get the direct deleted
    //MAIN DEPENDENCIES
    const artifactChildren: artifact[] = project.children;
    const direct: artifact[] = artifactChildren
        .filter(filterDeleted(true))
        .filter(filterChildren("direct"));
    //get the transitive from the deleted direct
    const nodes: artifact[] = getAllTransitive(direct)
        .filter(filterDeleted(true))
        .filter(removeOmmited)

    //TOTAL SIZE
    const treeTotalSize = [...direct, ...nodes]
        .reduce(treeSize, 0)
    //return report
    return {
        deleted: {
            title: "Delete",
            direct: {
                name: "direct",
                num: direct.length
            },
            transitive: {
                name: "transitive",
                num: nodes.length
            },
            size: {
                title: "Project size",
                totalSize: {
                    name: "",
                    num: formatFileSize(treeTotalSize, 2)
                }
            }
        }
    }
}

export const getAllDeletedReport = (project: artifact) => {
    //get the direct deleted
    //MAIN DEPENDENCIES
    const artifactChildren: artifact[] = project.children;
    const direct: artifact[] = artifactChildren
        .filter(filterDeleted(true))
        .filter(filterChildren("direct"));
    //get the transitive from the deleted direct
    const nodes: artifact[] = getAllTransitive(project.children)
        .filter(filterDeleted(true))
        .filter(removeOmmited)

    //TOTAL SIZE
    const treeTotalSize = [...direct, ...nodes]
        .reduce(treeSize, 0)

    //return report
    return {
        deleted: {
            title: "Delete",
            direct: {
                name: "direct",
                num: direct.length
            },
            transitive: {
                name: "transitive",
                num: nodes.length
            },
            size: {
                title: "Project size",
                totalSize: {
                    name: "",
                    num: formatFileSize(treeTotalSize, 2)
                }
            }
        }
    }
}

//Filter all the nodes that match a TYPE
const filterChildren = (type: "parent" | "direct" | "omitted" | "transitive" | "inherited") => (node: artifact) => node.type === type;

const filterBloated = (type: "parent" | "direct" | "omitted" | "transitive" | "inherited", status: "used" | "bloated") => (node: artifact) => node.type === type && node.status === status

const filterDeleted = (deleted: boolean) => (node: artifact) => node.deleted === deleted;

const removeOmmited = (node: artifact) => node.type !== "omitted";

const treeSize = (size: number, artifact: any) => size + artifact.size;

export const filterEmpty = (d: any) => d.num > 0;

//get all the  children from a list of artifacts
export const getAllTransitive = (artifacts: any) => {
    const reduceTransitive = (transitiveArr: any, artifact: any) => {
        const innerChilds = getAllTransitive(artifact.children)
        return [...transitiveArr, ...artifact.children, ...innerChilds].flat()
    }
    return artifacts.reduce(reduceTransitive, [])
}