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



    return (
        <Row id="search"
            key={uuidv4()}
            style={{ width: size.width, height: size.height, backgroundColor: "white" }}
            justify="center" align="middle"
        >
            <Col span={12} >
                <img src={logo} alt="DepClean" width="250" height="auto" />
                <p>Bloated dependencies are libraries that the build tool packages with the
                application’s compiled code but that are actually not necessary to build and run the application.
                </p>

                <p>
                    DepClean analyses the presence of bloated dependencies in Maven artifacts. Paste your project url and discover debloated dependencies in your project
                </p>

                <div>
                    <p>
                        {`https://github.com/`}
                        <span>
                            {user}
                        </span>
                        /
                        <span>
                            {project}
                        </span>
                    </p>
                </div>

                <Input.Group>
                    <Row gutter={8} justify="center">
                        <Col span={8}>
                            <Input size="large" placeholder="user" maxLength={20} prefix={<UserOutlined />} />
                        </Col>
                        <Col span={8}>
                            <Input size="large" placeholder="project" maxLength={20} prefix={<ProjectOutlined />} />

                        </Col>
                    </Row>
                </Input.Group>

                <Button type="primary" icon={<SearchOutlined />} size="large">
                    Depclean project
                </Button>

                <p><span>OR</span></p>

                <div>
                    <Link to={"/scan"}>Scan a decpclean json file</Link>
                </div>

            </Col>
        </Row>
    )
}