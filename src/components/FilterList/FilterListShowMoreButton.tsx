import { Button } from '@mantine/core';

export const FilterListShowMoreButtonDisplayName = 'FilterListShowMoreButton';
export interface FilterListShowMoreButtonProps {
  key?: string;
  showDataInstead?: boolean;
  toggleShowDataInstead?: () => void;
}

export function FilterListShowMoreButton({
  key = '',
  showDataInstead = true,
  toggleShowDataInstead = () => {}
}: FilterListShowMoreButtonProps) {
  return (
    <Button key={key} onClick={toggleShowDataInstead}>
      {showDataInstead ? 'Less' : 'More'}
    </Button>
  );
}

FilterListShowMoreButton.displayName = FilterListShowMoreButtonDisplayName;
