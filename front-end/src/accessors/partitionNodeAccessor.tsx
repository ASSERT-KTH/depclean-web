

export const classAccessor = (d: any) => {
    return "node " +
        " node-leaf" +
        (d.data.type === "parent" ? " node-parent" : " ") +
        // (d.data.highlight ? " node-highlight" : "") +
        (d.data.visible ? " node-visible" : " node-invisible") +
        (d.data.deleted ? " node-deleted" : "")
}

//get the width and hight from a new calculated variable
export const wAccessor = (d: any) => d.w;
export const hAccessor = (d: any) => d.h;
export const yDisplacedAccessor = (d: any) => d.y;

