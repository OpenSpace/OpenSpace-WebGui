import { Children, isValidElement } from 'react';
import { ObjectOrStringWordBeginningSubString } from './util';

export const FilterListDataDisplayName = 'FilterListData';

function filterChildren(searchString: string, children: React.ReactNode) {
  // Filter children on their props
  // Most matcher functions are case sensitive, hence toLowerCase
  const childArray = Children.toArray(children);
  console.log('childarray', childArray);
  const filteredChildren = childArray.filter((child) => {
    const matcherFunc = ObjectOrStringWordBeginningSubString;
    let searchAbleChild: string | object;
    if (!isValidElement(child)) {
      // TODO (anden88 2024-10-16): extremely unclear if this is correct, I believe only
      // text and numbers will end up here since objects are not valid React renderables
      // see: https://react.dev/reference/react/isValidElement
      searchAbleChild = child.toString().toLowerCase();
    } else {
      if (typeof child.props === 'object') {
        // console.log(child.props);
      } else {
        console.error(
          'TODO: Add missing case for matcher function for',
          child,
          ' child props',
          typeof child.props
        );
      }
      searchAbleChild = { ...child.props };

      console.log(
        'child children props',
        child.props.children,
        'child props',
        child.props
      );
    }
    console.log('searchable child', searchAbleChild);
    const finalMatcher = matcherFunc;
    // ignorePropsFilter.map((key) => delete searchAbleChild[key]); // either string or name key to object
    const isMatching = finalMatcher(searchAbleChild, searchString);
    return isMatching;
  });

  return filteredChildren;
}

export interface FilterListDataProps {
  searchString?: string;
  children: React.ReactNode;
}

export function FilterListData({ searchString = '', children }: FilterListDataProps) {
  const content = filterChildren(searchString, children);
  return <>{content}</>;
}

FilterListData.displayName = FilterListDataDisplayName;
