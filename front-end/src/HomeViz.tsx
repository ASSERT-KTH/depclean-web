import React, { useState, useEffect, useMemo } from 'react';
import { MainInfo } from './MainInfo';
import { Row } from 'antd';
import { HorizontalPartitionTree } from './HorizontalPartitionTree';
import { v4 as uuidv4 } from 'uuid';
import { DependencyList } from './DependencyList';
import { dimension } from 'src/interfaces/interfaces';
import { Legend } from 'src/Legend';
import { FilterButton } from 'src/FilterButton';
import { AppToolTipStateProvider } from 'src/AppToolTipStateContext';

export const HomeViz = () => {
    const [size, setSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight
    });
    //modify size on resize
    useEffect(() => {
        function handleResize() {
            setSize({
                width: window.innerWidth,
                height: window.innerHeight
            })
        }
        window.addEventListener('resize', handleResize)
    })

    //DATA FOR TREE
    const dimensions: dimension = useMemo(
        () => {
            return {
                width: size.width,
                height: size.height,
                marginTop: 90,
                marginRight: 50,
                marginBottom: 50,
                marginLeft: 50,
                boundedHeight: size.height - 250,
                boundedWidth: size.width - (size.width * 0.0416666667) - (size.width * 0.0833333333),
            }
        }, [size])

    return (
        <div>
            <Row id="MainInfo" className={"margin-buttom-20"} key={uuidv4()} >
                <MainInfo />
            </Row>
            <Row className="vizContainer" id="DependencyTree" key={uuidv4()}>
                <FilterButton />
                <Legend />
                <AppToolTipStateProvider>
                    <HorizontalPartitionTree dimensions={dimensions} />
                </AppToolTipStateProvider>
                <DependencyList height={dimensions.boundedHeight - 60} />
            </Row>
        </div>
    )
}