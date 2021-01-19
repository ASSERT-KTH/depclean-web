
//DEFINE CHECKBOXES AND LABELS
export const dep = {
    tittle: "Dependencies",
    children: [
        { label: 'Direct', value: 'direct', disabled: true, checked: false },
        { label: 'Transitive', value: 'transitive', disabled: false, checked: true },
        { label: 'Inherited', value: 'inherited', disabled: false, checked: true },
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
        { label: "Type", value: "color-type" },
        { label: "Group Id", value: "color-artifact-id" },
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
