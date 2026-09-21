import TrackPlayer, {
  Capability,
  AppKilledPlaybackBehavior,
} from 'react-native-track-player';

export async function setupPlayer() {
  let isSetup = false; // Флаг: готов ли плеер. По умолчанию считаем, что нет.
  try {
    // Пытаемся получить текущую активную аудиокнигу
    // Если плеер уже был инициализирован ранее — этот вызов сработает без ошибок
    await TrackPlayer.getActiveTrack();
    isSetup = true; // Если ошибки не было — плеер уже настроен.
  } catch {
    // Сюда попадаем, если getActiveTrack() выбросил ошибку —
    // значит, плеер ещё НЕ инициализирован. Настраиваем его.

    // Первичная инициализация нативного плеера.
    // Обязательно вызывается один раз за жизнь приложения — повторный вызов кинет ошибку.
    await TrackPlayer.setupPlayer();

    // Настраиваем, какие элементы управления будут доступны пользователю
    // (в шторке уведомлений, на экране блокировки, в наушниках и т.п.)
    await TrackPlayer.updateOptions({
      capabilities: [
        Capability.Play, //кнопка играть
        Capability.Pause, //кнопка Пауза
        Capability.SkipToNext, //переключить на следующую аудиокнигу
        Capability.SkipToPrevious, //переключить на предыдущую аудиокнигу
        Capability.SeekTo, //перемотка по таймлайну
      ],
      // Настройки, специфичные для Android

      android: {
        // Что делать с воспроизведением, когда пользователь «убивает» приложение
        // (свайпом из списка недавних):
        // 'StopPlaybackAndRemoveNotification' — остановить воспроизведение
        // и убрать уведомление плеера из шторки.
        appKilledPlaybackBehavior:
          AppKilledPlaybackBehavior.StopPlaybackAndRemoveNotification,
      },
    });
    isSetup = true; // Плеер успешно настроен.
  }
  // Возвращаем результат: true — плеер готов, false — что-то пошло не так.

  return isSetup;
}
