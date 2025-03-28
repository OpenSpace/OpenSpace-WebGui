import { useState } from 'react';
import { Button, Group, Stack } from '@mantine/core';

import { Layout } from '@/components/Layout/Layout';
import { ArrowLeftIcon, ArrowRightIcon } from '@/icons/icons';
import { useWindowLayoutProvider } from '@/windowmanagement/WindowLayout/hooks';

import { ContentSteps } from './Steps/ContentSteps';
import { IntroductionSteps } from './Steps/IntroductionSteps';
import { NavigationSteps } from './Steps/NavigationSteps';
import { TimeSteps } from './Steps/TimeSteps';
import { Chapters } from './Chapters';

export function GettingStartedPanel() {
  const [step, setStep] = useState(0);
  const { closeWindow } = useWindowLayoutProvider();
  const Sections = [IntroductionSteps, NavigationSteps, TimeSteps, ContentSteps];
  const steps = Sections.flat();

  const sectionBreaks = Sections.map((section) =>
    section[0] ? steps.indexOf(section[0]) : -1
  );

  const section = sectionBreaks.findIndex((breakpoint, index) => {
    const nextBreakpoint = sectionBreaks[index + 1] ?? steps.length;
    return step >= breakpoint && step < nextBreakpoint;
  });

  const isFirstStep = step === 0;
  const isLastStep = step === steps.length - 1;

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
            section={isLastStep ? Sections.length : section}
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
            Previous
          </Button>
          <Button
            onClick={onClickNext}
            variant={'filled'}
            rightSection={!isLastStep && <ArrowRightIcon />}
          >
            {isLastStep ? 'Finish' : 'Next'}
          </Button>
        </Group>
      </Layout.FixedSection>
    </Layout>
  );
}
