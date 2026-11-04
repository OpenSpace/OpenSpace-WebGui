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
  onAdd: (command: TestCommand) => void;
  onCancel: () => void;
}

export function AddCommandForm({ type, onAdd, onCancel }: Props) {
  switch (type) {
    case 'navigationstate':
      return <NavigationStateCommand onAdd={onAdd} onCancel={onCancel} />;
    case 'asset':
      return <AssetCommand onAdd={onAdd} onCancel={onCancel} />;
    case 'property':
      return <PropertyCommand onAdd={onAdd} onCancel={onCancel} />;
    case 'wait':
      return <WaitCommand onAdd={onAdd} onCancel={onCancel} />;
    case 'script':
      return <ScriptCommand onAdd={onAdd} onCancel={onCancel} />;
    case 'time':
      return <TimeCommand onAdd={onAdd} onCancel={onCancel} />;
    case 'pause':
      return <PauseCommand onAdd={onAdd} onCancel={onCancel} />;
    case 'deltatime':
      return <DeltaTimeCommand onAdd={onAdd} onCancel={onCancel} />;
    case 'action':
      return <ActionCommand onAdd={onAdd} onCancel={onCancel} />;
    default:
      throw new Error(`Unhandled command type: ${type}`);
  }
}
