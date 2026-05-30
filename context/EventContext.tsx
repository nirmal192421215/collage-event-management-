import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Event, Registration } from '../data/types';
import { API_URL } from '../constants/Api';

import { useAuth } from './AuthContext';

interface EventContextType {
  events: Event[];
  getEvent: (id: string) => Event | undefined;
  registerForEvent: (eventId: string, userId: string, userData: Partial<Registration>) => Promise<{ success: boolean; error?: string }>;
  cancelRegistration: (eventId: string, userId: string) => Promise<void>;
  isUserRegistered: (eventId: string, userId: string) => boolean;
  createEvent: (event: Omit<Event, 'id' | 'registrations' | 'attendees' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateEvent: (id: string, updates: Partial<Event>) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
  markAttendance: (eventId: string, userId: string) => Promise<void>;
  getFeaturedEvents: () => Event[];
  getUpcomingEvents: () => Event[];
  getEventsByCategory: (category: string) => Event[];
  searchEvents: (query: string) => Event[];
  fetchEventById: (id: string) => Promise<Event | undefined>;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export function EventProvider({ children }: { children: ReactNode }) {
  const [events, setEventsState] = useState<Event[]>([]);
  const { user, updateUser: updateAuthUser } = useAuth();

  const fetchEvents = async () => {
    try {
      const res = await fetch(`${API_URL}/events`);
      if (res.ok) {
        const data = await res.json();
        setEventsState(data);
      }
    } catch (e) {
      console.error('Failed to fetch events from backend', e);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEventById = async (id: string) => {
    try {
      const res = await fetch(`${API_URL}/events/${id}`);
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.error('Failed to fetch event', e);
    }
    return undefined;
  };

  const getEvent = (id: string) => events.find(e => e.id === id);

  const registerForEvent = async (eventId: string, userId: string, userData: Partial<Registration>) => {
    try {
      const res = await fetch(`${API_URL}/events/${eventId}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, ...userData }),
      });
      const data = await res.json();
      if (!res.ok) return { success: false, error: data.error || 'Failed to register.' };
      
      // Update local event state
      setEventsState(prev => prev.map(e => e.id === eventId ? data.event : e));
      
      // Update user state to reflect the new registration
      if (user) {
        updateAuthUser({ eventsRegistered: [...user.eventsRegistered, eventId] });
      }
      
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Network error.' };
    }
  };

  const cancelRegistration = async (eventId: string, userId: string) => {
    try {
      const res = await fetch(`${API_URL}/events/${eventId}/register/${userId}`, { method: 'DELETE' });
      if (res.ok) {
        // Update local event state
        setEventsState(prev => prev.map(e =>
          e.id === eventId
            ? {
                ...e,
                registrations: e.registrations.filter(r => r.userId !== userId),
                registeredCount: Math.max(0, e.registeredCount - 1),
              }
            : e
        ));
        
        // Update user state
        if (user) {
          updateAuthUser({ eventsRegistered: user.eventsRegistered.filter(id => id !== eventId) });
        }
      }
    } catch (error) {
      console.error('Cancel failed', error);
    }
  };

  const isUserRegistered = (eventId: string, userId: string) => {
    const event = events.find(e => e.id === eventId);
    return !!event?.registrations.find(r => r.userId === userId);
  };

  const createEvent = async (eventData: Omit<Event, 'id' | 'registrations' | 'attendees' | 'createdAt' | 'updatedAt'>) => {
    try {
      const res = await fetch(`${API_URL}/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData),
      });
      if (res.ok) {
        const newEvent = await res.json();
        setEventsState(prev => [newEvent, ...prev]);
      }
    } catch (error) {
      console.error('Create event failed', error);
    }
  };

  const updateEvent = async (id: string, updates: Partial<Event>) => {
    try {
      const res = await fetch(`${API_URL}/events/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        const updated = await res.json();
        setEventsState(prev => prev.map(e => e.id === id ? updated : e));
      }
    } catch (error) {
      console.error('Update event failed', error);
    }
  };

  const deleteEvent = async (id: string) => {
    try {
      const res = await fetch(`${API_URL}/events/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setEventsState(prev => prev.filter(e => e.id !== id));
      }
    } catch (error) {
      console.error('Delete event failed', error);
    }
  };

  const markAttendance = async (eventId: string, userId: string) => {
    try {
      const res = await fetch(`${API_URL}/events/${eventId}/attendance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      if (res.ok) {
        const data = await res.json();
        const updatedEvent = data.event;
        // Normalize _id -> id and ensure attendees are strings
        if (updatedEvent) {
          if (!updatedEvent.id) updatedEvent.id = updatedEvent._id?.toString();
          if (updatedEvent.attendees) {
            updatedEvent.attendees = updatedEvent.attendees.map((a: any) => a?.toString());
          }
          if (updatedEvent.registrations) {
            updatedEvent.registrations = updatedEvent.registrations.map((r: any) => ({
              ...r,
              id: r.id || r._id?.toString(),
            }));
          }
        }
        setEventsState(prev => prev.map(e => e.id === eventId ? updatedEvent : e));
      }
    } catch (error) {
      console.error('Mark attendance failed', error);
    }
  };

  const getFeaturedEvents = () => events.filter(e => e.featured && e.status !== 'completed');
  const getUpcomingEvents = () => events.filter(e => e.status === 'upcoming').sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const getEventsByCategory = (category: string) => events.filter(e => e.category === category);
  const searchEvents = (query: string) => {
    const q = query.toLowerCase();
    return events.filter(e =>
      e.title.toLowerCase().includes(q) ||
      e.description.toLowerCase().includes(q) ||
      e.category.toLowerCase().includes(q) ||
      e.tags.some(t => t.toLowerCase().includes(q))
    );
  };

  return (
    <EventContext.Provider value={{ events, getEvent, registerForEvent, cancelRegistration, isUserRegistered, createEvent, updateEvent, deleteEvent, markAttendance, getFeaturedEvents, getUpcomingEvents, getEventsByCategory, searchEvents, fetchEventById }}>
      {children}
    </EventContext.Provider>
  );
}

export function useEvents() {
  const ctx = useContext(EventContext);
  if (!ctx) throw new Error('useEvents must be used within EventProvider');
  return ctx;
}
