import React from 'react';
import { Button } from 'antd';
import { FilterOutlined } from '@ant-design/icons'
import { useAppState } from "src/AppMenuStateContext";
import { v4 as uuidv4 } from 'uuid';

export const FilterButton = () => {
    //get the main state
    const { menuState, menuDispatch } = useAppState();
    const { viewFilter } = menuState;

    return <>
        {viewFilter ? <Button
            key={uuidv4()}
            className="filterButton"
            type={"dashed"}
            onClick={() => menuDispatch({ type: "VIEW_FILTER", payload: !viewFilter })}>
            <FilterOutlined rotate={viewFilter ? 90 : 0} />
            View Filter
        </Button> : <></>}
    </>

}