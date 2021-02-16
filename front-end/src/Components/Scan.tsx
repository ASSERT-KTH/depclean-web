import React, { useState, useEffect } from 'react';
import { Row, Col, message, Button } from 'antd';
import { v4 as uuidv4 } from 'uuid';
import { createProject, projectIsValid, getReport } from 'src/utils/dataRetrieve';
import { InboxOutlined } from '@ant-design/icons';
import Dropzone from 'react-dropzone';
import { artifact, artifactResume } from 'src/interfaces/interfaces'
import { Project } from 'src/Components/ScanProject';
import { useAppState } from "src/AppStateContext";

interface packageI {
    packages: artifact | undefined
    resume: artifactResume | undefined
}

export const Scan = () => {

    const { dispatch } = useAppState();

    const [size, setSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight
    });

    const [packages, setPackages] = useState<packageI>({ packages: undefined, resume: undefined })

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

    //
    const packageLoader =
        <Col span={12} >
            <div>
                <Dropzone
                    className="scan__dropzone"
                    onDropAccepted={handleDropAccepted}
                    onDropRejected={handleDropRejected}
                    multiple={false}
                    accept="application/json"
                // onDrop={(acceptedFiles: any) => console.log(acceptedFiles)}
                >
                    {({ getRootProps, getInputProps }: any) => (
                        <section className="">
                            <div {...getRootProps()} className="dropzone flex flex-list flex-center">
                                <input {...getInputProps()} />
                                <InboxOutlined className="icon-large" />
                                <p>Drag 'n' drop a file here </p>
                                <p>OR</p>
                                <Button type="primary" className="button btn-green" size={'large'}>
                                    click to upload file
                        </Button>

                            </div>
                        </section>
                    )}
                </Dropzone>
            </div>
        </Col>;


    // const loadAgain = packages.packages !== undefined ?
    //     <Col span={10}>
    //         <p style={{ textAlign: "center" }}>OR</p>
    //         <Dropzone
    //             className=""
    //             onDropAccepted={handleDropAccepted}
    //             onDropRejected={handleDropRejected}
    //             multiple={false}
    //             accept="application/json"
    //         >
    //             {({ getRootProps, getInputProps }: any) => (
    //                 <section className="">
    //                     <div {...getRootProps()} className="flex flex-list flex-center">
    //                         <input {...getInputProps()} />
    //                         <Button type="primary" className="button btn-green" size={'large'}>
    //                             click to upload file
    //             </Button>
    //                     </div>
    //                 </section>
    //             )}
    //         </Dropzone>
    //     </Col>
    //     : <></>;

    //dipslay when there is a project uploded
    const project = packages.resume !== undefined ?
        <Project data={packages.resume} /> : <></>;

    //select what to display if packages are undefined or not
    const content = packages.packages === undefined ?
        packageLoader : project;



    return (
        <Row id="search"
            key={uuidv4()}
            style={{ width: size.width, height: size.height, backgroundColor: "white" }}
            justify="center"
            align="middle"
        >
            {content}
            {/* {loadAgain} */}
        </Row>
    )
}


