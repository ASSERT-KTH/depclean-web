import { dependencytypeColor } from 'src/utils/treeAccess';
import { sum, format } from 'd3';

export const nodevValueAccessor = (d: any) => d.value;

//DATA ACCESSORS
export const formatTick = (d: any) => d + "%";
export const yAccessor = (d: any) => 0;
export const posAccessor = (d: any) => d.x0;
export const wAccessor = (d: any) => d.x1;

export const nameAccessor = (d: any) => d.data.category;
export const valueAccesor = (d: any) => "(" + d.value + ")";
export const getValueAccessor = (total: number) => {
    return (d: any) => format(".2f")((d.value / total) * 100) + "%";
}
// export const indexAccessor = (d: any) => d.index;
// export const colorInterpolator = d3.interpolate("red", "blue")

export const indexAccesor = (d: any) => d.data.category;
export const colorAccessor = (d: any) => dependencytypeColor(indexAccesor(d))

//CREATE THE OBJECT
const countCategories = (category: string) => {
    return (categoryMap: any, node: any) => {
        const gId = node.data[category];
        const count: number = categoryMap[gId] || 0;
        return {
            ...categoryMap,
            [gId]: count + 1,
        }
    }
}

const mapCategories = (categories: any) => {
    return (key: any) => {
        return {
            data: {
                category: key,
                items: categories[key]
            },
            index: 0,
            value: categories[key],
            x0: 0,
            x1: 0
        }

    }
}

const addIndex = (d: any, i: number) => {
    d.index = i;
    return d;
}

const sortCategories = (a: any, b: any) => {
    const aData = a.data.category.split("-");
    const bData = b.data.category.split("-");
    const aName = aData[1] + "-" + aData[0];
    const bName = bData[1] + "-" + bData[0];
    return bName.localeCompare(aName)
}

const itemsAccessor = (d: any) => d.data.items

const reduceObject = (objectMap: any, node: any) => {
    const counter = objectMap.value + node.value
    return {
        ...objectMap,
        data: {
            category: "others",
            items: counter
        },
        index: 0,
        value: counter,
        x0: 0,
        x1: 0
    }
}

export const chart = (array: any[], category: string, xScale: d3.ScaleLinear<number, number, never>) => {

    //GET ALL THE CATEGORIES AND COUNTED ITEMS
    const categories = array.reduce(countCategories(category), {})

    //TRANSFORM IT TO AN ARRAY OF OBJECTS
    let va = Object.keys(categories)
        .map(mapCategories(categories))
        .sort(sortCategories)
        .map(addIndex)

    //get the total of items
    const chartTotal: number = sum(va, itemsAccessor);

    if (va.length > 10) {
        va.sort((a: any, b: any) => b.value - a.value)
        let newArr = va.slice(0, 9);
        const newObj = va.slice(9, va.length)
            .reduce(reduceObject)
        va = [...newArr, newObj];
    }
    //calculate the position of the objects
    let pos = 0;
    return va.map((d: any, index: number) => {
        d.x1 = xScale((d.data.items / chartTotal) * 100);
        d.x0 = pos;
        d.index = index;
        pos += d.x1;
        return d;
    })

}
