/**
 * Parse Number to float and return with fixed decimals
 * @param {number} value 
 * @returns 
 */
 export const FormatFloatValue = (value) => {
    value = Number.parseFloat(value);

    return value.toLocaleString(
        'de-DE',
        {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }
    );
}

/**
 * Parse Number to float and return with fixed decimals and unit
 * @param {number} value 
 * @returns 
 */
 export const FormatPriceValue = (value) => {
    return `${FormatFloatValue(value)} €`;
}