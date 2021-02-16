import React from 'react';
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

    const data = dataInfo.map((item: any) => {
        return item.num === 0 ? <></> : (
            <DataInfo
                quantity={item.num}
                name={item.name}
                theme={theme}
                key={uuidv4()}
            />
        )
    })

    return <div style={{ marginRight: "20px" }} className={theme}>
        {dataInfo.length === 0 ? <></> :
            <>
                <h3>{tittle}</h3>
                <div className="flex" key={uuidv4()}>
                    {data}
                </div>
            </>}
    </div>

}

