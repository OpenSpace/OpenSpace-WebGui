export type Vec3 = [number, number, number];

export interface NavigationStateValue {
  anchor: string;
  position: Vec3;
  aim?: string;
  pitch?: number;
  referenceFrame?: string;
  up?: Vec3;
  yaw?: number;
  timestamp?: string;
}

export interface PropertyCommandValue {
  property: string;
  value: string | number | boolean;
}

export type TestCommand =
  | { type: 'navigationstate'; value: NavigationStateValue }
  | { type: 'asset'; value: string }
  | { type: 'property'; value: PropertyCommandValue }
  | { type: 'wait'; value: number }
  | { type: 'script'; value: string }
  | { type: 'time'; value: string }
  | { type: 'pause'; value: boolean }
  | { type: 'deltatime'; value: number }
  | { type: 'action'; value: string }
  | { type: 'screenshot' };

export interface OsTest {
  profile: string;
  commands: TestCommand[];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isTestCommand(command: unknown): command is TestCommand {
  if (!isRecord(command)) {
    return false;
  }
  const { type, value } = command;
  switch (type) {
    case 'screenshot':
      return true;
    case 'wait':
    case 'deltatime':
      return typeof value === 'number';
    case 'pause':
      return typeof value === 'boolean';
    case 'script':
    case 'time':
    case 'asset':
    case 'action':
      return typeof value === 'string';
    case 'property':
      return (
        isRecord(value) &&
        typeof value.property === 'string' &&
        ['string', 'number', 'boolean'].includes(typeof value.value)
      );
    case 'navigationstate':
      return (
        isRecord(value) &&
        typeof value.anchor === 'string' &&
        Array.isArray(value.position)
      );
    default:
      return false;
  }
}

export function isOsTest(test: unknown): test is OsTest {
  return (
    isRecord(test) &&
    (test.profile === undefined || typeof test.profile === 'string') &&
    Array.isArray(test.commands) &&
    test.commands.every(isTestCommand)
  );
}
