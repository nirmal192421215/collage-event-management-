import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from '../context/AuthContext';
import { EventProvider } from '../context/EventContext';
import { NotificationProvider } from '../context/NotificationContext';
import '../global.css';

export default function RootLayout() {
  return (
    <AuthProvider>
      <EventProvider>
        <NotificationProvider>
          <StatusBar style="light" />
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="(auth)" options={{ animation: 'fade' }} />
            <Stack.Screen name="student" options={{ animation: 'fade' }} />
            <Stack.Screen name="admin" options={{ animation: 'fade' }} />
            <Stack.Screen name="event/[id]" options={{ animation: 'slide_from_right', headerShown: false }} />
          </Stack>
        </NotificationProvider>
      </EventProvider>
    </AuthProvider>
  );
}
