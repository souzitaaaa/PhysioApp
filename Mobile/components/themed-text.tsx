import React from 'react';
import { Text, TextProps, useColorScheme } from 'react-native';

type ThemedTextProps = TextProps & { children: React.ReactNode };

export const ThemedText = ({ children, style, ...props }: ThemedTextProps) => {
  const scheme = useColorScheme(); 
  return (
    <Text
      style={[
        { color: scheme === 'dark' ? 'white' : 'black' },
        style,
      ]}
      {...props}
    >
      {children}
    </Text>
  );
};
