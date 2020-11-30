import * as d3 from 'd3';

interface dimension {
    width: number,
    height: number,
    marginTop: number,
    marginRight: number,
    marginBottom: number,
    marginLeft: number,
    boundedHeight: number,
    boundedWidth: number,
}


export const getNodes = (data: {}, dataAccesor: (d: {}) => number, dimensions: dimension) => {
    const childrenAccessor = (d: any) => d.children;

    const treemap = d3.treemap()
        .size([dimensions.boundedWidth, dimensions.boundedHeight])
        .padding(4)
    // .round(true)

    const root = d3.hierarchy(data, childrenAccessor)
        .sum(dataAccesor)
        .sort((a: any, b: any) => b.value - a.value)

    const nodes = treemap(root);
    return nodes.descendants();
}

