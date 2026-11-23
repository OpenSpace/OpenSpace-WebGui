import { ActionCommand } from './Commands/ActionCommand';
import { AssetCommand } from './Commands/AssetCommand';
import { DeltaTimeCommand } from './Commands/DeltaTimeCommand';
import { NavigationStateCommand } from './Commands/NavigationStateCommand';
import { PauseCommand } from './Commands/PauseCommand';
import { PropertyCommand } from './Commands/PropertyCommand';
import { ScriptCommand } from './Commands/ScriptCommand';
import { TimeCommand } from './Commands/TimeCommand';
import { WaitCommand } from './Commands/WaitCommand';
import { CommandType, TestCommand } from './types';

interface Props {
  type: CommandType;
  onSubmit: (command: TestCommand) => void;
  onCancel: () => void;
  initialCommand?: TestCommand;
}

export function CommandForm({ type, onSubmit, onCancel, initialCommand }: Props) {
  switch (type) {
    case 'navigationstate':
      return (
        <NavigationStateCommand
          onSubmit={onSubmit}
          onCancel={onCancel}
          initialValue={
            initialCommand?.type === 'navigationstate' ? initialCommand.value : undefined
          }
        />
      );
    case 'asset':
      return (
        <AssetCommand
          onSubmit={onSubmit}
          onCancel={onCancel}
          initialValue={
            initialCommand?.type === 'asset' ? initialCommand.value : undefined
          }
        />
      );
    case 'property':
      return (
        <PropertyCommand
          onSubmit={onSubmit}
          onCancel={onCancel}
          initialValue={
            initialCommand?.type === 'property' ? initialCommand.value : undefined
          }
        />
      );
    case 'wait':
      return (
        <WaitCommand
          onSubmit={onSubmit}
          onCancel={onCancel}
          initialValue={
            initialCommand?.type === 'wait' ? initialCommand.value : undefined
          }
        />
      );
    case 'script':
      return (
        <ScriptCommand
          onSubmit={onSubmit}
          onCancel={onCancel}
          initialValue={
            initialCommand?.type === 'script' ? initialCommand.value : undefined
          }
        />
      );
    case 'time':
      return (
        <TimeCommand
          onSubmit={onSubmit}
          onCancel={onCancel}
          initialValue={
            initialCommand?.type === 'time' ? initialCommand.value : undefined
          }
        />
      );
    case 'pause':
      return (
        <PauseCommand
          onSubmit={onSubmit}
          onCancel={onCancel}
          initialValue={
            initialCommand?.type === 'pause' ? initialCommand.value : undefined
          }
        />
      );
    case 'deltatime':
      return (
        <DeltaTimeCommand
          onSubmit={onSubmit}
          onCancel={onCancel}
          initialValue={
            initialCommand?.type === 'deltatime' ? initialCommand.value : undefined
          }
        />
      );
    case 'action':
      return (
        <ActionCommand
          onSubmit={onSubmit}
          onCancel={onCancel}
          initialValue={
            initialCommand?.type === 'action' ? initialCommand.value : undefined
          }
        />
      );
    default:
      throw new Error(`Unhandled command type: ${type}`);
  }
}
