import { isValidElement } from 'react';

export function WordBeginningSubString(test: string, search: string): boolean {
  const searchWords = search.split(' ');
  const testWords = test.split(' ');

  function containsWordAsFirst(searchWord: string) {
    return testWords.some((testWord) => testWord.indexOf(searchWord) === 0);
  }
  return searchWords.every((searchWord) => containsWordAsFirst(searchWord));
}

export function ObjectWordBeginningSubstring(test: Object, search: string): boolean {
  console.log('object.values', Object.values(test));
  const internalObjects = Object.values(test).forEach((item) => console.log(item));
  //   .filter((t) => {
  //     if (['object'].includes(typeof t)) {
  //       console.log('t was object', t);
  //       return t;
  //     }
  //   });
  console.log('internalObjects', internalObjects);
  const valuesAsStrings = Object.values(test)
    .filter((t) => ['number', 'string'].includes(typeof t))
    .map((t: string | number) => t.toString())
    .map((t: string) => t.toLowerCase());
  return valuesAsStrings.some((v) => WordBeginningSubString(v, search));
}

export function ObjectOrStringWordBeginningSubString(
  test: Object | string,
  search: string
): boolean {
  if (typeof test === 'object') {
    return ObjectWordBeginningSubstring(test, search);
  } else {
    return WordBeginningSubString(test, search);
  }
}
