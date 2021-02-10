import React from 'react';
import { Button } from 'antd';
import { FilterOutlined } from '@ant-design/icons'
import { useAppState } from "src/AppMenuStateContext";

export const FilterButton = () => {
    //get the main state
    const { menuState, menuDispatch } = useAppState();
    const { viewFilter } = menuState;

    return (
        <Button
            className="filterButton"
            type={"dashed"}
            onClick={() => menuDispatch({ type: "VIEW_FILTER", payload: !viewFilter })}>
            <FilterOutlined rotate={viewFilter ? 90 : 0} />
            Filter
        </Button>)
}