import { treemap, hierarchy } from 'd3';
import { dimension } from 'src/interfaces/interfaces';

export const getNodes = (data: {}, dataAccesor: (d: {}) => number, dimensions: dimension) => {
    const childrenAccessor = (d: any) => d.children;

    const treemapD3 = treemap()
        .size([dimensions.boundedWidth, dimensions.boundedHeight])
        .padding(4)
    // .round(true)

    const root = hierarchy(data, childrenAccessor)
        .sum(dataAccesor)
        .sort((a: any, b: any) => b.value - a.value)

    const nodes = treemapD3(root);
    return nodes.descendants();
}

