import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Colors } from '../../constants/Colors';
import { BorderRadius, Shadow } from '../../constants/Theme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'default' | 'elevated' | 'flat' | 'outlined';
  padding?: number;
}

export default function Card({ children, style, variant = 'default', padding = 16 }: CardProps) {
  return (
    <View style={[styles.base, styles[variant], { padding }, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.white,
  },
  default: {
    ...Shadow.md,
  },
  elevated: {
    ...Shadow.lg,
  },
  flat: {
    backgroundColor: Colors.surfaceElevated,
  },
  outlined: {
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
  },
});
