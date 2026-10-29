import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export interface VerifiedSuccessCardProps {
  email: string;
  onContinue: () => void;
}

export function VerifiedSuccessCard({ email, onContinue }: VerifiedSuccessCardProps) {

  return (
    <View style={styles.container}>
      {/* Success Badge Icon */}
      <View style={styles.iconWrapper}>
        <View style={styles.outerCircle}>
          <View style={styles.innerCircle}>
            {/* Mail Icon with Checkmark */}
            <Text style={styles.envelopeIcon}>✉</Text>
            <View style={styles.checkmarkBadge}>
              <Text style={styles.checkmarkText}>✓</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Headings */}
      <Text variant="title" weight="bold" align="center" style={styles.title}>
        Email Verified!
      </Text>

      <Text variant="body" color="secondary" align="center" style={styles.subtitle}>
        Your Google email has been successfully verified.
      </Text>

      {/* Verified Account Card */}
      <Card variant="bordered" style={styles.accountCard}>
        <View style={styles.cardRow}>
          {/* Gmail 'M' logo */}
          <View style={styles.gmailIcon}>
            <Text style={styles.gmailText}>M</Text>
          </View>

          <View style={styles.accountTextContainer}>
            <Text variant="body" weight="semibold" numberOfLines={1}>
              {email}
            </Text>

            <View style={styles.verifiedBadgeRow}>
              <View style={styles.verifiedBadge}>
                <Text style={styles.verifiedBadgeIcon}>✓</Text>
                <Text style={styles.verifiedBadgeText}>Verified</Text>
              </View>
            </View>
          </View>
        </View>
      </Card>

      {/* Guidance Note */}
      <Text variant="caption" color="secondary" align="center" style={styles.guidance}>
        You can now continue with the application.
      </Text>

      {/* Primary Action Button */}
      <Button
        title="Continue"
        variant="primary"
        size="lg"
        onPress={onContinue}
        style={{
          backgroundColor: '#2563eb', // Royal blue per design
          width: '100%',
          marginTop: 16,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  iconWrapper: {
    marginBottom: 24,
  },
  outerCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#ecfdf5',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#a7f3d0',
  },
  innerCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#10b981',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  envelopeIcon: {
    fontSize: 28,
    color: '#ffffff',
  },
  checkmarkBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#059669',
    borderWidth: 2,
    borderColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  title: {
    marginBottom: 8,
    fontSize: 26,
  },
  subtitle: {
    marginBottom: 28,
    lineHeight: 22,
    maxWidth: 280,
  },
  accountCard: {
    width: '100%',
    padding: 16,
    marginBottom: 16,
    borderRadius: 16,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  gmailIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#fee2e2',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  gmailText: {
    color: '#ea4335',
    fontWeight: 'bold',
    fontSize: 20,
  },
  accountTextContainer: {
    flex: 1,
  },
  verifiedBadgeRow: {
    flexDirection: 'row',
    marginTop: 6,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#d1fae5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  verifiedBadgeIcon: {
    color: '#059669',
    fontSize: 11,
    fontWeight: 'bold',
    marginRight: 4,
  },
  verifiedBadgeText: {
    color: '#059669',
    fontSize: 11,
    fontWeight: '600',
  },
  guidance: {
    marginTop: 8,
    marginBottom: 8,
  },
});
