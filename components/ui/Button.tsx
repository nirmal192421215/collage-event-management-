import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Gradients } from '../../constants/Colors';
import { BorderRadius, Shadow } from '../../constants/Theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
}

export default function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  style,
  textStyle,
  fullWidth = false,
}: ButtonProps) {
  const sizeStyles = {
    sm: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: BorderRadius.md },
    md: { paddingHorizontal: 24, paddingVertical: 12, borderRadius: BorderRadius.md },
    lg: { paddingHorizontal: 32, paddingVertical: 16, borderRadius: BorderRadius.lg },
  };

  const textSizes = {
    sm: { fontSize: 13 },
    md: { fontSize: 15 },
    lg: { fontSize: 17 },
  };

  const isDisabled = disabled || loading;

  if (variant === 'primary') {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={isDisabled}
        style={[fullWidth && styles.fullWidth, style]}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={isDisabled ? ['#B0D0F0', '#9EC5E8'] : Gradients.primary}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.base, sizeStyles[size], fullWidth && styles.fullWidth, Shadow.md]}
        >
          {loading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <>
              {icon}
              <Text style={[styles.textPrimary, textSizes[size], textStyle]}>{title}</Text>
            </>
          )}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  if (variant === 'outline') {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={isDisabled}
        style={[styles.base, styles.outline, sizeStyles[size], fullWidth && styles.fullWidth, isDisabled && styles.disabled, style]}
        activeOpacity={0.7}
      >
        {loading ? <ActivityIndicator color={Colors.primary} size="small" /> : (
          <>
            {icon}
            <Text style={[styles.textOutline, textSizes[size], textStyle]}>{title}</Text>
          </>
        )}
      </TouchableOpacity>
    );
  }

  if (variant === 'ghost') {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={isDisabled}
        style={[styles.base, sizeStyles[size], fullWidth && styles.fullWidth, isDisabled && styles.disabled, style]}
        activeOpacity={0.7}
      >
        {icon}
        <Text style={[styles.textGhost, textSizes[size], textStyle]}>{title}</Text>
      </TouchableOpacity>
    );
  }

  if (variant === 'danger') {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={isDisabled}
        style={[styles.base, styles.danger, sizeStyles[size], fullWidth && styles.fullWidth, isDisabled && styles.disabled, style]}
        activeOpacity={0.8}
      >
        {loading ? <ActivityIndicator color="#fff" size="small" /> : (
          <>
            {icon}
            <Text style={[styles.textPrimary, textSizes[size], textStyle]}>{title}</Text>
          </>
        )}
      </TouchableOpacity>
    );
  }

  // secondary
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      style={[styles.base, styles.secondary, sizeStyles[size], fullWidth && styles.fullWidth, isDisabled && styles.disabled, style]}
      activeOpacity={0.8}
    >
      {loading ? <ActivityIndicator color={Colors.primary} size="small" /> : (
        <>
          {icon}
          <Text style={[styles.textSecondary, textSizes[size], textStyle]}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  fullWidth: { width: '100%' },
  outline: {
    borderWidth: 2,
    borderColor: Colors.primary,
    backgroundColor: 'transparent',
  },
  secondary: {
    backgroundColor: Colors.primaryUltraLight,
  },
  danger: {
    backgroundColor: Colors.error,
    borderRadius: BorderRadius.md,
  },
  disabled: { opacity: 0.5 },
  textPrimary: {
    color: Colors.white,
    fontWeight: '700',
  },
  textOutline: {
    color: Colors.primary,
    fontWeight: '700',
  },
  textGhost: {
    color: Colors.primary,
    fontWeight: '600',
  },
  textSecondary: {
    color: Colors.primaryDark,
    fontWeight: '700',
  },
});
