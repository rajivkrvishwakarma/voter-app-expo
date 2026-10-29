import { Text } from '@/components/ui/Text';
import { useAppTheme } from '@/providers/ThemeProvider';
import { Ionicons } from '@expo/vector-icons';
import {
  Modal,
  Pressable,
  StyleSheet,
  View,
  type GestureResponderEvent,
} from 'react-native';
import { MOCK_DEVICE_ACCOUNTS } from '../services/verifiedEmail.service';
import type { GoogleAccountChoice } from '../types/auth.types';

export interface AccountConsentSheetProps {
  visible: boolean;
  onSelectAccount: (account: GoogleAccountChoice) => void;
  onCancel: () => void;
  selectedAccountId?: string;
}

export function AccountConsentSheet({
  visible,
  onSelectAccount,
  onCancel,
  selectedAccountId = 'acc_2',
}: AccountConsentSheetProps) {
  const { isDark } = useAppTheme();

  const handleBackdropPress = (e: GestureResponderEvent) => {
    if (e.target === e.currentTarget) {
      onCancel();
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onCancel}
    >
      <Pressable style={styles.backdrop} onPress={handleBackdropPress}>
        <View
          style={[
            styles.sheetContainer,
            { backgroundColor: isDark ? '#1e293b' : '#ffffff' },
          ]}
        >
          {/* Sheet Handle */}
          <View style={styles.handle} />

          {/* Google Branding Header */}
          <View style={styles.brandContainer}>
            <View style={styles.googleLogoRow}>
              <Text style={[styles.googleLetter, { color: '#4285F4' }]}>G</Text>
              <Text style={[styles.googleLetter, { color: '#EA4335' }]}>o</Text>
              <Text style={[styles.googleLetter, { color: '#FBBC05' }]}>o</Text>
              <Text style={[styles.googleLetter, { color: '#4285F4' }]}>g</Text>
              <Text style={[styles.googleLetter, { color: '#34A853' }]}>l</Text>
              <Text style={[styles.googleLetter, { color: '#EA4335' }]}>e</Text>
            </View>
            <Text variant="subtitle" weight="bold" style={styles.title}>
              Choose an account
            </Text>
            <Text variant="caption" color="secondary" style={styles.subtitle}>
              to share your email with this app
            </Text>
          </View>

          {/* Account Choices List */}
          <View style={styles.accountList}>
            {MOCK_DEVICE_ACCOUNTS.map((acc) => {
              const isSelected = acc.id === selectedAccountId;
              return (
                <Pressable
                  key={acc.id}
                  accessibilityRole="button"
                  accessibilityLabel={`Select account ${acc.email}`}
                  style={({ pressed }) => [
                    styles.accountRow,
                    {
                      backgroundColor: pressed
                        ? (isDark ? '#334155' : '#f1f5f9')
                        : 'transparent',
                    },
                  ]}
                  onPress={() => onSelectAccount(acc)}
                >
                  <View style={[styles.avatar, { backgroundColor: acc.avatarColor || '#2563eb' }]}>
                    <Text weight="bold" style={styles.avatarLetter}>
                      {acc.avatarLetter || acc.name.charAt(0)}
                    </Text>
                  </View>

                  <View style={styles.accountInfo}>
                    <Text variant="body" weight="medium" numberOfLines={1}>
                      {acc.email}
                    </Text>
                  </View>

                  {isSelected ? (
                    <Ionicons name="radio-button-on" size={22} color="#2563eb" />
                  ) : (
                    <Ionicons name="chevron-forward" size={18} color="#94a3b8" />
                  )}
                </Pressable>
              );
            })}

            {/* Add another account row */}
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Add another account"
              style={({ pressed }) => [
                styles.accountRow,
                {
                  backgroundColor: pressed
                    ? (isDark ? '#334155' : '#f1f5f9')
                    : 'transparent',
                },
              ]}
              onPress={() => onSelectAccount(MOCK_DEVICE_ACCOUNTS[1])}
            >
              <View style={[styles.avatar, { backgroundColor: isDark ? '#475569' : '#e2e8f0' }]}>
                <Ionicons name="add" size={20} color={isDark ? '#f8fafc' : '#475569'} />
              </View>
              <View style={styles.accountInfo}>
                <Text variant="body" color="secondary">
                  Add another account
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#94a3b8" />
            </Pressable>
          </View>

          {/* Disclaimer & Cancel */}
          <Text variant="caption" color="muted" style={styles.disclaimer}>
            Your email will be shared securely with this app. You can manage this in your Google Account settings.
          </Text>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Cancel"
            style={styles.cancelButton}
            onPress={onCancel}
          >
            <Text variant="label" weight="medium" color="secondary">
              Cancel
            </Text>
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 12,
    paddingBottom: 32,
    paddingHorizontal: 20,
    maxHeight: '85%',
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#94a3b8',
    alignSelf: 'center',
    marginBottom: 16,
  },
  brandContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  googleLogoRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  googleLetter: {
    fontSize: 22,
    fontWeight: '700',
  },
  title: {
    marginBottom: 4,
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
  },
  accountList: {
    marginVertical: 8,
  },
  accountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarLetter: {
    color: '#ffffff',
    fontSize: 14,
  },
  accountInfo: {
    flex: 1,
  },
  radioSelected: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#2563eb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#2563eb',
  },
  chevron: {
    fontSize: 20,
    lineHeight: 22,
  },
  disclaimer: {
    marginTop: 12,
    marginBottom: 16,
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 8,
  },
  cancelButton: {
    alignSelf: 'center',
    paddingVertical: 10,
    paddingHorizontal: 24,
  },
});
