
import React from 'react';
import { useAppState } from "./AppStateContext"
import { getMainMessage, getDirectBloatedMessage, getAllBloatedMessage } from 'src/utils/message';

export const Message = () => {
    //get the main state
    const { state } = useAppState();
    //Get all the nodes
    const { filtered, messageState, filteredProject } = state;
    //GET THE INFORMATIN

    const displayMessage = messageState === "ORIGINAL" ? getMainMessage(filtered) :
        messageState === "DEBLOAT_DIRECT" ? getDirectBloatedMessage(filtered, filteredProject) :
            messageState === "DEBLOAT_ALL" ? getAllBloatedMessage(filtered, filteredProject) : getMainMessage(filtered)

    return (
        <div className="flex flex-center flex-wrap margin-buttom-40 ">
            {displayMessage}
        </div>
    )
}



