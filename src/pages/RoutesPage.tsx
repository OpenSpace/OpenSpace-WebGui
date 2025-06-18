import { Link } from 'react-router';
import { AppShell, Group, Image, NavLink, Title } from '@mantine/core';

import { DashboardIcon, HomeIcon, PenIcon } from '@/icons/icons';

export function RoutesPage() {
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
            src={`${import.meta.env.BASE_URL}images/openspace-logo.png`}
            alt={'OpenSpace logo'}
            h={30}
            w={40}
            fit={'contain'}
          />
          <Title>OpenSpace Routes</Title>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p={'md'}>
        <NavLink
          to={'/'}
          label={'GUI'}
          leftSection={<HomeIcon />}
          description={'The regular OpenSpace GUI'}
          component={Link}
        />
        <NavLink
          to={'/actions'}
          label={'Actions'}
          description={'Actions panel opened up as a page'}
          target={'_blank'}
          leftSection={<DashboardIcon />}
          component={Link}
        />
        <NavLink
          href={'/showcomposer'}
          label={'ShowComposer'}
          description={'ShowComposer opened up as a page'}
          target={'_blank'}
          leftSection={<PenIcon />}
        />
      </AppShell.Navbar>
      <AppShell.Main>
        This page displays the different routes that are available in OpenSpace.
      </AppShell.Main>
    </AppShell>
  );
}
