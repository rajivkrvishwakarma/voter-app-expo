import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ModalWrapper, Text } from '@/components/ui';
import {
  VOTER_COLOR_CODES,
  type VoterColorOption,
} from '@/constants';
import { useAppTheme } from '@/providers/ThemeProvider';

export interface ColorCodePickerModalProps {
  visible: boolean;
  selectedColor: VoterColorOption;
  onSelectColor: (option: VoterColorOption) => void;
  onClose: () => void;
}

export function ColorCodePickerModal({
  visible,
  selectedColor,
  onSelectColor,
  onClose,
}: ColorCodePickerModalProps) {
  const { isDark } = useAppTheme();
  const cardBorder = isDark ? '#1E356A' : '#EDF2F7';
  const activeBlue = isDark ? '#38BDF8' : '#0284C7';

  return (
    <ModalWrapper
      visible={visible}
      onClose={onClose}
      type="bottom-sheet"
      title="Select Colour Code"
      subtitle="Categorize voter mobilization status"
    >
      <ScrollView
        style={styles.colorListScroll}
        contentContainerStyle={styles.colorListContent}
        showsVerticalScrollIndicator={false}
      >
        {VOTER_COLOR_CODES.map((item) => {
          const isSelected =
            selectedColor.hex.toLowerCase() === item.hex.toLowerCase() &&
            selectedColor.key === item.key;
          const itemIsLight =
            item.hex.toLowerCase() === '#ffffff' ||
            item.hex.toLowerCase() === '#ffff00';

          return (
            <TouchableOpacity
              key={item.key}
              onPress={() => onSelectColor(item)}
              style={[
                styles.colorOptionRow,
                {
                  backgroundColor: isDark ? '#101F42' : '#F8FAFC',
                  borderColor: isSelected ? activeBlue : cardBorder,
                },
                isSelected && styles.selectedRowBorder,
              ]}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.colorOptionCircle,
                  { backgroundColor: item.hex },
                  itemIsLight && styles.subtleBorder,
                ]}
              />
              <View style={styles.colorOptionTextCol}>
                <Text
                  variant="body"
                  weight={isSelected ? 'bold' : 'medium'}
                  style={{ textTransform: 'capitalize' }}
                >
                  {item.name}
                </Text>
                <Text variant="caption" color="secondary">
                  {item.hex}
                </Text>
              </View>

              {isSelected ? (
                <Ionicons name="checkmark-circle" size={22} color={activeBlue} />
              ) : (
                <Ionicons
                  name="chevron-forward"
                  size={16}
                  color={isDark ? '#475569' : '#94A3B8'}
                />
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </ModalWrapper>
  );
}

const styles = StyleSheet.create({
  colorListScroll: {
    maxHeight: 360,
  },
  colorListContent: {
    gap: 8,
    paddingBottom: 8,
  },
  colorOptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  selectedRowBorder: {
    borderWidth: 1.5,
  },
  colorOptionCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    marginRight: 14,
  },
  subtleBorder: {
    borderWidth: 1.5,
    borderColor: '#94A3B8',
  },
  colorOptionTextCol: {
    flex: 1,
    gap: 1,
  },
});

