import React, { useState } from 'react';
import {
  StyleSheet,
  Switch,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@/components/ui';
import type { Voter } from '@/features/voters';
import { useAppTheme } from '@/providers/ThemeProvider';
import { triggerAlert } from '@/store/alert.store';

export interface VoterQuickActionsProps {
  voter: Voter;
}

const COLOR_OPTIONS = [
  { name: 'Sky Blue', hex: '#0284C7' },
  { name: 'Green', hex: '#22C55E' },
  { name: 'Amber', hex: '#F59E0B' },
  { name: 'Red', hex: '#EF4444' },
  { name: 'Purple', hex: '#8B5CF6' },
];

export function VoterQuickActions({ voter }: VoterQuickActionsProps) {
  const { isDark } = useAppTheme();

  // Mobile editing state
  const [mobileNumber, setMobileNumber] = useState(voter?.mobile_1 || '');
  const [isEditingMobile, setIsEditingMobile] = useState(false);

  // Status & mobilization states
  const [colorIndex, setColorIndex] = useState(0);
  const [isStar, setIsStar] = useState(voter?.survey?.star_voter === 1);
  const [isVoted, setIsVoted] = useState(voter?.survey?.is_voted === 1);

  const cardBg = isDark ? '#0D1935' : '#FFFFFF';
  const cardBorder = isDark ? '#1E356A' : '#EDF2F7';
  const inputBg = isDark ? '#132347' : '#F8FAFC';
  const activeBlue = isDark ? '#38BDF8' : '#0284C7';
  const currentColor = COLOR_OPTIONS[colorIndex];

  const handleSaveMobile = () => {
    setIsEditingMobile(false);
    triggerAlert.success(
      'Mobile Updated',
      mobileNumber ? `Phone set to ${mobileNumber}` : 'Mobile number cleared'
    );
  };

  const handleCycleColor = () => {
    const nextIndex = (colorIndex + 1) % COLOR_OPTIONS.length;
    setColorIndex(nextIndex);
    const nextColor = COLOR_OPTIONS[nextIndex];
    triggerAlert.info('Colour Code Updated', `Categorized as ${nextColor.name}`);
  };

  const handleToggleStar = () => {
    const next = !isStar;
    setIsStar(next);
    if (next) {
      triggerAlert.success('Star Voter Marked', `${voter.name} is now flagged as a VIP star voter.`);
    } else {
      triggerAlert.info('Star Voter Removed', `${voter.name} is no longer marked as a star voter.`);
    }
  };

  const handleToggleVoted = (val: boolean) => {
    setIsVoted(val);
    if (val) {
      triggerAlert.success('Voting Status: Voted', `${voter.name} marked as voted.`);
    } else {
      triggerAlert.warning('Voting Status: Not Voted', `${voter.name} marked as not voted yet.`);
    }
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

  return (
    <View style={[styles.containerCard, { backgroundColor: cardBg, borderColor: cardBorder }]}>
      {/* 1. Mobile Number Row with In-place Edit */}
      <View style={styles.actionRow}>
        <View style={styles.labelCol}>
          <Text variant="caption" color="secondary">Mobile - 1</Text>
          {isEditingMobile ? (
            <TextInput
              value={mobileNumber}
              onChangeText={setMobileNumber}
              placeholder="Enter mobile number"
              placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
              keyboardType="phone-pad"
              autoFocus
              style={[
                styles.mobileInput,
                {
                  backgroundColor: inputBg,
                  borderColor: activeBlue,
                  color: isDark ? '#FFFFFF' : '#0F172A',
                },
              ]}
            />
          ) : (
            <Text variant="body" weight="medium" style={styles.mobileDisplay}>
              {mobileNumber || '—'}
            </Text>
          )}
        </View>

        {/* Action Icons with Bold Variant */}
        <View style={styles.iconsRow}>
          {isEditingMobile ? (
            <TouchableOpacity
              onPress={handleSaveMobile}
              style={[styles.iconButton, { backgroundColor: '#DCFCE7' }]}
              accessibilityLabel="Save Mobile"
            >
              <Ionicons name="checkmark-circle" size={20} color="#16A34A" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => setIsEditingMobile(true)}
              style={[styles.iconButton, { backgroundColor: inputBg }]}
              accessibilityLabel="Edit Mobile"
            >
              <Ionicons name="pencil" size={17} color={activeBlue} />
            </TouchableOpacity>
          )}

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
        </View>
      </View>

      <View style={[styles.divider, { backgroundColor: cardBorder }]} />

      {/* 2. Color Code, Star (Other), and Voted Toggle Row */}
      <View style={styles.controlsRow}>
        {/* Colour Code Button */}
        <TouchableOpacity
          onPress={handleCycleColor}
          activeOpacity={0.7}
          style={styles.colorCodeBtn}
          accessibilityLabel="Change Color Code"
        >
          <Text variant="caption" weight="medium" color="secondary">Colour Code</Text>
          <View style={[styles.colorCircle, { backgroundColor: currentColor.hex }]} />
        </TouchableOpacity>

        {/* Star Voter Toggle with Bold Star Icon */}
        <TouchableOpacity
          onPress={handleToggleStar}
          activeOpacity={0.7}
          style={styles.starToggleBtn}
          accessibilityLabel="Toggle Star Voter"
        >
          <Text variant="caption" weight="medium" color="secondary">Other</Text>
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

      {/* 3. Voters on Same Address & Booth Buttons (App Theme Navy & Electric Blue - No Orange) */}
      <View style={styles.sameButtonsCol}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleSameAddress}
          style={[styles.actionBannerBtn, { backgroundColor: activeBlue }]}
        >
          <Ionicons name="home" size={17} color="#FFFFFF" style={{ marginRight: 8 }} />
          <Text variant="caption" weight="bold" style={styles.actionBannerBtnText}>
            VOTERS ON SAME ADDRESS
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleSameBooth}
          style={[
            styles.actionBannerBtn,
            {
              backgroundColor: isDark ? '#132347' : '#0F172A',
              borderColor: isDark ? '#38BDF8' : '#1E293B',
              borderWidth: 1,
            },
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
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  labelCol: {
    flex: 1,
    marginRight: 10,
  },
  mobileDisplay: {
    marginTop: 2,
    fontSize: 14,
  },
  mobileInput: {
    height: 36,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginTop: 4,
    fontSize: 14,
  },
  iconsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
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
