import React, { useState, useEffect } from 'react';
import { User, Category, VoteOption } from '../types';
import { 
  UserCheck, 
  UserPlus, 
  ArrowRight, 
  X, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles,
  Shield,
  HelpCircle
} from 'lucide-react';

interface PendingVote {
  category: Category;
  option: VoteOption;
}

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  registeredUsers: User[];
  onLogin: (user: User) => void;
  onRegister: (newUser: User) => void;
  pendingVote: PendingVote | null;
}

const AVATAR_PALETTES = [
  { name: 'Indigo Gece', class: 'from-indigo-500 to-purple-600' },
  { name: 'Altın Güneş', class: 'from-amber-500 to-orange-600' },
  { name: 'Zümrüt Yeşili', class: 'from-emerald-500 to-teal-600' },
  { name: 'Safir Mavisi', class: 'from-sky-500 to-blue-600' },
  { name: 'Gül Kurusu', class: 'from-rose-500 to-pink-600' },
  { name: 'Koyu Menekşe', class: 'from-purple-600 to-fuchsia-600' },
];

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  registeredUsers,
  onLogin,
  onRegister,
  pendingVote,
}) => {
  const [step, setStep] = useState<'check' | 'register'>('check');
  const [usernameInput, setUsernameInput] = useState('');
  const [fullNameInput, setFullNameInput] = useState('');
  const [selectedAvatarColor, setSelectedAvatarColor] = useState(AVATAR_PALETTES[0].class);
  const [errorMsg, setErrorMsg] = useState('');

  // Reset state on modal open
  useEffect(() => {
    if (isOpen) {
      setStep('check');
      setUsernameInput('');
      setFullNameInput('');
      setErrorMsg('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const normalizeUsername = (val: string) => {
    return val.trim().toLowerCase().replace(/^@/, '').replace(/\s+/g, '');
  };

  const handleCheckUsername = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUsername = normalizeUsername(usernameInput);

    if (!cleanUsername) {
      setErrorMsg('Lütfen geçerli bir kullanıcı adı girin.');
      return;
    }

    if (cleanUsername.length < 3) {
      setErrorMsg('Kullanıcı adı en az 3 karakter olmalıdır.');
      return;
    }

    const foundUser = registeredUsers.find(
      (u) => normalizeUsername(u.username) === cleanUsername
    );

    if (foundUser) {
      // User found, log in directly and execute pending vote if any
      setErrorMsg('');
      onLogin(foundUser);
      onClose();
    } else {
      // User not found in system: prompt to register so they can vote immediately
      setErrorMsg('');
      setStep('register');
    }
  };

  const handleRegisterUser = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUsername = normalizeUsername(usernameInput);

    if (!cleanUsername) {
      setErrorMsg('Lütfen kullanıcı adı belirtin.');
      return;
    }

    const trimmedFullName = fullNameInput.trim() || `@${cleanUsername}`;

    // Generate initials
    const words = trimmedFullName.split(' ').filter(Boolean);
    const initial = words.length > 1
      ? (words[0][0] + words[1][0]).toUpperCase()
      : (cleanUsername.slice(0, 2)).toUpperCase();

    const newUser: User = {
      id: `user-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      username: cleanUsername,
      fullName: trimmedFullName,
      avatarColor: selectedAvatarColor,
      avatarInitial: initial,
      createdAt: new Date().toISOString(),
    };

    onRegister(newUser);
    onClose();
  };

  const handleQuickSelectUser = (user: User) => {
    onLogin(user);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl shadow-indigo-500/10 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="relative px-6 pt-6 pb-4 border-b border-slate-800/80 bg-slate-950/40">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              step === 'check' 
                ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/30' 
                : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
            }`}>
              {step === 'check' ? <UserCheck className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                {step === 'check' ? 'Kullanıcı Doğrulama' : 'Yeni Kullanıcı Kaydı'}
              </h2>
              <p className="text-xs text-slate-400">
                {step === 'check'
                  ? 'Oylamaya katılmak için kullanıcı adınızı girin'
                  : 'Sistemde kayıt bulunamadı, hızlıca kayıt oluşturun'}
              </p>
            </div>
          </div>

          {/* Pending Vote Context Notice */}
          {pendingVote && (
            <div className="mt-4 p-2.5 rounded-xl bg-indigo-950/50 border border-indigo-500/30 flex items-center gap-2.5 text-xs text-indigo-200">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <div className="truncate">
                <span className="text-slate-400">Oylanacak Seçenek:</span>{' '}
                <strong className="text-white">{pendingVote.option.title}</strong>{' '}
                <span className="text-slate-400">({pendingVote.category.title})</span>
              </div>
            </div>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {step === 'check' ? (
            /* STEP 1: USERNAME CHECK */
            <form onSubmit={handleCheckUsername} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Kullanıcı Adı (Username)
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500 text-sm font-mono">
                    @
                  </span>
                  <input
                    type="text"
                    value={usernameInput}
                    onChange={(e) => {
                      setUsernameInput(e.target.value);
                      setErrorMsg('');
                    }}
                    placeholder="ornek: ahmet, enes, mehmet"
                    autoFocus
                    className="w-full pl-8 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-mono"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1.5 flex items-center gap-1">
                  <Shield className="w-3 h-3 text-indigo-400" />
                  Kayıtlı kullanıcılar anında oy kullanabilir, olmayanlar tek tıkla kaydolabilir.
                </p>
              </div>

              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Kontrol Et ve Devam Et</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Sample Registered Users Quick Pick */}
              <div className="pt-4 border-t border-slate-800/80">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <span className="font-medium flex items-center gap-1">
                    <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
                    Hızlı Test: Kayıtlı Kullanıcılar
                  </span>
                  <span className="text-[10px] text-slate-500">Tıkla ve Seç</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {registeredUsers.map((u) => (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => handleQuickSelectUser(u)}
                      className="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-xs text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <span className={`w-2 h-2 rounded-full bg-gradient-to-r ${u.avatarColor}`}></span>
                      <span className="font-mono text-indigo-400">@{u.username}</span>
                      <span className="text-slate-500 text-[10px]">({u.fullName.split(' ')[0]})</span>
                    </button>
                  ))}
                </div>
              </div>
            </form>
          ) : (
            /* STEP 2: NOT REGISTERED -> INSTANT REGISTRATION FORM */
            <form onSubmit={handleRegisterUser} className="space-y-4">
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
                <div>
                  <strong className="font-semibold text-white">
                    @{normalizeUsername(usernameInput)}
                  </strong>{' '}
                  kullanıcı adı sistemde kayıtlı değil. Oylamaya kaldığınız yerden devam etmek için hızlıca kaydolun:
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Kullanıcı Adı (Username)
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500 text-sm font-mono">
                    @
                  </span>
                  <input
                    type="text"
                    value={usernameInput}
                    onChange={(e) => setUsernameInput(e.target.value)}
                    className="w-full pl-8 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm font-mono focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Ad Soyad
                </label>
                <input
                  type="text"
                  value={fullNameInput}
                  onChange={(e) => setFullNameInput(e.target.value)}
                  placeholder="Örn: Ahmet Yılmaz"
                  autoFocus
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Profil Rengi Seçin
                </label>
                <div className="flex gap-2">
                  {AVATAR_PALETTES.map((pal, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedAvatarColor(pal.class)}
                      className={`w-7 h-7 rounded-full bg-gradient-to-tr ${pal.class} transition-transform ${
                        selectedAvatarColor === pal.class
                          ? 'ring-2 ring-white scale-110'
                          : 'opacity-70 hover:opacity-100'
                      }`}
                      title={pal.name}
                    />
                  ))}
                </div>
              </div>

              {errorMsg && (
                <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                  {errorMsg}
                </div>
              )}

              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setStep('check')}
                  className="w-1/3 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
                >
                  Geri Dön
                </button>
                <button
                  type="submit"
                  className="w-2/3 py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Kaydı Tamamla & {pendingVote ? 'Oyumu Gönder' : 'Giriş Yap'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
