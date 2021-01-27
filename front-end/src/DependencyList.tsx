import React from 'react';
import { Tree, Button } from 'antd';
import { useAppState } from "./AppStateContext";
import { formatTree, reduceChildren, filterDeleted, mapKey } from "./utils/treeAccess";
import { PlusOutlined, MinusOutlined } from '@ant-design/icons'

export const DependencyList = () => {
    //get the main state
    const { state, dispatch } = useAppState();
    //Get all the nodes
    const { filteredProject, viewDependencyList } = state;
    const treeData = formatTree([filteredProject]);
    const selectedKeys = treeData[0].children
        .reduce(reduceChildren, [])
        .filter(filterDeleted(true))
        .map(mapKey)

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
                    showLine={false}
                    showIcon={false}
                    treeData={treeData}
                    height={500}
                    defaultExpandAll={true}
                    selectable={true}
                    multiple={true}
                    defaultSelectedKeys={selectedKeys}
                    selectedKeys={selectedKeys}
                // disabled={true}
                /> : ""}
        </div>
    )
}