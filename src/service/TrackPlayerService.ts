// обработка конопок уведомления

// Импортируем сам плеер и перечисление Event (список событий,
// на которые можно подписаться — нажатия кнопок в уведомлении,
// на экране блокировки, на наушниках, в машине через Bluetooth и т.д.)
import TrackPlayer, { Event } from 'react-native-track-player';
export async function PlaybackService() {
  TrackPlayer.addEventListener(Event.RemotePlay, () => TrackPlayer.play());
  TrackPlayer.addEventListener(Event.RemotePause, () => TrackPlayer.pause());
  TrackPlayer.addEventListener(Event.RemoteNext, () =>
    TrackPlayer.skipToNext(),
  );
  TrackPlayer.addEventListener(
    Event.RemotePrevious,
    () => TrackPlayer.skipToPrevious,
  );
  TrackPlayer.addEventListener(Event.RemoteSeek, ({ position }) => {
    TrackPlayer.seekTo(position);
  });
}

// PlaybackService — это «уши» плеера, которые слышат кнопки на наушниках, уведомление и экране блокировки, и превращают их в команды для музыки. Работает в фоне, даже когда приложение свёрнуто.
