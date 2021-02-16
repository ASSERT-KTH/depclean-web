import React, { useState, useEffect } from 'react';
import { Row, message } from 'antd';
import { v4 as uuidv4 } from 'uuid';
import { createProject, projectIsValid, getReport } from 'src/utils/dataRetrieve';
import { artifact, artifactResume } from 'src/interfaces/interfaces'
import { Project } from 'src/Components/ScanProject';
import { useAppState } from "src/AppStateContext";
import { PackageLoader } from 'src/PackageLoader';

interface packageI {
    packages: artifact | undefined
    resume: artifactResume | undefined
}

export const Scan = () => {

    const { dispatch } = useAppState();
    const [packages, setPackages] = useState<packageI>({ packages: undefined, resume: undefined })

    const [size, setSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight
    });

    //UPADTE THE SIZE OF THEC OMPONENT
    useEffect(() => {
        function handleResize() {
            setSize({
                width: window.innerWidth,
                height: window.innerHeight
            })
        }
        window.addEventListener('resize', handleResize)
    })

    const handleDropAccepted = ([file]: [any]) => {
        const reader: FileReader = new FileReader()
        reader.onload = () => {
            try {
                const json = JSON.parse(reader.result as string)
                //format the data to an artifact type
                const project: artifact = createProject(json);
                //check i f the project is valid
                // eslint-disable-next-line no-throw-literal
                if (projectIsValid(project) === false) throw "Invalid Json format";
                const report = getReport(project);

                dispatch({ type: "SET_MESSAGE", payload: "ORIGINAL" });
                //set the packages and the report
                //navigate to the view page

                setPackages({
                    ...packages,
                    packages: project,
                    resume: report
                })
            } catch (err) {
                handleDropRejected();
                console.error(err)
            }
        }

        try {
            reader.readAsBinaryString(file)
        } catch (err) {
            console.error(err)
            handleDropRejected();
        }
    }

    const handleDropRejected = () => {
        message.error(`Could not parse the depclean POM.json file`);
    }

    return (
        <Row id="search"
            key={uuidv4()}
            style={{ width: size.width, height: size.height, backgroundColor: "white" }}
            justify="center"
            align="middle">

            {packages.packages === undefined ?
                <PackageLoader handleDropAccepted={handleDropAccepted} handleDropRejected={handleDropRejected} /> :
                packages.resume !== undefined ?
                    <Project data={packages.resume} /> : <></>}
        </Row>
    )
}


