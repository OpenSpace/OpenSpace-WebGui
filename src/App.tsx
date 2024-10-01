import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import "rc-dock/dist/rc-dock-dark.css";

function App() {
  return (
    <MantineProvider>
      <div>Hello World</div>
    </MantineProvider>
  );
}

export default App;
