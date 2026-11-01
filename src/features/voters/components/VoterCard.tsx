import React from 'react';
import {
  Image,
  Linking,
  Pressable,
  Share,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@/components/ui';
import { useAppTheme } from '@/providers/ThemeProvider';
import { resolveImageUrl } from '@/utils/imageUrl';
import type { Voter } from '../types/voter.types';

export interface VoterCardProps {
  voter: Voter;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onViewDetails?: (voter: Voter) => void;
}

export function VoterCard({
  voter,
  isExpanded,
  onToggleExpand,
  onViewDetails,
}: VoterCardProps) {
  const { isDark } = useAppTheme();

  const cardBg = isDark ? '#0D1935' : '#FFFFFF';
  const cardBorder = isDark ? '#1E356A' : '#EDF2F7';
  const iconBoxBg = isDark ? '#101F42' : '#F0F9FF';
  const activeBlue = isDark ? '#38BDF8' : '#0284C7';

  const avatarUri = voter.image ? resolveImageUrl(voter.image) : null;

  const handleWhatsApp = async () => {
    const phone = voter.mobile_1 || voter.survey?.mobile_2;
    if (!phone) return;
    const cleanPhone = phone.replace(/\D/g, '');
    const url = `whatsapp://send?phone=${cleanPhone}`;
    const canOpen = await Linking.canOpenURL(url);
    if (canOpen) {
      await Linking.openURL(url);
    } else {
      await Linking.openURL(`https://wa.me/${cleanPhone}`);
    }
  };

  const handleCall = () => {
    const phone = voter.mobile_1 || voter.survey?.mobile_2;
    if (phone) {
      void Linking.openURL(`tel:${phone}`);
    }
  };

  const handleShare = async () => {
    await Share.share({
      title: voter.name,
      message: `Voter: ${voter.name}\nVoter ID: ${voter.voter_id}\nBooth: ${voter.booth}\nPart: ${voter.part_no}\nSRN: ${voter.srn}\nAddress: ${voter.address}`,
    });
  };

  const handleDetails = () => {
    if (onViewDetails) {
      onViewDetails(voter);
    } else {
      onToggleExpand();
    }
  };

  return (
    <View style={[styles.card, { backgroundColor: cardBg, borderColor: cardBorder }]}>
      {/* Top Header Row */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onToggleExpand}
        style={styles.cardHeader}
      >
        {/* Avatar or User Icon */}
        <View style={[styles.avatarBox, { backgroundColor: iconBoxBg }]}>
          {avatarUri ? (
            <Image source={{ uri: avatarUri }} style={styles.avatarImage} resizeMode="cover" />
          ) : (
            <Ionicons name="person-outline" size={24} color={activeBlue} />
          )}
        </View>

        {/* Voter Main Details */}
        <View style={styles.detailsColumn}>
          <Text
            variant="body"
            weight="bold"
            numberOfLines={1}
            style={[styles.voterName, { color: isDark ? '#F8FAFC' : '#0F172A' }]}
          >
            {voter.name}
          </Text>

          <View style={styles.metaRow}>
            <Text variant="caption" color="secondary" numberOfLines={1}>
              {voter.village ? `${voter.village}(Part no ${voter.part_no || '1'})` : `Part no ${voter.part_no || '1'}`}
            </Text>
            <Text variant="caption" color="secondary" style={styles.dividerDot}>
              |
            </Text>
            <Text variant="caption" color="secondary">
              booth no - {voter.booth || '1'}
            </Text>
            <Text variant="caption" color="secondary" style={styles.dividerDot}>
              |
            </Text>
            <Text variant="caption" weight="bold" style={{ color: activeBlue }}>
              Srn - {voter.srn || '-'}
            </Text>
          </View>
        </View>

        {/* Action / Expand Button */}
        <Pressable
          onPress={onToggleExpand}
          hitSlop={8}
          style={styles.ellipsisBtn}
          accessibilityLabel="Toggle Voter Actions"
        >
          <Ionicons
            name={isExpanded ? 'chevron-up' : 'ellipsis-horizontal'}
            size={20}
            color={isDark ? '#94A3B8' : '#64748B'}
          />
        </Pressable>
      </TouchableOpacity>

      {/* Expanded Quick Action Bar (matching first card in design reference) */}
      {isExpanded && (
        <>
          <View style={[styles.cardDivider, { backgroundColor: cardBorder }]} />
          <View style={styles.actionButtonsRow}>
            {/* WhatsApp */}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => { void handleWhatsApp(); }}
              style={[styles.actionBtn, { backgroundColor: iconBoxBg }]}
              accessibilityLabel="WhatsApp Voter"
            >
              <Ionicons name="logo-whatsapp" size={22} color={activeBlue} />
            </TouchableOpacity>

            {/* Phone Call */}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handleCall}
              style={[styles.actionBtn, { backgroundColor: iconBoxBg }]}
              accessibilityLabel="Call Voter"
            >
              <Ionicons name="call" size={20} color={activeBlue} />
            </TouchableOpacity>

            {/* Voter Details / ID Card */}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handleDetails}
              style={[styles.actionBtn, { backgroundColor: iconBoxBg }]}
              accessibilityLabel="View Voter Details"
            >
              <Ionicons name="card-outline" size={22} color={activeBlue} />
            </TouchableOpacity>

            {/* Print / Share */}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => { void handleShare(); }}
              style={[styles.actionBtn, { backgroundColor: iconBoxBg }]}
              accessibilityLabel="Print or Share Voter Slip"
            >
              <Ionicons name="print-outline" size={22} color={activeBlue} />
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1.5,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarImage: {
    width: 44,
    height: 44,
    borderRadius: 12,
  },
  detailsColumn: {
    flex: 1,
    justifyContent: 'center',
  },
  voterName: {
    fontSize: 15,
    marginBottom: 3,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 4,
  },
  dividerDot: {
    opacity: 0.4,
    marginHorizontal: 1,
  },
  ellipsisBtn: {
    padding: 6,
    marginLeft: 6,
  },
  cardDivider: {
    height: 1,
    width: '100%',
    marginVertical: 10,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 2,
  },
  actionBtn: {
    width: 48,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

