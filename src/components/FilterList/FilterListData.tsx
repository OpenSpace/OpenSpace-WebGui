import { Children, cloneElement, isValidElement } from 'react';
import { ScrollArea } from '@mantine/core';

import { ObjectOrStringWordBeginningSubString } from './util';

export const FilterListDataDisplayName = 'FilterListData';
export interface FilterListDataProps {
  searchString?: string;
  children: React.ReactNode;
}

function filterChildren(searchString: string, children: React.ReactNode) {
  const content = internalFilterChildren(searchString, children);
  if (content.length > 0) {
    return content;
  }
  return <div>Nothing found. Try another search!</div>;
}

function internalFilterChildren(
  searchString: string,
  children: React.ReactNode
): React.ReactNode[] {
  // Filter children on their props
  // Most matcher functions are case sensitive, hence toLowerCase
  const childArray = Children.toArray(children);

  // Recursive to handle filtering on deeply nested children
  const filteredChildren = childArray.filter((child) => {
    // TODO: add matcher prop or default
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
      const filteredNestedChildren = internalFilterChildren(searchString, renderedOutput);
      return filteredNestedChildren.length > 0 ? filteredNestedChildren : null;
    }

    // Check if the element has children, and filter recursively if so
    if (child.props && child.props.children) {
      const filteredNestedChildren = internalFilterChildren(
        searchString,
        child.props.children
      );

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
    // TODO: add ignore props filter
    const isMatching = finalMatcher(searchAbleChild, searchString);
    return isMatching ? child : null;
  });

  return filteredChildren;
}

export function FilterListData({ searchString = '', children }: FilterListDataProps) {
  const content = filterChildren(searchString, children);
  console.log('Render FilterListData');
  return (
    <ScrollArea.Autosize
      scrollbars={'y'}
      type={'always'}
      offsetScrollbars
      mah={'100%'}
      mb={'var(--mantine-spacing-md)'}
    >
      {content}
    </ScrollArea.Autosize>
  );
}

FilterListData.displayName = FilterListDataDisplayName;
