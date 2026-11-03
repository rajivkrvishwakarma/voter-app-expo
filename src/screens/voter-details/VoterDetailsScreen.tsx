import React, { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Linking,
  Pressable,
  Share,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button, Text, WaveScreenContainer } from '@/components/ui';
import { useIndividualVoterDetailsQuery, type Voter } from '@/features/voters';
import { useAppTheme } from '@/providers/ThemeProvider';
import { resolveImageUrl } from '@/utils/imageUrl';
import { ProfileDetails } from './ProfileDetails';
import { SurveyDetails } from './SurveyDetails';
import { FamilyDetails } from './FamilyDetails';

export interface VoterDetailsScreenProps {
  voter: Voter | null;
  voterId?: number | string;
  onBack: () => void;
}

export function VoterDetailsScreen({ voter, voterId, onBack }: VoterDetailsScreenProps) {
  const { isDark } = useAppTheme();
  const [activeTab, setActiveTab] = useState<'profile' | 'survey' | 'members'>('profile');

  const resolvedId = voter?.id ?? voterId ?? null;
  const resolvedVoterId = voter?.voter_id ?? null;

  // Fetch full voter details from GET /api/individual-voter-details
  const { data, isLoading, isError, refetch } = useIndividualVoterDetailsQuery(
    resolvedId,
    resolvedVoterId
  );

  const fullVoter = data?.voter || voter;

  const cardBg = isDark ? '#0D1935' : '#FFFFFF';
  const cardBorder = isDark ? '#1E356A' : '#EDF2F7';
  const sectionBg = isDark ? '#101F42' : '#F8FAFC';
  const activeBlue = isDark ? '#38BDF8' : '#0284C7';
  const avatarUri = fullVoter?.image ? resolveImageUrl(fullVoter.image) : null;

  const handleCall = (phone?: string) => {
    const target = phone || fullVoter?.mobile_1 || fullVoter?.survey?.mobile_2;
    if (target) {
      void Linking.openURL(`tel:${target}`);
    }
  };

  const handleWhatsApp = async (phone?: string) => {
    const target = phone || fullVoter?.mobile_1 || fullVoter?.survey?.mobile_2;
    if (!target) return;
    const cleanPhone = target.replace(/\D/g, '');
    const url = `whatsapp://send?phone=${cleanPhone}`;
    const canOpen = await Linking.canOpenURL(url);
    if (canOpen) {
      await Linking.openURL(url);
    } else {
      await Linking.openURL(`https://wa.me/${cleanPhone}`);
    }
  };

  const handleShare = async () => {
    if (!fullVoter) return;
    await Share.share({
      title: fullVoter.name,
      message: `Voter Profile:\nName: ${fullVoter.name}\nVoter ID: ${fullVoter.voter_id}\nBooth: ${fullVoter.booth}\nPart: ${fullVoter.part_no}\nSRN: ${fullVoter.srn}\nAddress: ${fullVoter.address}`,
    });
  };

  return (
    <WaveScreenContainer
      title={fullVoter?.name || 'Voter Profile'}
      onBack={onBack}
      scrollable
      contentContainerStyle={styles.containerContent}
    >
      {isLoading ? (
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color={activeBlue} />
          <Text variant="body" color="secondary" style={styles.loadingText}>
            Loading voter profile...
          </Text>
        </View>
      ) : isError && !fullVoter ? (
        <View style={styles.centerBox}>
          <Ionicons name="alert-circle-outline" size={44} color="#EF4444" />
          <Text variant="subtitle" weight="bold" style={styles.errorTitle}>
            Failed to Load Details
          </Text>
          <Text variant="caption" color="secondary" style={styles.errorSubtitle}>
            Unable to retrieve voter profile from server.
          </Text>
          <Button
            title="Retry"
            variant="primary"
            size="md"
            onPress={() => { void refetch(); }}
            style={styles.retryBtn}
          />
        </View>
      ) : (
        <View style={styles.bodyWrapper}>
          {/* 1. Hero Profile Card */}
          <View style={[styles.heroCard, { backgroundColor: cardBg, borderColor: cardBorder }]}>
            <View style={styles.heroRow}>
              <View style={[styles.avatarBox, { backgroundColor: sectionBg, borderColor: activeBlue }]}>
                {avatarUri ? (
                  <Image source={{ uri: avatarUri }} style={styles.avatarImg} resizeMode="cover" />
                ) : (
                  <Ionicons name="person" size={38} color={activeBlue} />
                )}
              </View>

              <View style={styles.heroTextCol}>
                <Text
                  variant="title"
                  weight="bold"
                  numberOfLines={1}
                  style={{ color: isDark ? '#F8FAFC' : '#0F172A' }}
                >
                  {fullVoter?.name}
                </Text>

                <View style={styles.badgeRow}>
                  <View style={[styles.idBadge, { backgroundColor: isDark ? '#1E356A' : '#E0F2FE' }]}>
                    <Text variant="caption" weight="bold" style={{ color: activeBlue }}>
                      {fullVoter?.voter_id || 'NO ID'}
                    </Text>
                  </View>

                  {fullVoter?.survey?.star_voter === 1 && (
                    <View style={styles.starBadge}>
                      <Ionicons name="star" size={12} color="#D97706" />
                      <Text variant="caption" weight="bold" style={styles.starText}>
                        STAR VOTER
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </View>

            {/* Quick Action Buttons */}
            <View style={[styles.actionBar, { borderTopColor: cardBorder }]}>
              <TouchableOpacity
                style={[styles.actionBtn, { backgroundColor: sectionBg }]}
                onPress={() => handleWhatsApp()}
                activeOpacity={0.7}
              >
                <Ionicons name="logo-whatsapp" size={20} color="#22C55E" />
                <Text variant="caption" weight="bold">WhatsApp</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionBtn, { backgroundColor: sectionBg }]}
                onPress={() => handleCall()}
                activeOpacity={0.7}
              >
                <Ionicons name="call" size={19} color={activeBlue} />
                <Text variant="caption" weight="bold">Call</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionBtn, { backgroundColor: sectionBg }]}
                onPress={handleShare}
                activeOpacity={0.7}
              >
                <Ionicons name="share-social-outline" size={19} color={activeBlue} />
                <Text variant="caption" weight="bold">Share</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* 2. Navigation Tab Segment */}
          <View style={[styles.tabSegment, { backgroundColor: sectionBg }]}>
            <Pressable
              style={[styles.tabButton, activeTab === 'profile' && { backgroundColor: activeBlue }]}
              onPress={() => setActiveTab('profile')}
            >
              <Text
                variant="caption"
                weight="bold"
                style={{
                  color: activeTab === 'profile' ? '#FFFFFF' : isDark ? '#94A3B8' : '#64748B',
                }}
              >
                Profile Info
              </Text>
            </Pressable>

            <Pressable
              style={[styles.tabButton, activeTab === 'survey' && { backgroundColor: activeBlue }]}
              onPress={() => setActiveTab('survey')}
            >
              <Text
                variant="caption"
                weight="bold"
                style={{
                  color: activeTab === 'survey' ? '#FFFFFF' : isDark ? '#94A3B8' : '#64748B',
                }}
              >
                Survey & Issues
              </Text>
            </Pressable>

            <Pressable
              style={[styles.tabButton, activeTab === 'members' && { backgroundColor: activeBlue }]}
              onPress={() => setActiveTab('members')}
            >
              <Text
                variant="caption"
                weight="bold"
                style={{
                  color: activeTab === 'members' ? '#FFFFFF' : isDark ? '#94A3B8' : '#64748B',
                }}
              >
                Family ({fullVoter?.members?.length || 0})
              </Text>
            </Pressable>
          </View>

          {/* 3. Modular Tab Contents */}
          {fullVoter && activeTab === 'profile' && <ProfileDetails voter={fullVoter} />}
          {fullVoter && activeTab === 'survey' && <SurveyDetails voter={fullVoter} />}
          {fullVoter && activeTab === 'members' && <FamilyDetails voter={fullVoter} />}

          <View style={styles.bottomSpacer} />
        </View>
      )}
    </WaveScreenContainer>
  );
}

const styles = StyleSheet.create({
  containerContent: {
    paddingBottom: 200,
  },
  bodyWrapper: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  centerBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  loadingText: {
    marginTop: 14,
  },
  errorTitle: {
    marginTop: 14,
    marginBottom: 4,
  },
  errorSubtitle: {
    marginBottom: 16,
    textAlign: 'center',
  },
  retryBtn: {
    minWidth: 120,
  },
  heroCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  avatarBox: {
    width: 66,
    height: 66,
    borderRadius: 33,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    marginRight: 14,
  },
  avatarImg: {
    width: 66,
    height: 66,
    borderRadius: 33,
  },
  heroTextCol: {
    flex: 1,
    gap: 4,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
    marginTop: 2,
  },
  idBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
  },
  starBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  starText: {
    color: '#D97706',
    fontSize: 10,
  },
  actionBar: {
    flexDirection: 'row',
    gap: 10,
    paddingTop: 12,
    borderTopWidth: 1,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 12,
  },
  tabSegment: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 4,
    marginBottom: 14,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 8,
  },
  bottomSpacer: {
    height: 20,
  },
});
