import React, { useState, useEffect } from 'react';
import { Row, Col, Input, Button } from 'antd';
import { v4 as uuidv4 } from 'uuid';
import logo from 'src/img/depCleanLogo.svg';
import { ProjectOutlined, UserOutlined, SearchOutlined } from '@ant-design/icons';
import {
    Link,
} from "react-router-dom";

export const Search = () => {
    const [size, setSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight
    });

    const [user, setUser] = useState("")
    const [project, setProject] = useState("")


    const onChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        console.log(value)
        setUser(value);
        // const reg = /^-?\d*(\.\d*)?$/;
        // if ((!isNaN(value) && reg.test(value)) || value === '' || value === '-') {
        //   this.props.onChange(value);
        // }
    };

    useEffect(() => {
        function handleResize() {
            setSize({
                width: window.innerWidth,
                height: window.innerHeight
            })
        }
        window.addEventListener('resize', handleResize)
    })

    const userInfo = user === "" ? <span className="unHighlight">{"<user>"}</span> : <span>{user}</span>
    const projectInfo = project === "" ? <span className="unHighlight">{"<project>"}</span> : <span>{project}</span>


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
                <div>

                    <Input.Group>
                        <Row gutter={8} justify="center" align="middle">
                            <Col span={8}>
                                <Input size="large" placeholder="user" maxLength={20} prefix={<UserOutlined />} />
                            </Col>
                            <Col span={8}>
                                <Input size="large" placeholder="project" maxLength={20} prefix={<ProjectOutlined />} />

                            </Col>
                            <Button type="primary" className="button btn-green mid-size margin-auto" icon={<SearchOutlined />} size="large">Depclean project</Button>
                        </Row>
                    </Input.Group>
                </div>
                <div className="spacer-h spacer-h-m"></div>
                <div className="flex flex-center flex-justify-center">
                    <span className="text-center text-small"></span>
                    <Link className="text-small link-green underline-text" to={"/scan"}>Scan a decpclean json file</Link>
                </div>


            </Col>
        </Row>
    )
}