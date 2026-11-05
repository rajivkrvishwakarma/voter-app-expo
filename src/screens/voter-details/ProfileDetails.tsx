import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { InlineEditableInput, Text } from '@/components/ui';
import {
  buildSurveyUpdatePayload,
  useUpdateSurveyDetailsMutation,
  type UpdateSurveyDetailsPayload,
  type Voter,
} from '@/features/voters';
import { useAppTheme } from '@/providers/ThemeProvider';
import { VoterQuickActions } from './VoterQuickActions';

export interface ProfileDetailsProps {
  voter: Voter;
}

export function ProfileDetails({ voter }: ProfileDetailsProps) {
  const { isDark } = useAppTheme();
  const updateMutation = useUpdateSurveyDetailsMutation();

  const cardBg = isDark ? '#0D1935' : '#FFFFFF';
  const cardBorder = isDark ? '#1E356A' : '#EDF2F7';
  const dividerColor = isDark ? '#15254A' : '#F1F5F9';
  const activeBlue = isDark ? '#38BDF8' : '#0284C7';

  const handleUpdate = (
    field: keyof UpdateSurveyDetailsPayload,
    val: string | number
  ) => {
    const payload = buildSurveyUpdatePayload(voter, { [field]: val });
    updateMutation.mutate(payload);
  };

  return (
    <View style={styles.cardsStack}>
      {/* Electoral Info Card */}
      <View
        style={[
          styles.sectionCard,
          { backgroundColor: cardBg, borderColor: cardBorder },
        ]}
      >
        <View style={styles.sectionTitleRow}>
          <Ionicons name="finger-print" size={18} color={activeBlue} />
          <Text variant="body" weight="bold">
            Electoral Records
          </Text>
        </View>
        <View style={[styles.cardDivider, { backgroundColor: cardBorder }]} />

        <InlineEditableInput
          label="Part Number"
          value={voter?.part_no}
          placeholder="Part number"
          keyboardType="numeric"
          isSaving={updateMutation.isPending}
          onSave={(val) => handleUpdate('part_no', val)}
        />
        <View style={[styles.rowDivider, { backgroundColor: dividerColor }]} />

        <InlineEditableInput
          label="Booth Number"
          value={voter?.booth}
          placeholder="Booth number"
          isSaving={updateMutation.isPending}
          onSave={(val) => handleUpdate('booth', val)}
        />
        <View style={[styles.rowDivider, { backgroundColor: dividerColor }]} />

        <InlineEditableInput
          label="SRN (Serial No)"
          value={voter?.srn}
          placeholder="Serial number"
          isHighlight
          keyboardType="numeric"
          isSaving={updateMutation.isPending}
          onSave={(val) => handleUpdate('srn', val)}
        />
        <View style={[styles.rowDivider, { backgroundColor: dividerColor }]} />

        <InlineEditableInput
          label="Voter ID Card"
          value={voter?.voter_id}
          placeholder="Voter ID (EPIC)"
          isHighlight
          autoCapitalize="characters"
          isSaving={updateMutation.isPending}
          onSave={(val) => handleUpdate('voter_id_field', val)}
        />
        <View style={[styles.rowDivider, { backgroundColor: dividerColor }]} />

        <InlineEditableInput
          label="ACC Number"
          value={voter?.acc_no}
          placeholder="ACC number"
          isSaving={updateMutation.isPending}
          onSave={(val) => handleUpdate('acc_no', val)}
        />
      </View>

      {/* Personal & Address Card */}
      <View
        style={[
          styles.sectionCard,
          { backgroundColor: cardBg, borderColor: cardBorder },
        ]}
      >
        <View style={styles.sectionTitleRow}>
          <Ionicons name="person-circle-outline" size={18} color={activeBlue} />
          <Text variant="body" weight="bold">
            Personal & Address
          </Text>
        </View>
        <View style={[styles.cardDivider, { backgroundColor: cardBorder }]} />

        <InlineEditableInput
          label="Voter Name"
          value={voter?.name}
          placeholder="Full name"
          isSaving={updateMutation.isPending}
          onSave={(val) => handleUpdate('name', val)}
        />
        <View style={[styles.rowDivider, { backgroundColor: dividerColor }]} />

        <InlineEditableInput
          label="Father / Relative"
          value={voter?.father_name}
          placeholder="Father / relative name"
          isSaving={updateMutation.isPending}
          onSave={(val) => handleUpdate('father_name', val)}
        />
        <View style={[styles.rowDivider, { backgroundColor: dividerColor }]} />

        <InlineEditableInput
          label="Relation"
          value={voter?.relation}
          placeholder="Relation"
          isSaving={updateMutation.isPending}
          onSave={(val) => handleUpdate('relation', val)}
        />
        <View style={[styles.rowDivider, { backgroundColor: dividerColor }]} />

        <InlineEditableInput
          label="Age (Years)"
          value={voter?.age}
          placeholder="Age"
          keyboardType="numeric"
          isSaving={updateMutation.isPending}
          onSave={(val) => handleUpdate('age', Number(val) || 0)}
        />
        <View style={[styles.rowDivider, { backgroundColor: dividerColor }]} />

        <InlineEditableInput
          label="Gender"
          value={voter?.gender}
          placeholder="Gender"
          isSaving={updateMutation.isPending}
          onSave={(val) => handleUpdate('gender', val)}
        />
        <View style={[styles.rowDivider, { backgroundColor: dividerColor }]} />

        <InlineEditableInput
          label="Date of Birth"
          value={voter?.dob}
          placeholder="YYYY-MM-DD"
          isSaving={updateMutation.isPending}
          onSave={(val) => handleUpdate('dob', val)}
        />
        <View style={[styles.rowDivider, { backgroundColor: dividerColor }]} />

        <InlineEditableInput
          label="Cast / Category"
          value={voter?.cast}
          placeholder="Cast / category"
          isSaving={updateMutation.isPending}
          onSave={(val) => handleUpdate('cast', val)}
        />
        <View style={[styles.rowDivider, { backgroundColor: dividerColor }]} />

        <InlineEditableInput
          label="House No"
          value={voter?.house_no}
          placeholder="House number"
          isSaving={updateMutation.isPending}
          onSave={(val) => handleUpdate('house_no', val)}
        />
        <View style={[styles.rowDivider, { backgroundColor: dividerColor }]} />

        <InlineEditableInput
          label="Village"
          value={voter?.village}
          placeholder="Village"
          isSaving={updateMutation.isPending}
          onSave={(val) => handleUpdate('village', val)}
        />
        <View style={[styles.rowDivider, { backgroundColor: dividerColor }]} />

        <InlineEditableInput
          label="Address"
          value={voter?.address}
          placeholder="Complete residential address"
          isSaving={updateMutation.isPending}
          onSave={(val) => handleUpdate('address', val)}
        />
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
    gap: 4,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  cardDivider: {
    height: 1,
    width: '100%',
    marginVertical: 4,
    marginBottom: 6,
  },
  rowDivider: {
    height: 1,
    width: '100%',
    marginVertical: 2,
    opacity: 0.6,
  },
});

export default ProfileDetails;
