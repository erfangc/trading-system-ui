/**
 * Modifies the value of a nested property within an object or array structure.
 * Supports modification via dot-notation paths as well as array index access.
 *
 * @param {Object|Array} data The data structure to modify.
 * @param {string} path The dot-separated or array-index-based path to the property.
 *                       Example: "users[0].profile.name"
 * @param {*} value The new value to assign to the property.
 * @returns {Object|Array} The modified data structure.
 */
export function modifyNestedPropertyByPath(data: object | Array<any>, path: string, value: any): object | Array<any> {
    /*
    split path into by dot (/\./), for each segment further split by [\d+] if applicable
     */
    let parts = path.split(/\./);
    let travelInstructions = [];
    let arrPat = /(\w+)\[(\d+)]/;
    for (let i = 0; i < parts.length; i++) {
        let part = parts[i];
        let result = arrPat.exec(part);
        if (result !== null && result.length === 3) {
            const property = result[1];
            const arrayIndex = parseInt(result[2]);
            travelInstructions.push(property);
            travelInstructions.push(arrayIndex);
        } else {
            travelInstructions.push(part);
        }
    }

    /*
    travel down `data` according to travel instruction, stop just before the last instruction
    as that is the one that we need to mutate
     */
    let curr = data; // data == the root node
    let instIdx = 0;
    
    while (instIdx != travelInstructions.length - 1) {
        let inst = travelInstructions[instIdx];
        let nextInst = travelInstructions[instIdx + 1];
        let isArrayAccess = !isNaN(nextInst);
        /*
        determine how to travel
        - if inst is a number, access curr like an array
        - if inst is not a number, access curr like an object
        - if curr is undefined create the node according to the rules:
            - if inst is a number, create a new array
            - if inst is a not a number, create a new object
        - set curr to next
         */
        let next = curr[inst];
        if (next === undefined) {
            if (isArrayAccess) {
                next = [];
            } else {
                next = {};
            }
            curr[inst] = next;
        }
        instIdx++;
        curr = next;
    }
    curr[travelInstructions[instIdx]] = value;
    return data;
}