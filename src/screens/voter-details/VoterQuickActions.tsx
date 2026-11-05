import { InlineEditableInput, Text } from '@/components/ui';
import { findColorOption, type VoterColorOption } from '@/constants';
import {
  buildSurveyUpdatePayload,
  useUpdateSurveyDetailsMutation,
  type Voter,
} from '@/features/voters';
import { useAppTheme } from '@/providers/ThemeProvider';
import { triggerAlert } from '@/store/alert.store';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  StyleSheet,
  Switch,
  TouchableOpacity,
  View,
} from 'react-native';
import { ColorCodePickerModal } from './ColorCodePickerModal';

export interface VoterQuickActionsProps {
  voter: Voter;
}

export function VoterQuickActions({ voter }: VoterQuickActionsProps) {
  const { isDark } = useAppTheme();
  const updateMutation = useUpdateSurveyDetailsMutation();

  // Mobile editing state
  const [mobileNumber, setMobileNumber] = useState(voter?.mobile_1 || '');

  // Status & mobilization states
  const [selectedColor, setSelectedColor] = useState<VoterColorOption>(() =>
    findColorOption(voter?.survey?.color_code)
  );
  const [isColorModalOpen, setIsColorModalOpen] = useState(false);
  const [isStar, setIsStar] = useState(voter?.survey?.star_voter === 1);
  const [isVoted, setIsVoted] = useState(voter?.survey?.is_voted === 1);

  const cardBg = isDark ? '#0D1935' : '#FFFFFF';
  const cardBorder = isDark ? '#1E356A' : '#EDF2F7';
  const inputBg = isDark ? '#132347' : '#F8FAFC';
  const activeBlue = isDark ? '#38BDF8' : '#0284C7';

  const handleSaveMobile = (savedNumber: string) => {
    setMobileNumber(savedNumber);
    updateMutation.mutate(
      buildSurveyUpdatePayload(voter, { mobile_1: savedNumber })
    );
  };

  const handleSelectColor = (option: VoterColorOption) => {
    setSelectedColor(option);
    setIsColorModalOpen(false);
    // Call survey details update API passing color hex code in string
    updateMutation.mutate(
      buildSurveyUpdatePayload(voter, { color_code: option.hex })
    );
  };

  const handleToggleStar = () => {
    const next = !isStar;
    setIsStar(next);
    updateMutation.mutate(
      buildSurveyUpdatePayload(voter, { star_voter: next })
    );
  };

  const handleToggleVoted = (val: boolean) => {
    setIsVoted(val);
    updateMutation.mutate(
      buildSurveyUpdatePayload(voter, { is_voted: val })
    );
  };

  const handleSameAddress = () => {
    triggerAlert.info(
      'Same Address Lookup',
      `Finding voters residing at: ${voter.address || 'same address'}`
    );
  };

  const handleSameBooth = () => {
    triggerAlert.info(
      'Same Booth Lookup',
      `Finding voters registered under Booth: ${voter.booth || 'N/A'}`
    );
  };

  const isLightColor =
    selectedColor.hex.toLowerCase() === '#ffffff' ||
    selectedColor.hex.toLowerCase() === '#ffff00';

  return (
    <View style={[styles.containerCard, { backgroundColor: cardBg, borderColor: cardBorder }]}>
      {/* 1. Mobile Number Row with Reusable InlineEditableInput */}
      <InlineEditableInput
        value={mobileNumber}
        onChangeText={setMobileNumber}
        onSave={handleSaveMobile}
        placeholder="Mobile - 1"
        keyboardType="phone-pad"
        isSaving={updateMutation.isPending}
        extraActions={
          <>
            <TouchableOpacity
              onPress={() => triggerAlert.info('Contact Info', `Contact details for ${voter.name}`)}
              style={[styles.iconButton, { backgroundColor: inputBg }]}
              accessibilityLabel="Contact Book"
            >
              <Ionicons name="book" size={17} color={activeBlue} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => triggerAlert.info('Add Member', `Link family or household member to ${voter.name}`)}
              style={[styles.iconButton, { backgroundColor: inputBg }]}
              accessibilityLabel="Add Member"
            >
              <Ionicons name="person-add" size={17} color={activeBlue} />
            </TouchableOpacity>
          </>
        }
      />

      <View style={[styles.divider, { backgroundColor: cardBorder }]} />

      {/* 2. Color Code, Star (Other), and Voted Toggle Row */}
      <View style={styles.controlsRow}>
        {/* Colour Code Button -> opens bottom sheet modal */}
        <TouchableOpacity
          onPress={() => setIsColorModalOpen(true)}
          activeOpacity={0.7}
          style={styles.colorCodeBtn}
          accessibilityLabel="Open Colour Code Picker"
        >
          <Text variant="caption" weight="medium" color="secondary">Colour Code</Text>
          <View
            style={[
              styles.colorCircle,
              { backgroundColor: selectedColor.hex },
              isLightColor && styles.subtleBorder,
            ]}
          />
        </TouchableOpacity>

        {/* Star Voter Toggle with Bold Star Icon */}
        <TouchableOpacity
          onPress={handleToggleStar}
          activeOpacity={0.7}
          style={styles.starToggleBtn}
          accessibilityLabel="Toggle Star Voter"
        >
          <Text variant="caption" weight="medium" color="secondary">Star Voter</Text>
          <Ionicons
            name="star"
            size={19}
            color={isStar ? '#F59E0B' : isDark ? '#475569' : '#CBD5E1'}
          />
        </TouchableOpacity>

        {/* Voted Switch */}
        <View style={styles.votedContainer}>
          <Text variant="caption" weight="medium" color="secondary">Voted</Text>
          <Switch
            value={isVoted}
            onValueChange={handleToggleVoted}
            trackColor={{ false: isDark ? '#334155' : '#CBD5E1', true: activeBlue }}
            thumbColor="#FFFFFF"
            style={styles.switchControl}
          />
        </View>
      </View>

      <View style={[styles.divider, { backgroundColor: cardBorder }]} />

      {/* 3. Voters on Same Address & Booth Buttons */}
      <View style={styles.sameButtonsCol}>
        <TouchableOpacity
          onPress={handleSameAddress}
          activeOpacity={0.8}
          style={[
            styles.actionBannerBtn,
            { backgroundColor: isDark ? '#132347' : '#0284C7' },
          ]}
        >
          <Ionicons
            name="location"
            size={17}
            color={isDark ? '#38BDF8' : '#FFFFFF'}
            style={{ marginRight: 8 }}
          />
          <Text
            variant="caption"
            weight="bold"
            style={[
              styles.actionBannerBtnText,
              isDark && { color: '#38BDF8' },
            ]}
          >
            VOTERS ON SAME ADDRESS
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleSameBooth}
          activeOpacity={0.8}
          style={[
            styles.actionBannerBtn,
            { backgroundColor: isDark ? '#101F42' : '#0F172A' },
          ]}
        >
          <Ionicons
            name="business"
            size={17}
            color={isDark ? '#38BDF8' : '#FFFFFF'}
            style={{ marginRight: 8 }}
          />
          <Text
            variant="caption"
            weight="bold"
            style={[
              styles.actionBannerBtnText,
              isDark && { color: '#38BDF8' },
            ]}
          >
            VOTERS ON SAME BOOTH
          </Text>
        </TouchableOpacity>
      </View>

      {/* Reusable Bottom Sheet Modal for Colour Code Picker */}
      <ColorCodePickerModal
        visible={isColorModalOpen}
        selectedColor={selectedColor}
        onSelectColor={handleSelectColor}
        onClose={() => setIsColorModalOpen(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  containerCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginTop: 14,
    gap: 12,
  },
  iconButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: {
    height: 1,
    width: '100%',
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  colorCodeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  colorCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
  },
  subtleBorder: {
    borderWidth: 1.5,
    borderColor: '#94A3B8',
  },
  starToggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 6,
  },
  votedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  switchControl: {
    transform: [{ scaleX: 0.85 }, { scaleY: 0.85 }],
  },
  sameButtonsCol: {
    gap: 10,
    marginTop: 4,
  },
  actionBannerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  actionBannerBtnText: {
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
});
