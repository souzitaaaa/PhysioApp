import React from 'react';
import { View, ViewProps, useColorScheme } from 'react-native';

type ThemedViewProps = ViewProps & { children: React.ReactNode };

export const ThemedView = ({ children, style, ...props }: ThemedViewProps) => {
  const scheme = useColorScheme();
  return (
    <View
      style={[
        { backgroundColor: scheme === 'dark' ? '#222' : '#fff', flex: 1 },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
};
