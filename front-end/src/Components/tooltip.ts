
//return the bosx position according to the diplay type
// type can be TOP, LEFT, RIGHT, BOTTOM
// return a css property
export const getBoxPosition = (display: string, position: { x: number, y: number }) => {
    return display === "TOP" ?
        `translate(calc( -50% + ${position.x}px),calc( -100% + (${position.y}px))` :
        display === "LEFT" ? `translate(calc( ${position.x}px),calc( -50% + (${position.y}px))` :
            display === "BOTTOM" ? `translate(calc( -50% + ${position.x}px),calc( (${position.y}px))` :
                display === "RIGHT" ? `translate(calc(  -100% + ${position.x}px),calc( -50% + (${position.y}px))` :
                    `translate(calc( -50% + ${position.x}px),calc( -100% + (${position.y}px))`
}

//returns a className according to the display type
export const getClassType = (display: string) => {
    return display === undefined || display === "TOP" ? "tooltip-top" :
        display === "LEFT" ? "tooltip-left" : display === "BOTTOM" ?
            "tooltip-bottom" : display === "RIGHT" ?
                "tooltip-right" : "tooltip-top";
}

export const formatFileSize = (bytes: number, decimalPoint: number) => {
    if (bytes == 0) return '0 Bytes';
    var k = 1000,
        dm = decimalPoint || 2,
        sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
        i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
