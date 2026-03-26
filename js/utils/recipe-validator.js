// Contains RegEx patterns and logic for validating user input for the add-recipe page.

// this object contains multiple regex pattenrs
export const REGEX = {
    ALPHA_ONLY: /[^\p{L}\s]/u
}

// tests a value against a given regex pattern
export function matchAgainstREGEX(value, regex) {
    return regex.test(value);
}

export function validateRecipeInput(name, description, course) {
    const invalidName = matchAgainstREGEX(name, REGEX.ALPHA_ONLY);
    const invalidDescription = matchAgainstREGEX(description, REGEX.ALPHA_ONLY);
    const invalidCourse = matchAgainstREGEX(course, REGEX.ALPHA_ONLY);
    return {invalidName, invalidDescription, invalidCourse};
}

export function validateIngredientInput(name, quantity) {
    const invalidName = matchAgainstREGEX(name, REGEX.ALPHA_ONLY);
    const invalidQuantity = isNaN(quantity) || quantity <= 0;
    return {invalidName, invalidQuantity}
}

// Validates a custom unit input and checks if it already exists in the dropdown list.
export function validateOtherUnitInput(unit, unitsOptions) {
    if (!unit) return {valid: false, unique: false};
    let invalidInput = matchAgainstREGEX(unit, REGEX.ALPHA_ONLY);
    
    let isThere = false;
    for (let option of unitsOptions) {
        if (option.value.toLowerCase() === unit.toLowerCase()) {
            isThere = true;
            break;
        }
    }
    return {valid: !invalidInput, unique: !isThere};
}