// App.tsx
import React, { useEffect, useState } from 'react';
import { SafeAreaView, StatusBar, StyleSheet, Text, View } from 'react-native';
import LibraryScreen from './src/screens/LibraryScreen';
import { setupPlayer } from './src/player/setupPlayer';

export default function App() {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const ok = await setupPlayer();
        if (!ok) {
          setError('Не удалось инициализировать плеер');
          return;
        }
        setReady(true);
      } catch (e: any) {
        console.warn('setupPlayer error:', e);
        setError(e?.message ?? 'Ошибка инициализации плеера');
      }
    })();
  }, []);

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <Text style={styles.error}>{error}</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!ready) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <Text>Подготовка плеера…</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <LibraryScreen />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  error: { color: '#c00', textAlign: 'center' },
});
