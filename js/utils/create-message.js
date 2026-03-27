/*

createMessage(success, description, data) function:
    - Standardizes the communication between the logic layer and the UI handlers
    - Expects the input in the form of:
    {
        success: Boolean,      // Whether the operation worked
        description: String,   // A human-readable status or error message
        data: Object/Null      // Optional payload (e.g., user object or session object)
    }
    - Purpose:
        - Provide a consistent structure for all function responses
    - return:
        returns a structured object confirming success with the necessary payload (if applicable) 
        or describing the specific issue

*/
export function createMessage(success, description, data = null) {
    return {
        success,
        description,
        data
    };
}