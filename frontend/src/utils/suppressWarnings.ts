// Suppress React Router warnings in development
if (process.env.NODE_ENV === 'development') {
  const originalWarn = console.warn;
  console.warn = (...args) => {
    if (
      args[0]?.includes?.('React Router Future Flag Warning') ||
      args[0]?.includes?.('deprecation')
    ) {
      return;
    }
    originalWarn.apply(console, args);
  };
}