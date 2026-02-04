import { useTranslation } from 'react-i18next';
import { Alert, Grid, Modal, Stack, Text, Title } from '@mantine/core';
import { address } from '@/api/api';
import {QRCodeSVG} from 'qrcode.react';

interface Props {
  opened: boolean;
  close: () => void;
}

export function QRCode({ opened, close }: Props) {
  const { t } = useTranslation('components', { keyPrefix: 'qrcode' });
  const port = window?.location?.port || 4680;
  return (
    <Modal
      opened={opened}
      onClose={close}
      title={t('modal-title')}
      size={'40%'}
      closeButtonProps={{ 'aria-label': 'Close QR Code' }}
    >
      <Grid>
        <Grid.Col span={4}>
           <QRCodeSVG
            value={`http://${address}:${port}/gui/#/routes/`}
            title={t('qr-alt-text')}
            size={128}
            bgColor={"#ffffff"}
            fgColor={"#000000"}
            level={"L"}
            imageSettings={{
                src: `${import.meta.env.BASE_URL}/images/icon.png`,
                x: undefined,
                y: undefined,
                height: 24,
                width: 24,
                opacity: 1,
                excavate: true,
            }}
            />

        </Grid.Col>
        <Grid.Col span={8}>
          <Stack gap={'xs'}>
            <Title order={1}>{t('qr-alt-text')}</Title>
            <Text>{t('qrcode-panel-description')}</Text>
            
            <Alert variant={'light'} color={'blue'} title={t('qr-ip-warning-title')}>
                <Text>{t('qr-ip-warning-text')}</Text>
            </Alert>
             <Alert variant={'light'} color={'blue'} title={t('qr-allow-warning-title')}>
                <Text>{t('qr-allow-warning-text')}</Text>
            </Alert>
          </Stack>
        </Grid.Col>
      </Grid>
    </Modal>
  );
}
