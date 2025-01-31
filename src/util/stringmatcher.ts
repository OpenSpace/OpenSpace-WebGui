/**
 * Check if the test string contains the search string as a case insensitive substring.
 */
export const caseInsensitiveSubstring = (test: string, search: string): boolean => {
  const lowerCaseTest = test.toLowerCase();
  const lowerCaseSearch = search.toLowerCase();
  return lowerCaseTest.includes(lowerCaseSearch);
};

/**
 * Check if any of the strings in the test array contains the search string as a case
 * insensitive substring.
 */
export const checkCaseInsensitiveSubstringList = (
  test: string[],
  search: string
): boolean => {
  return test.some((item) => caseInsensitiveSubstring(item, search));
};
