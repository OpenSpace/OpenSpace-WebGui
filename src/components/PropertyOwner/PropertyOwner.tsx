import { SceneTree } from '../SceneTree/SceneTree';

interface Props {
  uri: string;
}

export function PropertyOwner({ uri }: Props) {
  return (
    <SceneTree propertyOwnerUri={uri} />
  );
}

