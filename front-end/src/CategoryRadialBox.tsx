import React from 'react';
import { Radio } from 'antd';
import { useAppState } from "./AppStateContext";
import { v4 as uuidv4 } from 'uuid';

interface radialBox {
    label: string,
    value: string
}

interface categoryProps {
    tittle: string,
    children: radialBox[]
}

export const CategoryRadialBox = ({
    tittle,
    children
}: React.PropsWithChildren<categoryProps>) => {
    //get the main state
    const { state, dispatch } = useAppState();
    //Get all the nodes
    const {
        colorSelected
    } = state;

    function onChange(e: any) {
        dispatch({ type: "SELECT_COLOR", payload: e.target.value })
    };

    const radiobtn = children.map((d: any) => {
        return (
            <Radio value={d.value} key={uuidv4()} >
                {d.label}
            </Radio>)
    })

    return (
        <div>
            <h4>{tittle}</h4>
            <Radio.Group
                onChange={onChange}
                value={colorSelected}
                className="flex-list">
                {radiobtn}
            </Radio.Group>
        </div>
    )
}