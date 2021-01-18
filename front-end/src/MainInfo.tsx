import React from "react";
import { Col, Slider } from 'antd';
import { Message } from 'src/Message';
import { useAppState } from "./AppStateContext";
import { truncateString } from "src/utils/stringManipulation";
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { getNodesWithDepCategory } from "./utils/treeAccess";
import { Chart } from 'src/Chart';
import * as d3 from 'd3';
import { dimension } from 'src/interfaces/interfaces'

export const MainInfo = () => {
    //get the main state
    const { state, dispatch } = useAppState();
    //Get all the nodes
    const { debloatNum, filteredBloated, filtered } = state;
    const nodesFiltered = filtered.descendants().filter((d: any) => d.data.type !== "omitted" && d.data.type !== "test" && d.data.deleted === false)

    const nodesDep = getNodesWithDepCategory(nodesFiltered.splice(1));
    const colorUsage = d3.interpolate("red", "blue")
    //GET THE INFORMATIN
    const tittle = truncateString(state.project.artifactId, 35);
    const version = state.project.version;

    const marginRight = 0;
    const marginLeft = 20;
    const marginTop = 15;
    const marginBottom = 15;
    const width = 400;
    const height = 70;

    const dimensions: dimension = {
        width: width,
        height: height,
        marginTop: marginTop,
        marginRight: marginRight,
        marginBottom: marginBottom,
        marginLeft: marginLeft,
        boundedHeight: height - marginTop + marginBottom,
        boundedWidth: width - marginRight + marginLeft,
    };

    const marks = {
        0: 'None',
        50: 'Direct',
        100: {
            style: {
                color: "hsla(119,38,56,1)",
                fontWeight: 600,
            },
            label: "All",
        },
    };

    //on change slider debloat project and select debloat
    const onChange = (value: number) => {
        dispatch({ type: "DEBLOAT_PROJECT", payload: value })
        dispatch({ type: "SELECT_BLOAT", payload: filteredBloated });
    };


    return (
        <Col span={22} offset={1}>
            <div className="flex flex-enter margin-20 " >
                <div>
                    <h1 >
                        {tittle}
                    </h1>
                    <span className="version-num">{version}</span>
                </div>
                <div className="pull-left">
                    <Chart
                        nodes={nodesDep}
                        dimensions={dimensions}
                        category={"dependencyUsage"}
                        labelY={"Artifacts"}
                        colorInterpolator={colorUsage}
                        numTicks={5}
                    />
                </div>
                <div className="pull-left slider-theme">
                    <span className="tittle"><ExclamationCircleOutlined /> Debloat artifacts</span>
                    <Slider
                        style={{ width: 150 }}
                        marks={marks}
                        step={50}
                        defaultValue={debloatNum}
                        value={debloatNum}
                        tooltipVisible={false}
                        onChange={onChange}
                    />




                </div>
            </div>
            <Message />


        </Col>
    )
}