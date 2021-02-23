import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import { providersKey } from 'src/interfaces/interfaces';

interface legendGroup {
    colorPallete: any,
    rectSize?: number,
    groupIds: providersKey[]
}
//color pallete
export const LegendGroup = ({
    colorPallete,
    rectSize,
    groupIds
}: React.PropsWithChildren<legendGroup>) => {

    return <>
        <span>Total providers: {groupIds.length}</span>
        {groupIds.map((groupId: providersKey) => {
            return <div
                key={uuidv4()}
                className="flex color-ratio">
                <div ><svg width={rectSize} height={rectSize}><rect width={rectSize} height={rectSize} fill={colorPallete(groupId.name)} /></svg></div>
                <span style={{ display: "block" }}>({groupId.nodeNames.length}) {groupId.name}</span>
            </div>
        })}
    </>
}