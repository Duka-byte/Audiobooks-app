// src/screens/PlayerScreen.tsx
import React from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import TrackPlayer, {
  useActiveTrack,
  useProgress,
  usePlaybackState,
  State,
} from 'react-native-track-player';

type Props = {
  onBack: () => void;
};

export default function PlayerScreen({ onBack }: Props) {
  const track = useActiveTrack();
  const { position, duration } = useProgress(500);
  const state = usePlaybackState();

  const isPlaying = state.state === State.Playing;
  const isLoading =
    state.state === State.Loading || state.state === State.Buffering;

  const togglePlay = () => {
    if (isPlaying) {
      TrackPlayer.pause();
    } else {
      TrackPlayer.play();
    }
  };

  const next = () => TrackPlayer.skipToNext().catch(() => {});
  const prev = () => TrackPlayer.skipToPrevious().catch(() => {});
  const seekBy = (s: number) =>
    TrackPlayer.seekTo(Math.max(0, position + s)).catch(() => {});

  return (
    <View style={styles.container}>
      <Pressable style={styles.back} onPress={onBack}>
        <Text style={styles.backText}>← Библиотека</Text>
      </Pressable>

      <View style={styles.info}>
        <Text style={styles.book} numberOfLines={2}>
          {track?.artist ?? '—'}
        </Text>
        <Text style={styles.chapter} numberOfLines={2}>
          {track?.title ?? '—'}
        </Text>
      </View>

      <View style={styles.progressBlock}>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              {
                width:
                  duration > 0
                    ? `${Math.min(100, (position / duration) * 100)}%`
                    : '0%',
              },
            ]}
          />
        </View>
        <View style={styles.times}>
          <Text style={styles.time}>{fmt(position)}</Text>
          <Text style={styles.time}>{fmt(duration)}</Text>
        </View>
      </View>

      {isLoading ? (
        <ActivityIndicator style={styles.loader} size="large" />
      ) : (
        <View style={styles.controls}>
          <Pressable style={styles.btn} onPress={() => seekBy(-15)}>
            <Text style={styles.btnText}>−15</Text>
          </Pressable>
          <Pressable style={styles.btn} onPress={prev}>
            <Text style={styles.btnText}>⏮</Text>
          </Pressable>
          <Pressable style={styles.btnBig} onPress={togglePlay}>
            <Text style={styles.btnBigText}>{isPlaying ? '⏸' : '▶'}</Text>
          </Pressable>
          <Pressable style={styles.btn} onPress={next}>
            <Text style={styles.btnText}>⏭</Text>
          </Pressable>
          <Pressable style={styles.btn} onPress={() => seekBy(15)}>
            <Text style={styles.btnText}>+15</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

function fmt(sec: number) {
  if (!isFinite(sec) || sec < 0) return '0:00';
  const s = Math.floor(sec % 60);
  const m = Math.floor(sec / 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#fff' },
  back: { paddingVertical: 8, alignSelf: 'flex-start' },
  backText: { color: '#2f6fed', fontSize: 15, fontWeight: '600' },

  info: { marginTop: 24, alignItems: 'center' },
  book: { fontSize: 14, color: '#888', textAlign: 'center' },
  chapter: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 6,
  },

  progressBlock: { marginTop: 40 },
  progressBar: {
    height: 4,
    backgroundColor: '#e0e0e0',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: { height: '100%', backgroundColor: '#2f6fed' },
  times: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  time: { fontSize: 12, color: '#888' },

  loader: { marginTop: 40 },

  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 40,
  },
  btn: { padding: 12 },
  btnText: { fontSize: 22 },
  btnBig: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#2f6fed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnBigText: { fontSize: 32, color: '#fff' },
});
