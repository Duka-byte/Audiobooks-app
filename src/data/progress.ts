// сохранение позиции
// data/progress.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import TrackPlayer, { Event } from 'react-native-track-player';

const KEY = (bookPath: string) => `progress:${bookPath}`;

export function registerProgressSaver(bookPath: string) {
  const save = async () => {
    const [idx, pos] = await Promise.all([
      TrackPlayer.getActiveTrackIndex(),
      TrackPlayer.getPosition(),
    ]);
    await AsyncStorage.setItem(KEY(bookPath), JSON.stringify({ idx, pos }));
  };

  // сохраняем каждые 10 сек и при паузе
  const interval = setInterval(save, 10000);
  const sub = TrackPlayer.addEventListener(Event.RemotePause, save);

  return () => {
    clearInterval(interval);
    sub.remove();
  };
}
