import { Children, cloneElement, isValidElement } from 'react';
import { ObjectOrStringWordBeginningSubString } from './util';

export const FilterListDataDisplayName = 'FilterListData';

function filterChildren(
  searchString: string,
  children: React.ReactNode
): React.ReactNode[] {
  // Filter children on their props
  // Most matcher functions are case sensitive, hence toLowerCase
  const childArray = Children.toArray(children);

  // Recursive to handle filtering on deeply nested children
  const filteredChildren = childArray.filter((child) => {
    const finalMatcher = ObjectOrStringWordBeginningSubString;

    // TODO (anden88 2024-10-16): a little unclear if this is correct, I believe only
    // text and numbers will end up here since objects are not valid React renderables
    // see: https://react.dev/reference/react/isValidElement
    if (!isValidElement(child)) {
      // Non-element nodes like strings, numbers, etc.
      const searchAbleChild = child.toString().toLowerCase();
      return finalMatcher(searchAbleChild, searchString) ? child : null;
    }

    // Handle functional components
    if (typeof child.type === 'function') {
      // Invoke the functional component and filter its rendered output
      const renderedOutput = (child.type as React.FunctionComponent)(child.props);
      const filteredNestedChildren = filterChildren(searchString, renderedOutput);
      return filteredNestedChildren.length > 0 ? filteredNestedChildren : null;
    }

    // Check if the element has children, and filter recursively if so
    if (child.props && child.props.children) {
      const filteredNestedChildren = filterChildren(searchString, child.props.children);

      if (filteredNestedChildren.length > 0) {
        // If there are matching nested children, return the parent element with filtered
        // children
        return cloneElement(child, {
          ...child.props,
          key: child.key,
          children: filteredNestedChildren
        });
      }
      return null; // No matching children in this subtree
    }

    // Apply filter to the current element's props
    const searchAbleChild = { ...child.props };
    const isMatching = finalMatcher(searchAbleChild, searchString);
    return isMatching ? child : null;
  });
  return filteredChildren;
}

export interface FilterListDataProps {
  searchString?: string;
  children: React.ReactNode;
}

export function FilterListData({ searchString = '', children }: FilterListDataProps) {
  const content = filterChildren(searchString, children);
  console.log('finished filtering', content);
  return <>{content}</>;
}

FilterListData.displayName = FilterListDataDisplayName;
