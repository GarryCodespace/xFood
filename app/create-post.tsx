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
  ActivityIndicator,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/colors';
import { Camera, X, Plus, DollarSign, MapPin } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { AllergenTagList } from '@/components/AllergenTagList';
import { AllergenTag, SpecialTag } from '@/types';
import { useToast } from '@/hooks/toast-store';
import { apiService } from '@/utils/api';

const deliveryOptions = ['Pickup Only', 'Delivery Available'] as const;

export default function CreatePostScreen() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [ingredients, setIngredients] = useState<string[]>(['']);
  const [image, setImage] = useState<string | null>(null);
  const [price, setPrice] = useState('');
  const [location, setLocation] = useState('');
  const [deliveryOption, setDeliveryOption] = useState<'Pickup Only' | 'Delivery Available'>('Pickup Only');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [allergenTags, setAllergenTags] = useState<AllergenTag[]>([]);
  const [specialTags, setSpecialTags] = useState<SpecialTag[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const router = useRouter();
  const { showSuccess, showError } = useToast();

  const handleAddIngredient = () => {
    setIngredients([...ingredients, '']);
  };

  const handleUpdateIngredient = (text: string, index: number) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = text;
    setIngredients(newIngredients);
  };

  const handleRemoveIngredient = (index: number) => {
    if (ingredients.length > 1) {
      const newIngredients = [...ingredients];
      newIngredients.splice(index, 1);
      setIngredients(newIngredients);
    }
  };

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  const handleSelectAllergen = (tag: AllergenTag) => {
    setAllergenTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleSelectSpecial = (tag: SpecialTag) => {
    setSpecialTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    // Validation
    if (!title.trim()) {
      showError('Please enter a title for your bake.');
      return;
    }
    if (!description.trim()) {
      showError('Please enter a description for your bake.');
      return;
    }
    if (!image) {
      showError('Please add a photo of your bake.');
      return;
    }
    if (!location.trim()) {
      showError('Please enter your location.');
      return;
    }
    if (ingredients.some(i => !i.trim())) {
      showError('Please fill in all ingredient fields or remove empty ones.');
      return;
    }

    setIsLoading(true);

    try {
      // Prepare post data
      const postData = {
        title: title.trim(),
        description: description.trim(),
        ingredients: ingredients.filter(i => i.trim()),
        image,
        price: price ? parseFloat(price) : null,
        location: location.trim(),
        deliveryOption,
        tags: [...tags, ...allergenTags, ...specialTags],
        allergenTags,
        specialTags,
        userId: 'current_user_id', // Replace with actual user ID
        timestamp: new Date().toISOString(),
      };

      // Submit to backend
      const result = await apiService.createPost(postData);

      if (!result.success) {
        throw new Error('Failed to create post');
      }
      
      showSuccess('Your bake has been shared successfully!');
      
      // Clear form
      setTitle('');
      setDescription('');
      setIngredients(['']);
      setImage(null);
      setPrice('');
      setLocation('');
      setDeliveryOption('Pickup Only');
      setTags([]);
      setAllergenTags([]);
      setSpecialTags([]);
      setNewTag('');
      
      // Navigate back to home after a short delay
      setTimeout(() => {
        router.replace('/');
      }, 1500);
    } catch (error) {
      console.error('Post creation error:', error);
      showError('Something went wrong while creating your post. Please try again.');
    } finally {
      setIsLoading(false);
    }
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
                <Text style={styles.imagePlaceholderText}>Tap to add a photo</Text>
              </View>
            )}
          </Pressable>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Title</Text>
            <TextInput
              style={styles.input}
              placeholder="What did you bake?"
              value={title}
              onChangeText={setTitle}
              maxLength={50}
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Tell us about your bake..."
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Ingredients</Text>
            {ingredients.map((ingredient, index) => (
              <View key={index} style={styles.ingredientRow}>
                <TextInput
                  style={[styles.input, styles.ingredientInput]}
                  placeholder={`Ingredient ${index + 1}`}
                  value={ingredient}
                  onChangeText={(text) => handleUpdateIngredient(text, index)}
                />
                <Pressable 
                  style={styles.removeButton}
                  onPress={() => handleRemoveIngredient(index)}
                  disabled={ingredients.length === 1}
                >
                  <X size={16} color={ingredients.length === 1 ? Colors.gray : Colors.error} />
                </Pressable>
              </View>
            ))}
            <Pressable style={styles.addButton} onPress={handleAddIngredient}>
              <Plus size={16} color={Colors.white} />
              <Text style={styles.addButtonText}>Add Ingredient</Text>
            </Pressable>
          </View>
          
          <AllergenTagList
            allergenTags={allergenTags}
            specialTags={specialTags}
            selectedAllergens={allergenTags}
            selectedSpecials={specialTags}
            onSelectAllergen={handleSelectAllergen}
            onSelectSpecial={handleSelectSpecial}
            editable={true}
          />
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Price (optional)</Text>
            <View style={styles.priceInputContainer}>
              <DollarSign size={16} color={Colors.textLight} style={styles.priceIcon} />
              <TextInput
                style={styles.priceInput}
                placeholder="0.00"
                value={price}
                onChangeText={setPrice}
                keyboardType="decimal-pad"
              />
            </View>
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Location</Text>
            <View style={styles.locationInputContainer}>
              <MapPin size={16} color={Colors.textLight} style={styles.locationIcon} />
              <TextInput
                style={styles.locationInput}
                placeholder="Where are you located?"
                value={location}
                onChangeText={setLocation}
              />
            </View>
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Delivery Option</Text>
            <View style={styles.optionsContainer}>
              {deliveryOptions.map((option) => (
                <Pressable
                  key={option}
                  style={[
                    styles.optionButton,
                    deliveryOption === option && styles.selectedOption
                  ]}
                  onPress={() => setDeliveryOption(option)}
                >
                  <Text 
                    style={[
                      styles.optionText,
                      deliveryOption === option && styles.selectedOptionText
                    ]}
                  >
                    {option}
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
          
          <Pressable 
            style={[
              styles.submitButton,
              (!title || !description || !image || !location) && styles.submitButtonDisabled,
              isLoading && styles.submitButtonLoading
            ]}
            onPress={handleSubmit}
            disabled={!title || !description || !image || !location || isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={Colors.white} />
            ) : (
              <Text style={styles.submitButtonText}>Share Your Bake</Text>
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
    height: 200,
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
  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ingredientInput: {
    flex: 1,
  },
  removeButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  addButton: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  addButtonText: {
    color: Colors.white,
    fontWeight: '600' as const,
    fontSize: 14,
    marginLeft: 4,
  },
  priceInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.gray,
    paddingHorizontal: 16,
  },
  priceIcon: {
    marginRight: 8,
  },
  priceInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 14,
    color: Colors.text,
  },
  locationInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.gray,
    paddingHorizontal: 16,
  },
  locationIcon: {
    marginRight: 8,
  },
  locationInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 14,
    color: Colors.text,
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