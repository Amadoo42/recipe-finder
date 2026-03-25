/**
 * @typedef {Object} Message
 * @property {boolean} success - Indicates the success status of an operation.
 * @property {string} description - A descriptive message providing details about the operation's outcome.
 * @property {any} [data] - Optional additional data related to the operation, which can be included in the response for further context.
 */

/**
 * @summary Utility function to create a standardized message object for API responses
 * @description The function takes in parameters for success status, a descriptive message, and optional data. 
 * It returns an object that can be used consistently across the application to communicate the outcome of operations, such as user creation or authentication processes.
 * @param {boolean} success - Indicates whether the operation was successful or not.
 * @param {string} description - A descriptive message providing details about the operation's outcome.
 * @param {any} [data=null] - Optional additional data related to the operation, which can be included in the response for further context.
 * @returns {Message} An object containing the success status, description, and any additional data.
 */
export function createMessage(success, description, data = null) {
    return {
        success,
        description,
        data
    };
}