import { Group, Groups, Properties, PropertyOwners } from '@/types/types';

import { getGuiPath, isSceneGraphNode } from './propertyTreeHelpers';

function emptyGroup(): Group {
  return { subgroups: [], propertyOwners: [] };
}

/**
 * Compute the data structure for the groups, based on the GUI path for all added scene
 * graph nodes.
 */
export function computeGroups(
  propertyOwners: PropertyOwners,
  properties: Properties
): Groups {
  const groups: Groups = {};

  const sceneGraphNodes = Object.keys(propertyOwners).filter((uri) =>
    isSceneGraphNode(uri)
  );

  // Create links to all scene graph nodes based on their GUI path. If a node does not
  // have a GUI path, it is added to the top level
  sceneGraphNodes.forEach((uri) => {
    const guiPath = getGuiPath(uri, properties) || '/';
    groups[guiPath] = groups[guiPath] || emptyGroup();
    groups[guiPath].propertyOwners.push(uri);
  });

  // Create links from parent groups to subgroups
  Object.keys(groups).forEach((group) => {
    const path = group.split('/');
    for (let i = 1; i < path.length; ++i) {
      const parentPath = path.slice(0, i).join('/');
      const childPath = path.slice(0, i + 1).join('/');
      groups[parentPath] = groups[parentPath] || emptyGroup();
      const parentGroup = groups[parentPath];
      if (!parentGroup.subgroups.includes(childPath)) {
        parentGroup.subgroups.push(childPath);
      }
    }

    // After collecting all the subgroups, there is one extra group at the top with
    // an empty key keep that has the top levels as subgroups (this is due to all our
    // paths starting with an inital slash). We don't need to keep this around
    delete groups[''];
  });

  return groups;
}
