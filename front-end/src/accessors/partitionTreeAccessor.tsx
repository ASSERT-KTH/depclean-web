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

        const displaceY = d.depth === 1 ? (d.x0 * heightPercent) / 1 : d.y;

        const parentY = d.depth === 1 ?
            d.parent.x0 + d.parent.y + displaceY :
            d.parent.x0 + d.parent.y + d.y + (d.x0 - d.parent.x0);


        const point1: [number, number] = [d.parent.y0 + d.parent.h + padding, parentY];
        const point2: [number, number] = [d.y0 - padding, d.x0 + d.y];
        const point3: [number, number] = [d.y0 - padding, d.x0 + d.y + d.w];
        const point4: [number, number] = [d.parent.y0 + d.parent.h + padding, parentY + d.w];

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


export const linksClassAccessor = (d: any) => {
    return "treeLink " +
        // (d.data.highlight ? " treeLink-highlight" : "") +
        (d.data.visible ? " treeLink-visible" : " treeLink-invisible") +
        (d.data.deleted || d.parent.data.deleted ? " treeLink-deleted" : "")
}