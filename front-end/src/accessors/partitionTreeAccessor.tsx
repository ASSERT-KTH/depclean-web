import * as d3 from 'd3';

//ACCESSORS
//Path to draw the links
export const linkAccesor = (heightPercent: number) => {

    const link = d3.linkHorizontal()
        .source((d: any) => d.source)
        .target((d: any) => d.target)
        .x((d: any) => d[0])
        .y((d: any) => d[1]);

    const padding = 2;

    return (d: any) => {

        // const displaceY = d.depth === 1 ? (d.x0 * heightPercent) / 1 : 0;

        // const parentY = d.depth === 1 ?
        //     d.parent.x0 + d.parent.y + displaceY :
        //     d.parent.x0 + d.parent.y + displaceY;
        // const parentY = d.depth === 1 ?
        //     d.parent.x0 + d.parent.y + displaceY :
        //     d.parent.x0 + d.parent.y + d.y + (d.x0 - d.parent.x0);

        const parentCenterPoint = d.parent.x0 + d.parent.y + d.parent.w / 2;

        const parentCenter: [number, number] = [d.parent.y0 + d.parent.h + padding, parentCenterPoint];

        const point1: [number, number] = parentCenter;
        // const point1: [number, number] = [d.parent.y0 + d.parent.h + padding, parentY];
        const point2: [number, number] = [d.y0 - padding, d.x0 + d.y];
        const point3: [number, number] = [d.y0 - padding, d.x0 + d.y + d.w];
        // const point4: [number, number] = [d.parent.y0 + d.parent.h + padding, parentY + d.w];
        const point4: [number, number] = parentCenter;

        //create an area with all points and links
        return [
            link({
                source: point1,
                target: point2
            }),
            point2 + ',' + point3,
            link({
                source: point3,
                target: point4
            })?.slice(1)
        ].join('L');
    }
};

export const linkStraightAccesor = (heightPercent: number) => {

    const padding = 2;
    const extraLine: number = 10;

    return (d: any) => {

        const parentCenterPoint = d.parent.x0 + d.parent.y + d.parent.w / 2;
        // console.log(d)
        const fatherHeight: number = d.w > 5 ? 5 : d.w / 2;
        const parentCenter: [number, number] = [d.parent.y0 + d.parent.h + padding, parentCenterPoint];

        const point1: [number, number] = parentCenter;
        const point2: [number, number] = [d.y0 - padding, d.x0 + d.y];
        const point3: [number, number] = [d.y0 - padding, d.x0 + d.y + d.w];
        const point4: [number, number] = parentCenter;

        return `M ${point1[0]} ${point1[1] - fatherHeight}
        L ${point1[0] + extraLine} ${point1[1] - fatherHeight} 
        L ${point2[0] - extraLine} ${point2[1]}
        L ${point2[0]} ${point2[1]} 
        L ${point3[0]} ${point3[1]} 
        L ${point3[0] - extraLine} ${point3[1]} 
        L ${point4[0] + extraLine} ${point4[1] + fatherHeight} 
        L ${point4[0]} ${point4[1] + fatherHeight} 
        L ${point1[0]} ${point1[1] - fatherHeight} `;
    }
};

//
export const linksClassAccessor = (d: any) => {
    return "treeLink " +
        // (d.data.highlight ? " treeLink-highlight" : "") +
        (d.data.visible ? " treeLink-visible" : " treeLink-invisible") +
        (d.data.deleted || d.parent.data.deleted ? " treeLink-deleted" : "")
}


export const radialClassAccessor = () => "treeLink treeLink-ommited"

export const linkXaccessor = (d: any) => d.y;
export const linkYaccessor = (d: any) => d.x;

export const linkradial = d3.linkVertical()
    .x(linkXaccessor)
    .y(linkYaccessor);