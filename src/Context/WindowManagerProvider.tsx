interface WindowManagerProviderProps {
  children: React.ReactNode;
}

export function WindowManagerProvider({ children }: WindowManagerProviderProps) {
  return <div>{children}</div>;
}
