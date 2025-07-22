import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TextInput, 
  Pressable, 
  Image, 
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/colors';
import { Camera, X, Plus } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';

const circleTypes = ['Location', 'Theme', 'Interest'] as const;

export default function CreateCircleScreen() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [type, setType] = useState<'Location' | 'Theme' | 'Interest'>('Theme');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const router = useRouter();

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!name || !description || !image) {
      // Show validation error
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      router.replace('/circles');
    }, 1500);
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
    >
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Pressable style={styles.imagePickerContainer} onPress={pickImage}>
            {image ? (
              <Image source={{ uri: image }} style={styles.previewImage} />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Camera size={32} color={Colors.textLight} />
                <Text style={styles.imagePlaceholderText}>Tap to add a cover image</Text>
              </View>
            )}
          </Pressable>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Circle Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Give your circle a name"
              value={name}
              onChangeText={setName}
              maxLength={50}
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="What is this circle about?"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Circle Type</Text>
            <View style={styles.optionsContainer}>
              {circleTypes.map((circleType) => (
                <Pressable
                  key={circleType}
                  style={[
                    styles.optionButton,
                    type === circleType && styles.selectedOption
                  ]}
                  onPress={() => setType(circleType)}
                >
                  <Text 
                    style={[
                      styles.optionText,
                      type === circleType && styles.selectedOptionText
                    ]}
                  >
                    {circleType}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Tags</Text>
            <View style={styles.tagsContainer}>
              {tags.map((tag) => (
                <View key={tag} style={styles.tag}>
                  <Text style={styles.tagText}>#{tag}</Text>
                  <Pressable 
                    style={styles.removeTagButton}
                    onPress={() => handleRemoveTag(tag)}
                  >
                    <X size={12} color={Colors.white} />
                  </Pressable>
                </View>
              ))}
            </View>
            <View style={styles.tagInputContainer}>
              <TextInput
                style={styles.tagInput}
                placeholder="Add a tag"
                value={newTag}
                onChangeText={setNewTag}
                onSubmitEditing={handleAddTag}
              />
              <Pressable 
                style={[
                  styles.addTagButton,
                  !newTag.trim() && styles.addTagButtonDisabled
                ]}
                onPress={handleAddTag}
                disabled={!newTag.trim()}
              >
                <Plus size={16} color={Colors.white} />
              </Pressable>
            </View>
          </View>
          
          <View style={styles.rulesContainer}>
            <Text style={styles.rulesTitle}>Default Circle Rules</Text>
            <Text style={styles.ruleText}>1. Be kind and respectful to other members</Text>
            <Text style={styles.ruleText}>2. Share your baking experiences and recipes</Text>
            <Text style={styles.ruleText}>3. No spam or promotional content without approval</Text>
            <Text style={styles.ruleText}>4. Credit original sources when sharing recipes</Text>
            <Text style={styles.ruleNote}>You can customize these rules after creating the circle</Text>
          </View>
          
          <Pressable 
            style={[
              styles.submitButton,
              (!name || !description || !image) && styles.submitButtonDisabled,
              isLoading && styles.submitButtonLoading
            ]}
            onPress={handleSubmit}
            disabled={!name || !description || !image || isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={Colors.white} />
            ) : (
              <Text style={styles.submitButtonText}>Create Circle</Text>
            )}
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  imagePickerContainer: {
    width: '100%',
    height: 160,
    backgroundColor: Colors.lightGray,
    borderRadius: 8,
    marginBottom: 16,
    overflow: 'hidden',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholderText: {
    marginTop: 8,
    fontSize: 14,
    color: Colors.textLight,
  },
  previewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
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
    backgroundColor: Colors.white,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.gray,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  optionButton: {
    backgroundColor: Colors.white,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.gray,
  },
  selectedOption: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  optionText: {
    fontSize: 14,
    color: Colors.text,
  },
  selectedOptionText: {
    color: Colors.white,
    fontWeight: '600' as const,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  tag: {
    backgroundColor: Colors.primary,
    borderRadius: 16,
    paddingVertical: 6,
    paddingLeft: 12,
    paddingRight: 8,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: '500' as const,
    marginRight: 4,
  },
  removeTagButton: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tagInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tagInput: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.gray,
  },
  addTagButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  addTagButtonDisabled: {
    backgroundColor: Colors.gray,
  },
  rulesContainer: {
    backgroundColor: Colors.white,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.gray,
  },
  rulesTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 12,
  },
  ruleText: {
    fontSize: 14,
    color: Colors.text,
    marginBottom: 8,
  },
  ruleNote: {
    fontSize: 12,
    color: Colors.textLight,
    fontStyle: 'italic',
    marginTop: 8,
  },
  submitButton: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 16,
  },
  submitButtonDisabled: {
    backgroundColor: Colors.gray,
  },
  submitButtonLoading: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600' as const,
  },
});