// сканирование папки

import RNFS from 'react-native-fs';

export type Chapter = { title: string; url: string };
export type Book = { title: string; path: string; chapters: Chapter[] };

export async function scanBooks(rootPath: string): Promise<Book[]> {
  const dirs = await RNFS.readDir(rootPath);
  const books: Book[] = [];

  for (const dir of dirs.filter(d => d.isDirectory())) {
    const files = await RNFS.readDir(dir.path);
    const audio = files
      .filter(f => /\.(mp3|m4a|m4b|ogg|flac|)$/i.test(f.name))
      .sort((a, b) =>
        a.name.localeCompare(b.name, undefined, { numeric: true }),
      )
      .map(f => ({
        title: f.name.replace(/\.[^.]+$/, ''),
        url: 'file://' + f.path,
      }));

    if (audio.length) {
      books.push({ title: dir.name, path: dir.path, chapters: audio });
    }
  }

  return books;
}
