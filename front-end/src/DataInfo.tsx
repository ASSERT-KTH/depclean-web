import React from 'react';
import { v4 as uuidv4 } from 'uuid';

interface DataProps {
    quantity: number,
    name: string,
    theme: string
}

export const DataInfo = ({
    quantity,
    name,
    theme
}: React.PropsWithChildren<DataProps>) => {


    return (
        <div key={uuidv4()} className={"dataInfo " + theme}>
            <span >
                {quantity}
            </span>
            {name}
        </div>
    )
}