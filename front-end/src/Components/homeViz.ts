


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

// const view = {
//     tittle: "Label",
//     children: [
//         { label: "GroupId", value: "direct", checked: true, disabled: false },
//         { label: "ArtifactId", value: "omitted", checked: true, disabled: false },
//         { label: "Version", value: "transitive", checked: true, disabled: false }
//     ]
// }

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
