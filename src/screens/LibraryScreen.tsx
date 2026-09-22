// src/screens/LibraryScreen.tsx
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { scanBooks, Book } from '../data/scanBooks';
import { playBook } from '../player/playBook';

const BOOKS_ROOT = '/sdcard/Audiobooks';

type Props = {
  onOpenPlayer: () => void;
};

export default function LibraryScreen({ onOpenPlayer }: Props) {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await scanBooks(BOOKS_ROOT);
      setBooks(result);
    } catch (e: any) {
      console.warn('scanBooks error:', e);
      setError(e?.message ?? 'Не удалось прочитать папку с книгами');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const onPressBook = useCallback(
    async (book: Book) => {
      try {
        await playBook(book, 0, 0);
        onOpenPlayer();
      } catch (e) {
        console.warn('playBook error:', e);
      }
    },
    [onOpenPlayer],
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={styles.hint}>Сканирую папку с книгами…</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error}</Text>
        <Pressable style={styles.button} onPress={load}>
          <Text style={styles.buttonText}>Повторить</Text>
        </Pressable>
      </View>
    );
  }

  if (!books.length) {
    return (
      <View style={styles.center}>
        <Text style={styles.hint}>
          Книг не найдено.{'\n'}Проверьте папку: {BOOKS_ROOT}
        </Text>
        <Pressable style={styles.button} onPress={load}>
          <Text style={styles.buttonText}>Обновить</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={books}
        keyExtractor={b => b.path}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <Pressable
            style={({ pressed }) => [
              styles.item,
              pressed && styles.itemPressed,
            ]}
            onPress={() => onPressBook(item)}
          >
            <Text style={styles.title} numberOfLines={1}>
              {item.title}
            </Text>
            <Text style={styles.subtitle}>{item.chapters.length} гл.</Text>
          </Pressable>
        )}
      />
    </View>
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
  list: { paddingVertical: 8 },
  item: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e0e0e0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemPressed: { backgroundColor: '#f2f2f2' },
  title: { fontSize: 16, fontWeight: '600', flex: 1, marginRight: 12 },
  subtitle: { fontSize: 13, color: '#888' },
  hint: { marginTop: 12, color: '#666', textAlign: 'center' },
  error: { color: '#c00', textAlign: 'center', marginBottom: 16 },
  button: {
    marginTop: 16,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#2f6fed',
    borderRadius: 8,
  },
  buttonText: { color: '#fff', fontWeight: '600' },
});
