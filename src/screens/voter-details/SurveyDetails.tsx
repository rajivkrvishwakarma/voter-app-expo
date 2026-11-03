import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@/components/ui';
import type { Voter } from '@/features/voters';
import { useAppTheme } from '@/providers/ThemeProvider';
import { DetailRow } from './DetailRow';

export interface SurveyDetailsProps {
  voter: Voter;
}

export function SurveyDetails({ voter }: SurveyDetailsProps) {
  const { isDark } = useAppTheme();

  const cardBg = isDark ? '#0D1935' : '#FFFFFF';
  const cardBorder = isDark ? '#1E356A' : '#EDF2F7';
  const activeBlue = isDark ? '#38BDF8' : '#0284C7';

  const isVoted = voter?.survey?.is_voted === 1;

  return (
    <View style={styles.cardsStack}>
      <View style={[styles.sectionCard, { backgroundColor: cardBg, borderColor: cardBorder }]}>
        <View style={styles.sectionTitleRow}>
          <Ionicons name="clipboard-outline" size={18} color={activeBlue} />
          <Text variant="body" weight="bold">Field Survey & Mobilization</Text>
        </View>
        <View style={[styles.divider, { backgroundColor: cardBorder }]} />

        <DetailRow
          label="Voting Status"
          value={isVoted ? '✓ Voted' : 'Not Voted Yet'}
          valueColor={isVoted ? '#22C55E' : '#EAB308'}
          isHighlight
        />
        <DetailRow label="Demands / Notes" value={voter?.survey?.demands} fullWidth />
        <DetailRow label="Personnel / Incharge" value={voter?.survey?.personnel} />
        <DetailRow label="Position / Role" value={voter?.survey?.position} />
        <DetailRow label="Society / Organization" value={voter?.survey?.society} />
        <DetailRow label="New Address" value={voter?.survey?.new_address} fullWidth />
        <DetailRow label="Secondary Mobile" value={voter?.survey?.mobile_2} />
        <DetailRow label="Email Address" value={voter?.survey?.email} />

        {/* Extra Information (if available) */}
        {voter?.extra_information && (
          <>
            <View style={[styles.subDivider, { backgroundColor: cardBorder }]} />
            <Text variant="caption" weight="bold" color="secondary">Additional Information</Text>
            {voter.extra_information.extra_info_1 ? (
              <DetailRow label="Info 1" value={voter.extra_information.extra_info_1} />
            ) : null}
            {voter.extra_information.extra_info_2 ? (
              <DetailRow label="Info 2" value={voter.extra_information.extra_info_2} />
            ) : null}
            {voter.extra_information.extra_info_3 ? (
              <DetailRow label="Info 3" value={voter.extra_information.extra_info_3} />
            ) : null}
          </>
        )}
      </View>
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
  subDivider: {
    height: 1,
    width: '100%',
    marginVertical: 6,
  },
});

export default SurveyDetails;

