import React from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { Calendar, MapPin, Users, Video } from 'lucide-react-native';
import { CircleEvent } from '@/types';
import { Colors } from '@/constants/colors';

interface EventCardProps {
  event: CircleEvent;
  onPress?: () => void;
  onRSVP?: (eventId: string) => void;
  hasRSVPed?: boolean;
}

export const EventCard: React.FC<EventCardProps> = ({ 
  event, 
  onPress, 
  onRSVP,
  hasRSVPed = false
}) => {
  const eventDate = new Date(event.date);
  const isUpcoming = eventDate > new Date();
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  return (
    <Pressable style={styles.container} onPress={onPress}>
      <View style={styles.header}>
        <Text style={styles.title} numberOfLines={1}>{event.title}</Text>
        <View style={styles.dateContainer}>
          <Calendar size={14} color={Colors.primary} />
          <Text style={styles.date}>{formatDate(eventDate)}</Text>
        </View>
      </View>
      
      <Text style={styles.description} numberOfLines={2}>
        {event.description}
      </Text>
      
      <View style={styles.infoRow}>
        <View style={styles.locationContainer}>
          {event.isVirtual ? (
            <Video size={14} color={Colors.textLight} />
          ) : (
            <MapPin size={14} color={Colors.textLight} />
          )}
          <Text style={styles.location} numberOfLines={1}>
            {event.location}
          </Text>
        </View>
        
        <View style={styles.attendeesContainer}>
          <Users size={14} color={Colors.textLight} />
          <Text style={styles.attendees}>
            {event.rsvps.length}
            {event.maxAttendees && `/${event.maxAttendees}`}
          </Text>
        </View>
      </View>
      
      {isUpcoming && (
        <View style={styles.footer}>
          <Pressable 
            style={[
              styles.rsvpButton,
              hasRSVPed && styles.rsvpButtonActive
            ]}
            onPress={() => onRSVP?.(event.id)}
          >
            <Text style={[
              styles.rsvpButtonText,
              hasRSVPed && styles.rsvpButtonTextActive
            ]}>
              {hasRSVPed ? 'Going' : 'RSVP'}
            </Text>
          </Pressable>
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 4,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  date: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '600' as const,
    marginLeft: 4,
  },
  description: {
    fontSize: 14,
    color: Colors.textLight,
    lineHeight: 20,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 16,
  },
  location: {
    fontSize: 12,
    color: Colors.textLight,
    marginLeft: 4,
  },
  attendeesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  attendees: {
    fontSize: 12,
    color: Colors.textLight,
    marginLeft: 4,
  },
  footer: {
    alignItems: 'flex-end',
  },
  rsvpButton: {
    backgroundColor: Colors.lightGray,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  rsvpButtonActive: {
    backgroundColor: Colors.success,
  },
  rsvpButtonText: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: Colors.textLight,
  },
  rsvpButtonTextActive: {
    color: Colors.white,
  },
});