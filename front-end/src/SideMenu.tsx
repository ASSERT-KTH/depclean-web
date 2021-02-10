import React from 'react';
import { Layout, Divider, Checkbox } from 'antd';
import { useLocation } from 'react-router-dom';
import { bloated, used, colorOptions, omitted, link } from 'src/Components/homeViz';
import { CategoryCheckbox } from './CategoryCheckbox';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import { CategoryRadialBox } from './CategoryRadialBox';
import { useAppState } from "src/AppStateContext";
import { useAppState as useMenuAppState } from "src/AppMenuStateContext";
import { v4 as uuidv4 } from 'uuid';

const { Sider } = Layout;
// import { bloated, bloated, colorOptions, scope, omitted } from 'src/Components/homeViz';

export const SideMenu = () => {
    //get the main state
    const { state, dispatch } = useAppState();
    const { menuState } = useMenuAppState();
    //Get all the nodes
    const {
        filteredDependencies,
        // filteredScope,
        filteredBloated,
        // textDisplay,
        viewOmitted,
        viewLinks
    } = state;
    const { viewFilter } = menuState;

    const location = useLocation()

    const lateralMenu = <Sider
        collapsible={true}
        theme={"light"}
        collapsedWidth={0}
        className={"sideMenu"}
        trigger={null}
        width={200}
        collapsed={viewFilter}
    >
        {/* <CategoryCheckbox
            key={uuidv4()}
            tittle={bloated.tittle}
            children={bloated.children}
            checked={filteredBloated}
            onClick={(checkedValues: string[]) => dispatch({ type: "SELECT_BLOAT", payload: checkedValues })}
        /> */}
        <h3>Dependencies</h3>
        <CategoryCheckbox
            key={uuidv4()}
            tittle={used.tittle}
            children={used.children}
            checked={filteredDependencies}
            onClick={(checkedValues: string[]) => dispatch({ type: "FILTER_USED_DEPENDENCIES", payload: checkedValues })}
        />
        <Divider />
        <CategoryCheckbox
            key={uuidv4()}
            tittle={bloated.tittle}
            children={bloated.children}
            checked={filteredBloated}
            onClick={(checkedValues: string[]) => dispatch({ type: "FILTER_BLOATED_DEPENDENCIES", payload: checkedValues })}
        />
        {/* <Divider />
        <CategoryCheckbox
            key={uuidv4()}
            tittle={scope.tittle}
            children={scope.children}
            checked={filteredScope}
            onClick={(checkedValues: string[]) => dispatch({ type: "SELECT_SCOPE", payload: checkedValues })}
        /> */}
        <Divider />
        <h3>Relations</h3>
        <Checkbox
            key={uuidv4()}
            checked={viewLinks}
            onChange={(e: CheckboxChangeEvent) => dispatch({ type: "VIEW_LINKS", payload: !viewLinks })}
        >{link.tittle}</Checkbox>
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
            onClick={(e: any) => dispatch({ type: "SELECT_COLOR", payload: e.target.value })}
        />

    </Sider>;

    return location.pathname === "/result" ? lateralMenu : <></>;
}