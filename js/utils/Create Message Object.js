export function createMessage(success, description, data=null){
    return{
        success: success,
        description: description,
        data
    };
}