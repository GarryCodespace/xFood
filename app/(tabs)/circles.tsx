import React, { useState } from 'react';
import { StyleSheet, View, Text, FlatList, Pressable, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { CircleCard } from '@/components/CircleCard';
import { TagList } from '@/components/TagList';
import { EventCard } from '@/components/EventCard';
import { BakeRequestCard } from '@/components/BakeRequestCard';
import { mockCircles } from '@/mocks/circles';
import { mockEvents } from '@/mocks/events';
import { mockRequests } from '@/mocks/requests';
import { Colors } from '@/constants/colors';
import { Plus, Calendar, MessageSquare } from 'lucide-react-native';

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
  const [activeTab, setActiveTab] = useState<'circles' | 'events' | 'requests'>('circles');
  const [refreshing, setRefreshing] = useState(false);
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

  const renderTabContent = () => {
    switch (activeTab) {
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
        <Text style={styles.heading}>Pastry Community</Text>
        <Pressable style={styles.createButton} onPress={handleCreateCircle}>
          <Plus size={20} color={Colors.white} />
          <Text style={styles.createButtonText}>New Circle</Text>
        </Pressable>
      </View>
      
      <View style={styles.tabContainer}>
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
});