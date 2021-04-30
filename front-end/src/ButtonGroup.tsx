import { CopyOutlined, ExportOutlined } from '@ant-design/icons';
import { Button, message, Tooltip } from 'antd';
import React from 'react';
import { FilterButton } from 'src/FilterButton';
import { v4 as uuidv4 } from 'uuid';
import copy from 'copy-to-clipboard';
import { useParams, useLocation } from "react-router-dom";
import { ResultType } from './interfaces/interfaces';
import { getStateNumber } from './Components/appStateContext';
import { useAppState } from './AppStateContext';
import { exportComponentAsJPEG } from 'react-component-export-image';


interface bottomGroupI {
    componentRef: React.RefObject<HTMLInputElement>
}

export const ButtonGroup = ({ componentRef }: React.PropsWithChildren<bottomGroupI>) => {
    const location = useLocation();

    const { id } = useParams<ResultType>();
    const { state } = useAppState();
    const { messageState, filteredDependencies, filteredBloated, viewLinks, viewOmitted, colorSelected } = state;

    const copyURL = () => {
        const menuState = getStateNumber(messageState, filteredDependencies, filteredBloated, viewLinks, viewOmitted, colorSelected);
        console.log(location.pathname)
        copy(`https://castor-software.github.io/depclean-web#/result/LD/${id}/${menuState}`);
        message.success(`The project URL has been copied to the clipboard`);
    }

    const exportImage = () => {
        exportComponentAsJPEG(componentRef, { fileName: "depClean" })
        message.success(`Your visualization has been exported as an image`);
    }


    return (
        <div id="ButtonGroup">
            <FilterButton />
            <div className="space-w" key={uuidv4()} />
            <Tooltip placement="top" title={"Copy Project's URL"}>
                <Button
                    key={uuidv4()}
                    className="copyButton"
                    type={"dashed"}
                    onClick={copyURL}
                >
                    <CopyOutlined />
                </Button>
            </Tooltip>
            <div className="space-w" key={uuidv4()} />
            <Tooltip placement="top" title={"Export image"}>

                <Button
                    key={uuidv4()}
                    className="exportImage"
                    type={"dashed"}
                    onClick={exportImage}
                >
                    <ExportOutlined />

                </Button>
            </Tooltip>
        </div>
    )
}