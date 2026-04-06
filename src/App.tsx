import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { MapPin, LogIn, LogOut, Trash2, CheckCircle, XCircle, Volume2, VolumeX } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { KhokhlomaFloral, KhokhlomaSide, HeartOrnament, BottomBorder, SlavicWeaving } from './components/Ornaments';
import { db, auth, googleProvider } from './firebase';
import { collection, addDoc, serverTimestamp, query, orderBy, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { signInWithPopup, signOut, onAuthStateChanged, User } from 'firebase/auth';

function FadeIn({ children, delay = 0, yOffset = 40 }: { children: React.ReactNode; delay?: number; yOffset?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: yOffset }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 1, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
    >
      {children}
    </motion.div>
  );
}

export default function App() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const [isAdminView, setIsAdminView] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [guests, setGuests] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const toggleAudio = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation(); // Предотвращаем всплытие клика, чтобы не конфликтовать с глобальным слушателем
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        // Устанавливаем источник только при попытке воспроизведения, чтобы избежать ошибки 404 при загрузке
        if (!audioRef.current.getAttribute('src')) {
          audioRef.current.setAttribute('src', '/music.mp3');
        }
        audioRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch((error) => {
          console.error("Audio playback failed:", error);
          setIsPlaying(false);
          alert("Пожалуйста, загрузите файл music.mp3 в папку public, чтобы музыка заработала.");
        });
      }
    }
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.5; // Устанавливаем громкость 50%
      
      const playOnFirstInteraction = async () => {
        if (audioRef.current && !isPlaying) {
          try {
            if (!audioRef.current.getAttribute('src')) {
              audioRef.current.setAttribute('src', '/music.mp3');
            }
            await audioRef.current.play();
            setIsPlaying(true);
          } catch (e) {
            console.error("Автовоспроизведение не удалось:", e);
          }
        }
        // Удаляем слушатели после первой попытки
        document.removeEventListener('click', playOnFirstInteraction);
        document.removeEventListener('touchstart', playOnFirstInteraction);
      };

      // Ждем первого взаимодействия пользователя со страницей
      document.addEventListener('click', playOnFirstInteraction);
      document.addEventListener('touchstart', playOnFirstInteraction);

      return () => {
        document.removeEventListener('click', playOnFirstInteraction);
        document.removeEventListener('touchstart', playOnFirstInteraction);
      };
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser?.email === 'redsunsavi@bk.ru') {
        // Admin user logged in
      } else {
        setIsAdminView(false);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (isAdminView && user?.email === 'redsunsavi@bk.ru') {
      const q = query(collection(db, 'guests'), orderBy('createdAt', 'desc'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const guestData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setGuests(guestData);
      }, (error) => {
        console.error("Error fetching guests:", error);
      });
      return () => unsubscribe();
    }
  }, [isAdminView, user]);

  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm();
  const attendanceValue = watch("attendance");

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'guests'), {
        name: data.name,
        attendance: data.attendance,
        partnerName: data.attendance === 'with_partner' ? data.partnerName : null,
        drinks: data.attendance !== 'no' ? (data.drinks || []) : [],
        createdAt: serverTimestamp()
      });
      alert('Спасибо! Ваша анкета отправлена.');
      reset();
    } catch (error) {
      console.error("Error submitting RSVP:", error);
      alert('Произошла ошибка при отправке. Попробуйте еще раз.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setIsAdminView(false);
  };

  const handleDeleteGuest = async (id: string) => {
    if (window.confirm('Вы уверены, что хотите удалить этот ответ?')) {
      try {
        await deleteDoc(doc(db, 'guests', id));
      } catch (error) {
        console.error("Delete failed:", error);
      }
    }
  };

  if (isAdminView && user?.email === 'redsunsavi@bk.ru') {
    return (
      <div className="min-h-screen bg-gray-50 p-6 font-sans">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-folk-red">Список гостей</h1>
            <div className="flex gap-4">
              <button 
                onClick={() => setIsAdminView(false)}
                className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm hover:bg-gray-100 transition-colors"
              >
                На сайт
              </button>
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-folk-red text-white rounded-md text-sm hover:bg-red-700 transition-colors"
              >
                <LogOut size={16} /> Выйти
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-xs uppercase tracking-widest font-medium text-gray-500">Имя</th>
                  <th className="px-6 py-4 text-xs uppercase tracking-widest font-medium text-gray-500">Пара</th>
                  <th className="px-6 py-4 text-xs uppercase tracking-widest font-medium text-gray-500">Присутствие</th>
                  <th className="px-6 py-4 text-xs uppercase tracking-widest font-medium text-gray-500">Напитки</th>
                  <th className="px-6 py-4 text-xs uppercase tracking-widest font-medium text-gray-500">Дата</th>
                  <th className="px-6 py-4 text-xs uppercase tracking-widest font-medium text-gray-500">Действие</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {guests.map((guest) => (
                  <tr key={guest.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">{guest.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{guest.partnerName || '-'}</td>
                    <td className="px-6 py-4">
                      {guest.attendance === 'alone' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <CheckCircle size={12} /> Один(а)
                        </span>
                      ) : guest.attendance === 'with_partner' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          <CheckCircle size={12} /> С парой
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          <XCircle size={12} /> Не сможет
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {guest.drinks ? (Array.isArray(guest.drinks) ? guest.drinks.join(', ') : guest.drinks) : '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {guest.createdAt?.toDate().toLocaleString('ru-RU')}
                    </td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => handleDeleteGuest(guest.id)}
                        className="text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
                {guests.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-gray-500 italic">
                      Ответов пока нет
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          <div className="mt-8 grid grid-cols-2 gap-4">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <p className="text-xs uppercase tracking-widest text-gray-500 mb-1">Всего ответов</p>
              <p className="text-3xl font-bold text-folk-red">{guests.length}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <p className="text-xs uppercase tracking-widest text-gray-500 mb-1">Придут</p>
              <p className="text-3xl font-bold text-green-600">{guests.filter(g => g.attendance === 'alone' || g.attendance === 'with_partner').length}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-folk-dark selection:bg-folk-red selection:text-white font-sans relative">
      
      {/* Vertical Weaving Ornament (Side) */}
      <div className="fixed right-0 top-0 bottom-0 w-12 md:w-24 z-50 pointer-events-none hidden lg:block">
        <img src="/ornament-vertical.png" className="w-full h-full object-contain opacity-90" alt="" />
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-start overflow-hidden px-4">
        {/* Hero Image with Fade */}
        <div className="w-full h-[60vh] md:h-[70vh] relative overflow-hidden">
          <motion.img 
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1.05 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            style={{ y }}
            src="https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1974&auto=format&fit=crop" 
            alt="Young Couple" 
            className="w-full h-full object-cover origin-top"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white"></div>
        </div>

        <div className="text-center z-10 -mt-20 md:-mt-32 relative">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 1.0, ease: "easeOut" }}
          >
            <h1 className="text-6xl md:text-8xl mb-4 tracking-tighter leading-[0.85] text-folk-red">
              Максим <br /> & Елизавета
            </h1>
            <div className="w-24 h-px bg-folk-red mx-auto mb-6" />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 1.8, ease: "easeOut" }}
          >
            <p className="slavic-text text-2xl md:text-3xl tracking-[0.2em] text-folk-red">
              29/05/2026
            </p>
          </motion.div>
        </div>
      </section>

      <FadeIn yOffset={20}>
        <img src="/ornament-horizontal.png" className="w-full h-auto block opacity-90" alt="" />
      </FadeIn>

      {/* Welcome Section (Red Background) */}
      <section className="bg-folk-red text-white py-24 px-6 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <HeartOrnament className="w-32 h-32 text-white" />
        </div>
        
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <FadeIn>
            <h2 className="text-3xl md:text-4xl mb-8">Самые дорогие и близкие нам люди!</h2>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="text-lg md:text-xl leading-relaxed mb-12 uppercase tracking-wide">
              Приглашаем вас на наше свадебное торжество. <br />
              Мы будем счастливы видеть вас
            </p>
          </FadeIn>
            
          <FadeIn delay={0.4}>
            <div className="mt-16">
              <p className="slavic-text text-xl mb-2 flex flex-col items-center gap-1">
                <span>В Банкетном зале:</span>
                <span>"Malina Rose"</span>
              </p>
              <p className="text-sm opacity-80 uppercase tracking-widest">с.Карагали, Кизанская улица, 8</p>
              <a 
                href="https://yandex.ru/maps/-/CDT6Z8-J" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-6 px-6 py-3 border border-white/30 hover:bg-white hover:text-folk-red transition-all duration-300 uppercase text-xs tracking-widest"
              >
                <MapPin size={16} />
                Открыть карту
              </a>
            </div>
          </FadeIn>
        </div>
      </section>

      <FadeIn yOffset={20}>
        <img src="/ornament-horizontal.png" className="w-full h-auto block opacity-90" alt="" />
      </FadeIn>

      {/* Program Section */}
      <section className="py-24 px-6 relative">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 hidden md:block">
          <KhokhlomaSide className="w-32 h-64 opacity-80" />
        </div>
        <div className="absolute right-0 top-1/2 -translate-y-1/2 rotate-180 hidden md:block">
          <KhokhlomaSide className="w-32 h-64 opacity-80" />
        </div>

        <div className="max-w-2xl mx-auto text-center">
          <FadeIn>
            <h2 className="text-4xl md:text-5xl mb-16 text-folk-red">Программа</h2>
          </FadeIn>
            
          <div className="space-y-16">
            {[
              { time: "15:30", title: "Велком" },
              { time: "16:00", title: "Регистрация" },
              { time: "17:00", title: "Банкет" },
              { time: "23:00", title: "Финал" }
            ].map((item, index) => (
              <div key={index}>
                <FadeIn delay={index * 0.15}>
                  <div className="group">
                    <p className="slavic-text text-4xl text-folk-red mb-2">{item.time}</p>
                    <p className="slavic-text text-xl tracking-widest">{item.title}</p>
                  </div>
                </FadeIn>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FadeIn yOffset={20}>
        <img src="/ornament-horizontal.png" className="w-full h-auto block opacity-90" alt="" />
      </FadeIn>

      {/* Dress Code Section */}
      <section className="py-24 px-6 bg-folk-red text-white text-center relative">
        <div className="max-w-5xl mx-auto">
          <FadeIn>
            <h2 className="text-4xl md:text-5xl mb-8">Дресс-код</h2>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="slavic-text text-xl mb-6 tracking-widest">Стилистика свадьбы <br /> A LA RUSSE</p>
            <p className="text-sm uppercase tracking-widest leading-relaxed mb-12 opacity-90">
              Мы будем рады и благодарны, если вы поддержите общую стилистику и цветовую гамму мероприятия
            </p>
          </FadeIn>

          <FadeIn delay={0.4}>
            {/* Image Collage (Moved here) */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-16">
              <img src="https://picsum.photos/seed/slavic1/600/800" alt="Ref 1" className="w-full h-auto object-cover grayscale hover:grayscale-0 transition-all duration-500 rounded-sm" referrerPolicy="no-referrer" />
              <img src="https://picsum.photos/seed/slavic2/600/800" alt="Ref 2" className="w-full h-auto object-cover grayscale hover:grayscale-0 transition-all duration-500 rounded-sm" referrerPolicy="no-referrer" />
              <img src="https://picsum.photos/seed/slavic3/600/800" alt="Ref 3" className="w-full h-auto object-cover grayscale hover:grayscale-0 transition-all duration-500 rounded-sm" referrerPolicy="no-referrer" />
              <img src="https://picsum.photos/seed/slavic4/600/800" alt="Ref 4" className="w-full h-auto object-cover grayscale hover:grayscale-0 transition-all duration-500 rounded-sm" referrerPolicy="no-referrer" />
              <div className="flex items-center justify-center p-8 border-2 border-white/20 text-center bg-white/5 rounded-sm">
                <p className="slavic-text text-xl text-white leading-tight">Не забывай свои корни</p>
              </div>
              <img src="https://picsum.photos/seed/slavic5/600/800" alt="Ref 5" className="w-full h-auto object-cover grayscale hover:grayscale-0 transition-all duration-500 rounded-sm" referrerPolicy="no-referrer" />
            </div>
          </FadeIn>
            
          <FadeIn delay={0.6}>
            {/* Color Palette (Single row, compact) */}
            <div className="flex justify-center items-center gap-3 md:gap-4 mb-16 overflow-x-auto pb-4 no-scrollbar">
              {['#FFFFFF', '#F5E6D3', '#D2B48C', '#B8860B', '#8B0000'].map((color, i) => (
                <div 
                  key={i}
                  className="w-12 h-12 md:w-14 md:h-14 rounded-full border-[3px] border-white shadow-xl shrink-0"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </FadeIn>

          <FadeIn delay={0.8}>
            <div className="space-y-6 text-sm uppercase tracking-widest leading-relaxed max-w-xl mx-auto">
              <p className="text-white/80">Для удобства мы подобрали референсы, которые помогут вам при составлении образа.</p>
              <p className="text-white font-medium">Девушкам рекомендуем вплести в волосы ленты и надеть кокошник! Мужчины могут надеть модные рубашки-косоворотки.</p>
            </div>
          </FadeIn>
        </div>
      </section>

      <FadeIn yOffset={20}>
        <img src="/ornament-horizontal.png" className="w-full h-auto block opacity-90" alt="" />
      </FadeIn>

      {/* RSVP Section */}
      <section className="py-24 px-6 bg-white relative overflow-hidden">
        <div className="max-w-xl mx-auto text-center relative z-10">
          <FadeIn>
            <h2 className="text-4xl md:text-5xl mb-8 text-folk-red">Анкета гостя</h2>
            <p className="text-sm uppercase tracking-widest mb-12">Пожалуйста подтвердите своё присутствие до 20 августа</p>
          </FadeIn>
            
          <FadeIn delay={0.2}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 text-left">
              <div>
                <label className="block text-xs uppercase tracking-widest mb-2 opacity-60">Ваше Имя и Фамилия</label>
                <input 
                  {...register("name", { required: true })}
                  className="w-full bg-transparent border-b border-folk-dark/20 py-3 focus:border-folk-red outline-none transition-colors"
                  placeholder="Иван Иванов"
                />
              </div>
              
              <div className="flex flex-col gap-4 py-4">
                <label className="text-xs uppercase tracking-widest opacity-60">Придете ли вы?</label>
                <div className="flex flex-col gap-3">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input type="radio" {...register("attendance", { required: true })} value="alone" className="accent-folk-red" />
                    <span className="text-sm uppercase tracking-widest group-hover:text-folk-red transition-colors">Приду один(а)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input type="radio" {...register("attendance", { required: true })} value="with_partner" className="accent-folk-red" />
                    <span className="text-sm uppercase tracking-widest group-hover:text-folk-red transition-colors">Буду с половинкой</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input type="radio" {...register("attendance", { required: true })} value="no" className="accent-folk-red" />
                    <span className="text-sm uppercase tracking-widest group-hover:text-folk-red transition-colors">Не смогу</span>
                  </label>
                </div>
              </div>

              {attendanceValue === 'with_partner' && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                  <label className="block text-xs uppercase tracking-widest mb-2 opacity-60">Имя вашей половинки</label>
                  <input 
                    {...register("partnerName", { required: true })}
                    className="w-full bg-transparent border-b border-folk-dark/20 py-3 focus:border-folk-red outline-none transition-colors"
                    placeholder="Анна Иванова"
                  />
                </div>
              )}

              {attendanceValue !== 'no' && attendanceValue && (
                <div className="flex flex-col gap-4 py-4 animate-in fade-in duration-300">
                  <label className="text-xs uppercase tracking-widest opacity-60">Предпочтения по напиткам</label>
                  <div className="flex flex-col gap-3">
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <input type="checkbox" {...register("drinks")} value="сок_вода" className="accent-folk-red" />
                      <span className="text-sm uppercase tracking-widest group-hover:text-folk-red transition-colors">Сок и вода</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <input type="checkbox" {...register("drinks")} value="алкоголь" className="accent-folk-red" />
                      <span className="text-sm uppercase tracking-widest group-hover:text-folk-red transition-colors">Алкоголь</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <input type="checkbox" {...register("drinks")} value="безалкогольное" className="accent-folk-red" />
                      <span className="text-sm uppercase tracking-widest group-hover:text-folk-red transition-colors">Безалкогольное</span>
                    </label>
                  </div>
                </div>
              )}

              <button 
                type="submit"
                disabled={isSubmitting}
                className={`w-full bg-folk-red text-white py-5 slavic-text text-xl hover:bg-folk-dark transition-all duration-300 shadow-lg ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isSubmitting ? 'Отправка...' : 'Я приду'}
              </button>
            </form>
          </FadeIn>
            
          <FadeIn delay={0.4}>
            <p className="mt-12 text-[10px] uppercase tracking-[0.3em] opacity-40">
              Обратите внимание, что анкета заполняется на каждого гостя отдельно
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Footer / Bottom Border */}
      <FadeIn yOffset={20}>
        <img src="/footer-ornament.png" className="w-full h-auto block" alt="" />
      </FadeIn>
      <footer className="py-12 text-center bg-white relative">
        <p className="slavic-text text-2xl text-folk-red mb-2">Максим & Елизавета</p>
        <p className="text-[10px] uppercase tracking-[0.5em] opacity-30">2026 • Сделано с любовью</p>
        
        {/* Admin Login Button */}
        <div className="mt-8">
          {!user ? (
            <button 
              onClick={handleLogin}
              className="text-[10px] uppercase tracking-widest opacity-20 hover:opacity-100 transition-opacity flex items-center gap-1 mx-auto"
            >
              <LogIn size={10} /> Вход для администратора
            </button>
          ) : user.email === 'redsunsavi@bk.ru' ? (
            <button 
              onClick={() => setIsAdminView(true)}
              className="text-[10px] uppercase tracking-widest text-folk-red font-bold hover:underline transition-all"
            >
              Перейти в админку
            </button>
          ) : (
            <button 
              onClick={handleLogout}
              className="text-[10px] uppercase tracking-widest opacity-20 hover:opacity-100 transition-opacity"
            >
              Выйти ({user.email})
            </button>
          )}
        </div>
      </footer>

      {/* Floating Audio Button */}
      <button 
        onClick={toggleAudio}
        className="fixed bottom-6 right-6 z-50 bg-folk-red text-white p-4 rounded-full shadow-xl hover:bg-folk-dark transition-all duration-300 flex items-center justify-center hover:scale-110"
        aria-label="Toggle music"
      >
        {isPlaying ? <Volume2 size={24} /> : <VolumeX size={24} />}
      </button>
      <audio ref={audioRef} loop />
    </div>
  );
}
