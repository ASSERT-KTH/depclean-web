// import * as d3 from 'd3';
import { ArrowRightOutlined, ArrowUpOutlined } from '@ant-design/icons';
import React from 'react';
import { DataGroup } from 'src/DataGroup';
import { countDependencies, countBloated, getTreeSize } from "src/utils/treeAccess";
import { formatFileSize } from 'src/Components/tooltip';


export const getMainMessage = (filtered: any) => {
    const descent = filtered.descendants();
    const dependencyInfo = countDependencies(descent);
    const bloatedInfo = countBloated(descent);
    //get project size
    const sizeInfo = getTreeSize(descent);
    dependencyInfo.sort((a: any, b: any) => a.name.localeCompare(b.name))
    const message = bloatedInfo.length === 0 ?
        <div className="flex flex-center text-message">
            <div>No bloated dependencies!</div>
        </div> :
        <>

            <DataGroup
                tittle="Bloated"
                dataInfo={bloatedInfo}
                theme="bloated"
            />

            {/* <div className="flex flex-center text-message">
                <div>Debloat it maybe <ArrowUpOutlined /></div>
            </div> */}
        </>
    return (
        <>
            <DataGroup
                tittle="Dependencies"
                dataInfo={dependencyInfo}
                theme="dependencies"
            />

            {message}
            <DataGroup
                tittle="Project size"
                dataInfo={sizeInfo}
                theme="dependencies"
            />
        </>

    )
}

const countDirectBloated = (bloatedMap: any, artifact: any) => {
    const counter = artifact.status === "bloated" ? 1 : 0;
    return {
        ...bloatedMap,
        num: bloatedMap.num + counter
    }
}



//get all the  children from a list of artifacts
export const getAllTransitive = (artifacts: any) => {
    const reduceTransitive = (transitiveArr: any, artifact: any) => {
        console.log(artifact)
        const innerChilds = getAllTransitive(artifact.children)
        return [...transitiveArr, ...artifact.children, ...innerChilds].flat()
    }
    return artifacts.reduce(reduceTransitive, [])
}


//Filter all the direct debloated in a project
const filterDirectBloated = (d: any) => d.type === "direct" && d.status === "bloated";

const getUsedTransitive = ((artifact: any) => artifact.status === "used")
const getBloatedTranstive = ((artifact: any) => artifact.status === "bloated")

const addNumBloated = (projectInfo: any, type: string, numSubstract: number) => {
    let toModify = projectInfo.find((d: any) => d.name === type)
    toModify = {
        ...toModify,
        num: toModify.num + numSubstract
    }
    const others = projectInfo.filter((d: any) => d.name !== type);
    return [toModify, ...others];
}

const countSize = (size: { name: string, num: number }, artifact: any) => {
    const counter: number = size.num + artifact.size;
    return {
        ...size,
        name: "",
        num: counter
    }
}
const fomatSize = (node: any) => {
    node.num = formatFileSize(node.num, 2)
    return node;
}

const filterDirectUsed = (d: any) => {
    return d.type === "direct" && d.status === "used"
}

export const getDirectBloatedMessage = (filtered: any, project: any) => {
    //filter all the direct debloated
    const directDebloated = project.children.filter(filterDirectBloated);
    const directUsed = project.children.filter(filterDirectUsed);
    //get all the transitive in one array
    const allTransitive = getAllTransitive(directDebloated);
    const directChildren = getAllTransitive(directUsed)
    //get the transitive that are used
    const usedTransitive = allTransitive.filter(getUsedTransitive)
    const bloatedTransitive = allTransitive.filter(getBloatedTranstive)

    //get the size of the project
    const totalSize = [[project, ...directUsed, ...directChildren].reduce(countSize, { name: "", num: 0 })].map(fomatSize);

    //create the message for the direct bloated
    const bloatedDirectInfo = [directDebloated.reduce(countDirectBloated, { name: "direct", num: 0 })];
    //create the message for the transitive
    const bloatedTransitiveInfo = [bloatedTransitive.reduce(countDirectBloated, { name: "transitive", num: 0 })]
    //all the dependencies
    const descent = filtered.descendants();
    //remove the bloated form the project counter
    let dependencyInfo = countDependencies(descent);
    dependencyInfo = addNumBloated(dependencyInfo, "direct", -bloatedDirectInfo[0].num)
    dependencyInfo = usedTransitive.length > 0 ? addNumBloated(dependencyInfo, "direct", usedTransitive.length) : dependencyInfo;
    dependencyInfo = bloatedTransitive.length > 0 ? addNumBloated(dependencyInfo, "transitive", -bloatedTransitive.length) : dependencyInfo;
    dependencyInfo.sort((a: any, b: any) => a.name.localeCompare(b.name))

    let bloatedInfo = countBloated(descent);
    bloatedInfo = directDebloated.length > 0 ? addNumBloated(bloatedInfo, "direct", -directDebloated.length) : bloatedInfo;
    bloatedInfo = bloatedTransitive.length > 0 ? addNumBloated(bloatedInfo, "transitive", -bloatedTransitive.length) : bloatedInfo;
    bloatedInfo.sort((a: any, b: any) => a.name.localeCompare(b.name))

    const transitiveMessage = bloatedTransitiveInfo[0].num > 0 ? <>
        <div className="flex flex-center text-message">
            <div>You also<br></br>get rid of<ArrowRightOutlined /></div>
        </div>
        <DataGroup
            tittle="Bloated"
            dataInfo={bloatedTransitiveInfo}
            theme="bloated" />
    </> : <></>

    return (
        <>
            <div className="flex flex-center text-message">
                <div>If you<br></br>delete<ArrowRightOutlined /></div>

            </div>
            <DataGroup
                tittle="Bloated"
                dataInfo={bloatedDirectInfo}
                theme="bloated" />

            {transitiveMessage}
            <div className="flex flex-center text-message">
                <div>Now this<br></br>project has<ArrowRightOutlined /></div>
            </div>

            <DataGroup
                tittle="Dependencies"
                dataInfo={dependencyInfo}
                theme="dependencies" />


            <DataGroup
                tittle="Bloated"
                dataInfo={bloatedInfo}
                theme="bloated" />

            <DataGroup
                tittle="Project size"
                dataInfo={totalSize}
                theme="dependnecies" />
        </>

    )
}

