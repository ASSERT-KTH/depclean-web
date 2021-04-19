import { dimension, colortype } from "src/interfaces/interfaces"



export const used = {
    tittle: "Used",
    children: [
        { label: "Direct", value: "direct", checked: true, disabled: false },
        { label: "Transitive", value: "transitive", checked: true, disabled: false },
        { label: "Inherited", value: "inherited", checked: true, disabled: false }
    ]
}

export const bloated = {
    tittle: "Bloated",
    children: [
        { label: "Direct", value: "direct", checked: true, disabled: false },
        { label: "Transitive", value: "transitive", checked: true, disabled: false },
        { label: "Inherited", value: "inherited", checked: true, disabled: false }
    ]
}

export const colorOptions = {
    tittle: "Color by",
    children: [
        { label: "None", value: "NONE" },
        { label: "Used - Bloated", value: "DEPENDENCY_TYPE" },
        { label: "Usage Ratio", value: "USAGE_RATIO" },
        // { label: "Type", value: "DEPENDENCY_TYPE" },
        { label: "Group Id", value: "GROUP_ID" },
    ]
}


export const scope = {
    tittle: "Scope",
    children: [
        { label: "Compile", value: "compile", checked: true, disabled: true },
        { label: "Test", value: "test", checked: true, disabled: false },
    ]
}

export const omitted = {
    tittle: "Omitted",
    children: [
        { label: "Omitted", value: "omitted", checked: true, disabled: false },
    ]
}

export const link = {
    tittle: "Links",
    children: [
        { label: "Links", value: "links", checked: true, disabled: false },
    ]
}

export const getInitialSize = (width: number, height: number): dimension => {
    return {
        width: width,
        height: height,
        marginTop: 90,
        marginRight: 50,
        marginBottom: 50,
        marginLeft: 50,
        boundedHeight: height - 250,
        boundedWidth: width - (width * 0.0416666667) - (width * 0.0833333333),
    }
}

export const getDebloatValue = (val: number): 0 | 50 | 100 => {
    switch (val) {
        case 0:
            return 0;
        case 1:
            return 50;
        case 2:
            return 100;
        default:
            return 0
    }

}

export const getBooleanValue = (val: number) => {
    switch (val) {
        case 0:
            return false;
        case 1:
            return true;
        default:
            return false;
    }
}

export const getColorValue = (val: number): colortype => {
    switch (val) {
        case 0:
            return "NONE";
        case 1:
            return "DEPENDENCY_TYPE";
        case 2:
            return "USAGE_RATIO";
        case 3:
            return "GROUP_ID";
        default:
            return "DEPENDENCY_TYPE"
    }
}