import React from 'react';
import { Space } from 'antd';
import { DataInfo } from './DataInfo';
import { v4 as uuidv4 } from 'uuid';


interface DataGroupProps {
    tittle: string
    dataInfo: object[]
    theme: string
}


export const DataGroup = ({
    tittle,
    dataInfo,
    theme
}: React.PropsWithChildren<DataGroupProps>) => {
    const fdata = dataInfo.filter((d: any) => { return d.name !== "parent" && d.name !== "omitted" })
    const data = fdata.map((item: any) => {

        return (
            <DataInfo
                quantity={item.num}
                name={item.name}
                key={uuidv4()}
                theme={theme}
            />
        )
    })
    return (
        <div key={uuidv4()} style={{ marginRight: "20px" }} className={theme}>
            <h3>{tittle}</h3>
            <div className="flex">
                {data}
            </div>
        </div>
    )
}

