import { Button, ScreenContainer, Text } from '@/components/ui';
import { useCurrentUserQuery } from '@/features/auth';
import { useLanguagesQuery, useChangeLanguageMutation } from '@/features/localization';
import { useAppTheme } from '@/providers/ThemeProvider';
import { useAuthStore } from '@/store/auth.store';
import { resolveImageUrl } from '@/utils/imageUrl';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  Pressable,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

export interface DashboardScreenProps {
  onLogout: () => void;
  onOpenProfile: () => void;
  onOpenSearch: () => void;
}

const DASHBOARD_ACTIONS = [
  {
    id: 'search',
    title: 'Search',
    image: require('../../../assets/images/search.png'),
    glowBg: '#F0F9FF',
    glowBorder: '#E0F2FE',
    darkGlow: 'rgba(56, 189, 248, 0.14)',
  },
  {
    id: 'adv-search',
    title: 'Advance Search',
    image: require('../../../assets/images/adv-search.png'),
    glowBg: '#FFFBEB',
    glowBorder: '#FEF3C7',
    darkGlow: 'rgba(245, 158, 11, 0.14)',
  },
  {
    id: 'lists',
    title: 'Lists',
    image: require('../../../assets/images/list.png'),
    glowBg: '#F0FDF4',
    glowBorder: '#DCFCE7',
    darkGlow: 'rgba(34, 197, 94, 0.14)',
  },
  {
    id: 'survey',
    title: 'Survey',
    image: require('../../../assets/images/survey.png'),
    glowBg: '#F0F9FF',
    glowBorder: '#E0F2FE',
    darkGlow: 'rgba(14, 165, 233, 0.14)',
  },
  {
    id: 'data',
    title: 'Data',
    image: require('../../../assets/images/data.png'),
    glowBg: '#ECFEFF',
    glowBorder: '#CFFAFE',
    darkGlow: 'rgba(6, 182, 212, 0.14)',
  },
  {
    id: 'setting',
    title: 'Setting',
    image: require('../../../assets/images/setting.png'),
    glowBg: '#EFF6FF',
    glowBorder: '#DBEAFE',
    darkGlow: 'rgba(99, 102, 241, 0.14)',
  },
] as const;

const DASHBOARD_ROWS = [
  DASHBOARD_ACTIONS.slice(0, 2),
  DASHBOARD_ACTIONS.slice(2, 4),
  DASHBOARD_ACTIONS.slice(4, 6),
];

