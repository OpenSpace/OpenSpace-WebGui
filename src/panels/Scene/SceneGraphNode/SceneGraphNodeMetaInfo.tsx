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
  Title
} from '@mantine/core';

import { CopyToClipboardButton } from '@/components/CopyToClipboardButton/CopyToClipboardButton';
import { useStringProperty } from '@/hooks/properties';
import { useGetPropertyOwner } from '@/hooks/propertyOwner';
import { useAppSelector } from '@/redux/hooks';
import { Uri } from '@/types/types';
import { identifierFromUri } from '@/util/propertyTreeHelpers';

interface Props {
  uri: Uri;
}

export function SceneGraphNodeMetaInfo({ uri }: Props) {
  const propertyOwner = useGetPropertyOwner(uri);
  const [guiPath] = useStringProperty(`${uri}.GuiPath`);

  const [description] = useStringProperty(`${uri}.GuiDescription`);
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
          {identifier}
          <CopyToClipboardButton value={identifier || ''} />
        </Group>
      ],
      [
        'URI:',
        <Group justify={'space-between'}>
          <Code>{uri}</Code>
          <CopyToClipboardButton value={uri} />
        </Group>
      ],
      ['About:', description || 'No description found'],
      [
        'Tags:',
        <Group gap={'xs'}>
          {propertyOwner?.tags.map((tag) => (
            <Pill key={tag}>
              <Flex gap={2}>
                {tag}
                <CopyToClipboardButton value={tag} />
              </Flex>
            </Pill>
          ))}
        </Group>
      ],
      ['GUI:', <span style={{ overflowWrap: 'anywhere' }}>{guiPath}</span>]
    ]
  };

  const assetMetaTableData: TableData = {
    body: [
      ['Name:', documentation?.name],
      [
        'Path:',
        <span style={{ overflowWrap: 'anywhere' }}>{documentation?.path}</span>,
        documentation?.path && <CopyToClipboardButton value={documentation?.path || ''} />
      ],
      ['Author:', documentation?.author],
      ['License:', documentation?.license],
      [
        'About:',
        <Spoiler showLabel={'Show more'} hideLabel={'Hide details'}>
          {documentation?.description}
        </Spoiler>
      ],
      [
        'Nodes in the asset:',
        <Spoiler
          showLabel={'Show more'}
          hideLabel={'Hide details'}
          style={{ overflowWrap: 'anywhere' }}
        >
          {documentation?.identifiers?.map((id) => id).join(', ')}
        </Spoiler>
      ],
      [
        'URL:',
        <Anchor
          href={documentation?.url}
          target={'_blank'}
          style={{ overflowWrap: 'anywhere' }}
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
      <Table mb={'md'} withRowBorders={false} data={mainTableData} />
      <Card>
        <Title order={3}>Asset Info</Title>
        <Table data={assetMetaTableData} />
      </Card>
    </>
  );
}
