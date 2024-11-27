import { Button } from '@mantine/core';

import { useAppSelector } from '@/redux/hooks';

interface Props {
  uri: string;
  onClick?: () => void;
}

export function SceneGraphNodeHeader({ uri, onClick }: Props) {
  const propertyOwner = useAppSelector((state) => {
    return state.propertyOwners.propertyOwners[uri];
  });

  const name = propertyOwner?.name ?? propertyOwner?.identifier;
  // TODO: Add checkboxes, etc. to the header.
  // Also add a version that is not clickable
  if (onClick) {
    return (
      <Button variant={'subtle'} onClick={onClick}>
        {name}
      </Button>
    );
  }

  return <>{name}</>;
}
