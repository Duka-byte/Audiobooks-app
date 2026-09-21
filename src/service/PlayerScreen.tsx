// src/screens/PlayerScreen.tsx
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import TrackPlayer, {
  useProgress,
  usePlaybackState,
  State,
} from 'react-native-track-player';

function formatTime(seconds: number): string {
  if (!seconds || isNaN(seconds)) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function PlayerScreen() {
  const { position, duration } = useProgress();
  const playbackState = usePlaybackState();
  const isPlaying = playbackState.state === State.Playing;

  return (
    <View style={styles.container}>
      <Text style={styles.time}>
        {formatTime(position)} / {formatTime(duration)}
      </Text>

      <View style={styles.row}>
        <Button
          title="-30s"
          onPress={() => TrackPlayer.seekTo(Math.max(0, position - 30))}
        />
        <Button
          title={isPlaying ? '⏸' : '▶'}
          onPress={() => (isPlaying ? TrackPlayer.pause() : TrackPlayer.play())}
        />
        <Button
          title="+30s"
          onPress={() => TrackPlayer.seekTo(position + 30)}
        />
      </View>

      <Button title="Скорость 1.5x" onPress={() => TrackPlayer.setRate(1.5)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  time: { fontSize: 24, marginBottom: 20 },
  row: { flexDirection: 'row', gap: 12, marginBottom: 12 },
});
