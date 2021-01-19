import React from 'react';
import { Layout, Divider, Checkbox } from 'antd';
import { useLocation } from 'react-router-dom';
import { dep, bloated, colorOptions, scope, omitted } from 'src/Components/homeViz';
import { CategoryCheckbox } from './CategoryCheckbox';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import { CategoryRadialBox } from './CategoryRadialBox';
import { useAppState } from "./AppStateContext";
import { v4 as uuidv4 } from 'uuid';

const { Sider } = Layout;
// import { dep, bloated, colorOptions, scope, omitted } from 'src/Components/homeViz';

export const SideMenu = () => {
    //get the main state
    const { state, dispatch } = useAppState();
    //Get all the nodes
    const {
        filteredDependencies,
        filteredScope,
        filteredBloated,
        // textDisplay,
        viewOmitted,
        hideMenu
    } = state;

    const location = useLocation()

    const lateralMenu = <Sider
        collapsible={true}
        theme={"light"}
        collapsedWidth={0}
        className={"sideMenu"}
        trigger={null}
        width={150}
        collapsed={hideMenu}
    >
        <CategoryCheckbox
            key={uuidv4()}
            tittle={bloated.tittle}
            children={bloated.children}
            checked={filteredBloated}
            onClick={(checkedValues: string[]) => dispatch({ type: "SELECT_BLOAT", payload: checkedValues })}
        />
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
            tittle={scope.tittle}
            children={scope.children}
            checked={filteredScope}
            onClick={(checkedValues: string[]) => dispatch({ type: "SELECT_SCOPE", payload: checkedValues })}
        />
        <Divider />
        <Checkbox
            key={uuidv4()}
            checked={viewOmitted}
            onChange={(e: CheckboxChangeEvent) => dispatch({ type: "VIEW_OMITTED", payload: !viewOmitted })}
        >{omitted.tittle}</Checkbox>
        <Divider />

        <CategoryRadialBox
            key={uuidv4()}
            tittle={colorOptions.tittle}
            children={colorOptions.children}
        />

    </Sider>;

    return location.pathname === "/result" ? lateralMenu : <></>;
}