import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  Pressable, 
  ScrollView,
  ActivityIndicator,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/colors';
import { Shield, Award, Upload, CheckCircle } from 'lucide-react-native';
import * as DocumentPicker from 'expo-document-picker';

const quizQuestions = [
  {
    question: "What is the safe internal temperature for baked goods containing eggs?",
    options: ["140°F", "160°F", "180°F", "200°F"],
    correct: 1
  },
  {
    question: "How long can perishable baked goods be left at room temperature?",
    options: ["1 hour", "2 hours", "4 hours", "6 hours"],
    correct: 1
  },
  {
    question: "What should you do if you have a cut on your hand while baking?",
    options: ["Continue baking", "Cover with bandage and glove", "Just use a bandage", "Ignore it"],
    correct: 1
  },
  {
    question: "How should dairy-based baked goods be stored?",
    options: ["Room temperature", "Refrigerated", "Frozen", "Any temperature"],
    correct: 1
  },
  {
    question: "What is cross-contamination in baking?",
    options: ["Mixing ingredients", "Using dirty equipment", "Transferring harmful bacteria", "Overcooking"],
    correct: 2
  }
];

export default function VerificationScreen() {
  const [verificationMethod, setVerificationMethod] = useState<'license' | 'quiz' | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [licenseUploaded, setLicenseUploaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleMethodSelect = (method: 'license' | 'quiz') => {
    setVerificationMethod(method);
  };

  const handleQuizAnswer = (answerIndex: number) => {
    const newAnswers = [...answers, answerIndex];
    setAnswers(newAnswers);

    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setQuizCompleted(true);
    }
  };

  const handleLicenseUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['image/*', 'application/pdf'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled) {
        setLicenseUploaded(true);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to upload document');
    }
  };

  const handleSubmitVerification = async () => {
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      
      if (verificationMethod === 'quiz') {
        const correctAnswers = answers.filter((answer, index) => 
          answer === quizQuestions[index].correct
        ).length;
        
        if (correctAnswers >= 4) {
          Alert.alert(
            'Verification Successful!',
            'You are now a verified baker. Your badge will appear on your profile.',
            [{ text: 'OK', onPress: () => router.back() }]
          );
        } else {
          Alert.alert(
            'Quiz Failed',
            `You got ${correctAnswers}/5 questions correct. You need at least 4 to pass. Please try again.`,
            [{ text: 'Retry', onPress: () => {
              setCurrentQuestion(0);
              setAnswers([]);
              setQuizCompleted(false);
            }}]
          );
        }
      } else {
        Alert.alert(
          'Verification Submitted!',
          'Your license has been submitted for review. You will be notified once approved.',
          [{ text: 'OK', onPress: () => router.back() }]
        );
      }
    }, 2000);
  };

  const renderMethodSelection = () => (
    <View style={styles.methodContainer}>
      <Text style={styles.title}>Choose Verification Method</Text>
      <Text style={styles.subtitle}>
        Get verified to build trust with other bakers in your community
      </Text>
      
      <Pressable 
        style={styles.methodButton}
        onPress={() => handleMethodSelect('license')}
      >
        <Shield size={24} color={Colors.primary} />
        <View style={styles.methodContent}>
          <Text style={styles.methodTitle}>Food Handler License</Text>
          <Text style={styles.methodDescription}>
            Upload your food handler's license or food safety certificate
          </Text>
        </View>
      </Pressable>
      
      <Pressable 
        style={styles.methodButton}
        onPress={() => handleMethodSelect('quiz')}
      >
        <Award size={24} color={Colors.primary} />
        <View style={styles.methodContent}>
          <Text style={styles.methodTitle}>Food Safety Quiz</Text>
          <Text style={styles.methodDescription}>
            Complete a 5-question quiz about food safety basics
          </Text>
        </View>
      </Pressable>
    </View>
  );

  const renderLicenseUpload = () => (
    <View style={styles.uploadContainer}>
      <Text style={styles.title}>Upload Food Handler License</Text>
      <Text style={styles.subtitle}>
        Please upload a clear photo or PDF of your food handler's license
      </Text>
      
      <Pressable 
        style={[styles.uploadButton, licenseUploaded && styles.uploadButtonSuccess]}
        onPress={handleLicenseUpload}
      >
        {licenseUploaded ? (
          <CheckCircle size={24} color={Colors.success} />
        ) : (
          <Upload size={24} color={Colors.primary} />
        )}
        <Text style={[
          styles.uploadButtonText,
          licenseUploaded && styles.uploadButtonTextSuccess
        ]}>
          {licenseUploaded ? 'License Uploaded' : 'Upload License'}
        </Text>
      </Pressable>
      
      {licenseUploaded && (
        <Pressable 
          style={styles.submitButton}
          onPress={handleSubmitVerification}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={Colors.white} />
          ) : (
            <Text style={styles.submitButtonText}>Submit for Review</Text>
          )}
        </Pressable>
      )}
    </View>
  );

  const renderQuiz = () => {
    if (quizCompleted) {
      const correctAnswers = answers.filter((answer, index) => 
        answer === quizQuestions[index].correct
      ).length;
      
      return (
        <View style={styles.quizContainer}>
          <Text style={styles.title}>Quiz Completed!</Text>
          <Text style={styles.subtitle}>
            You got {correctAnswers} out of {quizQuestions.length} questions correct
          </Text>
          
          <Pressable 
            style={styles.submitButton}
            onPress={handleSubmitVerification}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={Colors.white} />
            ) : (
              <Text style={styles.submitButtonText}>Submit Results</Text>
            )}
          </Pressable>
        </View>
      );
    }

    const question = quizQuestions[currentQuestion];
    
    return (
      <View style={styles.quizContainer}>
        <Text style={styles.questionCounter}>
          Question {currentQuestion + 1} of {quizQuestions.length}
        </Text>
        
        <Text style={styles.question}>{question.question}</Text>
        
        <View style={styles.optionsContainer}>
          {question.options.map((option, index) => (
            <Pressable
              key={index}
              style={styles.optionButton}
              onPress={() => handleQuizAnswer(index)}
            >
              <Text style={styles.optionText}>{option}</Text>
            </Pressable>
          ))}
        </View>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {!verificationMethod && renderMethodSelection()}
        {verificationMethod === 'license' && renderLicenseUpload()}
        {verificationMethod === 'quiz' && renderQuiz()}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: 16,
  },
  methodContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textLight,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  methodButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    width: '100%',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  methodContent: {
    flex: 1,
    marginLeft: 16,
  },
  methodTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 4,
  },
  methodDescription: {
    fontSize: 14,
    color: Colors.textLight,
    lineHeight: 20,
  },
  uploadContainer: {
    alignItems: 'center',
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingVertical: 20,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.primary,
    borderStyle: 'dashed',
    marginBottom: 24,
    width: '100%',
  },
  uploadButtonSuccess: {
    borderColor: Colors.success,
    borderStyle: 'solid',
  },
  uploadButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.primary,
    marginLeft: 8,
  },
  uploadButtonTextSuccess: {
    color: Colors.success,
  },
  quizContainer: {
    alignItems: 'center',
  },
  questionCounter: {
    fontSize: 14,
    color: Colors.textLight,
    marginBottom: 16,
  },
  question: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 26,
  },
  optionsContainer: {
    width: '100%',
  },
  optionButton: {
    backgroundColor: Colors.white,
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  optionText: {
    fontSize: 16,
    color: Colors.text,
    textAlign: 'center',
  },
  submitButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 8,
    marginTop: 16,
    width: '100%',
    alignItems: 'center',
  },
  submitButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600' as const,
  },
});