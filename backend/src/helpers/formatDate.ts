export function formatDateToCustom(dateString: string): string {
    const date = new Date(dateString);

    // Extract day, month, and year
    const day = String(date.getDate()).padStart(2, "0");
    const month = date.toLocaleString("en-US", { month: "short" }).toUpperCase();
    const year = String(date.getFullYear()).slice(-2);

    // Return in the desired format
    return `${day}-${month}-${year}`;
}