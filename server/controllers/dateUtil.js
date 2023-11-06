export function getCurrentDate() {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1; // getMonth() returns 0-11
    const day = currentDate.getDate();

    return `${year}-${month}-${day}`;
}