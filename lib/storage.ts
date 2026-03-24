import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { getDb } from './firebase';

export interface Post {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  createdAt: string;
  authorId: string;
}

export interface Photo {
  id: string;
  url: string;
  title: string;
  description?: string;
  createdAt: string;
}

// --- Firestore CRUD ---

export const fetchAllPosts = async (): Promise<Post[]> => {
  try {
    const db = getDb();
    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
        title: data.title,
        content: data.content,
        imageUrl: data.imageUrl || undefined,
        createdAt: data.createdAt instanceof Timestamp
          ? data.createdAt.toDate().toISOString()
          : data.createdAt,
        authorId: data.authorId,
      };
    });
  } catch (error) {
    console.error('Failed to fetch posts:', error);
    return [];
  }
};

export const fetchAllPhotos = async (): Promise<Photo[]> => {
  try {
    const db = getDb();
    const q = query(collection(db, 'photos'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
        url: data.url,
        title: data.title,
        description: data.description || undefined,
        createdAt: data.createdAt instanceof Timestamp
          ? data.createdAt.toDate().toISOString()
          : data.createdAt,
      };
    });
  } catch (error) {
    console.error('Failed to fetch photos:', error);
    return [];
  }
};

export const savePost = async (
  post: Omit<Post, 'id' | 'createdAt'>
): Promise<Post> => {
  const db = getDb();
  const docRef = await addDoc(collection(db, 'posts'), {
    ...post,
    createdAt: Timestamp.now(),
  });
  return {
    ...post,
    id: docRef.id,
    createdAt: new Date().toISOString(),
  };
};

export const deletePost = async (id: string): Promise<void> => {
  const db = getDb();
  await deleteDoc(doc(db, 'posts', id));
};

export const savePhoto = async (
  photo: Omit<Photo, 'id' | 'createdAt'>
): Promise<Photo> => {
  const db = getDb();
  const docRef = await addDoc(collection(db, 'photos'), {
    ...photo,
    createdAt: Timestamp.now(),
  });
  return {
    ...photo,
    id: docRef.id,
    createdAt: new Date().toISOString(),
  };
};

export const savePhotos = async (
  newPhotos: Omit<Photo, 'id' | 'createdAt'>[]
): Promise<Photo[]> => {
  const results: Photo[] = [];
  for (const photo of newPhotos) {
    const saved = await savePhoto(photo);
    results.push(saved);
  }
  return results;
};

export const deletePhoto = async (id: string): Promise<void> => {
  const db = getDb();
  await deleteDoc(doc(db, 'photos', id));
};
