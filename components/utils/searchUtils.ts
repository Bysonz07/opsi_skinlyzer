// utils/searchUtils.ts
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