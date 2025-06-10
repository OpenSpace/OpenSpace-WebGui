import {
  Anchor,
  Card,
  Code,
  Flex,
  Group,
  Pill,
  Spoiler,
  Table,
  TableData,
  Text,
  Title
} from '@mantine/core';

import { CopyToClipboardButton } from '@/components/CopyToClipboardButton/CopyToClipboardButton';
import { useProperty } from '@/hooks/properties';
import { usePropertyOwner } from '@/hooks/propertyOwner';
import { useAppSelector } from '@/redux/hooks';
import classes from '@/theme/global.module.css';
import { Uri } from '@/types/types';
import { identifierFromUri } from '@/util/propertyTreeHelpers';

interface Props {
  uri: Uri;
}

export function SceneGraphNodeMetaInfo({ uri }: Props) {
  const propertyOwner = usePropertyOwner(uri);
  const [guiPath] = useProperty('StringProperty', `${uri}.GuiPath`);

  const [description] = useProperty('StringProperty', `${uri}.GuiDescription`);
  if (description) {
    description.replace(/\\n/g, '').replace(/<br>/g, '');
  }

  const identifier = identifierFromUri(uri);

  const documentation = useAppSelector((state) => {
    if (identifier) {
      return state.documentation.assetsMetaData.find(
        (doc) => doc.identifiers && doc.identifiers.includes(identifier)
      );
    }
    return undefined;
  });

  const mainTableData: TableData = {
    body: [
      [
        'Identifier:',
        <Group justify={'space-between'}>
          <Text className={classes.selectable}>{identifier}</Text>
          <CopyToClipboardButton value={identifier || ''} />
        </Group>
      ],
      [
        'URI:',
        <Group justify={'space-between'}>
          <Code className={classes.selectable}>{uri}</Code>
          <CopyToClipboardButton value={uri} />
        </Group>
      ],
      [
        'About:',
        <Text className={classes.selectable}>
          {description || 'No description found'}
        </Text>
      ],
      [
        'Tags:',
        <Group gap={'xs'}>
          {propertyOwner?.tags.map((tag) => (
            <Pill key={tag}>
              <Flex gap={2}>
                <Text className={classes.selectable}>{tag}</Text>
                <CopyToClipboardButton value={tag} />
              </Flex>
            </Pill>
          ))}
        </Group>
      ],
      [
        'GUI:',
        <Text style={{ overflowWrap: 'anywhere' }} className={classes.selectable}>
          {guiPath}
        </Text>
      ]
    ]
  };

  const assetMetaTableData: TableData = {
    body: [
      ['Name:', <Text className={classes.selectable}>{documentation?.name}</Text>],
      [
        'Path:',
        <Text style={{ overflowWrap: 'anywhere' }} className={classes.selectable}>
          {documentation?.path}
        </Text>,
        documentation?.path && <CopyToClipboardButton value={documentation?.path || ''} />
      ],
      ['Author:', <Text className={classes.selectable}>{documentation?.author}</Text>],
      ['License:', <Text className={classes.selectable}>{documentation?.license}</Text>],
      [
        'About:',
        <Spoiler showLabel={'Show more'} hideLabel={'Hide details'}>
          <Text className={classes.selectable}>{documentation?.description}</Text>
        </Spoiler>
      ],
      [
        'Nodes in the asset:',
        <Spoiler
          showLabel={'Show more'}
          hideLabel={'Hide details'}
          style={{ overflowWrap: 'anywhere' }}
        >
          <Text className={classes.selectable}>
            {documentation?.identifiers?.map((id) => id).join(', ')}
          </Text>
        </Spoiler>
      ],
      [
        'URL:',
        <Anchor
          href={documentation?.url}
          target={'_blank'}
          style={{ overflowWrap: 'anywhere' }}
          className={classes.selectable}
        >
          {documentation?.url}
        </Anchor>
      ]
    ]
  };

  // The version field is not relevant for all assets, and should only be displayed if it
  // exists
  if (documentation?.version) {
    mainTableData.body?.push(['Version:', documentation.version]);
  }

  return (
    <>
      <Table
        mb={'md'}
        withRowBorders={false}
        data={mainTableData}
        styles={{ td: { verticalAlign: 'top' } }}
      />
      <Card>
        <Title order={3}>Asset Info</Title>
        <Table data={assetMetaTableData} />
      </Card>
    </>
  );
}
