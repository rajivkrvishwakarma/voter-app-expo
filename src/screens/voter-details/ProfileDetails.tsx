import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@/components/ui';
import type { Voter } from '@/features/voters';
import { useAppTheme } from '@/providers/ThemeProvider';
import { DetailRow } from './DetailRow';
import { VoterQuickActions } from './VoterQuickActions';

export interface ProfileDetailsProps {
  voter: Voter;
}

export function ProfileDetails({ voter }: ProfileDetailsProps) {
  const { isDark } = useAppTheme();

  const cardBg = isDark ? '#0D1935' : '#FFFFFF';
  const cardBorder = isDark ? '#1E356A' : '#EDF2F7';
  const activeBlue = isDark ? '#38BDF8' : '#0284C7';

  return (
    <View style={styles.cardsStack}>
      {/* Electoral Info Card */}
      <View style={[styles.sectionCard, { backgroundColor: cardBg, borderColor: cardBorder }]}>
        <View style={styles.sectionTitleRow}>
          <Ionicons name="finger-print" size={18} color={activeBlue} />
          <Text variant="body" weight="bold">Electoral Records</Text>
        </View>
        <View style={[styles.divider, { backgroundColor: cardBorder }]} />
        <DetailRow label="Part Number" value={voter?.part_no} />
        <DetailRow label="Booth Number" value={voter?.booth} />
        <DetailRow label="SRN (Serial No)" value={voter?.srn} isHighlight />
        <DetailRow label="Voter ID Card" value={voter?.voter_id} isHighlight />
        <DetailRow label="ACC Number" value={voter?.acc_no} />
      </View>

      {/* Personal Info Card */}
      <View style={[styles.sectionCard, { backgroundColor: cardBg, borderColor: cardBorder }]}>
        <View style={styles.sectionTitleRow}>
          <Ionicons name="person-circle-outline" size={18} color={activeBlue} />
          <Text variant="body" weight="bold">Personal & Address</Text>
        </View>
        <View style={[styles.divider, { backgroundColor: cardBorder }]} />
        <DetailRow label="Father / Relative" value={voter?.father_name} subValue={voter?.relation} />
        <DetailRow label="Age & Gender" value={`${voter?.age ? `${voter.age} yrs` : '—'} • ${voter?.gender || '—'}`} />
        <DetailRow label="Date of Birth" value={voter?.dob} />
        <DetailRow label="Cast / Category" value={voter?.cast} />
        <DetailRow label="House No / Village" value={`${voter?.house_no || '—'}, ${voter?.village || '—'}`} />
        <DetailRow label="Complete Address" value={voter?.address} fullWidth />
      </View>

      {/* Interactive Options: Mobile-1 with Edit, Colour Code, Star Voter, Voted Switch, Same Address/Booth */}
      <VoterQuickActions voter={voter} />
    </View>
  );
}

const styles = StyleSheet.create({
  cardsStack: {
    gap: 12,
  },
  sectionCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    gap: 10,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  divider: {
    height: 1,
    width: '100%',
    marginVertical: 4,
  },
});

export default ProfileDetails;
