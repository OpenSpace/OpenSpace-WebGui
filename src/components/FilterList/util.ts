export function wordBeginningSubString(test: string, search: string): boolean {
  const searchWords = search.split(' ');
  const testWords = test.split(' ');

  function containsWordAsFirst(searchWord: string) {
    return testWords.some((testWord) => testWord.indexOf(searchWord) === 0);
  }
  return searchWords.every((searchWord) => containsWordAsFirst(searchWord));
}

export function objectWordBeginningSubstring(test: object, search: string): boolean {
  const valuesAsStrings = Object.values(test)
    .filter((t) => ['number', 'string'].includes(typeof t))
    .map((t: string | number) => t.toString())
    .map((t: string) => t.toLowerCase());
  return valuesAsStrings.some((v) => wordBeginningSubString(v, search));
}

export function objectOrStringWordBeginningSubString(
  test: object | string,
  search: string
): boolean {
  if (typeof test === 'object') {
    return objectWordBeginningSubstring(test, search);
  } else {
    return wordBeginningSubString(test, search);
  }
}
