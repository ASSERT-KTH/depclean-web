import React from 'react';
import { Row, Col } from 'antd';
import { galleryData } from './utils/gallery'
import { Project } from "./Project";
import { v4 as uuidv4 } from 'uuid';

export const Gallery = () => {

    return (
        <div className="site-layout-content" id="gallery">
            <Row >
                <Col span="12"
                    offset={4}
                >
                    <div className="tittle">
                        <h1>DepClean project gallery</h1>
                        <p>How many artifacts are you not using in your project? How many are bloated and take space? Here are a couple of examples of some projects that we have runned DepClean to explore their dependencies</p>
                    </div>
                </Col>
            </Row>
            {galleryData.children.map((d: any) => {
                return <Project data={d} key={uuidv4()} />
            })}
        </div>
    )
}