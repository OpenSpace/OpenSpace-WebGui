import { useTranslation } from 'react-i18next';
import { AppShell, Divider, Group, Image, NavLink, Title } from '@mantine/core';

import {
  CastIcon,
  DashboardIcon,
  HomeIcon,
  MapIcon,
  OpenInBrowserIcon,
  PenIcon,
  SceneIcon,
  ScriptLogIcon
} from '@/icons/icons';

export function PortalPage() {
  const { t } = useTranslation('portal-page');

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: 'sm'
      }}
      padding={'md'}
    >
      <AppShell.Header>
        <Group h={'100%'} px={'md'}>
          <Image
            src={`${import.meta.env.BASE_URL}/images/openspace-logo.png`}
            alt={t('logo-alt')}
            h={30}
            w={40}
            fit={'contain'}
          />
          <Title>{t('title')}</Title>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p={'md'}>
        <NavLink
          href={'/gui/'}
          label={t('gui.title')}
          leftSection={<HomeIcon />}
          description={t('gui.description')}
        />

        <NavLink
          href={'/gui/#/actions'}
          label={t('actions.title')}
          description={t('actions.description')}
          target={'_blank'}
          leftSection={<DashboardIcon />}
          rightSection={<OpenInBrowserIcon />}
        />

        {/* Note that this link does not work in dev mode, since it's not part of this
            website; it's another OpenSpace-hosted site */}
        <NavLink
          href={'/showcomposer'}
          label={t('showcomposer.title')}
          description={t('showcomposer.description')}
          target={'_blank'}
          leftSection={<PenIcon />}
          rightSection={<OpenInBrowserIcon />}
        />

        <NavLink
          href={'/gui/#/map'}
          label={t('map.title')}
          description={t('map.description')}
          target={'_blank'}
          leftSection={<MapIcon />}
          rightSection={<OpenInBrowserIcon />}
        />
        <Divider my={'xs'} />
        <NavLink
          href={'https://astrocast.openspaceproject.com/'}
          label={t('astrocast.title')}
          description={t('astrocast.description')}
          target={'_blank'}
          leftSection={<CastIcon />}
          rightSection={<OpenInBrowserIcon />}
        />
        <NavLink
          href={'https://hub.openspaceproject.com/'}
          label={t('hub.title')}
          description={t('hub.description')}
          target={'_blank'}
          leftSection={<SceneIcon />}
          rightSection={<OpenInBrowserIcon />}
        />
        {/** If these links don't work, check the proxy port in `vite.config.ts` */}
        <NavLink
          href={'/logs/log.html'}
          label={t('html-log.title')}
          description={t('html-log.description')}
          target={'_blank'}
          leftSection={<ScriptLogIcon />}
          rightSection={<OpenInBrowserIcon />}
        />
        <NavLink
          href={'/logs/ScriptLog.txt'}
          label={t('script-log.title')}
          description={t('script-log.description')}
          target={'_blank'}
          leftSection={<ScriptLogIcon />}
          rightSection={<OpenInBrowserIcon />}
        />
      </AppShell.Navbar>
      <AppShell.Main>{t('introduction')}</AppShell.Main>
    </AppShell>
  );
}
