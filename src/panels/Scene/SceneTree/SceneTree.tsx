import { Tree, TreeNodeData } from '@mantine/core';

import { FilterList } from '@/components/FilterList/FilterList';
import { generateMatcherFunctionByKeys } from '@/components/FilterList/util';
import { useAppSelector } from '@/redux/hooks';

import { FeaturedSceneTree } from './FeaturedSceneTree';
import { SceneTreeNode, SceneTreeNodeStyled } from './SceneTreeNode';
import { sortTreeData } from './sortingUtil';
import { filterTreeData } from './treeUtil';

interface Props {
  showOnlyVisible?: boolean;
  showHiddenNodes?: boolean;
}

// @TODO (emmbr, 2024-12-03): Make the search more sophisticated. For example, include
// information about the gui path as well. Could be hidden under a setting. Started doing
// this but it needs some more afterthought. So just left this data structure here for now
interface SearchData extends TreeNodeData {
  guiPath: string | undefined;
}

/**
 * This component displays a tree of the scene graph, either starting from a certain
 * property owner, or the entire tree.
 */
export function SceneTree({ showOnlyVisible = false, showHiddenNodes = false }: Props) {
  const sceneTreeData = useAppSelector((state) => state.groups.sceneTreeData);
  // TODO: Remove dependency on entire properties object. This means that the entire menu
  // is rerendered as soon as a property changes... Alternatively, update state structure
  // so that the property values are stored in a separate object.
  const properties = useAppSelector((state) => state.properties.properties);
  const customGuiOrdering = useAppSelector((state) => state.groups.customGroupOrdering);

  let treeData = filterTreeData(
    sceneTreeData,
    showOnlyVisible,
    showHiddenNodes,
    properties
  );
  treeData = sortTreeData(treeData, customGuiOrdering, properties);

  function flattenTreeData(treeData: TreeNodeData[]): SearchData[] {
    const flatData: SearchData[] = [];

    function flatten(nodes: TreeNodeData[]) {
      nodes.forEach((node) => {
        if (node.children) {
          flatten(node.children);
        } else {
          // Only add leaf nodes to the flat data
          flatData.push({
            ...node,
            guiPath: properties[`${node.value}.GuiPath`]?.value as string | undefined
          });
        }
      });
    }
    flatten(treeData);
    return flatData;
  }
  const flatTreeData = flattenTreeData(treeData);

  // TODO: Remember which parts of the menu were open?

  // TODO: Make search results order by something. Either alphabetic or by relevance

  return (
    <FilterList>
      <FilterList.Favorites>
        <FeaturedSceneTree
          showHiddenNodes={showHiddenNodes}
          showOnlyVisible={showOnlyVisible}
        />
        <Tree
          data={treeData}
          renderNode={(payload) => <SceneTreeNodeStyled {...payload} />}
          selectOnClick
          clearSelectionOnOutsideClick
          allowRangeSelection={false}
        />
      </FilterList.Favorites>
      <FilterList.Data<SearchData>
        data={flatTreeData}
        renderElement={(node: SearchData) => (
          <SceneTreeNode key={node.value} node={node} expanded={false} />
        )}
        matcherFunc={generateMatcherFunctionByKeys(['label'])} // For now we just use the name
      />
    </FilterList>
  );
}
