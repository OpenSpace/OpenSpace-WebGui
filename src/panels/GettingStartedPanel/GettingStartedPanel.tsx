import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Group, Stack } from '@mantine/core';

import { Layout } from '@/components/Layout/Layout';
import { ArrowLeftIcon, ArrowRightIcon } from '@/icons/icons';
import { useWindowLayoutProvider } from '@/windowmanagement/WindowLayout/hooks';

import { useContentSteps } from './Steps/ContentSteps';
import { useIntroductionSteps } from './Steps/IntroductionSteps';
import { useNavigationSteps } from './Steps/NavigationSteps';
import { useTimeSteps } from './Steps/TimeSteps';
import { Chapters } from './Chapters';

export function GettingStartedPanel() {
  const [step, setStep] = useState(0);
  const { closeWindow } = useWindowLayoutProvider();

  const introductionSteps = useIntroductionSteps();
  const navigationSteps = useNavigationSteps();
  const timeSteps = useTimeSteps();
  const contentSteps = useContentSteps();

  const { t } = useTranslation('panel-gettingstartedtour');

  const sections = [introductionSteps, navigationSteps, timeSteps, contentSteps];
  const steps = sections.flat();

  const sectionBreaks = sections.map((section) =>
    section[0] ? steps.indexOf(section[0]) : -1
  );

  const section = sectionBreaks.findIndex((breakpoint, index) => {
    const nextBreakpoint = sectionBreaks[index + 1] ?? steps.length;
    return step >= breakpoint && step < nextBreakpoint;
  });

  const isFirstStep = step === 0;
  const isLastStep = step === steps.length - 1;
  const isLastIntroductionStep = step === introductionSteps.length - 1;

  function nextButtonLabel(): string {
    if (isLastIntroductionStep) {
      return t('button-labels.start');
    }
    if (isLastStep) {
      return t('button-labels.finish');
    }
    return t('button-labels.next');
  }

  function setSection(section: number) {
    setStep(sectionBreaks[section] ?? 0);
  }

  function onClickNext() {
    if (isLastStep) {
      closeWindow('gettingStartedTour');
    } else {
      setStep(step + 1);
    }
  }

  function onClickPrev() {
    setStep(step - 1);
  }

  return (
    <Layout>
      <Layout.GrowingSection>
        <Stack gap={'xs'} h={'100%'} style={{ overflowY: 'auto' }} p={'md'}>
          <Chapters
            section={isLastStep ? sections.length : section}
            setSection={setSection}
          />
          {steps[step]}
        </Stack>
      </Layout.GrowingSection>
      <Layout.FixedSection>
        <Group justify={'space-between'}>
          <Button
            onClick={onClickPrev}
            disabled={isFirstStep}
            leftSection={<ArrowLeftIcon />}
          >
            {t('button-labels.previous')}
          </Button>
          <Button
            onClick={onClickNext}
            variant={'filled'}
            rightSection={!isLastStep && !isLastIntroductionStep && <ArrowRightIcon />}
            color={!isLastStep && !isLastIntroductionStep ? 'blue' : 'green'}
          >
            {nextButtonLabel()}
          </Button>
        </Group>
      </Layout.FixedSection>
    </Layout>
  );
}
