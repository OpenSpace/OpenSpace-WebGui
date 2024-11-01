import { Collapse, Paper } from "@mantine/core";
import { shallowEqual, useDisclosure } from "@mantine/hooks";

import { useAppSelector } from "@/redux/hooks";
import { isPropertyVisible, isRenderable } from "@/util/propertytreehelper";

import { CollapsibleHeader } from "../CollapsibleHeader/CollapsibleHeader";
import { Property } from "../Property/Property";

interface Props {
  uri: string;
  autoExpand?: boolean;
}

export function PropertyOwner({ uri, autoExpand }: Props) {
  const [expanded, { toggle }] = useDisclosure(autoExpand || false);

  const propertyOwners = useAppSelector((state) => state.propertyTree.owners.propertyOwners);
  const propertyOwner = useAppSelector((state) => state.propertyTree.owners.propertyOwners[uri]);

  const properties = useAppSelector((state) => {
    const subProperties = propertyOwner?.properties || [];
    return subProperties.filter((prop) =>
      isPropertyVisible(state.propertyTree.props.properties, prop)
    );
  }, shallowEqual);

  const subPropertyOwners = propertyOwner?.subowners || [];
  const name = propertyOwner?.name;

  const hasChildren = (properties.length > 0) || (subPropertyOwners.length > 0)
  if (propertyOwner === undefined || !hasChildren) {
    return;
  }

  const sortedSubOwners = subPropertyOwners.slice().sort((uriA, uriB) => {
    const a = propertyOwners[uriA]?.name || "";
    const b = propertyOwners[uriB]?.name || "";
    return a.localeCompare(b);
  })

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
        <Paper withBorder p="1px" onClick={(event) => event.stopPropagation()}>
          {/* TODO: The rendering of these components are very slow...
              Setting the transition duration to zero helps a bit, but still*/}
          {sortedSubOwners.map(uri => <PropertyOwner key={uri} uri={uri} autoExpand={isRenderable(uri)} />)}
          {properties.map(uri => <Property key={uri} uri={uri} />)}
        </Paper>
      </Collapse >
    </>
  );
}