export function DashboardScreen({ onLogout, onOpenProfile, onOpenSearch }: DashboardScreenProps) {
  const { isDark } = useAppTheme();
  const { user: cachedUser, politician, logout } = useAuthStore();
  const {
    data: fetchedUser,
    isRefetching,
    refetch,
  } = useCurrentUserQuery();

  const user = fetchedUser || cachedUser;

  // Dynamic Localization Query & Mutation
  const {
    data: languagesData,
    isLoading: isLoadingLanguages,
  } = useLanguagesQuery();
  const changeLanguageMutation = useChangeLanguageMutation();

  const currentLanguageCode = languagesData?.current_language || 'en';
  const supportedLanguages = languagesData?.supported_languages || [
    { code: 'en', name: 'English', native: 'English' },
    { code: 'mr', name: 'Marathi', native: 'मराठी' },
    { code: 'hi', name: 'Hindi', native: 'हिंदी' },
  ];

  // UI state for headers and options
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showMenuDrawer, setShowMenuDrawer] = useState(false);

  const handleSelectLanguage = (langCode: string) => {
    if (langCode === currentLanguageCode) {
      setShowLanguageModal(false);
      return;
    }

    changeLanguageMutation.mutate(
      { lang: langCode },
      {
        onSettled: () => {
          setShowLanguageModal(false);
        },
        onError: (error) => {
          Alert.alert('Language Update Failed', error.message || 'Unable to change language.');
        },
      }
    );
  };

  const bannerUri = resolveImageUrl(
    politician?.party_banner_url || politician?.party_banner
  );
  const logoUri = resolveImageUrl(
    politician?.party_logo_url || politician?.party_logo
  );

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to log out from this session?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log Out',
        style: 'destructive',
        onPress: async () => {
          setShowUserModal(false);
          setShowMenuDrawer(false);
          await logout();
          onLogout();
        },
      },
    ]);
  };

  const handleActionPress = (actionTitle: string) => {
    if (actionTitle === 'Search') {
      onOpenSearch();
      return;
    }
    if (actionTitle === 'Setting' || actionTitle === 'Settings') {
      onOpenProfile();
      return;
    }
    Alert.alert(actionTitle, `${actionTitle} module ready for voter data.`);
  };

  // Reusable card & border colors
  const cardBg = isDark ? '#0D1935' : '#FFFFFF';
  const cardBorder = isDark ? '#1E356A' : '#F1F5F9';
  const headerBtnBg = isDark ? '#101F42' : '#EBF5FF';
  const headerBtnBorder = isDark ? '#1E356A' : '#E0F2FE';
  const activeBlue = isDark ? '#38BDF8' : '#0284C7';

  return (
    <ScreenContainer
      scrollable
      refreshControl={
        <RefreshControl
          refreshing={isRefetching}
          onRefresh={() => { void refetch(); }}
          tintColor={activeBlue}
        />
      }
    >
      {/* 1. Header with Left Menu & Right User + Language Icons */}
      <View style={styles.topHeaderRow}>
        {/* Left Side: Bold Hamburger Menu Icon */}
        <Pressable
          onPress={() => setShowMenuDrawer(true)}
          style={[styles.headerIconButton, { backgroundColor: headerBtnBg, borderColor: headerBtnBorder }]}
          hitSlop={8}
          accessibilityLabel="Open Menu"
        >
          <Ionicons name="menu" size={26} color={activeBlue} />
        </Pressable>

        {/* Center Portal Title */}
        <View style={styles.headerCenter}>
          <Text style={[styles.portalTag, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
            Jeeto
          </Text>
          <Text style={[styles.portalTag2, { color: activeBlue }]}>
            Lead
          </Text>
        </View>

        {/* Right Side: Change Language & User Icons */}
        <View style={styles.headerRightActions}>
          <Pressable
            onPress={() => setShowLanguageModal(true)}
            style={[styles.headerIconButton, { backgroundColor: headerBtnBg, borderColor: headerBtnBorder }]}
            hitSlop={8}
            accessibilityLabel="Change Language"
          >
            <Ionicons name="language" size={22} color={activeBlue} />
          </Pressable>

          <Pressable
            onPress={onOpenProfile}
            style={[styles.headerIconButton, styles.userIconButton, { backgroundColor: headerBtnBg, borderColor: headerBtnBorder }]}
            hitSlop={8}
            accessibilityLabel="User Profile"
          >
            <Ionicons name="person-circle" size={28} color={activeBlue} />
          </Pressable>
        </View>
      </View>

      {/* 2. Middle: Featured Campaign Card with Image */}
      {politician && (
        <View style={[styles.campaignCard, { backgroundColor: cardBg, borderColor: cardBorder }]}>
          {bannerUri ? (
            <Image
              source={{ uri: bannerUri }}
              style={styles.campaignBannerImage}
              resizeMode="cover"
            />
          ) : (
            <View style={[styles.bannerFallback, { backgroundColor: activeBlue }]} />
          )}

          <View style={styles.bannerDarkOverlay} />

          {/* Party Logo & Details Overlay on Image */}
          <View style={styles.campaignCardContent}>
            <View style={styles.partyHeaderRow}>
              {logoUri && (
                <Image
                  source={{ uri: logoUri }}
                  style={styles.partyLogoImg}
                  resizeMode="contain"
                />
              )}
              <View style={styles.partyTitleColumn}>
                <Text variant="title" weight="bold" style={styles.partyBannerTitle}>
                  {politician.party_name}
                </Text>
                <Text variant="caption" style={styles.candidateNameText}>
                  {politician.name}
                </Text>
              </View>
            </View>
          </View>
        </View>
      )}

      {/* 3. Middle Options Grid: 2 Columns x 3 Rows with Soft Ambient Glow Halo */}
      <View style={styles.optionsSection}>
        {DASHBOARD_ROWS.map((row, rowIndex) => (
          <View key={`row-${rowIndex}`} style={styles.optionsRow}>
            {row.map((item) => (
              <TouchableOpacity
                key={item.id}
                activeOpacity={0.75}
                onPress={() => handleActionPress(item.title)}
                style={[
                  styles.optionCard,
                  {
                    backgroundColor: cardBg,
                    borderColor: cardBorder,
                  },
                ]}
                accessibilityRole="button"
                accessibilityLabel={item.title}
              >
                {/* Ambient Soft Glow Circle Behind Icon */}
                <View
                  style={[
                    styles.iconGlowWrapper,
                    {
                      backgroundColor: isDark ? item.darkGlow : item.glowBg,
                      borderColor: isDark ? 'transparent' : item.glowBorder,
                    },
                  ]}
                >
                  <Image
                    source={item.image}
                    style={styles.optionCardImage}
                    resizeMode="contain"
                  />
                </View>

                <Text
                  variant="body"
                  weight="bold"
                  style={[
                    styles.optionTitle,
                    { color: isDark ? '#F8FAFC' : '#0F172A' },
                  ]}
                  numberOfLines={2}
                >
                  {item.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>

      {/* 4. Dynamic Language Selector Modal */}
      <Modal
        visible={showLanguageModal}
        transparent
        animationType="fade"
        onRequestClose={() => {
          if (!changeLanguageMutation.isPending) {
            setShowLanguageModal(false);
          }
        }}
      >
        <Pressable
          style={styles.modalBackdrop}
          onPress={() => {
            if (!changeLanguageMutation.isPending) {
              setShowLanguageModal(false);
            }
          }}
        >
          <View style={[styles.modalCard, { backgroundColor: cardBg, borderColor: cardBorder }]}>
            <View style={styles.modalHeaderRow}>
              <Text variant="subtitle" weight="bold" style={styles.modalTitle}>
                Select Language
              </Text>
              {changeLanguageMutation.isPending && (
                <ActivityIndicator size="small" color={activeBlue} />
              )}
            </View>

            {isLoadingLanguages && !languagesData ? (
              <View style={styles.languageLoadingBox}>
                <ActivityIndicator size="small" color={activeBlue} />
              </View>
            ) : (
              supportedLanguages.map((lang) => {
                const isSelected = currentLanguageCode === lang.code;
                const isUpdatingThis =
                  changeLanguageMutation.isPending &&
                  changeLanguageMutation.variables?.lang === lang.code;

                return (
                  <Pressable
                    key={lang.code}
                    disabled={changeLanguageMutation.isPending}
                    onPress={() => handleSelectLanguage(lang.code)}
                    style={[
                      styles.languageOptionRow,
                      isSelected && {
                        backgroundColor: headerBtnBg,
                        borderColor: activeBlue,
                      },
                    ]}
                  >
                    <View style={styles.languageTextColumn}>
                      <Text
                        variant="body"
                        weight={isSelected ? 'bold' : 'medium'}
                        style={isSelected ? { color: activeBlue } : undefined}
                      >
                        {lang.native}
                      </Text>
                      {lang.native !== lang.name && (
                        <Text variant="caption" color="secondary">
                          {lang.name}
                        </Text>
                      )}
                    </View>

                    {isUpdatingThis ? (
                      <ActivityIndicator size="small" color={activeBlue} />
                    ) : isSelected ? (
                      <Ionicons name="checkmark-circle" size={20} color={activeBlue} />
                    ) : null}
                  </Pressable>
                );
              })
            )}
          </View>
        </Pressable>
      </Modal>

      {/* 5. User Profile / Settings Drawer Modal */}
      <Modal
        visible={showUserModal || showMenuDrawer}
        transparent
        animationType="slide"
        onRequestClose={() => {
          setShowUserModal(false);
          setShowMenuDrawer(false);
        }}
      >
        <View style={styles.bottomDrawerBackdrop}>
          <View style={[styles.bottomDrawerContent, { backgroundColor: cardBg, borderColor: cardBorder }]}>
            <View style={styles.drawerHandle} />
            <Text variant="subtitle" weight="bold" style={styles.drawerHeading}>
              Voter & Coordinator Profile
            </Text>

            <View style={styles.profileInfoBox}>
              <View style={styles.infoLine}>
                <Text variant="caption" color="secondary">Name:</Text>
                <Text variant="body" weight="bold">{user?.name || 'Voter'}</Text>
              </View>
              <View style={styles.infoLine}>
                <Text variant="caption" color="secondary">Email:</Text>
                <Text variant="body">{user?.email || '—'}</Text>
              </View>
              <View style={styles.infoLine}>
                <Text variant="caption" color="secondary">Phone:</Text>
                <Text variant="body">{user?.phone || 'Not provided'}</Text>
              </View>
              <View style={styles.infoLine}>
                <Text variant="caption" color="secondary">Reference:</Text>
                <Text variant="body" weight="bold" style={{ color: activeBlue }}>{user?.reference_no || '—'}</Text>
              </View>
            </View>

            <Button
              title="Sign Out Session"
              variant="destructive"
              size="md"
              onPress={handleLogout}
              leftIcon={<Ionicons name="log-out-outline" size={18} color="#FFFFFF" />}
            />
          </View>
        </View>
      </Modal>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  topHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    marginBottom: 12,
  },
  headerCenter: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  portalTag: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  portalTag2: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  portalSub: {
    fontSize: 11,
  },
  headerRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerIconButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userIconButton: {
    marginLeft: 2,
  },
  campaignCard: {
    borderRadius: 22,
    height: 180,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 22,
    borderWidth: 1,
  },
  campaignBannerImage: {
    ...StyleSheet.absoluteFill,
    width: '100%',
    height: '100%',
  },
  bannerFallback: {
    ...StyleSheet.absoluteFill,
  },
  bannerDarkOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },
  campaignCardContent: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 16,
    zIndex: 5,
  },
  partyHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  partyLogoImg: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FFFFFF',
    marginRight: 12,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  partyTitleColumn: {
    flex: 1,
  },
  partyBannerTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    letterSpacing: 0.5,
  },
  candidateNameText: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 12,
  },
  refPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    gap: 5,
  },
  refPillText: {
    color: '#FFFFFF',
    fontSize: 11,
    letterSpacing: 0.3,
  },
  optionsSection: {
    width: '100%',
    marginBottom: 24,
  },
  optionsRow: {
    flexDirection: 'row',
    width: '100%',
    gap: 14,
    marginBottom: 14,
  },
  optionCard: {
    flex: 1,
    borderRadius: 22,
    borderWidth: 1,
    paddingVertical: 24,
    paddingHorizontal: 12,
    minHeight: 156,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2.5,
  },
  iconGlowWrapper: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  optionCardImage: {
    width: 50,
    height: 50,
  },
  optionTitle: {
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 20,
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    borderRadius: 20,
    borderWidth: 1,
    padding: 20,
  },
  modalHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
  },
  languageLoadingBox: {
    paddingVertical: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  languageTextColumn: {
    flex: 1,
  },
  languageOptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'transparent',
    marginBottom: 8,
  },
  bottomDrawerBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  bottomDrawerContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    padding: 24,
    paddingBottom: 40,
  },
  drawerHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#94A3B8',
    alignSelf: 'center',
    marginBottom: 16,
  },
  drawerHeading: {
    marginBottom: 16,
    textAlign: 'center',
  },
  profileInfoBox: {
    gap: 10,
    marginBottom: 24,
  },
  infoLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
