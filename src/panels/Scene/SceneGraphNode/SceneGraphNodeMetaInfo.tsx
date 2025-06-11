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
import styles from '@/theme/global.module.css';
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
        <Text size={'sm'}>Identifier:</Text>,
        <Group justify={'space-between'}>
          <Text className={styles.selectable} size={'sm'}>
            {identifier}
          </Text>
          <CopyToClipboardButton value={identifier || ''} />
        </Group>
      ],
      [
        <Text size={'sm'}>URI:</Text>,
        <Group justify={'space-between'}>
          <Code className={styles.selectable}>{uri}</Code>
          <CopyToClipboardButton value={uri} />
        </Group>
      ],
      [
        <Text size={'sm'}>About:</Text>,
        <Text className={styles.selectable}>{description || 'No description found'}</Text>
      ],
      [
        <Text size={'sm'}>Tags:</Text>,
        <Group gap={'xs'}>
          {propertyOwner?.tags.map((tag) => (
            <Pill key={tag}>
              <Flex gap={2}>
                <span className={styles.selectable}>{tag}</span>
                <CopyToClipboardButton value={tag} />
              </Flex>
            </Pill>
          ))}
        </Group>
      ],
      [
        <Text size={'sm'}>GUI:</Text>,
        <Text
          style={{ overflowWrap: 'anywhere' }}
          className={styles.selectable}
          size={'sm'}
        >
          {guiPath}
        </Text>
      ]
    ]
  };

  const assetMetaTableData: TableData = {
    body: [
      [
        <Text size={'sm'}>Name:</Text>,
        <Text className={styles.selectable} size={'sm'}>
          {documentation?.name}
        </Text>
      ],
      [
        <Text size={'sm'}>Path:</Text>,
        <Text
          style={{ overflowWrap: 'anywhere' }}
          className={styles.selectable}
          size={'sm'}
        >
          {documentation?.path}
        </Text>,
        documentation?.path && <CopyToClipboardButton value={documentation?.path || ''} />
      ],
      [
        <Text size={'sm'}>Author:</Text>,
        <Text className={styles.selectable} size={'sm'}>
          {documentation?.author}
        </Text>
      ],
      [
        <Text size={'sm'}>License:</Text>,
        <Text className={styles.selectable} size={'sm'}>
          {documentation?.license}
        </Text>
      ],
      [
        <Text size={'sm'}>About:</Text>,
        <Spoiler showLabel={'Show more'} hideLabel={'Hide details'}>
          <Text className={styles.selectable} size={'sm'}>
            {documentation?.description}
          </Text>
        </Spoiler>
      ],
      [
        <Text size={'sm'}>Nodes in the asset:</Text>,
        <Spoiler
          showLabel={'Show more'}
          hideLabel={'Hide details'}
          style={{ overflowWrap: 'anywhere' }}
        >
          <Text className={styles.selectable} size={'sm'}>
            {documentation?.identifiers?.map((id) => id).join(', ')}
          </Text>
        </Spoiler>
      ],
      [
        <Text size={'sm'}>URL:</Text>,
        <Anchor
          href={documentation?.url}
          target={'_blank'}
          style={{ overflowWrap: 'anywhere' }}
          className={styles.selectable}
          size={'sm'}
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
