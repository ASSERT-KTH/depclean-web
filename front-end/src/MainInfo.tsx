import React from "react";
import { Col, Slider } from 'antd';
import { DataGroup } from './DataGroup';
import { useAppState } from "./AppStateContext"
import { countDependencies, countBloated } from "./utils/treeAccess";
import { ExclamationCircleOutlined } from '@ant-design/icons';

export const MainInfo = () => {
    //get the main state
    const { state } = useAppState();
    //Get all the nodes
    const { filtered } = state;
    //GET THE INFORMATIN
    const descent = filtered.descendants();
    const dependencyInfo = countDependencies(descent);
    const bloatedInfo = countBloated(descent);

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
    return (
        <Col span={20} offset={2}>
            <div className="flex flex-enter margin-20 " >
                <div>
                    <h1 >
                        {tittle} <span className="version-num">{version}</span>
                    </h1>
                    <div className="flex">
                        <DataGroup
                            tittle="Dependencies"
                            dataInfo={dependencyInfo}
                            theme="dependencies"

                        />
                        <DataGroup
                            tittle="Bloated"
                            dataInfo={bloatedInfo}
                            theme="bloated"
                        />

                    </div>
                </div>
                <div className="pull-left slider-theme">
                    <span className="tittle"><ExclamationCircleOutlined /> Debloat artifacts</span>
                    <Slider
                        style={{ width: 300 }}
                        marks={marks}
                        step={50}
                        defaultValue={0}
                        tooltipVisible={false}

                    />
                </div>
            </div>

        </Col>
    )
}