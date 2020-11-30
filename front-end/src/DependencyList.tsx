import React from 'react';
import { Tree, Button } from 'antd';
import { useAppState } from "./AppStateContext";
import { formatTree } from "./utils/treeAccess";
import { PlusOutlined, MinusOutlined } from '@ant-design/icons'

export const DependencyList = () => {
    //get the main state
    const { state, dispatch } = useAppState();

    //Get all the nodes
    const { project, viewDependencyList } = state;
    const treeData = formatTree([project]);

    const onSelect = (selectedKeys: any, info: any) => {
        console.log('selected', selectedKeys, info);
    };

    const handleClick = () => {
        dispatch({ type: "VIEW_DEPENDENCY_LIST", payload: !viewDependencyList });
    }



    return (
        <div className="dependency-list">
            <div className="flex flex-center">
                <h3 style={{ margin: "0" }}>Dependency list</h3>
                <Button onClick={() => handleClick()} className="pull-left" icon={!viewDependencyList ? <PlusOutlined /> : <MinusOutlined />}></Button>
            </div>
            {viewDependencyList ?
                <Tree
                    showLine={true}
                    onSelect={onSelect}
                    treeData={treeData}
                    height={233}
                    defaultExpandAll={true}
                /> : ""}
        </div>
    )
}