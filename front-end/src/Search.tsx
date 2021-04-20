import React, { useState, useEffect } from 'react';
import { Row, Col, Input, Button, message } from 'antd';
import { v4 as uuidv4 } from 'uuid';
import logo from 'src/img/depCleanLogo.svg';
import { ProjectOutlined, UserOutlined, SearchOutlined } from '@ant-design/icons';
import { Link } from "react-router-dom";
import { debounce } from 'lodash';
import { getData } from 'src/utils/dataFetch';
import { createProject } from 'src/utils/dataRetrieve';
import { artifact } from 'src/interfaces/interfaces'
import { useAppState } from "src/AppStateContext";
import { useHistory } from 'react-router-dom';
import { StatusMessage } from 'src/Components/ScanStatusMessage';

export const Search = () => {

    let history = useHistory();
    const { dispatch, state } = useAppState();
    const { filteredBloated } = state;

    const [user, setUser] = useState("skyscreamer")
    const [project, setProject] = useState("JSONassert")
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [size, setSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight
    });

    useEffect(() => {
        function handleResize() {
            setSize({
                width: window.innerWidth,
                height: window.innerHeight
            })
        }
        window.addEventListener('resize', handleResize)
    })

    const onChangeSearch = debounce((text: string) => {
        const reg = /\s+/g;
        setUser(text.replace(reg, ''));
    }, 900);

    const onChangeProject = debounce((text: string) => {
        const reg = /\s+/g;
        setProject(text.replace(reg, ''));
    }, 900);

    const onClick = () => {
        setLoading(true);
        setError(false);
        getData(user, project)
            .then((response: any) => {
                setLoading(false);
                const project: artifact = createProject(response.data);
                //reset the filters first
                dispatch({ type: "RESET_FILTERS", payload: null })
                //replace the current project for the new one
                dispatch({ type: "LOAD_LOCAL_FILE", payload: project });
                //
                dispatch({ type: "SELECT_BLOAT", payload: filteredBloated });
                //navigate to the view page
                //navigate to the view page
                dispatch({ type: "SET_MESSAGE", payload: "ORIGINAL" });

                history.push("/result/RD/lrd/0111111111");
            })
            .catch((error) => {
                message.error(`Could not DepClean this`);
                setLoading(false);
                setError(true);
                if (error.response) {
                    // When response status code is out of 2xx range 
                    console.log(error.response.data)
                    console.log(error.response.status)
                    console.log(error.response.headers)
                } else if (error.request) {
                    // When no response was recieved after request was made
                    console.log(error.request)
                } else {
                    // Error
                    console.log(error.message)
                }
            })
    }

    //show that is loading FUNNY MESSAGE
    //on dismoutn cancel the call
    //after the call is done it should load got to the viz
    //not found then it should send an error



    const messages = ["DepCleaning project, it can take up to 2 minutes", "Checking project in Git hub", "Downloading project from Github", "Installing DepClean", "Running Depclean"]
    const userInfo = user === "" ? <span className="unHighlight">{"<user>"}</span> : <span className="color-green">{user}</span>
    const projectInfo = project === "" ? <span className="unHighlight">{"<project>"}</span> : <span className="color-green">{project}</span>
    const statusMessage = loading || error ?
        <StatusMessage
            statusMessages={messages}
            errorMessage={"Could not DepClean this project"}
            status={(error === false) ? "loading" : "error"}
        /> : <></>;

    return (
        <Row id="search"
            key={uuidv4()}
            style={{ width: size.width, height: size.height, backgroundColor: "white" }}
            justify="center"
            align="middle">

            <Col span={13} className="flex flex-list p-xl flex-justify-center">
                <img src={logo} alt="DepClean" width="250" height="auto" className="margin-auto" />
                <div className="spacer-h spacer-h-l"></div>
                <p>Bloated dependencies are libraries that the build tool packages with the
                application’s compiled code but that are actually not necessary to build and run the application.
                </p>
                <p>
                    DepClean analyses the presence of bloated dependencies in Maven artifacts. Paste your project url and discover debloated dependencies in your project
                </p>

                <div className="flex flex-center flex-justify-center main-url">
                    <p>{`https://github.com/`}{userInfo}/{projectInfo}</p>
                </div>
                {statusMessage}
                <div className="spacer-h spacer-h-m"></div>
                <div>

                    <Input.Group>
                        <Row gutter={8} justify="center" align="middle">
                            <Col span={8}>
                                <Input disabled={false} size="large" onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChangeSearch(e.target.value)} placeholder={user === "" ? "user" : user} maxLength={20} prefix={<UserOutlined />} />
                            </Col>
                            <Col span={8}>

                                <Input disabled={false} size="large" onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChangeProject(e.target.value)} placeholder={project === "" ? "project" : project} maxLength={20} prefix={<ProjectOutlined />} />
                            </Col>
                            <Button
                                onClick={(e) => onClick()}
                                loading={loading}
                                type="primary"
                                disabled={user !== "" && project !== "" ? false : true}
                                className="button btn-green mid-size margin-auto"
                                icon={<SearchOutlined />} size="large">
                                DepClean project
                                </Button>
                        </Row>
                    </Input.Group>
                </div>
                <div className="spacer-h spacer-h-m"></div>
                <div className="flex flex-center flex-justify-center">
                    <span className="text-center text-small"></span>
                    <Link className="text-small link-green underline-text" to={"/scan"}>Scan a DepClean json file</Link>
                </div>


            </Col>
        </Row>
    )
}