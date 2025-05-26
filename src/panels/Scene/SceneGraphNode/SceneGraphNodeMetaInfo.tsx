import { useTranslation } from 'react-i18next';
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
import { useProperty } from '@/hooks/properties';
import { usePropertyOwner } from '@/hooks/propertyOwner';
import { useAppSelector } from '@/redux/hooks';
import { Uri } from '@/types/types';
import { identifierFromUri } from '@/util/propertyTreeHelpers';

interface Props {
  uri: Uri;
}

export function SceneGraphNodeMetaInfo({ uri }: Props) {
  const { t: tCommon } = useTranslation('common');
  const { t } = useTranslation('panel-scene', {
    keyPrefix: 'scene-graph-node-meta-info'
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
        `${t('info-table.identifier')}:`,
        <Group justify={'space-between'}>
          {identifier}
          <CopyToClipboardButton value={identifier || ''} />
        </Group>
      ],
      [
        `${t('info-table.uri')}:`,
        <Group justify={'space-between'}>
          <Code>{uri}</Code>
          <CopyToClipboardButton value={uri} />
        </Group>
      ],
      [`${t('info-table.about')}:`, description || t('info-table.about-not-found')],
      [
        `${t('info-table.tags')}:`,
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
      [
        `${t('info-table.gui')}:`,
        <span style={{ overflowWrap: 'anywhere' }}>{guiPath}</span>
      ]
    ]
  };

  const assetMetaTableData: TableData = {
    body: [
      [`${t('asset-info-table.name')}:`, documentation?.name],
      [
        `${t('asset-info-table.path')}:`,
        <span style={{ overflowWrap: 'anywhere' }}>{documentation?.path}</span>,
        documentation?.path && <CopyToClipboardButton value={documentation?.path || ''} />
      ],
      [`${t('asset-info-table.author')}:`, documentation?.author],
      [`${t('asset-info-table.license')}:`, documentation?.license],
      [
        `${t('asset-info-table.about')}:`,
        <Spoiler showLabel={tCommon('show-more')} hideLabel={tCommon('hide-details')}>
          {documentation?.description}
        </Spoiler>
      ],
      [
        `${t('asset-info-table.nodes-in-asset')}:`,
        <Spoiler
          showLabel={tCommon('show-more')}
          hideLabel={tCommon('hide-details')}
          style={{ overflowWrap: 'anywhere' }}
        >
          {documentation?.identifiers?.map((id) => id).join(', ')}
        </Spoiler>
      ],
      [
        `${t('asset-info-table.url')}:`,
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
