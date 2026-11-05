import { useAppTheme } from '@/providers/ThemeProvider';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import Entypo from '@expo/vector-icons/Entypo';
import React, { useRef, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardTypeOptions,
  StyleProp,
  StyleSheet,
  TextInput,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { Text } from './Text';

export interface InlineEditableInputProps {
  /** Optional row label (e.g., "Part Number") */
  label?: string;
  /** Current text value */
  value?: string | number | null;
  /** Initial fallback value if uncontrolled */
  defaultValue?: string;
  /** Placeholder displayed when value is empty */
  placeholder?: string;
  /** Callback fired on every keystroke */
  onChangeText?: (text: string) => void;
  /** Callback fired when the user commits/saves the value via tick */
  onSave?: (savedValue: string) => void;
  /** Keyboard type (default, phone-pad, numeric, email-address, etc.) */
  keyboardType?: KeyboardTypeOptions;
  /** Capitalization mode */
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  /** Text alignment when in display mode */
  textAlign?: 'left' | 'right' | 'center';
  /** Highlight value with primary brand sky-blue */
  isHighlight?: boolean;
  /** Whether save mutation is currently loading */
  isSaving?: boolean;
  /** Maximum allowed input length */
  maxLength?: number;
  /** Whether the field is disabled from editing */
  disabled?: boolean;
  /** Optional auxiliary action icons to render beside the edit button */
  extraActions?: React.ReactNode;
  /** Container custom style */
  containerStyle?: StyleProp<ViewStyle>;
  /** Input custom style */
  inputStyle?: StyleProp<TextStyle>;
  /** Accessibility / test ID */
  testID?: string;
}

export function InlineEditableInput({
  label,
  value,
  defaultValue = '',
  placeholder = '',
  onChangeText,
  onSave,
  keyboardType = 'default',
  autoCapitalize = 'none',
  textAlign,
  isHighlight = false,
  isSaving = false,
  maxLength,
  disabled = false,
  extraActions,
  containerStyle,
  inputStyle,
  testID,
}: InlineEditableInputProps) {
  const { theme, isDark } = useAppTheme();
  const normalizedValue =
    value !== undefined && value !== null ? String(value) : undefined;
  const isControlled = normalizedValue !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
  const displayValue = isControlled ? normalizedValue : uncontrolledValue;
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<React.ElementRef<typeof TextInput>>(null);

  const activeBlue = isDark ? '#38BDF8' : '#0284C7';
  const textColor = isHighlight
    ? activeBlue
    : isDark
      ? '#F1F5F9'
      : '#0F172A';
  const placeholderColor = isDark ? '#64748B' : '#94A3B8';
  const editBg = isDark ? '#132347' : '#F8FAFC';
  const iconBg = isDark ? '#132347' : '#F1F5F9';
  const saveBg = isDark ? '#14532D' : '#DCFCE7';
  const saveIconColor = isDark ? '#4ADE80' : '#16A34A';

  const handleStartEdit = () => {
    if (disabled || isSaving) return;
    setIsEditing(true);
    // Short timeout to guarantee layout/mount before focusing
    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  };

  const handleSave = () => {
    setIsEditing(false);
    onSave?.(displayValue);
  };

  const handleChangeText = (text: string) => {
    if (!isControlled) {
      setUncontrolledValue(text);
    }
    onChangeText?.(text);
  };

  const resolvedAlignment = isEditing
    ? 'left'
    : textAlign ?? (label ? 'right' : 'left');

  return (
    <View style={[styles.container, containerStyle]}>
      {label ? (
        <Text variant="caption" color="secondary" style={styles.label}>
          {label}
        </Text>
      ) : null}

      <View
        style={[
          styles.inputWrapper,
          isEditing && [
            styles.inputWrapperEditing,
            {
              backgroundColor: editBg,
              borderColor: activeBlue,
            },
          ],
        ]}
      >
        <TextInput
          ref={inputRef}
          value={displayValue}
          onChangeText={handleChangeText}
          placeholder={placeholder || (label ? `Enter ${label.toLowerCase()}` : '')}
          placeholderTextColor={placeholderColor}
          editable={isEditing && !disabled && !isSaving}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          maxLength={maxLength}
          onSubmitEditing={handleSave}
          returnKeyType="done"
          testID={testID}
          style={[
            styles.input,
            {
              color: displayValue ? textColor : placeholderColor,
              fontFamily: isHighlight
                ? theme.tokens.typography.fonts.bold
                : theme.tokens.typography.fonts.medium,
              textAlign: resolvedAlignment,
            },
            inputStyle,
          ]}
        />
      </View>

      <View style={styles.actionsContainer}>
        {isEditing ? (
          <TouchableOpacity
            onPress={handleSave}
            disabled={isSaving}
            style={[styles.iconButton, { backgroundColor: saveBg }]}
            accessibilityLabel="Save value"
            accessibilityRole="button"
          >
            {isSaving ? (
              <ActivityIndicator size="small" color={saveIconColor} />
            ) : (
              <Ionicons name="checkmark-circle" size={20} color={saveIconColor} />
            )}
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={handleStartEdit}
            disabled={disabled || isSaving}
            style={[
              styles.iconButton,
              { backgroundColor: iconBg },
              (disabled || isSaving) && { opacity: 0.5 },
            ]}
            accessibilityLabel={`Edit ${label || 'value'}`}
            accessibilityRole="button"
          >
            {/* <Ionicons name="pencil" size={15} color={activeBlue} /> */}
            {/* <Entypo name="edit" size={16} color={activeBlue} /> */}
            <FontAwesome name="edit" size={16} color={activeBlue} />
          </TouchableOpacity>
        )}

        {extraActions}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 38,
    paddingVertical: 2,
  },
  label: {
    fontSize: 12,
    minWidth: 100,
    maxWidth: 130,
    marginRight: 6,
  },
  inputWrapper: {
    flex: 1,
    justifyContent: 'center',
    height: 36,
    marginRight: 8,
    paddingHorizontal: 4,
  },
  inputWrapperEditing: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  input: {
    fontSize: 13,
    paddingVertical: 0,
    margin: 0,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconButton: {
    width: 30,
    height: 30,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
