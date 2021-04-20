import { CopyOutlined, ExportOutlined } from '@ant-design/icons';
import { Button, message, Tooltip } from 'antd';
import React from 'react';
import { FilterButton } from 'src/FilterButton';
import { v4 as uuidv4 } from 'uuid';
import copy from 'copy-to-clipboard';
import { useParams } from "react-router-dom";
import { ResultType } from './interfaces/interfaces';
import { getStateNumber } from './Components/appStateContext';
import { useAppState } from './AppStateContext';

export const ButtonGroup = () => {

    const { id } = useParams<ResultType>();
    const { state } = useAppState();
    const { messageState, filteredDependencies, filteredBloated, viewLinks, viewOmitted, colorSelected } = state;

    const copyURL = () => {
        const menuState = getStateNumber(messageState, filteredDependencies, filteredBloated, viewLinks, viewOmitted, colorSelected);
        copy(`http://localhost:3000/depclean-web#/result/LD/${id}/${menuState}`);
        message.success(`The project URL has been copied to the clipboard`);
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
                // onClick={() => console.log(hola))}
                >
                    <ExportOutlined />

                </Button>
            </Tooltip>
        </div>
    )
}