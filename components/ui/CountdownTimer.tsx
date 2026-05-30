import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../constants/Colors';

interface CountdownTimerProps {
  targetDate: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function CountdownTimer({ targetDate }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isPast, setIsPast] = useState(false);

  useEffect(() => {
    const calc = () => {
      const diff = new Date(targetDate).getTime() - Date.now();
      if (diff <= 0) { setIsPast(true); return; }
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / 1000 / 60) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  if (isPast) {
    return (
      <View style={styles.pastContainer}>
        <Text style={styles.pastText}>Event has started!</Text>
      </View>
    );
  }

  const units = [
    { value: timeLeft.days, label: 'Days' },
    { value: timeLeft.hours, label: 'Hrs' },
    { value: timeLeft.minutes, label: 'Min' },
    { value: timeLeft.seconds, label: 'Sec' },
  ];

  return (
    <View style={styles.container}>
      {units.map((u, i) => (
        <React.Fragment key={u.label}>
          <View style={styles.unit}>
            <Text style={styles.value}>{String(u.value).padStart(2, '0')}</Text>
            <Text style={styles.label}>{u.label}</Text>
          </View>
          {i < 3 && <Text style={styles.colon}>:</Text>}
        </React.Fragment>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  unit: {
    alignItems: 'center',
    backgroundColor: Colors.primaryUltraLight,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    minWidth: 54,
  },
  value: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.primaryDark,
  },
  label: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.primary,
    marginTop: 2,
  },
  colon: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.primary,
    marginBottom: 12,
  },
  pastContainer: {
    backgroundColor: Colors.successLight,
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  pastText: {
    color: Colors.success,
    fontWeight: '700',
    fontSize: 15,
  },
});
