import { Collapse, Paper } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

import { useAppSelector } from "@/redux/hooks";

import { CollapsibleHeader } from "../CollapsibleHeader/CollapsibleHeader";
import { Property } from "../Property/Property";

interface Props {
  uri: string;
}

export function PropertyOwner({ uri }: Props) {
  const [expanded, { toggle }] = useDisclosure(false);

  const propertyOwner = useAppSelector((state) => state.propertyTree.owners.propertyOwners[uri]);

  // TODO: Filter based on Visibility
  const properties = propertyOwner?.properties || [];
  const subPropertyOwners = propertyOwner?.subowners || [];
  const name = propertyOwner?.name;

  if (propertyOwner === undefined) {
    return;
  }

  // TODO: This should possibly be implemented as part of the tree structure instead...
  // So that we can navigate using the keyboard in the same way (arrow keys and space)

  // Alternatively, open the Property and subpropertyowner settings in a sepratae menu?
  return (
    <>
      <div role="button" onClick={toggle}>
        <CollapsibleHeader expanded={expanded} text={name} />
      </div>
      {/* TODO: These componetns looked awful without the added margin and padding (ml and p).
          But we should remove the styling once we've decided how to do for the entire page*/}
      <Collapse in={expanded} ml="lg" transitionDuration={0}>
        <Paper withBorder p="xs" pt="5px" onClick={(event) => event.stopPropagation()}>
          {/* TODO: The rendering of these components are very slow...
              Setting the transition duration to zero helps a bit, but still*/}
          {subPropertyOwners.map(uri => <PropertyOwner key={uri} uri={uri} />)}
          {properties.map(uri => <Property key={uri} uri={uri} />)}
        </Paper>
      </Collapse >
    </>
  );
}
