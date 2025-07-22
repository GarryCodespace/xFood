import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TextInput, 
  Pressable, 
  KeyboardAvoidingView, 
  Platform,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/colors';
import { useAuth } from '@/hooks/auth-store';
import { ChevronLeft } from 'lucide-react-native';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [kitchenType, setKitchenType] = useState<'Home Bakery' | 'Hobbyist' | 'Professional'>('Hobbyist');
  const [location, setLocation] = useState('');
  const [error, setError] = useState('');
  const { login, isLoading } = useAuth();
  const router = useRouter();

  const handleRegister = async () => {
    if (!name || !email || !password || !location) {
      setError('Please fill in all fields');
      return;
    }

    setError('');
    // In a real app, this would call a registration API
    // For demo, we'll just log in the user
    const result = await login(email, password);
    
    if (result.success) {
      router.replace('/');
    } else {
      setError(result.error || 'Registration failed');
    }
  };

  const handleBack = () => {
    router.back();
  };

  const kitchenTypes: Array<'Home Bakery' | 'Hobbyist' | 'Professional'> = [
    'Home Bakery', 'Hobbyist', 'Professional'
  ];

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={handleBack}>
            <ChevronLeft size={24} color={Colors.text} />
          </Pressable>
          <Text style={styles.headerTitle}>Create Account</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.title}>Join the Pastry Community</Text>
          
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your name"
              value={name}
              onChangeText={setName}
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Create a password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Location</Text>
            <TextInput
              style={styles.input}
              placeholder="City, State"
              value={location}
              onChangeText={setLocation}
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Kitchen Type</Text>
            <View style={styles.kitchenTypeContainer}>
              {kitchenTypes.map((type) => (
                <Pressable
                  key={type}
                  style={[
                    styles.kitchenTypeButton,
                    kitchenType === type && styles.selectedKitchenType
                  ]}
                  onPress={() => setKitchenType(type)}
                >
                  <Text 
                    style={[
                      styles.kitchenTypeText,
                      kitchenType === type && styles.selectedKitchenTypeText
                    ]}
                  >
                    {type}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
          
          <Pressable 
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleRegister}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={Colors.white} />
            ) : (
              <Text style={styles.buttonText}>Create Account</Text>
            )}
          </Pressable>
          
          <Text style={styles.termsText}>
            By signing up, you agree to our Terms of Service and Privacy Policy
          </Text>
          
          <Text style={styles.demoNote}>
            For demo purposes, you can register with any information
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  placeholder: {
    width: 40,
  },
  formContainer: {
    flex: 1,
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 24,
  },
  errorText: {
    color: Colors.error,
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: Colors.lightGray,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: Colors.text,
  },
  kitchenTypeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  kitchenTypeButton: {
    backgroundColor: Colors.lightGray,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    margin: 4,
  },
  selectedKitchenType: {
    backgroundColor: Colors.primary,
  },
  kitchenTypeText: {
    fontSize: 14,
    color: Colors.textLight,
    fontWeight: '500' as const,
  },
  selectedKitchenTypeText: {
    color: Colors.white,
  },
  button: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600' as const,
  },
  termsText: {
    fontSize: 12,
    color: Colors.textLight,
    textAlign: 'center',
    marginBottom: 16,
  },
  demoNote: {
    fontSize: 12,
    color: Colors.textLight,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});