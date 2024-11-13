export function wordBeginningSubString(test: string, search: string): boolean {
  const searchWords = search.split(' ');
  const testWords = test.split(' ');

  function containsWordAsFirst(searchWord: string) {
    return testWords.some((testWord) => testWord.indexOf(searchWord) === 0);
  }
  return searchWords.every((searchWord) => containsWordAsFirst(searchWord));
}

export function objectWordBeginningSubstring(test: object, search: string): boolean {
  // Convert search term to lowercase for case-insensitive comparison
  const lowerSearch = search.toLowerCase();

  // Recursively traverse objects and arrays
  function searchInValue(value: unknown): boolean {
    if (typeof value === 'string' || typeof value === 'number') {
      // Base case: Check if the string or number starts with the search term
      const testString = value.toString().toLowerCase();
      return wordBeginningSubString(testString, lowerSearch);
    } else if (Array.isArray(value)) {
      // If the value is an array, recursively search each item
      return value.some((item) => searchInValue(item));
    } else if (typeof value === 'object' && value !== null) {
      // If the value is an object, recursively search each property
      return Object.values(value).some((val) => searchInValue(val));
    }
    // If the value is neither a string, number, array, nor object, return false
    return false;
  }

  // Start the recursive search on the root `test` object
  return searchInValue(test);
}

// We generate a matcher function using only the keys of the passed object T
export function generateMatcherFunctionByKeys<T extends object>(keys: (keyof T)[]) {
  return (testObject: T, search: string): boolean => {
    // Create a partial object of T where the object properties are provided by `keys`
    const filtered = Object.keys(testObject)
      .filter((key) => keys.includes(key as keyof T))
      .reduce((obj, key) => {
        obj[key as keyof T] = testObject[key as keyof T];
        return obj;
      }, {} as Partial<T>);

    return objectWordBeginningSubstring(filtered, search);
  };
}
