// Export an empty object to ensure this file is treated as a module.
// Required when using declare global {} blocks so that TypeScript treats the file correctly.
export {};

// Declare global types to extend the Window interface
declare global {
  interface Window {
    // Add a custom property to the Window object to indicate if it's within CEF.
    // This is set within the CEF environment so will be true within CEF and undefined otherwise.
    // This is useful for checking if the app is running in a CEF context or not.
    isWithinCEF: boolean | undefined;
  }
}
