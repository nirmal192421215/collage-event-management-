import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors } from '../../constants/Colors';
import { BorderRadius } from '../../constants/Theme';

type BadgeVariant = 'primary' | 'success' | 'warning' | 'error' | 'info' | 'purple' | 'teal' | 'neutral';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  style?: ViewStyle;
}

const VARIANT_STYLES: Record<BadgeVariant, { bg: string; text: string }> = {
  primary: { bg: Colors.primaryUltraLight, text: Colors.primaryDark },
  success: { bg: Colors.successLight, text: Colors.success },
  warning: { bg: Colors.warningLight, text: Colors.warning },
  error: { bg: Colors.errorLight, text: Colors.error },
  info: { bg: Colors.infoLight, text: Colors.info },
  purple: { bg: '#EDE7FF', text: '#7C4DFF' },
  teal: { bg: '#E0F7FA', text: '#00BCD4' },
  neutral: { bg: Colors.surfaceElevated, text: Colors.textSecondary },
};

export default function Badge({ label, variant = 'primary', size = 'md', style }: BadgeProps) {
  const v = VARIANT_STYLES[variant];
  return (
    <View style={[styles.badge, { backgroundColor: v.bg, paddingHorizontal: size === 'sm' ? 8 : 12, paddingVertical: size === 'sm' ? 3 : 5 }, style]}>
      <Text style={[styles.text, { color: v.text, fontSize: size === 'sm' ? 11 : 12 }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: BorderRadius.full,
    alignSelf: 'flex-start',
  },
  text: {
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
