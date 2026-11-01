import React from 'react';
import { Modal, View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '@/providers/ThemeProvider';
import { Text, Button } from '@/components/ui';

export interface TermsModalProps {
  visible: boolean;
  onClose: () => void;
}

export function TermsModal({ visible, onClose }: TermsModalProps) {
  const { theme } = useAppTheme();

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <View
          style={[
            styles.container,
            {
              backgroundColor: theme.colors.background.surface,
              borderColor: theme.colors.border.subtle,
            },
          ]}
        >
          {/* Header */}
          <View style={[styles.header, { borderBottomColor: theme.colors.border.subtle }]}>
            <Text variant="subtitle" weight="semibold">
              Terms & Conditions
            </Text>
            <Pressable
              onPress={onClose}
              hitSlop={12}
              accessibilityRole="button"
              accessibilityLabel="Close terms"
            >
              <Ionicons name="close" size={24} color={theme.colors.text.secondary} />
            </Pressable>
          </View>

          {/* Content */}
          <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
            <Text variant="body" color="secondary" style={styles.sectionText}>
              By creating an account and registering with this campaign application, you agree to the following terms and guidelines:
            </Text>

            <Text variant="label" weight="bold" style={styles.heading}>
              1. Voter Registration & Reference Information
            </Text>
            <Text variant="body" color="secondary" style={styles.sectionText}>
              The name, email, phone number, and candidate referral reference code provided must be accurate to ensure proper campaign representation and constituency coordination.
            </Text>

            <Text variant="label" weight="bold" style={styles.heading}>
              2. Privacy & Data Security
            </Text>
            <Text variant="body" color="secondary" style={styles.sectionText}>
              Your contact details are encrypted and securely stored. They will be used strictly for voting coordination, candidate communication, and updates from the campaign.
            </Text>

            <Text variant="label" weight="bold" style={styles.heading}>
              3. Campaign Code of Conduct
            </Text>
            <Text variant="body" color="secondary" style={styles.sectionText}>
              Users are expected to adhere to democratic principles, respectful dialogue, and local electoral commission regulations while interacting with the platform.
            </Text>
          </ScrollView>

          {/* Footer */}
          <View style={[styles.footer, { borderTopColor: theme.colors.border.subtle }]}>
            <Button title="I Understand & Agree" variant="primary" size="md" onPress={onClose} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    maxHeight: '80%',
    paddingBottom: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  body: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  heading: {
    marginTop: 14,
    marginBottom: 6,
  },
  sectionText: {
    lineHeight: 20,
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
});
