import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from '@/components/ui';

export interface DetailRowProps {
  label: string;
  value?: string | number | null;
  subValue?: string | null;
  fullWidth?: boolean;
  isHighlight?: boolean;
  valueColor?: string;
}

export function DetailRow({
  label,
  value,
  subValue,
  fullWidth,
  isHighlight,
  valueColor,
}: DetailRowProps) {
  const display =
    value !== undefined && value !== null && String(value).trim() !== ''
      ? String(value)
      : '—';

  return (
    <View style={[styles.rowContainer, fullWidth && styles.rowFullWidth]}>
      <Text variant="caption" color="secondary" style={styles.rowLabel}>
        {label}
      </Text>
      <Text
        variant="body"
        weight={isHighlight ? 'bold' : 'regular'}
        style={[
          styles.rowVal,
          valueColor ? { color: valueColor } : undefined,
          isHighlight ? { color: '#0284C7' } : undefined,
        ]}
      >
        {display} {subValue ? `(${subValue})` : ''}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 2,
  },
  rowFullWidth: {
    flexDirection: 'column',
    gap: 2,
  },
  rowLabel: {
    fontSize: 12,
    minWidth: 120,
  },
  rowVal: {
    flex: 1,
    textAlign: 'right',
    fontSize: 13,
  },
});

