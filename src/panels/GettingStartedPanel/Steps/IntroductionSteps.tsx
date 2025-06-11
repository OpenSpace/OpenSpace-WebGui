import React from 'react';
import { useTranslation } from 'react-i18next';
import { Image, List, Stack, Text } from '@mantine/core';

import { TaskCheckbox } from '../Tasks/Components/TaskCheckbox';

export function useIntroductionSteps(): React.ReactNode[] {
  const { t } = useTranslation('panel-gettingstartedtour', {
    keyPrefix: 'steps.introduction'
  });

  return [
    <Stack align={'center'}>
      <Image src={'openspace-logo.png'} w={200} h={300} my={'lg'} />
      <Text size={'lg'}>{t('welcome')}</Text>
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
    </>
  ];
}
