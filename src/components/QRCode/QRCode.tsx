import { useTranslation } from 'react-i18next';
import { Alert, Divider, Grid, Modal, Stack, Text, Title } from '@mantine/core';
import { QRCodeSVG } from 'qrcode.react';

import { Property } from '@/components/Property/Property';
import { useProperty } from '@/hooks/properties';
import styles from '@/theme/global.module.css';

import { StringProperty } from '../Property/Types/StringProperty';

interface Props {
  opened: boolean;
  close: () => void;
}

export function QRCode({ opened, close }: Props) {
  const { t } = useTranslation('components', { keyPrefix: 'qrcode' });
  const [port] = useProperty('IntProperty', 'Modules.WebGui.Port');
  const [address] = useProperty('StringProperty', 'Modules.WebGui.Address');

  return (
    <Modal
      opened={opened}
      onClose={close}
      size={'xl'}
      closeButtonProps={{ 'aria-label': t('close-button-aria-label') }}
    >
        <Stack gap={'xs'} align={'center'}>
          <Title order={1}>{t('modal-title')}</Title>
          <QRCodeSVG
            value={`http://${address}:${port}/gui/#/routes/`}
            title={t('alt-text')}
            size={192}
            bgColor={'var(--mantine-color-black)'}
            fgColor={'var(--mantine-color-white)'}
            level={'L'}
            imageSettings={{
              src: `${import.meta.env.BASE_URL}/images/icon.png`,
              x: undefined,
              y: undefined,
              height: 24,
              width: 24,
              opacity: 1,
              excavate: true
            }}
          />
          <Text p={'md'} className={styles.selectable}>
            {t('panel-description')}
          </Text>

          <Alert variant={'light'} color={'blue'} title={t('ip-warning-title')}>
            <Text pb={'md'}>
              {t('ip-warning-text-1')}
            </Text>
            <Text pb={'md'} className={styles.selectable}>
              {t('ip-warning-text-2')}
            </Text>
            <Text pb={'md'}>
              {t('ip-warning-text-3')}
            </Text>
            <Divider my={'sm'} />
            <Text pb={'sm'}>{t('current-address-value')}</Text>
            <StringProperty uri={'Modules.WebGui.Address'} readOnly={true} />
          </Alert>
          <Alert variant={'light'} color={'blue'} title={t('allow-warning-title')}>
            <Text pb={'md'} className={styles.selectable}>
              {t('allow-warning-text')}
            </Text>
            <Property
              uri={'Modules.Server.Interfaces.DefaultWebSocketInterface.DefaultAccess'}
            />
            <Property
              uri={'Modules.Server.Interfaces.DefaultWebSocketInterface.AllowAddresses'}
            />
          </Alert>
        </Stack>
    </Modal>
  );
}
