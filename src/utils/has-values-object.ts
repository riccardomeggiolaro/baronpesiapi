// Check if the passed object has key value pairs
export async function hasKeyValuePairs(obj: object){
    // At the first key found return true
    for(const key in obj){
        if(obj.hasOwnProperty(key)){
            return true;
        }
    }
    // If didn't find any key return false
    return false;
}