import CopyUriButton from '@/components/CopyUriButton/CopyUriButton';
import { Uri } from '@/types/types';

interface Props {
  uri: Uri;
  description: string;
}

/**
 * This component is used to display the description of a property, including a copy
 * button for the URI.
 */
export function PropertyDescription({ uri, description }: Props) {
  return (
    <>
      {description}
      {uri && <CopyUriButton uri={uri} />}
    </>
  );
}
