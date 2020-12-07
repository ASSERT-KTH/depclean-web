

//TO DO: refacto this for a reduce and more elegant solution
export const countCategories = (array: any[], category: string) => {
    let groupId: { [index: string]: any } = {};
    let arr: any[] = [];
    for (let i = 0; i < array.length; i++) {

        const gId = array[i].data[category];
        const count: number = groupId[gId] || 0;
        groupId[gId] = count + 1;

        // //check if attribute exists
        // if (groupId[gId] === null || groupId[gId] === undefined) {
        //     groupId[gId] = 1;
        // } else {
        //     groupId[gId] = groupId[gId] + 1;
        // }
    }
    for (var propt in groupId) {

        arr.push({
            category: propt,
            items: groupId[propt]

        })
    }
    return arr;
}