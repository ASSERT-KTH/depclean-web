import { providersKey } from 'src/interfaces/interfaces';


export const getUniqueArray = (data: any) => {
    const groupId: string[] = data.map((d: any) => d.data.groupId);
    return groupId.sort();
}

export const getMainGroupIds = (groupIds: string[]): providersKey[] => {
    //goes through the array, and gets the main groupIds, returns an key array where key = {name:string, elements:groupId[]}, where they name is the most commmon element between them
    let testedIndex: number[] = [];
    let distanceKeys: providersKey[] = [];

    for (let i = 0; i < groupIds.length; i++) {
        //check it index exists in tested
        if (testedIndex.includes(i)) continue;

        const wordA: string[] = splitString(groupIds[i]);
        //if it does not exist then create key and compare
        let key: providersKey = { name: "", nodeNames: [groupIds[i]] };
        testedIndex = [...testedIndex, i];
        distanceKeys = [...distanceKeys, key]
        //compare to the other words
        for (let j = i + 1; j < groupIds.length; j++) {
            //skyp it has already been tested and it was added to a key
            if (testedIndex.includes(j)) continue;
            const wordB: string[] = splitString(groupIds[j]);
            const commonWords: string[] = intersection(wordA, wordB);
            //if common words is not 0 then we have a key
            if (commonWords.filter(filterDomains(["org", "net", "com", "io"])).length > 0) {
                //both words have been tested
                testedIndex = [...testedIndex, j];
                //add to the new key
                key.nodeNames = [...key.nodeNames, groupIds[j]]
                key.name = commonWords.join(".")
            }

        }
        if (key.name === "") { key.name = groupIds[i] }
    }
    return distanceKeys.sort((a: providersKey, b: providersKey) => b.nodeNames.length - a.nodeNames.length);
}

const splitString = (word: string) => {
    return word.split(".")
}

const intersection = (arrayA: string[], arrayB: string[]) => {
    return arrayA.filter((x: string) => arrayB.indexOf(x) !== -1)
}

const filterDomains = (domains: string[]) => {
    return (word: string) => !domains.includes(word)
}