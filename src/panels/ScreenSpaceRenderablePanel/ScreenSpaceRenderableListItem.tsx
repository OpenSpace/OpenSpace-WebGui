import { ActionIcon, Button } from '@mantine/core';

import { useOpenSpaceApi } from '@/api/hooks';
import { PropertyOwnerVisibilityCheckbox } from '@/components/PropertyOwner/VisiblityCheckbox';
import { ThreePartHeader } from '@/components/ThreePartHeader/ThreePartHeader';
import { TruncatedText } from '@/components/TruncatedText/TruncatedText';
import { usePropertyOwner, usePropertyOwnerVisibility } from '@/hooks/propertyOwner';
import { MinusIcon } from '@/icons/icons';
import { Uri } from '@/types/types';

interface Props {
  uri: Uri;
  onClick?: () => void;
}

export function ScreenSpaceRenderableListItem({ uri, onClick }: Props) {
  const propertyOwner = usePropertyOwner(uri);

  if (!propertyOwner) {
    throw Error(`No property owner found for uri: ${uri}`);
  }

  const { visibility, setVisibility } = usePropertyOwnerVisibility(uri);

  const luaApi = useOpenSpaceApi();

  function removeSlide(uri: Uri) {
    const identifier = uri.split('.').pop();

    if (!identifier) {
      return;
    }

    luaApi?.removeScreenSpaceRenderable(identifier);
  }

  return (
    <ThreePartHeader
      title={
        <Button
          variant={'subtle'}
          px={2}
          size={'compact-sm'}
          onClick={onClick}
          justify={'start'}
          flex={1}
        >
          <TruncatedText>{propertyOwner.name}</TruncatedText>
        </Button>
      }
      leftSection={
        <PropertyOwnerVisibilityCheckbox
          uri={uri}
          visibility={visibility}
          setVisibility={setVisibility}
        />
      }
      rightSection={
        <ActionIcon
          onClick={() => removeSlide(uri)}
          color={'red'}
          variant={'outline'}
          size={'sm'}
          aria-label={`Remove : ${uri})`} // TODO: i18n
        >
          <MinusIcon />
        </ActionIcon>
      }
    />
  );
}
