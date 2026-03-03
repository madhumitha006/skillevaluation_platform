import React from 'react';

interface SafeComponentProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const SafeComponent: React.FC<SafeComponentProps> = ({ 
  children, 
  fallback = <div>Loading...</div> 
}) => {
  try {
    return <>{children}</>;
  } catch (error) {
    console.error('SafeComponent caught error:', error);
    return <>{fallback}</>;
  }
};

export const withSafeRender = <P extends object>(
  Component: React.ComponentType<P>
) => {
  return (props: P) => (
    <SafeComponent>
      <Component {...props} />
    </SafeComponent>
  );
};