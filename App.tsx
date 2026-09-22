// App.tsx
import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { setupPlayer } from './src/player/setupPlayer';
import LibraryScreen from './src/screens/LibraryScreen';
import PlayerScreen from './src/screens/PlayerScreen';

export default function App() {
  const [ready, setReady] = useState(false);
  const [screen, setScreen] = useState<'library' | 'player'>('library');

  useEffect(() => {
    (async () => {
      const ok = await setupPlayer();
      setReady(ok);
    })();
  }, []);

  if (!ready) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return screen === 'library' ? (
    <LibraryScreen onOpenPlayer={() => setScreen('player')} />
  ) : (
    <PlayerScreen onBack={() => setScreen('library')} />
  );
}

const styles = StyleSheet.create({
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
