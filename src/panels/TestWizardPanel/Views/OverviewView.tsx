import { useTranslation } from 'react-i18next';
import {
  ActionIcon,
  Button,
  Divider,
  Group,
  Select,
  Stack,
  Text,
  TextInput
} from '@mantine/core';

import {
  DragReorderList,
  OnDragEndProps
} from '@/components/DragReorderList/DragReorderList';
import { Layout } from '@/components/Layout/Layout';
import { MinusIcon, PlusIcon } from '@/icons/icons';

import { ResettableField } from '../ResettableField';
import { SaveCancelButtons } from '../SaveCancelButtons';
import { COMMAND_TYPES, CommandEntry, CommandType, TestCommand } from '../types';
import { isCommandType } from '../util';

interface Props {
  name: string;
  onNameChange: (name: string) => void;
  profile: string;
  onProfileChange: (profile: string) => void;
  onProfileReset: () => void;
  isProfileResetDisabled: boolean;
  commands: CommandEntry[];
  onReorder: (props: OnDragEndProps<CommandEntry>) => void;
  onRemove: (index: number) => void;
  commandType: CommandType | null;
  onCommandTypeChange: (commandType: CommandType | null) => void;
  onAddCommand: () => void;
  onSave: () => void;
  onCancel: () => void;
}

export function OverviewView({
  name,
  onNameChange,
  profile,
  onProfileChange,
  onProfileReset,
  isProfileResetDisabled,
  commands,
  onReorder,
  onRemove,
  commandType,
  onCommandTypeChange,
  onAddCommand,
  onSave,
  onCancel
}: Props) {
  const { t } = useTranslation('panel-testwizard');
  const { t: tLabel } = useTranslation('panel-testwizard', {
    keyPrefix: 'command-labels'
  });

  const profileLabel = t('profile.label');

  function commandLabel(cmd: TestCommand): string {
    switch (cmd.type) {
      case 'screenshot':
        return tLabel('screenshot');
      case 'wait':
        return tLabel('wait', { value: cmd.value });
      case 'deltatime':
        return tLabel('deltatime', { value: cmd.value });
      case 'pause':
        return tLabel('pause', {
          value: cmd.value ? tLabel('pause-on') : tLabel('pause-off')
        });
      case 'script':
        return tLabel('script', { value: cmd.value });
      case 'time':
        return tLabel('time', { value: cmd.value });
      case 'asset':
        return tLabel('asset', { value: cmd.value });
      case 'action':
        return tLabel('action', { value: cmd.value });
      case 'property':
        return tLabel('property', {
          property: cmd.value.property,
          value: String(cmd.value.value)
        });
      case 'navigationstate':
        return tLabel('navigationstate', { anchor: cmd.value.anchor });
      default:
        throw new Error(`Unhandled command type: ${cmd}`);
    }
  }

  return (
    <Layout gap={'md'}>
      <Layout.FixedSection>
        <Stack gap={'xs'}>
          <TextInput
            label={t('test-name.label')}
            placeholder={t('test-name.placeholder')}
            value={name}
            onChange={(event) => onNameChange(event.currentTarget.value)}
            required
          />
          <ResettableField
            label={profileLabel}
            onReset={onProfileReset}
            disabled={isProfileResetDisabled}
          >
            <TextInput
              label={profileLabel}
              placeholder={t('profile.placeholder')}
              value={profile}
              onChange={(event) => onProfileChange(event.currentTarget.value)}
              required
            />
          </ResettableField>
        </Stack>
      </Layout.FixedSection>

      <Layout.FixedSection>
        <Divider
          label={t('sections.commands', { number: commands.length })}
          labelPosition={'left'}
        />
      </Layout.FixedSection>

      <Layout.GrowingSection mih={100}>
        {commands.length === 0 && (
          <Text c={'dimmed'} size={'sm'}>
            {t('no-commands')}
          </Text>
        )}
        <DragReorderList<CommandEntry>
          id={'testCommands'}
          data={commands}
          keyFunc={(entry) => entry.id}
          onDragEnd={onReorder}
          gap={'xs'}
          renderFunc={(entry, index) => (
            <Group justify={'space-between'} wrap={'nowrap'}>
              <Text size={'sm'} style={{ overflowWrap: 'anywhere' }}>
                {commandLabel(entry.cmd)}
              </Text>
              <ActionIcon
                variant={'light'}
                size={'sm'}
                color={'red'}
                onClick={() => onRemove(index)}
                aria-label={`${t('remove-command-aria-label')}: ${commandLabel(entry.cmd)}`}
              >
                <MinusIcon />
              </ActionIcon>
            </Group>
          )}
        />
      </Layout.GrowingSection>

      <Layout.FixedSection>
        <Stack gap={'md'}>
          <Group gap={'xs'} wrap={'nowrap'}>
            <Select
              flex={1}
              aria-label={t('add-command-form.type-label')}
              placeholder={t('add-command-form.type-placeholder')}
              data={COMMAND_TYPES.map((id) => ({
                value: id,
                label: t(`add-command-form.types.${id}.label`)
              }))}
              value={commandType}
              onChange={(value) =>
                onCommandTypeChange(value !== null && isCommandType(value) ? value : null)
              }
              allowDeselect={false}
            />
            <Button
              leftSection={<PlusIcon />}
              onClick={onAddCommand}
              disabled={commandType === null}
            >
              {t('overview.add')}
            </Button>
          </Group>
          <SaveCancelButtons
            onSave={onSave}
            onCancel={onCancel}
            saveDisabled={!profile || !name}
          />
        </Stack>
      </Layout.FixedSection>
    </Layout>
  );
}
