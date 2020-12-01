import React, { useState, useEffect } from 'react';
// import { LateralMenu } from './LateralMenu';
import { MainInfo } from './MainInfo';
import { Row, Col, Divider } from 'antd';
import { CategoryCheckbox } from './CategoryCheckbox';
import { CategoryRadialBox } from './CategoryRadialBox';
import { DependenceProvency } from './DependenceProvency';
import { HorizontalTree } from './HorizontalTree';
import { useAppState } from "./AppStateContext";
import { v4 as uuidv4 } from 'uuid';
import { DependencyList } from './DependencyList';

export const HomeViz = () => {
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

    //get the main state
    const { state, dispatch } = useAppState();
    //Get all the nodes
    const { filtered,
        filteredDependencies,
        filteredBloated,
        textDisplay,
    } = state;


    const dep = {
        tittle: "Dependencies",
        children: [
            { label: 'Direct', value: 'direct', disabled: true, checked: false },
            { label: 'Transitive', value: 'transitive', disabled: false, checked: true },
            { label: 'Inherited', value: 'inherited', disabled: false, checked: true },
        ]
    }

    const bloated = {
        tittle: "Bloated",
        children: [
            { label: "Direct", value: "direct", checked: true, disabled: false },
            { label: "Transitive", value: "transitive", checked: true, disabled: false },
            { label: "Inherited", value: "inherited", checked: true, disabled: false }
        ]
    }

    const colorOptions = {
        tittle: "Color by",
        children: [
            { label: "Type", value: "color-type" },
            { label: "Artifact Id", value: "color-artifact-id" },
            { label: "N° nodes", value: "color-group-nodes" },
        ]
    }

    const view = {
        tittle: "Label",
        children: [
            { label: "GroupId", value: "direct", checked: true, disabled: false },
            { label: "ArtifactId", value: "omitted", checked: true, disabled: false },
            { label: "Version", value: "transitive", checked: true, disabled: false }
        ]
    }


    //DATA FOR TREE

    let dimensions = {
        width: size.width,
        height: size.height,
        marginTop: 50,
        marginRight: 50,
        marginBottom: 50,
        marginLeft: 50,
        boundedHeight: size.height - 100,
        boundedWidth: size.width * 0.7,
    }




    return (
        <div>

            <Row id="MainInfo" key={uuidv4()} style={{ backgroundColor: "white" }}>
                {/* <LateralMenu /> */}
                <MainInfo />
            </Row>

            <Row className="vizContainer" id="DependencyTree" key={uuidv4()}
                style={{ width: size.width, height: size.height }}
            >
                {/* CATEGORY LIST */}
                <Col span="2" offset={1}>
                    <CategoryCheckbox
                        key={uuidv4()}
                        tittle={dep.tittle}
                        children={dep.children}
                        checked={filteredDependencies}
                        onClick={(checkedValues: string[]) => dispatch({ type: "SELECT_DEPENDENCY", payload: checkedValues })}
                    />
                    <Divider />
                    <CategoryCheckbox
                        key={uuidv4()}
                        tittle={bloated.tittle}
                        children={bloated.children}
                        checked={filteredBloated}
                        onClick={(checkedValues: string[]) => dispatch({ type: "SELECT_BLOAT", payload: checkedValues })}
                    />
                    <Divider />
                    <CategoryCheckbox
                        key={uuidv4()}
                        tittle={view.tittle}
                        children={view.children}
                        checked={textDisplay}
                        onClick={(checkedValues: string[]) => dispatch({ type: "SELECT_VIEW", payload: checkedValues })}
                    />
                    <Divider />
                    <CategoryRadialBox
                        key={uuidv4()}
                        tittle={colorOptions.tittle}
                        children={colorOptions.children}
                    />
                </Col >

                {/* VIZ D3 */}
                <HorizontalTree
                    key={uuidv4()}
                    data={filtered}
                    dimensions={dimensions}
                />

                {/* Dependencies List */}
                <DependencyList />

            </Row>

            <Row id="dependenceProvency">
                {/* TABS */}
                <DependenceProvency />
            </Row>
        </div>
    )
}