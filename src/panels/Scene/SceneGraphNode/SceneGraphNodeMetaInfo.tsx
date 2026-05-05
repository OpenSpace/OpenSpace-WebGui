import { useTranslation } from 'react-i18next';
import { Anchor, Code, Flex, Group, Pill, Table, Text, Title } from '@mantine/core';

import { CopyToClipboardButton } from '@/components/CopyToClipboardButton/CopyToClipboardButton';
import { ShowMore } from '@/components/ShowMore/ShowMore';
import { usePropertyValue } from '@/hooks/properties';
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
  const guiPath = usePropertyValue('StringProperty', `${uri}.GuiPath`);
  let description = usePropertyValue('StringProperty', `${uri}.GuiDescription`);

  if (description) {
    // Replace newlines and <br> tags with spaces to prevent breaking the layout
    description = description.replace(/\\n|<br>/g, '');
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

  const textProps = { className: styles.selectable, size: 'sm' } as const;

  return (
    <>
      <Table
        mb={'xs'}
        variant={'vertical'}
        withRowBorders={false}
        styles={{ td: { verticalAlign: 'top' }, th: { background: 'transparent' } }}
      >
        <Table.Tbody>
          <Table.Tr>
            <Table.Th w={90}>{t('info-table.identifier')}:</Table.Th>
            <Table.Td>
              <Group justify={'space-between'}>
                <Text {...textProps}>{identifier}</Text>
                <CopyToClipboardButton value={identifier || ''} />
              </Group>
            </Table.Td>
          </Table.Tr>

          <Table.Tr>
            <Table.Th>{t('info-table.uri')}:</Table.Th>
            <Table.Td>
              <Group justify={'space-between'}>
                <Code className={styles.selectable}>{uri}</Code>
                <CopyToClipboardButton value={uri} />
              </Group>
            </Table.Td>
          </Table.Tr>

          <Table.Tr>
            <Table.Th>{t('info-table.about')}:</Table.Th>
            <Table.Td>
              <Text {...textProps}>{description || t('info-table.about-not-found')}</Text>
            </Table.Td>
          </Table.Tr>

          <Table.Tr>
            <Table.Th>{t('info-table.tags')}:</Table.Th>
            <Table.Td>
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
            </Table.Td>
          </Table.Tr>

          <Table.Tr>
            <Table.Th>{t('info-table.gui')}:</Table.Th>
            <Table.Td>
              <Text style={{ overflowWrap: 'anywhere' }} {...textProps}>
                {guiPath}
              </Text>
            </Table.Td>
          </Table.Tr>
        </Table.Tbody>
      </Table>

      <Title order={3}>{t('asset-info-title')}</Title>
      <Table mb={'md'} variant={'vertical'} withRowBorders withTableBorder>
        <Table.Tr>
          <Table.Th w={90}>{t('asset-info-table.name')}:</Table.Th>
          <Table.Td>
            <Text {...textProps}>{documentation?.name}</Text>
          </Table.Td>
        </Table.Tr>

        <Table.Tr>
          <Table.Th>{t('asset-info-table.path')}:</Table.Th>
          <Table.Td>
            <Group justify={'space-between'} wrap={'nowrap'}>
              <Text {...textProps} style={{ overflowWrap: 'anywhere' }}>
                {documentation?.path}
              </Text>
              {documentation?.path && (
                <CopyToClipboardButton value={documentation?.path || ''} />
              )}
            </Group>
          </Table.Td>
        </Table.Tr>

        <Table.Tr>
          <Table.Th>{t('asset-info-table.author')}:</Table.Th>
          <Table.Td>
            <Text {...textProps}>{documentation?.author}</Text>
          </Table.Td>
        </Table.Tr>

        <Table.Tr>
          <Table.Th>{t('asset-info-table.license')}:</Table.Th>
          <Table.Td>
            <Text {...textProps}>{documentation?.license}</Text>
          </Table.Td>
        </Table.Tr>

        <Table.Tr>
          <Table.Th>{t('asset-info-table.about')}:</Table.Th>
          <Table.Td>
            <Text {...textProps}>{documentation?.description}</Text>
          </Table.Td>
        </Table.Tr>

        <Table.Tr>
          <Table.Th>{t('asset-info-table.nodes-in-asset')}:</Table.Th>
          <Table.Td>
            <ShowMore>
              <Text {...textProps}>
                {documentation?.identifiers?.map((id) => id).join(', ')}
              </Text>
            </ShowMore>
          </Table.Td>
        </Table.Tr>

        <Table.Tr>
          <Table.Th>{t('asset-info-table.url')}:</Table.Th>
          <Table.Td>
            <Anchor
              href={documentation?.url}
              target={'_blank'}
              style={{ overflowWrap: 'anywhere' }}
              {...textProps}
            >
              {documentation?.url}
            </Anchor>
          </Table.Td>
        </Table.Tr>

        {documentation?.version && (
          <Table.Tr>
            <Table.Th>{t('asset-info-table.version')}:</Table.Th>
            <Table.Td>
              <Text {...textProps}>{documentation?.version}</Text>
            </Table.Td>
          </Table.Tr>
        )}
      </Table>
    </>
  );
}
