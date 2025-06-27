import React from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Image, List, Stack, Text } from '@mantine/core';

import { useAppSelector } from '@/redux/hooks';

import { TaskCheckbox } from '../Tasks/Components/TaskCheckbox';

export function useIntroductionSteps(): React.ReactNode[] {
  const profileName = useAppSelector((state) => state.profile.name);
  const { t } = useTranslation('panel-gettingstartedtour', {
    keyPrefix: 'steps.introduction'
  });
  const isDefaultProfile = profileName === 'Default';

  return [
    <Stack align={'center'}>
      <Image
        src={`${import.meta.env.BASE_URL}/images/openspace-logo.png`}
        h={180}
        fit={'contain'}
        my={'lg'}
      />
      <Text size={'lg'} ta={'center'}>
        {t('welcome')}
      </Text>
    </Stack>,
    <>
      <Text>{t('topics.intro')}:</Text>
      <List>
        <List.Item>{t('topics.sections.navigation')}</List.Item>
        <List.Item>{t('topics.sections.time')}</List.Item>
        <List.Item>{t('topics.sections.content')}</List.Item>
      </List>
    </>,
    <>
      <Text>{t('about-tasks.intro')}</Text>
      <TaskCheckbox taskCompleted={false} label={t('about-tasks.task-label-example')} />
      <TaskCheckbox taskCompleted={true} label={t('about-tasks.task-label-complete')} />
    </>,
    <>
      <Text>{t('lets-go')}</Text>
      {!isDefaultProfile && (
        <Alert
          variant={'light'}
          color={'orange'}
          title={t('other-profile-warning.title')}
        >
          <Text>{t('other-profile-warning.description')}</Text>
        </Alert>
      )}
    </>
  ];
}
