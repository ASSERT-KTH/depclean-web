import React, { useState, useEffect, useMemo, useRef } from 'react';
import { MainInfo } from './MainInfo';
import { Row } from 'antd';
import { HorizontalPartitionTree } from './HorizontalPartitionTree';
import { v4 as uuidv4 } from 'uuid';
import { DependencyList } from './DependencyList';
import { dimension, ResultType } from 'src/interfaces/interfaces';
import { Legend } from 'src/Legend';
import { AppToolTipStateProvider } from 'src/AppToolTipStateContext';
import { getInitialSize, getDebloatValue, getBooleanValue, getColorValue } from 'src/Components/homeViz';
import { useParams } from "react-router-dom";
import { fetchFromFile, createProject } from './utils/dataRetrieve';
import { artifact, MenuStateI, newState } from 'src/interfaces/interfaces';
import { useAppState } from './AppStateContext';
import { useHistory } from 'react-router-dom';
import { ButtonGroup } from './ButtonGroup';

export const HomeViz = () => {

    const componentRef = useRef<HTMLInputElement>(null);

    const [loading, setLoading] = useState(false)
    const [size, setSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight
    });
    //modify size on resize
    useEffect(() => {
        function handleResize() {
            if (size.width !== window.innerWidth && size.height !== window.innerHeight) setSize({
                width: window.innerWidth,
                height: window.innerHeight
            })
        }
        window.addEventListener('resize', handleResize)
    })


    const { action, id, appState } = useParams<ResultType>();
    const { dispatch } = useAppState();

    let history = useHistory();

    useEffect(() => {

        async function fetchData(fileToLoad: string) {
            await fetchFromFile(fileToLoad)
                .then(dataProject => {
                    const project: artifact = createProject(dataProject);
                    upDateMenuState(project);
                    setLoading(false);
                })
                .catch((err) => {
                    history.push(`/result/LD/default/0111111111`);
                });
        }

        function upDateMenuState(project: artifact) {
            //transform into an array of numbers
            const menuState = String(appState).split('').map(e => Number(e));
            if (menuState.length !== 10) return;
            try {
                const menState: MenuStateI = [getDebloatValue(menuState[0]), getBooleanValue(menuState[1]), getBooleanValue(menuState[2]), getBooleanValue(menuState[3]), getBooleanValue(menuState[4]), getBooleanValue(menuState[5]), getBooleanValue(menuState[6]), getBooleanValue(menuState[7]), getBooleanValue(menuState[8]), getColorValue(menuState[9])]
                const newStateData: newState = {
                    artifact: project,
                    menuState: menState
                }
                dispatch({ type: "SET_MENU_STATE", payload: newStateData })
            }
            catch (error) {
                console.log("error with the menuState ");
                history.push(`/result/LD/default/011111111`);
            }
        }

        if (action === "LD" && id !== undefined) {
            setLoading(true);
            fetchData(id);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [action, id, appState])


    //DATA FOR TREE
    const dimensions: dimension = useMemo(
        () => getInitialSize(size.width, size.height), [size.width, size.height]
    )
    return (
        <div ref={componentRef}>
            {loading === false ?
                <>
                    <Row id="MainInfo" className={"margin-buttom-20"} key={uuidv4()} >
                        <MainInfo />
                    </Row>
                    <Row className="vizContainer" id="DependencyTree" key={uuidv4()}>

                        <ButtonGroup componentRef={componentRef} />
                        <Legend />
                        <AppToolTipStateProvider>
                            <HorizontalPartitionTree dimensions={dimensions} />
                        </AppToolTipStateProvider>
                        <DependencyList height={dimensions.boundedHeight - 60} />
                    </Row>
                </> :
                <></>
            }

        </div>
    )
}