import { CopyOutlined, ExportOutlined } from '@ant-design/icons';
import { Button, message } from 'antd';
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
            <Button
                key={uuidv4()}
                className="copyButton"
                type={"dashed"}
                onClick={copyURL}
            >
                <CopyOutlined />
            </Button>
            <div className="space-w" key={uuidv4()} />
            <Button
                key={uuidv4()}
                className="exportImage"
                type={"dashed"}
            // onClick={() => console.log(hola))}
            >
                <ExportOutlined />

            </Button>
            <textarea

                key={uuidv4()}
                className="invisibleDisplay"
            // value="Example copy for the textarea."
            // onChange={() => console.log("modify")}
            />
        </div>
    )
}