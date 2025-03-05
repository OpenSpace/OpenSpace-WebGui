import { useState } from 'react';
import { GettingStartedSteps } from './GettingStartedSteps';
import { Button, Group, Progress, Stack } from '@mantine/core';
import { Layout } from '@/components/Layout/Layout';
export function GettingStartedPanel() {
  const [step, setStep] = useState(0);
  const progress = (step / (GettingStartedSteps.length - 1)) * 100;

  return (
    <Layout>
      <Layout.GrowingSection>
        <Progress value={progress}></Progress>
        <Stack flex={1} gap={'lg'} p={'md'}>
          {GettingStartedSteps[step]}
        </Stack>
      </Layout.GrowingSection>

      <Layout.FixedSection>
        <Group justify="space-between">
          <Button onClick={() => setStep(step - 1)} disabled={step == 0}>
            Previous
          </Button>
          <Button
            onClick={() => setStep(step + 1)}
            disabled={step == GettingStartedSteps.length - 1}
          >
            Next
          </Button>
        </Group>
      </Layout.FixedSection>
    </Layout>
  );
}
