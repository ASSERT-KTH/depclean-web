import React, { useState, useEffect } from 'react';
import { Tabs, Col } from 'antd';
import { TreeMap } from './TreeMap';
import { useAppState } from "./AppStateContext";
import { Chart } from './Chart';
import { getRootInfo, mapNodeWithDepCategory, filterUnkown, filterOmittedTest } from "./utils/treeAccess";
import * as d3 from 'd3';
const { TabPane } = Tabs;

export const DependenceProvency = () => {

    //get the main state
    const { state } = useAppState();
    const { filtered } = state;
    //get all the inforation
    const rootInfo: any[] = getRootInfo(filtered);

    const dName: string = `Dependency Usage tree (${rootInfo[0].num})`;
    const gName: string = `Group Id (${rootInfo[1].num})`;
    const sName: string = `Size ${rootInfo[2].num}Mb`;

    const nodesDep = filtered
        .descendants()
        .filter(filterOmittedTest)
        .splice(1)
        .map(mapNodeWithDepCategory)
        .filter(filterUnkown);

    // const nodesDep = getNodesWithDepCategory(nodesFiltered.splice(1)).filter((d: any) => d.type !== "unknown" && d.status !== "unkown");
    const colorUsage = d3.interpolate("red", "blue")
    const colorGroupId = d3.scaleOrdinal(d3.schemeCategory10);

    const [dimensions, setDimensions] = useState({
        width: window.innerWidth,
        height: 600,
        marginTop: 50,
        marginRight: 50,
        marginBottom: 50,
        marginLeft: 50,
        boundedHeight: 600 - 50 - 50,
        boundedWidth: window.innerWidth * 0.9,
    });

    useEffect(() => {
        function handleResize() {
            setDimensions({
                width: window.innerWidth,
                height: 600,
                marginTop: 50,
                marginRight: 50,
                marginBottom: 50,
                marginLeft: 50,
                boundedHeight: 600 - 50 - 50,
                boundedWidth: window.innerWidth * 0.9,
            })
        }
        window.addEventListener('resize', handleResize)
    })

    //accessor for the SIZE
    const sizeAccesor = (d: any) => d.size;
    const dataHierarchy = filtered
        .sum(sizeAccesor)
    // .sort((a: any, b: any) => b.size - a.size)
    // .sort((a: any, b: any) => b.value - a.value)

    return (
        <Col span="24">
            <Tabs defaultActiveKey="1" centered>
                <TabPane tab={dName} key="1">
                    {/* VISUALIZTION DEPENDENCIES CHART */}
                    <Chart
                        nodes={nodesDep}
                        dimensions={dimensions}
                        category={"dependencyUsage"}
                        labelY={"Artifacts"}
                        colorInterpolator={colorUsage}
                        numTicks={5}
                    />
                </TabPane>
                <TabPane tab={gName} key="2">
                    {/* VISUALIZTION GROUP ID */}
                    <Chart
                        nodes={nodesDep}
                        dimensions={dimensions}
                        category={"groupId"}
                        labelY={"Artifacts"}
                        colorInterpolator={colorGroupId}
                        numTicks={5}
                    />
                </TabPane>
                <TabPane tab={sName} key="3">
                    {/* VISUALIZTION SIZE */}
                    <TreeMap
                        data={dataHierarchy}
                        dimensions={dimensions}

                    />
                </TabPane>
            </Tabs>
        </Col>
    )
}