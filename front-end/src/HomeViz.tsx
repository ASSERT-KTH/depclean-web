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
import { getInitialSize } from 'src/Components/homeViz';

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
            return getInitialSize(size.width, size.width);
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