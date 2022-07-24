/**
 * Calculates the Difference in Months between two Dates
 * @param {DateTime} startDate 
 * @param {DateTime} endDate 
 * @returns 
 */
export const getMonthDifference = (startDate, endDate) => {
    return (
        endDate.getMonth() - startDate.getMonth()
        + 12 
        * (endDate.getFullYear() - startDate.getFullYear())
    );
}