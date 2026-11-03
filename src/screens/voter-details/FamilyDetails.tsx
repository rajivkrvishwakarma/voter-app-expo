import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@/components/ui';
import type { Voter } from '@/features/voters';
import { useAppTheme } from '@/providers/ThemeProvider';

export interface FamilyDetailsProps {
  voter: Voter;
}

export function FamilyDetails({ voter }: FamilyDetailsProps) {
  const { isDark } = useAppTheme();

  const cardBg = isDark ? '#0D1935' : '#FFFFFF';
  const cardBorder = isDark ? '#1E356A' : '#EDF2F7';
  const activeBlue = isDark ? '#38BDF8' : '#0284C7';

  const members = voter?.members || [];

  return (
    <View style={styles.cardsStack}>
      {members.length > 0 ? (
        members.map((member, idx) => (
          <View
            key={`${member.id}-${idx}`}
            style={[styles.memberCard, { backgroundColor: cardBg, borderColor: cardBorder }]}
          >
            <Ionicons name="person-circle" size={38} color={activeBlue} />
            <View style={styles.memberTextCol}>
              <Text variant="body" weight="bold">{member.name}</Text>
              <Text variant="caption" color="secondary">
                {member.relation || 'Relative'} • {member.age || '—'} yrs • {member.gender || '—'}
              </Text>
              <Text variant="caption" color="secondary" numberOfLines={1}>
                Booth: {member.booth || '—'} • SRN: {member.srn || '—'}
              </Text>
            </View>
            {member.voter_id ? (
              <View style={[styles.memberBadge, { backgroundColor: isDark ? '#1E356A' : '#E0F2FE' }]}>
                <Text variant="caption" weight="bold" style={{ color: activeBlue, fontSize: 11 }}>
                  {member.voter_id}
                </Text>
              </View>
            ) : null}
          </View>
        ))
      ) : (
        <View style={[styles.emptyBox, { backgroundColor: cardBg, borderColor: cardBorder }]}>
          <Ionicons name="people-outline" size={44} color="#94A3B8" />
          <Text variant="body" weight="bold" style={styles.emptyTitle}>
            No Family Members
          </Text>
          <Text variant="caption" color="secondary" style={styles.emptySubtitle}>
            No associated family or booth members recorded.
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  cardsStack: {
    gap: 12,
  },
  memberCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    padding: 12,
    gap: 12,
  },
  memberTextCol: {
    flex: 1,
    gap: 2,
  },
  memberBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  emptyBox: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    borderWidth: 1,
    paddingVertical: 36,
    paddingHorizontal: 20,
  },
  emptyTitle: {
    marginTop: 10,
    marginBottom: 4,
  },
  emptySubtitle: {
    textAlign: 'center',
  },
});

export default FamilyDetails;

