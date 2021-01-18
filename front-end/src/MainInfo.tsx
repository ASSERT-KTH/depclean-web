import React from "react";
import { Col, Slider } from 'antd';
import { Message } from 'src/Message';
import { useAppState } from "./AppStateContext"
import { ExclamationCircleOutlined } from '@ant-design/icons';

export const MainInfo = () => {
    //get the main state
    const { state, dispatch } = useAppState();
    //Get all the nodes
    const { debloatNum, filteredBloated } = state;
    //GET THE INFORMATIN


    const tittle = state.project.artifactId;
    const version = state.project.version;

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

    const onChange = (value: number) => {
        dispatch({ type: "DEBLOAT_PROJECT", payload: value })
        //
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
                <div className="pull-left slider-theme">
                    <span className="tittle"><ExclamationCircleOutlined /> Debloat artifacts</span>
                    <Slider
                        style={{ width: 300 }}
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