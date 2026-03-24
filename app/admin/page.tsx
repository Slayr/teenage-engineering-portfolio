'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Lock, LogOut, Plus, Send, ArrowRight, Camera, Eye, Edit2, Trash2, ImagePlus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import { extractDataImages } from '@/lib/markdown';
import { savePost, savePhotos } from '@/lib/storage';
import { getFirebaseAuth } from '@/lib/firebase';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, User } from 'firebase/auth';

export default function Admin() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Login state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Tab state
  const [activeTab, setActiveTab] = useState<'blog' | 'photo'>('blog');

  // Post state
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishMessage, setPublishMessage] = useState('');
  const [isPreview, setIsPreview] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const inlineImageRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Inline images for blog content
  const [inlineImages, setInlineImages] = useState<{id: number, name: string, url: string}[]>([]);
  let inlineImageCounter = useRef(0);

  // Photo state
  const [pendingPhotos, setPendingPhotos] = useState<{id: string, url: string, title: string, description: string}[]>([]);
  const photoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getFirebaseAuth(), (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    try {
      await signInWithEmailAndPassword(getFirebaseAuth(), email, password);
    } catch (error: any) {
      console.error('Login error', error);
      setLoginError(error.message || 'Failed to login.');
    }
  };

  const handleLogout = async () => {
    await signOut(getFirebaseAuth());
  };

  const compressImage = (
    file: File,
    maxSize: number,
    quality: number,
  ): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let w = img.width, h = img.height;
          if (w > h) {
            if (w > maxSize) { h *= maxSize / w; w = maxSize; }
          } else {
            if (h > maxSize) { w *= maxSize / h; h = maxSize; }
          }
          canvas.width = w;
          canvas.height = h;
          canvas.getContext('2d')?.drawImage(img, 0, 0, w, h);
          // Try WebP first (much smaller), fall back to JPEG
          let dataUrl = canvas.toDataURL('image/webp', quality);
          if (!dataUrl.startsWith('data:image/webp')) {
            dataUrl = canvas.toDataURL('image/jpeg', quality);
          }
          resolve(dataUrl);
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, isPhotoTab: boolean = false) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    if (isPhotoTab) {
      files.forEach(async (file) => {
        const dataUrl = await compressImage(file, 1600, 0.82);
        setPendingPhotos(prev => [...prev, {
          id: Math.random().toString(36).substring(7),
          url: dataUrl,
          title: file.name.replace(/\.[^/.]+$/, ""),
          description: ''
        }]);
      });
    } else {
      const file = files[0];
      compressImage(file, 800, 0.80).then(dataUrl => setImageUrl(dataUrl));
    }
    
    if (e.target) e.target.value = '';
  };

  const handleInlineImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const name = file.name.replace(/\.[^/.]+$/, '');
    compressImage(file, 1200, 0.80).then(dataUrl => {
      const id = ++inlineImageCounter.current;
      setInlineImages(prev => [...prev, { id, name, url: dataUrl }]);
      const tag = `\n![${name}](inline:${id})\n`;
      const ta = textareaRef.current;
      if (ta) {
        const start = ta.selectionStart;
        const before = content.slice(0, start);
        const after = content.slice(ta.selectionEnd);
        setContent(before + tag + after);
      } else {
        setContent(content + tag);
      }
    });
    if (e.target) e.target.value = '';
  };

  const resolveInlineImages = (text: string) => {
    return text.replace(/\(inline:(\d+)\)/g, (match, idStr) => {
      const img = inlineImages.find(i => i.id === parseInt(idStr));
      return img ? `(${img.url})` : match;
    });
  };

  const renderPreviewContent = (text: string) => {
    // First resolve inline: references to data URLs
    let resolved = text.replace(/\(inline:(\d+)\)/g, (match, idStr) => {
      const img = inlineImages.find(i => i.id === parseInt(idStr));
      return img ? `(${img.url})` : match;
    });
    // Then extract data URLs so ReactMarkdown doesn't choke
    const { processed, images } = extractDataImages(resolved);
    const imgRenderer = ({ src, alt }: any) => {
      const resolvedSrc = (src && images[src]) || src;
      if (!resolvedSrc) return null;
      // eslint-disable-next-line @next/next/no-img-element
      return <img src={resolvedSrc} alt={alt || ''} className="rounded-xl max-w-full" />;
    };
    return <ReactMarkdown components={{ img: imgRenderer }}>{processed}</ReactMarkdown>;
  };

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setIsPublishing(true);
    setPublishMessage('');
    
    try {
      if (activeTab === 'blog') {
        if (!title || !content) throw new Error('Title and content required');
        const finalContent = resolveInlineImages(content);
        await savePost({
          title,
          content: finalContent,
          imageUrl: imageUrl || undefined,
          authorId: user.uid,
        });
        setPublishMessage('Post published successfully!');
        setTitle('');
        setContent('');
        setImageUrl('');
        setInlineImages([]);
        setTimeout(() => router.push('/blog'), 1500);
      } else {
        if (pendingPhotos.length === 0) throw new Error('No photos to upload');
        if (pendingPhotos.some(p => !p.title)) throw new Error('All photos must have a title');
        
        await savePhotos(pendingPhotos.map(p => ({
          title: p.title,
          description: p.description,
          url: p.url,
        })));
        
        setPublishMessage(`Successfully uploaded ${pendingPhotos.length} photo(s)!`);
        setPendingPhotos([]);
        setTimeout(() => router.push('/photography'), 1500);
      }
    } catch (error: any) {
      console.error('Publish error', error);
      setPublishMessage('Error publishing: ' + (error.message || 'Unknown error'));
    } finally {
      setIsPublishing(false);
    }
  };

  if (loading) {
    return (
      <div className="py-12 text-center te-label border border-dashed border-line rounded-2xl">
        Checking system authorization...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-md mx-auto space-y-8 pt-12">
        <div className="te-border-b pb-6 text-center">
          <h1 className="text-4xl te-heading flex items-center justify-center gap-4">
            <Lock size={36} className="text-accent" />
            System Auth
          </h1>
          <p className="te-label mt-4">Restricted access area.</p>
        </div>

        <motion.form 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleLogin} 
          className="te-card p-8 space-y-6"
        >
          {loginError && (
            <div className="p-3 bg-red-500/20 border border-red-500 text-red-500 text-sm font-mono rounded-lg">
              {loginError}
            </div>
          )}
          
          <div className="space-y-2">
            <label className="te-label block">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-bg/50 te-border p-3 font-mono text-sm focus:outline-none focus:border-accent transition-colors rounded-xl"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label className="te-label block">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-bg/50 te-border p-3 font-mono text-sm focus:outline-none focus:border-accent transition-colors rounded-xl"
              required
            />
          </div>

          <button type="submit" className="te-button te-button-accent w-full flex items-center justify-center gap-2">
            Authenticate <ArrowRight size={16} />
          </button>
        </motion.form>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <div className="te-border-b pb-6 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl te-heading flex items-center gap-4">
            <Plus size={36} className="text-accent" />
            Admin Dashboard
          </h1>
          <p className="te-label mt-4">Authorized as {user.email}</p>
        </div>
        <button onClick={handleLogout} className="te-button flex items-center gap-2 w-fit">
          <LogOut size={16} />
          Terminate Session
        </button>
      </div>

      <div className="flex gap-4 te-border-b pb-4">
        <button 
          onClick={() => { setActiveTab('blog'); setPublishMessage(''); }}
          className={`te-button ${activeTab === 'blog' ? 'te-button-accent' : ''}`}
        >
          New Blog Post
        </button>
        <button 
          onClick={() => { setActiveTab('photo'); setPublishMessage(''); }}
          className={`te-button ${activeTab === 'photo' ? 'te-button-accent' : ''}`}
        >
          Upload Photo
        </button>
      </div>

      <motion.form 
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handlePublish} 
        className="space-y-8 te-card p-8"
      >
        {publishMessage && (
          <div className={`p-4 te-border font-mono text-sm rounded-xl ${publishMessage.includes('Error') ? 'bg-red-500/20 border-red-500 text-red-500' : 'bg-accent/20 border-accent text-accent'}`}>
            {publishMessage}
          </div>
        )}

        {activeTab === 'blog' ? (
          <>
            <div className="space-y-2">
              <label className="te-label block">Title</label>
              <input 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-bg/50 te-border p-4 font-bold text-xl focus:outline-none focus:border-accent transition-colors rounded-xl"
                placeholder="Enter transmission title..."
                required
              />
            </div>

            <div className="space-y-2">
              <label className="te-label block">Cover Image</label>
              <div className="flex gap-4">
                <input 
                  type="url" 
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="flex-1 bg-bg/50 te-border p-3 font-mono text-sm focus:outline-none focus:border-accent transition-colors rounded-xl"
                  placeholder="https://... or upload an image"
                />
                <input 
                  type="file"
                  accept="image/*"
                  capture="environment"
                  ref={fileInputRef}
                  onChange={(e) => handleImageUpload(e, false)}
                  className="hidden"
                />
                <button 
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="te-button flex items-center gap-2 whitespace-nowrap"
                >
                  <Camera size={16} />
                  Upload
                </button>
              </div>
              {imageUrl && imageUrl.startsWith('data:image') && (
                <div className="mt-2 text-xs font-mono text-accent">
                  Image loaded and compressed successfully.
                </div>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="te-label block flex items-center gap-4">
                  <span>Content (Markdown)</span>
                  <div className="flex bg-ink/5 rounded-full p-1 te-border">
                    <button
                      type="button"
                      onClick={() => setIsPreview(false)}
                      className={`px-3 py-1 rounded-full text-xs font-mono flex items-center gap-1 transition-colors ${!isPreview ? 'bg-ink text-bg' : 'text-ink/60 hover:text-ink'}`}
                    >
                      <Edit2 size={12} /> Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsPreview(true)}
                      className={`px-3 py-1 rounded-full text-xs font-mono flex items-center gap-1 transition-colors ${isPreview ? 'bg-ink text-bg' : 'text-ink/60 hover:text-ink'}`}
                    >
                      <Eye size={12} /> Preview
                    </button>
                  </div>
                </label>
                <a href="https://www.markdownguide.org/cheat-sheet/" target="_blank" rel="noopener noreferrer" className="te-label hover:text-accent">Markdown Guide</a>
              </div>

              {!isPreview && (
                <div className="flex gap-2">
                  <input
                    type="file"
                    accept="image/*"
                    ref={inlineImageRef}
                    onChange={handleInlineImage}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => inlineImageRef.current?.click()}
                    className="te-button flex items-center gap-2 text-xs"
                  >
                    <ImagePlus size={14} />
                    Insert Image
                  </button>
                </div>
              )}
              
              {/* Inline image thumbnails */}
              {!isPreview && inlineImages.length > 0 && (
                <div className="flex flex-wrap gap-3 p-3 te-border rounded-xl bg-ink/5">
                  {inlineImages.map(img => (
                    <div key={img.id} className="relative group">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={img.url} alt={img.name} className="w-20 h-20 object-cover rounded-lg te-border" />
                      <button
                        type="button"
                        onClick={() => setInlineImages(prev => prev.filter(i => i.id !== img.id))}
                        className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ×
                      </button>
                      <p className="text-[10px] font-mono text-ink/50 truncate w-20 mt-1">inline:{img.id}</p>
                    </div>
                  ))}
                </div>
              )}

              {isPreview ? (
                <div className="w-full min-h-[350px] bg-bg/50 te-border p-4 font-sans prose prose-neutral max-w-none prose-headings:font-sans prose-headings:font-bold prose-a:text-accent rounded-xl">
                  {content ? renderPreviewContent(content) : <span className="text-ink/40 italic">Nothing to preview...</span>}
                </div>
              ) : (
                <textarea 
                  ref={textareaRef}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={15}
                  className="w-full bg-bg/50 te-border p-4 font-mono text-sm focus:outline-none focus:border-accent transition-colors resize-y rounded-xl"
                  placeholder="Write your transmission here..."
                  required
                />
              )}
            </div>
          </>
        ) : (
          <>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="te-label block">Upload Photos</label>
                <div className="flex gap-4">
                  <input 
                    type="file"
                    accept="image/*"
                    multiple
                    ref={photoInputRef}
                    onChange={(e) => handleImageUpload(e, true)}
                    className="hidden"
                  />
                  <button 
                    type="button"
                    onClick={() => photoInputRef.current?.click()}
                    className="te-button flex items-center gap-2 whitespace-nowrap"
                  >
                    <Camera size={16} />
                    Select Photos
                  </button>
                </div>
              </div>

              {pendingPhotos.length === 0 ? (
                <div className="py-12 text-center te-label border border-dashed border-line rounded-xl">
                  No photos selected. Click &quot;Select Photos&quot; to add some.
                </div>
              ) : (
                <div className="space-y-4 mt-6">
                  {pendingPhotos.map((photo, index) => (
                    <div key={photo.id} className="flex flex-col sm:flex-row gap-4 p-4 te-border rounded-xl bg-ink/5">
                      <div className="w-full sm:w-32 h-32 shrink-0 rounded-lg overflow-hidden bg-ink/10 relative">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={photo.url} alt="preview" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 space-y-3">
                        <input 
                          type="text" 
                          value={photo.title}
                          onChange={(e) => {
                            const newPhotos = [...pendingPhotos];
                            newPhotos[index].title = e.target.value;
                            setPendingPhotos(newPhotos);
                          }}
                          className="w-full bg-bg/50 te-border p-2 font-bold focus:outline-none focus:border-accent transition-colors rounded-lg"
                          placeholder="Photo Title"
                          required
                        />
                        <textarea 
                          value={photo.description}
                          onChange={(e) => {
                            const newPhotos = [...pendingPhotos];
                            newPhotos[index].description = e.target.value;
                            setPendingPhotos(newPhotos);
                          }}
                          rows={2}
                          className="w-full bg-bg/50 te-border p-2 font-mono text-sm focus:outline-none focus:border-accent transition-colors resize-y rounded-lg"
                          placeholder="Description (Optional)"
                        />
                      </div>
                      <button 
                        type="button"
                        onClick={() => setPendingPhotos(prev => prev.filter(p => p.id !== photo.id))}
                        className="p-2 h-fit text-red-500 hover:bg-red-500/10 rounded-lg transition-colors self-end sm:self-start"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        <div className="pt-6 te-border-t flex justify-end">
          <button 
            type="submit" 
            disabled={isPublishing}
            className="te-button te-button-accent flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={16} />
            {isPublishing ? 'Publishing...' : (activeTab === 'blog' ? 'Publish Transmission' : 'Upload Photo')}
          </button>
        </div>
      </motion.form>
    </div>
  );
}
