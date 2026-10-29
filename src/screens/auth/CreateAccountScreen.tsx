import React, { useState } from 'react';
import { View, StyleSheet, Pressable, Alert } from 'react-native';
import { ScreenContainer, Text, Button, Input } from '@/components/ui';
import { useAppTheme } from '@/providers/ThemeProvider';
import {
  GoogleEmailButton,
  AccountConsentSheet,
  VerifyingOverlay,
  VerifiedSuccessCard,
  useVerifyEmailMutation,
  type AuthFlowStep,
  type GoogleAccountChoice,
  VerifiedEmailService,
} from '@/features/auth';

export function CreateAccountScreen() {
  const { theme } = useAppTheme();
  const [step, setStep] = useState<AuthFlowStep>('form');
  const [fullName, setFullName] = useState('John Doe');
  const [email, setEmail] = useState('');
  const [selectedAccount, setSelectedAccount] = useState<GoogleAccountChoice | null>(null);

  const verifyMutation = useVerifyEmailMutation();

  const handleStartVerification = async () => {
    // If native Credential Manager is available, invoke it directly
    if (VerifiedEmailService.isNativeSupported()) {
      executeVerification();
      return;
    }

    // Open the interactive Android Credential Manager consent sheet
    setStep('consent');
  };

  const handleAccountChosen = (account: GoogleAccountChoice) => {
    setSelectedAccount(account);
    setStep('processing');
    executeVerification(account.email);
  };

  const executeVerification = (targetEmail?: string) => {
    setStep('processing');
    verifyMutation.mutate(
      { chosenEmail: targetEmail },
      {
        onSuccess: (result) => {
          setEmail(result.email);
          setStep('verified_form');
        },
        onError: (error) => {
          Alert.alert('Verification Failed', error.message || 'Could not verify email.');
          setStep('form');
        },
      }
    );
  };

  const handleFormContinue = () => {
    if (!email) {
      Alert.alert('Email Required', 'Please enter or verify your email address.');
      return;
    }
    setStep('success');
  };

  const handleReset = () => {
    setStep('form');
    setEmail('');
    setSelectedAccount(null);
  };

  // Step 3: Verifying state
  if (step === 'processing') {
    return <VerifyingOverlay email={selectedAccount?.email} />;
  }

  // Step 5: Success state
  if (step === 'success') {
    return (
      <ScreenContainer edges={['top', 'bottom']}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Back"
          style={styles.backButton}
          onPress={() => setStep('verified_form')}
        >
          <Text variant="title" weight="regular" color="secondary">
            ←
          </Text>
        </Pressable>
        <VerifiedSuccessCard email={email} onContinue={handleReset} />
      </ScreenContainer>
    );
  }

  // Step 1 and Step 4: Form state
  const isVerified = step === 'verified_form' && Boolean(email);

  return (
    <ScreenContainer scrollable edges={['top', 'bottom']}>
      {/* Top Bar with Back Arrow */}
      <View style={styles.topBar}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          style={styles.backButton}
          onPress={isVerified ? handleReset : undefined}
        >
          <Text variant="title" weight="regular" color="secondary">
            ←
          </Text>
        </Pressable>
      </View>

      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text variant="title" weight="bold" style={styles.screenTitle}>
            Create Account
          </Text>
          <Text variant="body" color="secondary" style={styles.screenSubtitle}>
            Get started with your details
          </Text>
        </View>

        {/* Inputs */}
        <View style={styles.inputsSection}>
          <Input
            label="Full Name"
            placeholder="John Doe"
            value={fullName}
            onChangeText={setFullName}
            containerStyle={styles.inputContainer}
          />

          <View style={styles.inputContainer}>
            <Input
              label="Email Address"
              placeholder="Enter your email address"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              rightElement={
                isVerified ? (
                  <View style={styles.inputCheckmarkCircle}>
                    <Text style={styles.inputCheckmark}>✓</Text>
                  </View>
                ) : undefined
              }
            />

            {/* Verified Green Badge (Step 4) */}
            {isVerified && (
              <View style={styles.verifiedTagRow}>
                <View style={styles.verifiedTag}>
                  <Text style={styles.verifiedTagCheck}>✓</Text>
                  <Text style={styles.verifiedTagText}>Verified</Text>
                </View>
              </View>
            )}
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actionsSection}>
          {!isVerified ? (
            <>
              <GoogleEmailButton
                onPress={handleStartVerification}
                loading={verifyMutation.isPending}
              />

              <View style={styles.dividerRow}>
                <View style={[styles.dividerLine, { backgroundColor: theme.colors.border.default }]} />
                <Text variant="caption" color="muted" style={styles.dividerText}>
                  or
                </Text>
                <View style={[styles.dividerLine, { backgroundColor: theme.colors.border.default }]} />
              </View>

              <Button
                title="Next"
                variant="outline"
                size="lg"
                onPress={handleFormContinue}
                style={styles.nextButton}
              />
            </>
          ) : (
            <>
              <Button
                title="Continue"
                variant="primary"
                size="lg"
                onPress={handleFormContinue}
                style={[styles.continueButton, { backgroundColor: '#2563eb' }]}
              />

              <Button
                title="Next"
                variant="outline"
                size="lg"
                onPress={handleFormContinue}
                style={styles.nextButton}
              />
            </>
          )}
        </View>

        {/* Footer Security Note */}
        <View style={styles.footer}>
          <Text variant="caption" color="muted" align="center" style={styles.footerText}>
            Your information is secure and will only be used for this application.
          </Text>
        </View>
      </View>

      {/* Step 2: Credential Manager Consent Sheet Modal */}
      <AccountConsentSheet
        visible={step === 'consent'}
        onSelectAccount={handleAccountChosen}
        onCancel={() => setStep('form')}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  topBar: {
    paddingVertical: 8,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    paddingTop: 8,
    paddingBottom: 24,
  },
  header: {
    marginBottom: 28,
  },
  screenTitle: {
    fontSize: 26,
    marginBottom: 4,
  },
  screenSubtitle: {
    fontSize: 15,
  },
  inputsSection: {
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputCheckmarkCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#10b981',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputCheckmark: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  verifiedTagRow: {
    flexDirection: 'row',
    marginTop: 8,
  },
  verifiedTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#d1fae5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  verifiedTagCheck: {
    color: '#059669',
    fontSize: 12,
    fontWeight: 'bold',
    marginRight: 4,
  },
  verifiedTagText: {
    color: '#059669',
    fontSize: 12,
    fontWeight: '600',
  },
  actionsSection: {
    marginBottom: 32,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 18,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    paddingHorizontal: 12,
  },
  nextButton: {
    width: '100%',
  },
  continueButton: {
    width: '100%',
    marginBottom: 12,
  },
  footer: {
    marginTop: 'auto',
    paddingTop: 16,
    alignItems: 'center',
  },
  footerText: {
    maxWidth: 260,
    lineHeight: 18,
  },
});
