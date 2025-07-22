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
import { Camera, X, Plus, Clock, Users, DollarSign } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { AllergenTagList } from '@/components/AllergenTagList';
import { AllergenTag, SpecialTag, RecipeIngredient, RecipeStep, Recipe } from '@/types';
import { useAuth } from '@/hooks/auth-store';
import { useToast } from '@/hooks/toast-store';
import { apiService, RecipeData } from '@/utils/api';

const difficultyLevels = ['Easy', 'Medium', 'Hard'] as const;

export default function CreateRecipeScreen() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [ingredients, setIngredients] = useState<RecipeIngredient[]>([
    { id: '1', name: '', amount: '', unit: '', notes: '' }
  ]);
  const [steps, setSteps] = useState<RecipeStep[]>([
    { id: '1', stepNumber: 1, instruction: '', duration: 0 }
  ]);
  const [prepTime, setPrepTime] = useState('');
  const [cookTime, setCookTime] = useState('');
  const [servings, setServings] = useState('');
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Easy');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [allergenTags, setAllergenTags] = useState<AllergenTag[]>([]);
  const [specialTags, setSpecialTags] = useState<SpecialTag[]>([]);
  const [isPremium, setIsPremium] = useState(false);
  const [price, setPrice] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const router = useRouter();
  const { currentUser } = useAuth();
  const { showSuccess, showError } = useToast();

  const pickCoverImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 1,
    });

    if (!result.canceled) {
      setCoverImage(result.assets[0].uri);
    }
  };

  const handleAddIngredient = () => {
    const newId = (ingredients.length + 1).toString();
    setIngredients([...ingredients, { id: newId, name: '', amount: '', unit: '', notes: '' }]);
  };

  const handleUpdateIngredient = (id: string, field: keyof RecipeIngredient, value: string) => {
    setIngredients(prev => prev.map(ingredient => 
      ingredient.id === id ? { ...ingredient, [field]: value } : ingredient
    ));
  };

  const handleRemoveIngredient = (id: string) => {
    if (ingredients.length > 1) {
      setIngredients(prev => prev.filter(ingredient => ingredient.id !== id));
    }
  };

  const handleAddStep = () => {
    const newId = (steps.length + 1).toString();
    setSteps([...steps, { 
      id: newId, 
      stepNumber: steps.length + 1, 
      instruction: '', 
      duration: 0 
    }]);
  };

  const handleUpdateStep = (id: string, field: keyof RecipeStep, value: string | number) => {
    setSteps(prev => prev.map(step => 
      step.id === id ? { ...step, [field]: value } : step
    ));
  };

  const handleRemoveStep = (id: string) => {
    if (steps.length > 1) {
      const updatedSteps = steps.filter(step => step.id !== id);
      // Renumber steps
      const renumberedSteps = updatedSteps.map((step, index) => ({
        ...step,
        stepNumber: index + 1
      }));
      setSteps(renumberedSteps);
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

  const validateForm = () => {
    if (!title.trim()) return 'Please enter a recipe title';
    if (!description.trim()) return 'Please enter a description';
    if (!coverImage) return 'Please add a cover image';
    if (!prepTime || !cookTime || !servings) return 'Please fill in prep time, cook time, and servings';
    if (ingredients.some(ing => !ing.name.trim() || !ing.amount.trim())) return 'Please complete all ingredients';
    if (steps.some(step => !step.instruction.trim())) return 'Please complete all recipe steps';
    if (isPremium && (!price || parseFloat(price) <= 0)) return 'Please set a valid price for premium recipes';
    return null;
  };

  const handleSubmit = async () => {
    const error = validateForm();
    if (error) {
      showError(error);
      return;
    }

    if (!currentUser) {
      showError('You must be logged in to create a recipe');
      return;
    }

    setIsLoading(true);

    try {
      // Create the recipe data for API
      const recipeData: RecipeData = {
        title: title.trim(),
        description: description.trim(),
        ingredients: ingredients.filter(ing => ing.name.trim()),
        steps: steps.filter(step => step.instruction.trim()),
        coverImage: coverImage || '',
        prepTime: parseInt(prepTime) || 0,
        cookTime: parseInt(cookTime) || 0,
        servings: parseInt(servings) || 1,
        difficulty,
        tags,
        allergenTags,
        specialTags,
        isPremium,
        price: isPremium ? parseFloat(price) || 0 : undefined,
        userId: currentUser.id,
        timestamp: new Date().toISOString(),
      };

      // Call API to create recipe
      const result = await apiService.createRecipe(recipeData);
      
      if (result.success) {
        showSuccess('Recipe published successfully!');
        // Navigate to recipes tab
        router.replace('/(tabs)/recipes');
      } else {
        throw new Error('Failed to create recipe');
      }
      
    } catch (error) {
      console.error('Failed to create recipe:', error);
      showError('Failed to publish recipe. Please try again.');
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
          <Pressable style={styles.imagePickerContainer} onPress={pickCoverImage}>
            {coverImage ? (
              <Image source={{ uri: coverImage }} style={styles.previewImage} />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Camera size={32} color={Colors.textLight} />
                <Text style={styles.imagePlaceholderText}>Add cover image</Text>
              </View>
            )}
          </Pressable>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Recipe Title</Text>
            <TextInput
              style={styles.input}
              placeholder="What's your recipe called?"
              value={title}
              onChangeText={setTitle}
              maxLength={100}
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Tell us about your recipe..."
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
          
          <View style={styles.metaContainer}>
            <View style={styles.metaRow}>
              <View style={styles.metaInput}>
                <Text style={styles.label}>Prep Time (min)</Text>
                <View style={styles.timeInputContainer}>
                  <Clock size={16} color={Colors.textLight} />
                  <TextInput
                    style={styles.timeInput}
                    placeholder="15"
                    value={prepTime}
                    onChangeText={setPrepTime}
                    keyboardType="numeric"
                  />
                </View>
              </View>
              
              <View style={styles.metaInput}>
                <Text style={styles.label}>Cook Time (min)</Text>
                <View style={styles.timeInputContainer}>
                  <Clock size={16} color={Colors.textLight} />
                  <TextInput
                    style={styles.timeInput}
                    placeholder="30"
                    value={cookTime}
                    onChangeText={setCookTime}
                    keyboardType="numeric"
                  />
                </View>
              </View>
            </View>
            
            <View style={styles.metaRow}>
              <View style={styles.metaInput}>
                <Text style={styles.label}>Servings</Text>
                <View style={styles.timeInputContainer}>
                  <Users size={16} color={Colors.textLight} />
                  <TextInput
                    style={styles.timeInput}
                    placeholder="4"
                    value={servings}
                    onChangeText={setServings}
                    keyboardType="numeric"
                  />
                </View>
              </View>
              
              <View style={styles.metaInput}>
                <Text style={styles.label}>Difficulty</Text>
                <View style={styles.difficultyContainer}>
                  {difficultyLevels.map((level) => (
                    <Pressable
                      key={level}
                      style={[
                        styles.difficultyButton,
                        difficulty === level && styles.selectedDifficulty
                      ]}
                      onPress={() => setDifficulty(level)}
                    >
                      <Text style={[
                        styles.difficultyText,
                        difficulty === level && styles.selectedDifficultyText
                      ]}>
                        {level}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            </View>
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Ingredients</Text>
            {ingredients.map((ingredient, index) => (
              <View key={ingredient.id} style={styles.ingredientRow}>
                <View style={styles.ingredientInputs}>
                  <TextInput
                    style={[styles.input, styles.ingredientName]}
                    placeholder="Ingredient name"
                    value={ingredient.name}
                    onChangeText={(text) => handleUpdateIngredient(ingredient.id, 'name', text)}
                  />
                  <TextInput
                    style={[styles.input, styles.ingredientAmount]}
                    placeholder="Amount"
                    value={ingredient.amount}
                    onChangeText={(text) => handleUpdateIngredient(ingredient.id, 'amount', text)}
                  />
                  <TextInput
                    style={[styles.input, styles.ingredientUnit]}
                    placeholder="Unit"
                    value={ingredient.unit}
                    onChangeText={(text) => handleUpdateIngredient(ingredient.id, 'unit', text)}
                  />
                </View>
                <Pressable 
                  style={styles.removeButton}
                  onPress={() => handleRemoveIngredient(ingredient.id)}
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
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Instructions</Text>
            {steps.map((step, index) => (
              <View key={step.id} style={styles.stepRow}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>{step.stepNumber}</Text>
                </View>
                <View style={styles.stepContent}>
                  <TextInput
                    style={[styles.input, styles.stepInstruction]}
                    placeholder="Describe this step..."
                    value={step.instruction}
                    onChangeText={(text) => handleUpdateStep(step.id, 'instruction', text)}
                    multiline
                    textAlignVertical="top"
                  />
                  <View style={styles.stepMeta}>
                    <View style={styles.stepDurationContainer}>
                      <Clock size={14} color={Colors.textLight} />
                      <TextInput
                        style={styles.stepDurationInput}
                        placeholder="0"
                        value={step.duration?.toString() || ''}
                        onChangeText={(text) => handleUpdateStep(step.id, 'duration', parseInt(text) || 0)}
                        keyboardType="numeric"
                      />
                      <Text style={styles.stepDurationLabel}>min</Text>
                    </View>
                    <Pressable 
                      style={styles.removeStepButton}
                      onPress={() => handleRemoveStep(step.id)}
                      disabled={steps.length === 1}
                    >
                      <X size={14} color={steps.length === 1 ? Colors.gray : Colors.error} />
                    </Pressable>
                  </View>
                </View>
              </View>
            ))}
            <Pressable style={styles.addButton} onPress={handleAddStep}>
              <Plus size={16} color={Colors.white} />
              <Text style={styles.addButtonText}>Add Step</Text>
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
          
          <View style={styles.pricingContainer}>
            <View style={styles.pricingHeader}>
              <Text style={styles.label}>Recipe Pricing</Text>
              <Pressable 
                style={[styles.toggleButton, isPremium && styles.toggleButtonActive]}
                onPress={() => setIsPremium(!isPremium)}
              >
                <Text style={[
                  styles.toggleButtonText,
                  isPremium && styles.toggleButtonTextActive
                ]}>
                  {isPremium ? 'Premium' : 'Free'}
                </Text>
              </Pressable>
            </View>
            
            {isPremium && (
              <View style={styles.priceInputContainer}>
                <DollarSign size={16} color={Colors.textLight} />
                <TextInput
                  style={styles.priceInput}
                  placeholder="4.99"
                  value={price}
                  onChangeText={setPrice}
                  keyboardType="decimal-pad"
                />
                <Text style={styles.priceNote}>Users will pay this amount to access your recipe</Text>
              </View>
            )}
          </View>
          
          <Pressable 
            style={[
              styles.submitButton,
              isLoading && styles.submitButtonLoading
            ]}
            onPress={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={Colors.white} />
            ) : (
              <Text style={styles.submitButtonText}>Publish Recipe</Text>
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
  metaContainer: {
    marginBottom: 16,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  metaInput: {
    flex: 1,
    marginHorizontal: 4,
  },
  timeInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.gray,
    paddingHorizontal: 12,
  },
  timeInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 14,
    color: Colors.text,
    marginLeft: 8,
  },
  difficultyContainer: {
    flexDirection: 'row',
  },
  difficultyButton: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 8,
    paddingVertical: 8,
    marginHorizontal: 2,
    borderWidth: 1,
    borderColor: Colors.gray,
    alignItems: 'center',
  },
  selectedDifficulty: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  difficultyText: {
    fontSize: 12,
    color: Colors.text,
  },
  selectedDifficultyText: {
    color: Colors.white,
    fontWeight: '600' as const,
  },
  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  ingredientInputs: {
    flex: 1,
    flexDirection: 'row',
  },
  ingredientName: {
    flex: 2,
    marginRight: 8,
  },
  ingredientAmount: {
    flex: 1,
    marginRight: 8,
  },
  ingredientUnit: {
    flex: 1,
  },
  removeButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    marginTop: 6,
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
  stepRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 6,
  },
  stepNumberText: {
    color: Colors.white,
    fontWeight: '600' as const,
    fontSize: 14,
  },
  stepContent: {
    flex: 1,
  },
  stepInstruction: {
    minHeight: 80,
    marginBottom: 8,
  },
  stepMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stepDurationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.lightGray,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  stepDurationInput: {
    width: 40,
    textAlign: 'center',
    fontSize: 12,
    color: Colors.text,
    marginLeft: 4,
  },
  stepDurationLabel: {
    fontSize: 12,
    color: Colors.textLight,
    marginLeft: 4,
  },
  removeStepButton: {
    padding: 4,
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
  pricingContainer: {
    backgroundColor: Colors.white,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.gray,
  },
  pricingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  toggleButton: {
    backgroundColor: Colors.lightGray,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  toggleButtonActive: {
    backgroundColor: Colors.primary,
  },
  toggleButtonText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.textLight,
  },
  toggleButtonTextActive: {
    color: Colors.white,
  },
  priceInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.lightGray,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  priceInput: {
    flex: 1,
    fontSize: 14,
    color: Colors.text,
    marginLeft: 8,
  },
  priceNote: {
    fontSize: 12,
    color: Colors.textLight,
    marginTop: 8,
  },
  submitButton: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 16,
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