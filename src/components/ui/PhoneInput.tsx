import { useAppTheme } from '@/providers/ThemeProvider';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  TextInput,
  View,
  type TextInputProps,
  type ViewStyle,
} from 'react-native';
import { Text } from './Text';

export interface PhoneInputProps extends Omit<TextInputProps, 'onChangeText' | 'value'> {
  label?: string;
  optional?: boolean;
  helperRight?: string;
  countryCode?: string;
  onCountryCodeToggle?: () => void;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  containerStyle?: ViewStyle;
}

export function PhoneInput({
  label = 'Mobile Number',
  optional = true,
  helperRight,
  countryCode = 'us +1',
  onCountryCodeToggle,
  value,
  onChangeText,
  error,
  containerStyle,
  ...textInputProps
}: PhoneInputProps) {
  const { theme, isDark } = useAppTheme();
  const [isFocused, setIsFocused] = useState(false);

  const hasError = Boolean(error);
  const inputBg = isDark ? '#101C38' : '#F1F5FD';

  const getBorderColor = () => {
    if (hasError) return theme.colors.status.error.solid;
    if (isFocused) return theme.colors.brand.primary;
    return isDark ? '#1E356A' : 'transparent';
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {/* Label Row */}
      <View style={styles.labelRow}>
        <View style={styles.labelBadgeRow}>
          <Text variant="label" weight="bold" style={styles.fieldLabel}>
            {label}
          </Text>
          {optional && (
            <View style={[styles.optionalBadge, { backgroundColor: isDark ? '#16274E' : '#E2EAF8' }]}>
              <Text variant="caption" weight="medium" style={[styles.optionalText, { color: isDark ? '#A4BFEF' : '#475569' }]}>
                Optional
              </Text>
            </View>
          )}
        </View>

        {helperRight && (
          <Text variant="caption" color="secondary" style={styles.helperRight}>
            {helperRight}
          </Text>
        )}
      </View>

      {/* Inputs Row */}
      <View style={styles.phoneRow}>
        {/* Country Code Pill */}
        <Pressable
          onPress={onCountryCodeToggle}
          style={[styles.countryCodeBox, { backgroundColor: inputBg, borderColor: isDark ? '#1E356A' : 'transparent' }]}
        >
          <Text variant="body" weight="medium" style={[styles.countryCodeText, { color: theme.colors.text.primary }]}>
            {countryCode}
          </Text>
        </Pressable>

        {/* Phone Input Box */}
        <View
          style={[
            styles.phoneInputBox,
            {
              backgroundColor: inputBg,
              borderColor: getBorderColor(),
            },
          ]}
        >
          <Ionicons name="call-outline" size={18} color="#1D61E7" style={styles.leftIcon} />
          <TextInput
            placeholder="(555) 342-8921"
            placeholderTextColor={theme.colors.text.muted}
            value={value}
            maxLength={10}
            onChangeText={onChangeText}
            keyboardType="phone-pad"
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            style={[styles.textInput, { color: theme.colors.text.primary }]}
            {...textInputProps}

          />
        </View>
      </View>

      {/* Error Message */}
      {error && (
        <Text variant="caption" style={styles.errorText}>
          {error}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 7,
  },
  labelBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fieldLabel: {
    fontSize: 13,
    letterSpacing: 0.2,
  },
  optionalBadge: {
    marginLeft: 6,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  optionalText: {
    fontSize: 10,
  },
  helperRight: {
    fontSize: 11,
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  countryCodeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: 48,
    height: 48,
    borderRadius: 14,
    borderWidth: 1.5,
    paddingHorizontal: 10,
  },
  countryCodeText: {
    fontSize: 13,
  },
  phoneInputBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderRadius: 14,
    borderWidth: 1.5,
    paddingHorizontal: 12,
  },
  leftIcon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    height: 48,
    fontSize: 14,
    paddingVertical: 0,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 11,
    marginTop: 4,
    marginLeft: 4,
  },
});

