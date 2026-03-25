'use client';

import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Camera, Maximize2, X, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { fetchAllPhotos, deletePhoto, Photo } from '@/lib/storage';
import { getFirebaseAuth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { AnimatePresence } from 'motion/react';

const mockPhotos: Photo[] = [
  { id: '1', url: 'https://picsum.photos/seed/photo1/800/800', title: 'Urban Geometry', description: 'Concrete and glass reflections.', createdAt: new Date().toISOString() },
  { id: '2', url: 'https://picsum.photos/seed/photo2/800/600', title: 'Neon Nights', description: 'Cyberpunk vibes in the city.', createdAt: new Date(Date.now() - 86400000).toISOString() },
  { id: '3', url: 'https://picsum.photos/seed/photo3/600/800', title: 'Minimalist Workspace', description: 'Clean desk setup.', createdAt: new Date(Date.now() - 86400000 * 2).toISOString() },
  { id: '4', url: 'https://picsum.photos/seed/photo4/1200/600', title: 'Abstract Architecture', description: 'Brutalist structures.', createdAt: new Date(Date.now() - 86400000 * 3).toISOString() },
  { id: '5', url: 'https://picsum.photos/seed/photo5/600/1200', title: 'Street Photography', description: 'Candid moments.', createdAt: new Date(Date.now() - 86400000 * 4).toISOString() },
  { id: '6', url: 'https://picsum.photos/seed/photo6/800/800', title: 'Product Shot', description: 'Teenage Engineering OP-1.', createdAt: new Date(Date.now() - 86400000 * 5).toISOString() },
  { id: '7', url: 'https://picsum.photos/seed/photo7/1000/600', title: 'Nature Textures', description: 'Macro leaf details.', createdAt: new Date(Date.now() - 86400000 * 6).toISOString() },
];

// Bento classes removed in favor of CSS columns for masonry

export default function Photography() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [isUserAdmin, setIsUserAdmin] = useState(false);

  useEffect(() => {
    const init = async () => {
      const storedPhotos = await fetchAllPhotos();
      setPhotos(storedPhotos.length > 0 ? storedPhotos : mockPhotos);
    };
    init();
    const unsubscribe = onAuthStateChanged(getFirebaseAuth(), (user) => {
      setIsUserAdmin(!!user);
    });
    return () => unsubscribe();
  }, []);

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this photo?')) {
      await deletePhoto(id);
      const updatedPhotos = await fetchAllPhotos();
      setPhotos(updatedPhotos.length > 0 ? updatedPhotos : mockPhotos);
    }
  };

  const navigatePhoto = (direction: 'prev' | 'next') => {
    if (!selectedPhoto) return;
    const currentIndex = photos.findIndex(p => p.id === selectedPhoto.id);
    if (currentIndex === -1) return;
    const newIndex = direction === 'next'
      ? (currentIndex + 1) % photos.length
      : (currentIndex - 1 + photos.length) % photos.length;
    setSelectedPhoto(photos[newIndex]);
  };

  useEffect(() => {
    if (!selectedPhoto) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedPhoto(null);
      if (e.key === 'ArrowRight') navigatePhoto('next');
      if (e.key === 'ArrowLeft') navigatePhoto('prev');
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedPhoto, photos]);

  return (
    <div className="space-y-12">
      <div className="te-border-b pb-6 text-center md:text-left">
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase flex items-center justify-center md:justify-start gap-4">
          <Camera size={48} className="text-accent" />
          Photography
        </h1>
        <p className="te-label mt-4 text-lg">Captured moments and visual experiments.</p>
      </div>

      {photos.length === 0 ? (
        <div className="py-24 text-center te-label border border-dashed border-line rounded-2xl">
          No photos uploaded yet. Use the Admin dashboard to add some.
        </div>
      ) : (
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
          {photos.map((photo, i) => (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`break-inside-avoid relative group cursor-pointer rounded-2xl overflow-hidden te-border bg-ink/5`}
              onClick={() => setSelectedPhoto(photo)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={photo.url} 
                alt={photo.title} 
                className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 pointer-events-none">
                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="text-bg font-bold text-xl mb-1">{photo.title}</h3>
                  {photo.description && (
                    <p className="text-bg/80 text-sm line-clamp-2 mb-4">{photo.description}</p>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-bg/60 text-xs font-mono uppercase tracking-widest">
                      {new Date(photo.createdAt).toLocaleDateString()}
                    </span>
                    <Maximize2 size={16} className="text-bg" />
                  </div>
                </div>
              </div>

              {isUserAdmin && (
                <button
                  onClick={(e) => handleDelete(e, photo.id)}
                  className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 z-10"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {/* Fullscreen Lightbox */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] bg-ink/95 backdrop-blur-xl flex flex-col"
          >
            <div className="flex justify-between items-center p-4 md:p-6">
              <p className="te-label text-bg/60">
                {photos.findIndex(p => p.id === selectedPhoto.id) + 1} / {photos.length}
              </p>
              <button 
                onClick={() => setSelectedPhoto(null)}
                className="p-3 bg-bg/10 hover:bg-bg/20 text-bg rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="flex-1 flex items-center justify-center p-4 md:p-6 min-h-0 relative">
              <button
                onClick={() => navigatePhoto('prev')}
                className="absolute left-2 md:left-6 p-3 bg-bg/10 hover:bg-bg/20 text-bg rounded-full transition-colors z-10"
                aria-label="Previous photo"
              >
                <ChevronLeft size={24} />
              </button>

              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={selectedPhoto.url} 
                alt={selectedPhoto.title} 
                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              />

              <button
                onClick={() => navigatePhoto('next')}
                className="absolute right-2 md:right-6 p-3 bg-bg/10 hover:bg-bg/20 text-bg rounded-full transition-colors z-10"
                aria-label="Next photo"
              >
                <ChevronRight size={24} />
              </button>
            </div>
            
            <div className="p-6 md:p-8 bg-gradient-to-t from-ink to-transparent">
              <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-2xl md:text-3xl font-bold text-bg mb-2">{selectedPhoto.title}</h2>
                {selectedPhoto.description && (
                  <p className="text-bg/70 text-lg">{selectedPhoto.description}</p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
