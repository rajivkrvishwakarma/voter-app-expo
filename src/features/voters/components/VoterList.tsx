import React, { useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  View,
} from 'react-native';
import { Text } from '@/components/ui';
import { useAppTheme } from '@/providers/ThemeProvider';
import { VoterCard } from './VoterCard';
import type { Voter } from '../types/voter.types';

export interface VoterListProps {
  voters: Voter[];
  isLoading?: boolean;
  isRefreshing?: boolean;
  onRefresh?: () => void;
  onViewDetails?: (voter: Voter) => void;
  ListHeaderComponent?: React.ReactElement;
  contentContainerStyle?: object;
}

export function VoterList({
  voters,
  isLoading,
  isRefreshing = false,
  onRefresh,
  onViewDetails,
  ListHeaderComponent,
  contentContainerStyle,
}: VoterListProps) {
  const { theme } = useAppTheme();
  const [selectedExpandedId, setSelectedExpandedId] = useState<number | null>(null);

  // Automatically default to the first voter item until user explicitly toggles
  const activeExpandedId =
    selectedExpandedId !== null
      ? selectedExpandedId
      : voters.length > 0
      ? voters[0].id
      : null;

  const toggleExpand = (id: number) => {
    setSelectedExpandedId((prev) => (prev === id ? -1 : id));
  };

  if (isLoading && voters.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={theme.colors.brand.primary} />
        <Text variant="body" color="secondary" style={styles.loadingText}>
          Loading voters list...
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={voters}
      keyExtractor={(item, index) => `${item.id}-${item.voter_id || index}`}
      ListHeaderComponent={ListHeaderComponent || undefined}
      contentContainerStyle={[styles.listContent, contentContainerStyle]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.brand.primary}
          />
        ) : undefined
      }
      renderItem={({ item }) => (
        <VoterCard
          voter={item}
          isExpanded={activeExpandedId === item.id}
          onToggleExpand={() => toggleExpand(item.id)}
          onViewDetails={onViewDetails}
        />
      )}
      ListEmptyComponent={
        !isLoading ? (
          <View style={styles.emptyContainer}>
            <Text variant="subtitle" weight="bold" color="secondary">
              No Voters Found
            </Text>
            <Text variant="caption" color="secondary" style={styles.emptySub}>
              Try adjusting your search keywords.
            </Text>
          </View>
        ) : undefined
      }
    />
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 100, // Space for bottom Floating Action Button
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    marginTop: 12,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
  },
  emptySub: {
    marginTop: 6,
    textAlign: 'center',
  },
});
