import React, { useState } from 'react';
import { StyleSheet, View, Text, FlatList, Pressable, RefreshControl, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { CircleCard } from '@/components/CircleCard';
import { TagList } from '@/components/TagList';
import { EventCard } from '@/components/EventCard';
import { BakeRequestCard } from '@/components/BakeRequestCard';
import { PastryCard } from '@/components/PastryCard';
import { mockCircles } from '@/mocks/circles';
import { mockEvents } from '@/mocks/events';
import { mockRequests } from '@/mocks/requests';
import { mockPosts } from '@/mocks/posts';
import { mockUsers } from '@/mocks/users';
import { Colors } from '@/constants/colors';
import { Plus, Calendar, MessageSquare, Search, MapPin, Filter } from 'lucide-react-native';

// Extract all unique tags from circles
const allTags = Array.from(
  new Set(mockCircles.flatMap(circle => circle.tags))
).sort();

// Extract all unique types
const circleTypes = Array.from(
  new Set(mockCircles.map(circle => circle.type))
);

export default function CirclesScreen() {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'discover' | 'circles' | 'events' | 'requests'>('discover');
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const router = useRouter();

  const handleSelectTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag) 
        : [...prev, tag]
    );
  };

  const handleSelectType = (type: string) => {
    setSelectedType(prev => prev === type ? null : type);
  };

  let filteredCircles = mockCircles;
  
  if (selectedTags.length > 0) {
    filteredCircles = filteredCircles.filter(circle => 
      selectedTags.some(tag => circle.tags.includes(tag))
    );
  }
  
  if (selectedType) {
    filteredCircles = filteredCircles.filter(circle => 
      circle.type === selectedType
    );
  }

  const upcomingEvents = mockEvents.filter(event => 
    new Date(event.date) > new Date()
  ).slice(0, 5);

  const openRequests = mockRequests.filter(request => 
    request.status === 'open' && new Date(request.deadline) > new Date()
  );

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  const handleCreateCircle = () => {
    router.push('/create-circle');
  };

  const handleRSVP = (eventId: string) => {
    console.log('RSVP to event:', eventId);
  };

  const handleRespondToRequest = (requestId: string) => {
    console.log('Respond to request:', requestId);
  };

  // Filter posts based on search and location
  const filteredPosts = mockPosts.filter(post => {
    const matchesSearch = !searchQuery || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesLocation = !locationFilter || 
      post.location.toLowerCase().includes(locationFilter.toLowerCase());
    
    return matchesSearch && matchesLocation;
  });

  const renderTabContent = () => {
    switch (activeTab) {
      case 'discover':
        return (
          <FlatList
            data={filteredPosts}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <PastryCard 
                post={item} 
                onReport={(postId) => router.push(`/report?postId=${postId}`)}
              />
            )}
            contentContainerStyle={styles.listContent}
            ListHeaderComponent={
              <>
                <View style={styles.searchContainer}>
                  <View style={styles.searchInputContainer}>
                    <Search size={20} color={Colors.textLight} />
                    <TextInput
                      style={styles.searchInput}
                      placeholder="Search pastries, circles, bakers..."
                      value={searchQuery}
                      onChangeText={setSearchQuery}
                      placeholderTextColor={Colors.textLight}
                    />
                  </View>
                  <Pressable style={styles.filterButton}>
                    <Filter size={20} color={Colors.primary} />
                  </Pressable>
                </View>
                
                <View style={styles.locationContainer}>
                  <MapPin size={16} color={Colors.textLight} />
                  <TextInput
                    style={styles.locationInput}
                    placeholder="Filter by location..."
                    value={locationFilter}
                    onChangeText={setLocationFilter}
                    placeholderTextColor={Colors.textLight}
                  />
                </View>
              </>
            }
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No pastries found</Text>
                <Text style={styles.emptySubtext}>Try adjusting your search or location filters</Text>
              </View>
            }
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={Colors.primary}
                colors={[Colors.primary]}
              />
            }
          />
        );
      
      case 'events':
        return (
          <FlatList
            data={upcomingEvents}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <EventCard 
                event={item} 
                onRSVP={handleRSVP}
                hasRSVPed={item.rsvps.includes('1')} // Mock current user ID
              />
            )}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No upcoming events</Text>
              </View>
            }
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={Colors.primary}
                colors={[Colors.primary]}
              />
            }
          />
        );
      
      case 'requests':
        return (
          <FlatList
            data={openRequests}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <BakeRequestCard 
                request={item} 
                onRespond={handleRespondToRequest}
              />
            )}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No open requests</Text>
              </View>
            }
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={Colors.primary}
                colors={[Colors.primary]}
              />
            }
          />
        );
      
      default:
        return (
          <FlatList
            data={filteredCircles}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <CircleCard circle={item} />}
            contentContainerStyle={styles.listContent}
            ListHeaderComponent={
              <>
                <View style={styles.filterContainer}>
                  <Text style={styles.filterLabel}>Filter by type:</Text>
                  <View style={styles.typeFilters}>
                    {circleTypes.map(type => (
                      <Pressable
                        key={type}
                        style={[
                          styles.typeFilter,
                          selectedType === type && styles.selectedTypeFilter
                        ]}
                        onPress={() => handleSelectType(type)}
                      >
                        <Text 
                          style={[
                            styles.typeFilterText,
                            selectedType === type && styles.selectedTypeFilterText
                          ]}
                        >
                          {type}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                </View>
                
                <TagList 
                  tags={allTags} 
                  selectedTags={selectedTags}
                  onSelectTag={handleSelectTag}
                />
              </>
            }
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No circles found with selected filters</Text>
              </View>
            }
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={Colors.primary}
                colors={[Colors.primary]}
              />
            }
          />
        );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.heading}>Community</Text>
        <Pressable style={styles.createButton} onPress={handleCreateCircle}>
          <Plus size={20} color={Colors.white} />
          <Text style={styles.createButtonText}>New Circle</Text>
        </Pressable>
      </View>
      
      <View style={styles.tabContainer}>
        <Pressable
          style={[
            styles.tab,
            activeTab === 'discover' && styles.activeTab
          ]}
          onPress={() => setActiveTab('discover')}
        >
          <Search size={16} color={activeTab === 'discover' ? Colors.primary : Colors.textLight} />
          <Text 
            style={[
              styles.tabText,
              activeTab === 'discover' && styles.activeTabText
            ]}
          >
            Discover
          </Text>
        </Pressable>
        <Pressable
          style={[
            styles.tab,
            activeTab === 'circles' && styles.activeTab
          ]}
          onPress={() => setActiveTab('circles')}
        >
          <Text 
            style={[
              styles.tabText,
              activeTab === 'circles' && styles.activeTabText
            ]}
          >
            Circles
          </Text>
        </Pressable>
        <Pressable
          style={[
            styles.tab,
            activeTab === 'events' && styles.activeTab
          ]}
          onPress={() => setActiveTab('events')}
        >
          <Calendar size={16} color={activeTab === 'events' ? Colors.primary : Colors.textLight} />
          <Text 
            style={[
              styles.tabText,
              activeTab === 'events' && styles.activeTabText
            ]}
          >
            Events
          </Text>
        </Pressable>
        <Pressable
          style={[
            styles.tab,
            activeTab === 'requests' && styles.activeTab
          ]}
          onPress={() => setActiveTab('requests')}
        >
          <MessageSquare size={16} color={activeTab === 'requests' ? Colors.primary : Colors.textLight} />
          <Text 
            style={[
              styles.tabText,
              activeTab === 'requests' && styles.activeTabText
            ]}
          >
            Requests
          </Text>
        </Pressable>
      </View>
      
      {renderTabContent()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray,
  },
  heading: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  createButtonText: {
    color: Colors.white,
    fontWeight: '600' as const,
    marginLeft: 4,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    marginRight: 24,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: Colors.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.textLight,
    marginLeft: 4,
  },
  activeTabText: {
    color: Colors.primary,
  },
  listContent: {
    padding: 16,
  },
  filterContainer: {
    marginBottom: 16,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 8,
  },
  typeFilters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  typeFilter: {
    backgroundColor: Colors.lightGray,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  selectedTypeFilter: {
    backgroundColor: Colors.primary,
  },
  typeFilterText: {
    fontSize: 12,
    color: Colors.textLight,
    fontWeight: '500' as const,
  },
  selectedTypeFilterText: {
    color: Colors.white,
  },
  emptyContainer: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: Colors.textLight,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: Colors.textLight,
    textAlign: 'center',
    marginTop: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.text,
    marginLeft: 8,
  },
  filterButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  locationInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.text,
    marginLeft: 8,
  },
});