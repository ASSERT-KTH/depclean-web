import React from "react";
import { Menu, Layout } from 'antd';
import { GithubFilled, BranchesOutlined } from '@ant-design/icons'
// import { v4 as uuidv4 } from 'uuid';
import { useHistory } from 'react-router-dom';
import logo from './img/depCleanLogo.svg';

const { Header } = Layout;
// const { Search } = Input;

export const MainMenu = () => {
    let history = useHistory();

    const handleClick = (e: any) => {
        switch (e.key) {
            case "home":
                history.push("/");
                break;
            case "gallery":
                history.push("/gallery");
                break;
            case "about":
                history.push("/about");
                break;
            case "git":
                window.open("https://github.com/castor-software/depclean", "_blank");
                // window.location.href = '';
                break;

            default:
                history.push("/");
                break;
        }
    }


    return (
        < Header >
            <div className="logo" />

            <Menu
                theme="light"
                mode="horizontal"
                defaultSelectedKeys={['1']}
                onClick={handleClick}
                style={{
                    display: 'flex',
                    justifyContent: 'center'
                }}
            >

                <Menu.Item key={"home"}>
                    <img src={logo} alt="DepClean" width="150" height="auto" />
                </Menu.Item>
                <Menu.Item key={"gallery"}>Gallery</Menu.Item>
                <Menu.Item key={"about"}>About</Menu.Item>


                <Menu.Item key={"add"} style={{ marginLeft: "auto" }}><BranchesOutlined />DepClean a project</Menu.Item>
                <Menu.Item key={"git"} >
                    <GithubFilled style={{ fontSize: '18px' }} />
                </Menu.Item>

            </Menu>
        </Header >
    )
}


