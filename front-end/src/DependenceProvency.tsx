import React, { useState, useEffect } from 'react';
import { Tabs, Col } from 'antd';
import { TreeMap } from './TreeMap';
import { useAppState } from "./AppStateContext";
import { Chart } from './Chart';
import { getRootInfo, getNodesWithDepCategory } from "./utils/treeAccess";

const { TabPane } = Tabs;

export const DependenceProvency = () => {

    //get the main state
    const { state } = useAppState();
    //Get all the nodes
    const { filtered } = state;
    const rootInfo: any[] = getRootInfo(filtered);

    const dName: string = `Dependency Usage tree (${rootInfo[0].num})`;
    const gName: string = `Group Id (${rootInfo[1].num})`;
    const sName: string = `Size ${rootInfo[2].num}Mb`;
    const nodesFiltered = filtered.descendants().filter((d: any) => d.data.type !== "omitted" && d.data.type !== "test")
    const nodesDep = getNodesWithDepCategory(nodesFiltered.splice(1));


    const [dimensions, setDimensions] = useState({
        width: window.innerWidth,
        height: 500,
        marginTop: 50,
        marginRight: 50,
        marginBottom: 50,
        marginLeft: 50,
        boundedHeight: 500 - 50 - 50,
        boundedWidth: window.innerWidth * 0.9,
    });

    useEffect(() => {
        function handleResize() {
            setDimensions({
                width: window.innerWidth,
                height: 500,
                marginTop: 50,
                marginRight: 50,
                marginBottom: 50,
                marginLeft: 50,
                boundedHeight: 500 - 50 - 50,
                boundedWidth: window.innerWidth * 0.9,
            })
        }
        window.addEventListener('resize', handleResize)
    })

    //accessor for the SIZE
    const sizeAccesor = (d: any) => d.size;
    const dataHierarchy = filtered
        .sum(sizeAccesor)
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
                    />
                </TabPane>
                <TabPane tab={gName} key="2">
                    {/* VISUALIZTION GROUP ID */}
                    <Chart
                        nodes={nodesDep}
                        dimensions={dimensions}
                        category={"groupId"}
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