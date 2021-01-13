

export const classAccessor = (d: any) => {
    return "node " +
        " node-leaf" +
        (d.data.type === "parent" ? " node-parent" : " ") +
        (d.data.highlight ? " node-highlight" : "") +
        (d.data.visible ? " node-visible" : " node-invisible") +
        (d.data.deleted ? " node-deleted" : "")
}
