/**
 * Parse Number to float and return with fixed decimals
 * @param {number} value 
 * @returns 
 */
 export const FormatFloatValue = (value) => {
    return parseFloat(value).toFixed(2);
}

/**
 * Parse Number to float and return with fixed decimals and unit
 * @param {number} value 
 * @returns 
 */
 export const FormatPriceValue = (value) => {
    return `${FormatFloatValue(value)} €`;
}