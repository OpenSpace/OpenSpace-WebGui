import { useTranslation } from 'react-i18next';
import {
  Anchor,
  Card,
  Code,
  Flex,
  Group,
  Pill,
  Table,
  TableData,
  Text,
  Title
} from '@mantine/core';

import { CopyToClipboardButton } from '@/components/CopyToClipboardButton/CopyToClipboardButton';
import { ShowMore } from '@/components/ShowMore/ShowMore';
import { useProperty } from '@/hooks/properties';
import { usePropertyOwner } from '@/hooks/propertyOwner';
import { useAppSelector } from '@/redux/hooks';
import styles from '@/theme/global.module.css';
import { Uri } from '@/types/types';
import { identifierFromUri } from '@/util/uris';

interface Props {
  uri: Uri;
}

export function SceneGraphNodeMetaInfo({ uri }: Props) {
  const { t } = useTranslation('panel-scene', {
    keyPrefix: 'scene-graph-node.meta-info'
  });

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
        <Text size={'sm'}>{t('info-table.identifier')}:</Text>,
        <Group justify={'space-between'}>
          <Text className={styles.selectable} size={'sm'}>
            {identifier}
          </Text>
          <CopyToClipboardButton value={identifier || ''} />
        </Group>
      ],
      [
        <Text size={'sm'}>{t('info-table.uri')}:</Text>,
        <Group justify={'space-between'}>
          <Code className={styles.selectable}>{uri}</Code>
          <CopyToClipboardButton value={uri} />
        </Group>
      ],
      [
        <Text size={'sm'}>{t('info-table.about')}:</Text>,
        <Text className={styles.selectable}>
          {description || t('info-table.about-not-found')}
        </Text>
      ],
      [
        <Text size={'sm'}>{t('info-table.tags')}:</Text>,
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
        <Text size={'sm'}>{t('info-table.gui')}:</Text>,
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
        <Text size={'sm'}>{t('asset-info-table.name')}:</Text>,
        <Text className={styles.selectable} size={'sm'}>
          {documentation?.name}
        </Text>
      ],
      [
        <Text size={'sm'}>{t('asset-info-table.path')}:</Text>,
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
        <Text size={'sm'}>{t('asset-info-table.author')}:</Text>,
        <Text className={styles.selectable} size={'sm'}>
          {documentation?.author}
        </Text>
      ],
      [
        <Text size={'sm'}>{t('asset-info-table.license')}:</Text>,
        <Text className={styles.selectable} size={'sm'}>
          {documentation?.license}
        </Text>
      ],
      [
        <Text size={'sm'}>{t('asset-info-table.about')}:</Text>,
        <ShowMore>
          <Text className={styles.selectable} size={'sm'}>
            {documentation?.description}
          </Text>
        </ShowMore>
      ],
      [
        <Text size={'sm'}>{t('asset-info-table.nodes-in-asset')}:</Text>,
        <ShowMore>
          <Text className={styles.selectable} size={'sm'}>
            {documentation?.identifiers?.map((id) => id).join(', ')}
          </Text>
        </ShowMore>
      ],
      [
        <Text size={'sm'}>{t('asset-info-table.url')}:</Text>,
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
    mainTableData.body?.push([
      `${t('asset-info-table.version')}:`,
      documentation.version
    ]);
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
        <Title order={3}>{t('asset-info-title')}</Title>
        <Table data={assetMetaTableData} />
      </Card>
    </>
  );
}
