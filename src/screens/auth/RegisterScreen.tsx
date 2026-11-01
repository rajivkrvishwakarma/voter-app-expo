import {
  Button,
  Card,
  Input,
  PhoneInput,
  ScreenContainer,
  Text,
} from '@/components/ui';
import { useRegisterMutation } from '@/features/auth';
import type { RegisterPayload, RegisterResponse } from '@/features/auth/types/auth.types';
import { useAppTheme } from '@/providers/ThemeProvider';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import { TermsModal } from './TermsModal';

export interface RegisterScreenProps {
  onSuccess: (data: RegisterResponse) => void;
}

export function RegisterScreen({ onSuccess }: RegisterScreenProps) {
  const { isDark } = useAppTheme();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [referenceNo, setReferenceNo] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showTerms, setShowTerms] = useState(false);

  const registerMutation = useRegisterMutation();

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = 'Full name is required';
    }

    if (!email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!referenceNo.trim()) {
      newErrors.referenceNo = 'Reference code is required';
    }

    const numericPhone = phone.replace(/\D/g, '');
    if (phone.trim() && (numericPhone.length < 6 || numericPhone.length > 15)) {
      newErrors.phone = 'Please enter a valid phone number (digits only)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = () => {
    if (!validate()) return;

    const payload: RegisterPayload = {
      name: name.trim(),
      email: email.trim(),
      reference_no: referenceNo.trim(),
    };

    const numericPhone = phone.replace(/\D/g, '');
    if (numericPhone) {
      payload.phone = numericPhone;
    }

    registerMutation.mutate(payload, {
      onSuccess: (data) => {
        onSuccess(data);
      },
      onError: (err) => {
        Alert.alert(
          'Registration Notice',
          err.message || 'Unable to complete sign-in. Please verify your reference details.'
        );
      },
    });
  };

  const handlePaste = async () => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard?.readText) {
        const text = await navigator.clipboard.readText();
        if (text) {
          setReferenceNo(text.trim());
          setErrors((prev) => ({ ...prev, referenceNo: '' }));
          return;
        }
      }
    } catch {
      // Fallback
    }

    if (Alert.prompt) {
      Alert.prompt(
        'Paste Reference No',
        'Enter or paste your campaign reference code:',
        (text) => {
          if (text) {
            setReferenceNo(text.trim());
            setErrors((prev) => ({ ...prev, referenceNo: '' }));
          }
        }
      );
    } else {
      setReferenceNo('CP-2026-9812');
      setErrors((prev) => ({ ...prev, referenceNo: '' }));
    }
  };

  const iconColor = '#1D61E7';

  return (
    <ScreenContainer
      scrollable
      contentContainerStyle={styles.scrollContainer}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}
      >
        {/* Screen Header */}
        <View style={styles.header}>
          <Text variant="title" weight="bold" style={styles.titleText}>
            Canvasser Sign In
          </Text>
          <Text variant="body" color="secondary" style={styles.subtitleText}>
            Please enter your credentials to access campaign materials.
          </Text>
        </View>

        {/* Main Card Container */}
        <Card variant="bordered" style={styles.mainCard}>
          {/* Field 1: Full Name */}
          <Input
            label="Full Name"
            required
            placeholder="Enter Your Full Name "
            value={name}
            onChangeText={(text) => {
              setName(text);
              if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
            }}
            error={errors.name}
            leftElement={<Ionicons name="person-outline" size={18} color={iconColor} />}
          />

          {/* Field 2: Email Address */}
          <Input
            label="Email Address"
            required
            placeholder="Enter Your Email Address"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            error={errors.email}
            leftElement={<Ionicons name="at-outline" size={19} color={iconColor} />}
          />

          {/* Field 3: Mobile Number (Reusable PhoneInput) */}
          <PhoneInput
            label="Mobile Number"
            optional={true}
            placeholder='Enter you Phone No.'
            countryCode={"+91"}
            value={phone}
            onChangeText={(text) => {
              const numericOnly = text.replace(/\D/g, '');
              setPhone(numericOnly);
              if (errors.phone) setErrors((prev) => ({ ...prev, phone: '' }));
            }}
            error={errors.phone}
          />

          {/* Field 4: Reference No */}
          <Input
            label="Reference No."
            required
            placeholder="Enter Reference Code."
            value={referenceNo}
            onChangeText={(text) => {
              setReferenceNo(text);
              if (errors.referenceNo) setErrors((prev) => ({ ...prev, referenceNo: '' }));
            }}
            autoCapitalize="characters"
            error={errors.referenceNo}
            hint="Enter Your Leader's Reference No."
            leftElement={<Ionicons name="key-outline" size={18} color={iconColor} />}
            rightElement={
              <Pressable
                onPress={handlePaste}
                style={[styles.pasteBtn, { backgroundColor: isDark ? '#1A3060' : '#E0EBFF' }]}
                hitSlop={6}
              >
                <Ionicons name="clipboard-outline" size={13} color={iconColor} />
                <Text variant="caption" weight="bold" style={[styles.pasteText, { color: iconColor }]}>
                  Paste
                </Text>
              </Pressable>
            }
          />

          {/* Reusable Primary Button */}
          <Button
            title="Continue to Campaign"
            variant="primary"
            size="lg"
            loading={registerMutation.isPending}
            onPress={handleRegister}
            style={styles.submitButton}
            leftIcon={<Ionicons name="person-circle-outline" size={22} color="#FFFFFF" />}
            rightIcon={<Ionicons name="arrow-forward" size={18} color="#FFFFFF" />}
          />

          {/* Terms & Conditions Link */}
          <View style={styles.termsRow}>
            <Text variant="caption" color="secondary">
              By proceeding, you agree to{' '}
            </Text>
            <Pressable onPress={() => setShowTerms(true)} hitSlop={6}>
              <Text variant="caption" weight="bold" style={{ color: iconColor, textDecorationLine: 'underline' }}>
                Terms and Conditions
              </Text>
            </Pressable>
          </View>
        </Card>
      </KeyboardAvoidingView>

      <TermsModal
        visible={showTerms}
        onClose={() => setShowTerms(false)}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    paddingBottom: 60,
  },
  container: {
    paddingVertical: 14,
  },
  header: {
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  titleText: {
    fontSize: 26,
    lineHeight: 32,
    marginBottom: 4,
  },
  subtitleText: {
    fontSize: 13,
    lineHeight: 18,
  },
  mainCard: {
    borderRadius: 24,
    padding: 20,
    gap: 16,
  },
  scanBadgeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scanBadgeText: {
    fontSize: 11,
    marginLeft: 4,
  },
  pasteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  pasteText: {
    fontSize: 11,
    marginLeft: 4,
  },
  submitButton: {
    marginTop: 8,
  },
  termsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: 2,
  },
});
