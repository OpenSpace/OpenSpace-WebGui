import { AppShell, Group, Image, NavLink, Title } from '@mantine/core';

import { DashboardIcon, HomeIcon } from '@/icons/icons';

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
            src={'openspace-logo.png'}
            alt={'OpenSpace logo'}
            h={30}
            fit={'contain'}
          />
          <Title>OpenSpace routes</Title>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p={'md'}>
        <NavLink
          href={'/frontend'}
          label={'GUI'}
          leftSection={<HomeIcon />}
          description={'The regular OpenSpace GUI'}
        />
        <NavLink
          href={'/actions'}
          label={'Actions'}
          description={'Actions panel opened up as a page'}
          leftSection={<DashboardIcon />}
        />

        <NavLink
          href={'/documentation'}
          label={'Local documentation'}
          description={'The local documentation for this particular run of OpenSpace'}
          leftSection={<DashboardIcon />}
        />
      </AppShell.Navbar>

      <AppShell.Main></AppShell.Main>
    </AppShell>
  );
}
