import React from 'react';
import { Tooltip } from './vizUtils/tooltip';
import { useToolTipAppState } from "src/AppToolTipStateContext";

export const ToolTipContainer = () => {
    const { toolTipState } = useToolTipAppState();
    const { toolTipValue, toolTipPos, toolTipOpacity } = toolTipState;

    return <>
        <Tooltip value={toolTipValue} position={toolTipPos} opacity={toolTipOpacity} display={"LEFT"} />
    </>
}