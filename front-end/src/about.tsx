import React from 'react';
import { Row, Col } from 'antd';

export const About = () => {

    return (

        <div className="site-layout-content">
            <Row>
                <Col span="12"
                    offset={6}
                >
                    <h1>DepClean</h1>
                    <p>DepClean is a tool to automatically remove dependencies that are included in your Java dependency tree but are not actually used in the project's code. DepClean detects and removes all the unused dependencies declared in the pom.xml file of a project or imported from its parent. For that, it relies on bytecode static analysis and extends the maven-dependency-analyze plugin (more details on this plugin). DepClean does not modify the original source code of the application nor its original pom.xml. It can be executed as a Maven goal through the command line or integrated directly into the Maven build lifecycle.</p>

                    <h2>How does it work?</h2>
                    <p>DepClean runs before executing the package phase of the Maven build lifecycle. It statically collects all the types referenced in the project under analysis as well as in its declared dependencies. Then, it compares the types that the project actually use in the bytecode with respect to the class members belonging to its dependencies.</p>
                    <p>With this usage information, DepClean constructs a new pom.xml based on the following steps:</p>
                    <ol>
                        <li>add all used transitive dependenciaes as direct dependencies</li>
                        <li>remove all unused direct dependencies</li>
                        <li>exclude all unused transitive dependencies</li>
                    </ol>
                </Col>
            </Row>
        </div>

    )
}