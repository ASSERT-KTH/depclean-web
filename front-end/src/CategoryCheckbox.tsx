import React from 'react';
import { Checkbox } from 'antd';
import { v4 as uuidv4 } from 'uuid';

interface checkBox {
    label: string,
    value: string,
    checked: boolean
    disabled: boolean
}

interface categoryPros {
    tittle: string,
    children: checkBox[],
    checked: string[]
    onClick: any
}

export const CategoryCheckbox = ({
    tittle,
    children,
    checked,
    onClick
}: React.PropsWithChildren<categoryPros>) => {


    return (
        <div className="lateralMenu" key={uuidv4()}>
            <h4>{tittle}</h4>
            <Checkbox.Group
                key={uuidv4()}
                options={children}
                onChange={onClick}
                className="flex-list"
                value={checked}
            />
        </div>
    )
}