const filterNonDebloatable = (artifact: any) => artifact.type !== "inherited" && artifact.type !== "omitted"

export const getAllBloatedMessage = (filtered: any, project: any) => {
    // filter first all the direct only //do not use inherited or omitted
    const directArtifacts = project.children.filter(filterNonDebloatable);
    //filter all the direct debloated
    const directDebloated = project.children.filter(filterDirectBloated);
    const directUsed = project.children.filter(filterDirectUsed);
    // get all the transitive in an flat array
    const allTransitive = getAllTransitive(directArtifacts);
    //get the transitive that are used
    const usedTransitive = allTransitive.filter(getUsedTransitive)
    const bloatedTransitive = allTransitive.filter(getBloatedTranstive)
    //create the message for the direct bloated
    const bloatedDirectInfo = [directDebloated.reduce(countDirectBloated, { name: "direct", num: 0 })];
    //create the message for the transitive
    const bloatedTransitiveInfo = [bloatedTransitive.reduce(countDirectBloated, { name: "transitive", num: 0 })]

    //get the size of the project
    const totalSize = [[project, ...directUsed, ...usedTransitive].reduce(countSize, { name: "", num: 0 })].map(fomatSize);

    //substract the results to the currentone

    //all the dependencies
    const descent = filtered.descendants();
    //remove the bloated form the project counter
    let dependencyInfo = countDependencies(descent);
    dependencyInfo = addNumBloated(dependencyInfo, "direct", -bloatedDirectInfo[0].num)
    dependencyInfo = usedTransitive.length > 0 ? addNumBloated(dependencyInfo, "direct", usedTransitive.length) : dependencyInfo;
    dependencyInfo = bloatedTransitive.length > 0 ? addNumBloated(dependencyInfo, "transitive", -bloatedTransitive.length) : dependencyInfo;
    dependencyInfo.sort((a: any, b: any) => a.name.localeCompare(b.name))

    let bloatedInfo = countBloated(descent);
    bloatedInfo = directDebloated.length > 0 ? addNumBloated(bloatedInfo, "direct", -directDebloated.length) : bloatedInfo;
    bloatedInfo = bloatedTransitive.length > 0 ? addNumBloated(bloatedInfo, "transitive", -bloatedTransitive.length) : bloatedInfo;
    bloatedInfo.sort((a: any, b: any) => a.name.localeCompare(b.name))
    return (
        <>
            <div className="flex flex-center text-message">
                <div>If you<br></br>delete<ArrowRightOutlined /></div>

            </div><DataGroup
                tittle="Bloated"
                dataInfo={[...bloatedDirectInfo, ...bloatedTransitiveInfo]}
                theme="bloated" />


            <div className="flex flex-center text-message">
                <div>Now this<br></br>project has<ArrowRightOutlined /></div>
            </div>

            <DataGroup
                tittle="Dependencies"
                dataInfo={dependencyInfo}
                theme="dependencies" />


            <DataGroup
                tittle="Bloated"
                dataInfo={bloatedInfo}
                theme="bloated" />

            <DataGroup
                tittle="Project size"
                dataInfo={totalSize}
                theme="dependnecies" />

        </>

    )
}
