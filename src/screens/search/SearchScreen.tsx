import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button, Text, WaveScreenContainer } from '@/components/ui';
import {
  useAllVotersQuery,
  useSearchByNameQuery,
  VoterList,
  type Voter,
} from '@/features/voters';
import { useDebounce } from '@/hooks/useDebounce';
import { useAppTheme } from '@/providers/ThemeProvider';

export interface SearchScreenProps {
  onBack: () => void;
}

export function SearchScreen({ onBack }: SearchScreenProps) {
  const { isDark } = useAppTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVoter, setSelectedVoter] = useState<Voter | null>(null);

  // Debounce search query by 400ms before triggering the API
  const debouncedQuery = useDebounce(searchQuery, 400);
  const isSearching = debouncedQuery.trim().length > 0;
  const isTyping = searchQuery.trim().length > 0 && searchQuery !== debouncedQuery;

  // 1. Initial list of all voters from /api/all-voter-list
  const allVotersQuery = useAllVotersQuery();

  // 2. Dynamic voter search from /api/search-by-name?name={name}
  const searchQueryResult = useSearchByNameQuery(debouncedQuery);

  // Determine active dataset
  const activeQuery = isSearching ? searchQueryResult : allVotersQuery;
  const voters = activeQuery.data?.voters ?? [];
  const totalCount = activeQuery.data?.count ?? voters.length;
  const isLoading = isSearching ? searchQueryResult.isLoading : allVotersQuery.isLoading;
  const isRefetching = isSearching ? searchQueryResult.isRefetching : allVotersQuery.isRefetching;
  const showSearchSpinner = isTyping || (isSearching && searchQueryResult.isFetching);

  const handleBarcodeScan = () => {
    Alert.alert('Scanner', 'QR / Barcode voter card scanner ready.');
  };

  const handleVoiceSearch = () => {
    Alert.alert('Voice Search', 'Voice voter search initialized.');
  };

  const searchBarBg = isDark ? '#0D1935' : '#FFFFFF';
  const searchBarBorder = isDark ? '#1E356A' : '#EDF2F7';
  const activeBlue = isDark ? '#38BDF8' : '#0284C7';

  return (
    <WaveScreenContainer
      onBack={onBack}
      headerCenter={
        <View style={styles.titleRow}>
          <Ionicons name="people" size={20} color="#FFFFFF" style={styles.groupIcon} />
          <Text style={styles.titleText}>
            Total - {totalCount.toLocaleString()}, {isSearching ? 'Search' : 'All'}
          </Text>
        </View>
      }
    >
      {/* Floating Search Bar (positioned over wavy background curve) */}
      <View style={styles.searchBarWrapper}>
        <View
          style={[
            styles.searchBar,
            { backgroundColor: searchBarBg, borderColor: searchBarBorder },
          ]}
        >
          <Ionicons name="search-outline" size={20} color="#94A3B8" style={styles.searchIcon} />
          <TextInput
            placeholder="Search Voters"
            placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={[styles.searchInput, { color: isDark ? '#F8FAFC' : '#0F172A' }]}
            clearButtonMode="never"
            autoCapitalize="none"
          />

          {showSearchSpinner ? (
            <ActivityIndicator size="small" color={activeBlue} style={styles.clearBtn} />
          ) : searchQuery.length > 0 ? (
            <Pressable onPress={() => setSearchQuery('')} hitSlop={6} style={styles.clearBtn}>
              <Ionicons name="close-circle" size={18} color="#94A3B8" />
            </Pressable>
          ) : null}

          <View style={[styles.inputDivider, { backgroundColor: searchBarBorder }]} />

          <TouchableOpacity
            onPress={handleVoiceSearch}
            hitSlop={8}
            style={styles.micBtn}
            accessibilityLabel="Voice Search"
          >
            <Ionicons name="mic" size={20} color={activeBlue} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Reusable Voter List */}
      <VoterList
        voters={voters}
        isLoading={isLoading}
        isRefreshing={isRefetching}
        onRefresh={() => {
          if (isSearching) {
            void searchQueryResult.refetch();
          } else {
            void allVotersQuery.refetch();
          }
        }}
        onViewDetails={(voter) => setSelectedVoter(voter)}
        contentContainerStyle={styles.listContainer}
      />

      {/* Floating Action Button (FAB) for Barcode/QR Scanning */}
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={handleBarcodeScan}
        style={[styles.fab, { backgroundColor: '#0284C7' }]}
        accessibilityLabel="Scan Barcode"
      >
        <Ionicons name="barcode-outline" size={28} color="#FFFFFF" />
      </TouchableOpacity>

      {/* Voter Details Modal */}
      <Modal
        visible={!!selectedVoter}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedVoter(null)}
      >
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalContent, { backgroundColor: searchBarBg, borderColor: searchBarBorder }]}>
            <View style={styles.modalHandle} />
            <Text variant="subtitle" weight="bold" style={styles.modalTitle}>
              {selectedVoter?.name}
            </Text>

            <View style={styles.modalInfoGrid}>
              <View style={styles.infoRow}>
                <Text variant="caption" color="secondary">Voter ID:</Text>
                <Text variant="body" weight="bold" style={{ color: activeBlue }}>
                  {selectedVoter?.voter_id || '—'}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text variant="caption" color="secondary">Age / Gender:</Text>
                <Text variant="body">
                  {selectedVoter?.age ? `${selectedVoter.age} yrs` : '—'} • {selectedVoter?.gender || '—'}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text variant="caption" color="secondary">Father / Relative:</Text>
                <Text variant="body">{selectedVoter?.father_name || '—'}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text variant="caption" color="secondary">Booth & Part:</Text>
                <Text variant="body">
                  Booth {selectedVoter?.booth || '—'} (Part {selectedVoter?.part_no || '—'})
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text variant="caption" color="secondary">SRN:</Text>
                <Text variant="body">{selectedVoter?.srn || '—'}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text variant="caption" color="secondary">Address:</Text>
                <Text variant="body" numberOfLines={2}>
                  {selectedVoter?.address || '—'}
                </Text>
              </View>
            </View>

            <Button
              title="Close"
              variant="outline"
              size="md"
              onPress={() => setSelectedVoter(null)}
            />
          </View>
        </View>
      </Modal>
    </WaveScreenContainer>
  );
}

const styles = StyleSheet.create({
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  groupIcon: {
    marginRight: 8,
  },
  titleText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  searchBarWrapper: {
    paddingHorizontal: 16,
    marginTop: -36, // Pull up over the bottom wave curve
    marginBottom: 12,
    zIndex: 10,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    paddingHorizontal: 16,
    shadowColor: '#0284C7',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 0,
    height: '100%',
  },
  clearBtn: {
    padding: 4,
    marginRight: 4,
  },
  inputDivider: {
    width: 1,
    height: 22,
    marginHorizontal: 8,
  },
  micBtn: {
    padding: 4,
  },
  listContainer: {
    paddingTop: 4,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 24,
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
    zIndex: 50,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    padding: 24,
    paddingBottom: 40,
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#CBD5E1',
    alignSelf: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 16,
    textAlign: 'center',
  },
  modalInfoGrid: {
    gap: 10,
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
