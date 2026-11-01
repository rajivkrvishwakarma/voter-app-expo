import { Button, Card, ScreenContainer, Text } from '@/components/ui';
import { useCurrentUserQuery, usePoliticianBannerQuery } from '@/features/auth';
import { useAppTheme } from '@/providers/ThemeProvider';
import { useAuthStore } from '@/store/auth.store';
import { resolveImageUrl } from '@/utils/imageUrl';
import { Ionicons } from '@expo/vector-icons';
import {
  Alert,
  Image,
  Pressable,
  RefreshControl,
  StyleSheet,
  View,
} from 'react-native';

export interface ProfileScreenProps {
  onBack: () => void;
  onLogout: () => void;
}

export function ProfileScreen({ onBack, onLogout }: ProfileScreenProps) {
  const { isDark, setThemeMode } = useAppTheme();
  const { user: cachedUser, politician: cachedPolitician, logout } = useAuthStore();

  const {
    data: fetchedUser,
    isRefetching: isUserRefetching,
    refetch: refetchUser,
  } = useCurrentUserQuery();

  const {
    data: fetchedPolitician,
    isRefetching: isPolRefetching,
    refetch: refetchPolitician,
  } = usePoliticianBannerQuery();

  const user = fetchedUser || cachedUser;
  const politician = fetchedPolitician || cachedPolitician;

  const handleRefresh = async () => {
    await Promise.all([refetchUser(), refetchPolitician()]);
  };

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to log out from this session?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log Out',
        style: 'destructive',
        onPress: async () => {
          await logout();
          onLogout();
        },
      },
    ]);
  };

  const cardBg = isDark ? '#0D1935' : '#FFFFFF';
  const cardBorder = isDark ? '#1E356A' : '#E8EEF8';
  const iconBg = isDark ? '#132347' : '#F0F9FF';
  const activeBlue = isDark ? '#38BDF8' : '#0284C7';

  const bannerUri = resolveImageUrl(
    politician?.party_banner_url || politician?.party_banner
  );
  const logoUri = resolveImageUrl(
    politician?.party_logo_url || politician?.party_logo
  );
  const candidateImageUri = resolveImageUrl(
    politician?.image_url || politician?.image
  );

  const initials = user?.name
    ? user.name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
    : 'U';

  const formattedDate = user?.created_at
    ? new Date(user.created_at).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
    : 'Active';

  return (
    <ScreenContainer
      scrollable
      contentContainerStyle={styles.scrollContent}
      refreshControl={
        <RefreshControl
          refreshing={isUserRefetching || isPolRefetching}
          onRefresh={handleRefresh}
          tintColor={activeBlue}
        />
      }
    >
      {/* 1. Header Navigation Bar */}
      <View style={styles.topNavRow}>
        <Pressable
          onPress={onBack}
          style={[styles.navButton, { backgroundColor: iconBg, borderColor: cardBorder }]}
          hitSlop={8}
          accessibilityLabel="Back to Dashboard"
        >
          <Ionicons name="arrow-back" size={22} color={activeBlue} />
        </Pressable>

        <Text variant="title" weight="bold" style={styles.navTitle}>
          My Profile
        </Text>

        <View style={styles.headerRightActions}>
          <Pressable
            onPress={() => setThemeMode(isDark ? 'light' : 'dark')}
            style={[styles.navButton, { backgroundColor: iconBg, borderColor: cardBorder }]}
            hitSlop={8}
            accessibilityLabel="Change Theme"
          >
            <Ionicons
              name={isDark ? 'sunny-outline' : 'moon-outline'}
              size={20}
              color={isDark ? '#F59E0B' : activeBlue}
            />
          </Pressable>

          <Pressable
            onPress={handleLogout}
            style={[styles.navButton, { backgroundColor: isDark ? '#2D1515' : '#FEE2E2', borderColor: isDark ? '#451A1A' : '#FECACA' }]}
            hitSlop={8}
            accessibilityLabel="Log Out"
          >
            <Ionicons name="log-out-outline" size={20} color="#EF4444" />
          </Pressable>
        </View>
      </View>

      {/* 2. User Hero Identity Card */}
      <Card variant="bordered" style={[styles.profileHeroCard, { backgroundColor: cardBg, borderColor: cardBorder }]}>
        <View style={styles.avatarRow}>
          <View style={[styles.avatarCircle, { backgroundColor: activeBlue }]}>
            <Text variant="title" weight="bold" style={styles.avatarText}>
              {initials}
            </Text>
          </View>

          <View style={styles.heroTextColumn}>
            <Text variant="title" weight="bold" style={styles.userNameText}>
              {user?.name || 'Voter'}
            </Text>
            <View style={styles.roleBadge}>
              <Ionicons name="shield-checkmark" size={12} color="#FFFFFF" />
              <Text variant="caption" weight="bold" style={styles.roleBadgeText}>
                {(user?.user_type || 'user').toUpperCase()}
              </Text>
            </View>
          </View>
        </View>

        <View style={[styles.refCodeBox, { backgroundColor: iconBg, borderColor: cardBorder }]}>
          <View>
            <Text variant="caption" color="secondary">Reference Number</Text>
            <Text variant="body" weight="bold" style={{ color: activeBlue }}>
              {user?.reference_no || '—'}
            </Text>
          </View>

          <View style={styles.sessionStatusPill}>
            <View style={styles.statusDotGreen} />
            <Text variant="caption" weight="semibold" style={{ color: '#10B981' }}>
              Active
            </Text>
          </View>
        </View>
      </Card>

      {/* 3. Connected Politician & Campaign Card (from /api/banner-screen) */}
      {politician && (
        <Card variant="bordered" style={[styles.politicianCard, { backgroundColor: cardBg, borderColor: cardBorder }]}>
          <Text variant="subtitle" weight="bold" style={styles.cardHeaderTitle}>
            Politician Details
          </Text>

          {/* Banner Hero */}
          {bannerUri && (
            <View style={styles.bannerWrapper}>
              <Image source={{ uri: bannerUri }} style={styles.bannerImage} resizeMode="cover" />
              <View style={styles.bannerShade} />
              <View style={styles.partyFloatingPill}>
                {logoUri && <Image source={{ uri: logoUri }} style={styles.partyFloatingLogo} resizeMode="contain" />}
                <Text variant="label" weight="bold" style={{ color: '#FFFFFF' }}>{politician.party_name}</Text>
              </View>
            </View>
          )}

          {/* Politician Details */}
          <View style={styles.politicianInfoRow}>
            {candidateImageUri ? (
              <Image source={{ uri: candidateImageUri }} style={styles.candidateAvatar} />
            ) : (
              <View style={[styles.candidateAvatarPlaceholder, { backgroundColor: iconBg }]}>
                <Ionicons name="person" size={24} color={activeBlue} />
              </View>
            )}

            <View style={styles.candidateDetailsText}>
              <Text variant="body" weight="bold">
                {politician.name}
              </Text>
              <Text variant="caption" color="secondary">
                {politician.userDetails?.professions || 'Politician'} • {politician.party_name}
              </Text>
              {politician.userDetails?.address && (
                <Text variant="caption" color="secondary" numberOfLines={1}>
                  📍 {politician.userDetails.address}
                </Text>
              )}
            </View>
          </View>
        </Card>
      )}

      {/* 4. Detailed Account Information Card */}
      <Card variant="bordered" style={[styles.detailsCard, { backgroundColor: cardBg, borderColor: cardBorder }]}>
        <Text variant="subtitle" weight="bold" style={styles.cardHeaderTitle}>
          Account Details
        </Text>

        <View style={styles.detailRow}>
          <Text variant="body" color="secondary">Email Address</Text>
          <Text variant="body" weight="medium">{user?.email || '—'}</Text>
        </View>

        <View style={[styles.detailRow, { borderTopColor: cardBorder }]}>
          <Text variant="body" color="secondary">Mobile Phone</Text>
          <Text variant="body" weight="medium">{user?.phone || 'Not provided'}</Text>
        </View>

        <View style={[styles.detailRow, { borderTopColor: cardBorder }]}>
          <Text variant="body" color="secondary">Language</Text>
          <Text variant="body" weight="medium">{user?.language?.toUpperCase() || 'EN'}</Text>
        </View>

        <View style={[styles.detailRow, { borderTopColor: cardBorder }]}>
          <Text variant="body" color="secondary">Registered On</Text>
          <Text variant="body" weight="medium">{formattedDate}</Text>
        </View>
      </Card>

      {/* 5. Sign Out Button */}
      <Button
        title="Sign Out of Session"
        variant="destructive"
        size="lg"
        onPress={handleLogout}
        style={styles.signOutButton}
        leftIcon={<Ionicons name="log-out-outline" size={20} color="#FFFFFF" />}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 60,
  },
  topNavRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    marginBottom: 12,
  },
  navButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navTitle: {
    fontSize: 20,
  },
  headerRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  profileHeroCard: {
    padding: 18,
    borderRadius: 22,
    marginBottom: 16,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 22,
  },
  heroTextColumn: {
    flex: 1,
  },
  userNameText: {
    fontSize: 20,
    marginBottom: 4,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0284C7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    alignSelf: 'flex-start',
    gap: 4,
  },
  roleBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    letterSpacing: 0.5,
  },
  refCodeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
  },
  sessionStatusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  statusDotGreen: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
  },
  politicianCard: {
    padding: 16,
    borderRadius: 22,
    marginBottom: 16,
  },
  cardHeaderTitle: {
    fontSize: 16,
    marginBottom: 12,
  },
  bannerWrapper: {
    width: '100%',
    height: 120,
    borderRadius: 14,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 12,
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  bannerShade: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
  },
  partyFloatingPill: {
    position: 'absolute',
    bottom: 8,
    left: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 6,
  },
  partyFloatingLogo: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#FFFFFF',
  },
  politicianInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  candidateAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  candidateAvatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  candidateDetailsText: {
    flex: 1,
    gap: 2,
  },
  detailsCard: {
    padding: 16,
    borderRadius: 22,
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  signOutButton: {
    marginTop: 4,
    marginBottom: 20,
  },
});
