import React from "react";
import { Col, Slider } from 'antd';
import { Message } from 'src/Message';
import { useAppState } from "./AppStateContext";
import { truncateString } from "src/utils/stringManipulation";
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { filterTypeAndDeleted, mapNodeWithDepCategory } from "./utils/treeAccess";
import { Chart } from 'src/Chart';
import { marks, dimensions } from 'src/Components/mainInfo';

export const MainInfo = () => {
    //get the main state
    const { state, dispatch } = useAppState();
    const { debloatNum, filteredBloated, filtered } = state;

    //all nodes without the parent, ommited 
    const nodesDep = filtered
        .descendants()
        .filter(filterTypeAndDeleted)
        .map(mapNodeWithDepCategory)

    //GET THE INFORMATIN
    const tittle = truncateString(state.project.artifactId, 35);
    const version = state.project.version;

    //on change slider debloat project and select debloat
    const onChange = (value: number) => {
        dispatch({ type: "DEBLOAT_PROJECT", payload: value })
        dispatch({ type: "SELECT_BLOAT", payload: filteredBloated });
        dispatch({ type: "FILTER_ALL", payload: null });
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
                        numTicks={3}
                        tooltipPos={"BOTTOM"}
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