import TrackPlayer from 'react-native-track-player';
import type { Book } from '../data/scanBooks';

export async function playBook(book: Book, startIndex = 0, position = 0) {
  await TrackPlayer.reset();
  await TrackPlayer.add(
    book.chapters.map((c, i) => ({
      id: `${book.path}/${i}`,
      url: c.url,
      title: c.title,
      artist: book.title,
    })),
  );
  await TrackPlayer.skip(startIndex);
  await TrackPlayer.seekTo(position);
  await TrackPlayer.play();
}
