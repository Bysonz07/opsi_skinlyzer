/**
 * Utility functions for search functionality
 */

/**
 * Filter items based on search term and specified fields
 */
export const filterItems = <T>(
    items: T[],
    searchTerm: string,
    searchFields: (keyof T)[]
): T[] => {
    if (!searchTerm.trim()) {
        return items;
    }

    const lowercasedTerm = searchTerm.toLowerCase();

    return items.filter(item =>
        searchFields.some(field => {
            const fieldValue = item[field];
            if (typeof fieldValue === 'string') {
                return fieldValue.toLowerCase().includes(lowercasedTerm);
            }
            return false;
        })
    );
};

/**
 * Debounce function to limit how often a function is called
 */
export const debounce = <T extends (...args: any[]) => any>(
    func: T,
    wait: number
): ((...args: Parameters<T>) => void) => {
    let timeout: number;

    return (...args: Parameters<T>) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
};

/**
 * Highlight search terms in text
 */
export const highlightText = (text: string, searchTerm: string): string => {
    if (!searchTerm.trim()) return text;

    const regex = new RegExp(`(${searchTerm})`, 'gi');
    return text.replace(regex, '**$1**');
};