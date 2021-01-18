
//truncate a string, add ... points at the end
//str: string to truncate
//limit: number of characters allowed before truncating the string
//If string is less than limit, rreturns same string otherwise it tuncates the string
//return a truncated string
export const truncateString = (str: string, limit: number): string => {
    return str.length <= limit ? str : str.slice(0, limit) + "...";
}