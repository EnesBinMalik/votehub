/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { 
  Category, 
  User, 
  VoteRecord, 
  CategoryStats, 
  OptionStats,
  VoteOption 
} from './types';
import { 
  DEFAULT_CATEGORIES, 
  DEFAULT_USERS, 
  INITIAL_VOTES 
} from './data/defaultData';
import { Header } from './components/Header';
import { CategoryCard } from './components/CategoryCard';
import { AuthModal } from './components/AuthModal';
import { AddCategoryModal } from './components/AddCategoryModal';
import { UserManagementModal } from './components/UserManagementModal';
import { ResultsView } from './components/ResultsView';
import { Footer } from './components/Footer';
import { 
  Vote, 
  Sparkles, 
  BarChart3, 
  Search, 
  Filter, 
  CheckCircle2, 
  Info,
  ShieldCheck,
  Plus,
  Flame,
  Film,
  Cpu,
  Trophy
} from 'lucide-react';

const STORAGE_KEYS = {
  USERS: 'votehub_registered_users_v2',
  CATEGORIES: 'votehub_categories_v2',
  VOTES: 'votehub_votes_v2',
  CURRENT_USER_ID: 'votehub_current_user_id_v2',
  IS_FINALIZED: 'votehub_is_finalized_v2',
};

export default function App() {
  // 1. Persistent State Initialization
  const [categories, setCategories] = useState<Category[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      return saved ? JSON.parse(saved) : DEFAULT_CATEGORIES;
    } catch {
      return DEFAULT_CATEGORIES;
    }
  });

  const [registeredUsers, setRegisteredUsers] = useState<User[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USERS);
      return saved ? JSON.parse(saved) : DEFAULT_USERS;
    } catch {
      return DEFAULT_USERS;
    }
  });

  const [votes, setVotes] = useState<VoteRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.VOTES);
      return saved ? JSON.parse(saved) : INITIAL_VOTES;
    } catch {
      return INITIAL_VOTES;
    }
  });

  const [currentUserId, setCurrentUserId] = useState<string | null>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID) || 'user-enes';
    } catch {
      return 'user-enes';
    }
  });

  const [isResultsView, setIsResultsView] = useState<boolean>(false);

  // Modals state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [isUserManagementOpen, setIsUserManagementOpen] = useState(false);
  const [pendingVote, setPendingVote] = useState<{ category: Category; option: VoteOption } | null>(null);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedThemeFilter, setSelectedThemeFilter] = useState<string>('all');

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' | 'warn' } | null>(null);

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    } catch (e) {
      console.error(e);
    }
  }, [categories]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(registeredUsers));
    } catch (e) {
      console.error(e);
    }
  }, [registeredUsers]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.VOTES, JSON.stringify(votes));
    } catch (e) {
      console.error(e);
    }
  }, [votes]);

  useEffect(() => {
    try {
      if (currentUserId) {
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, currentUserId);
      } else {
        localStorage.removeItem(STORAGE_KEYS.CURRENT_USER_ID);
      }
    } catch (e) {
      console.error(e);
    }
  }, [currentUserId]);

  const showToast = (text: string, type: 'success' | 'info' | 'warn' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 75,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#6366f1', '#a855f7', '#ec4899', '#f59e0b', '#10b981'],
      });
    } catch {
      // fallback safe
    }
  };

  // Current active user object
  const currentUser = useMemo(() => {
    if (!currentUserId) return null;
    return registeredUsers.find((u) => u.id === currentUserId) || null;
  }, [currentUserId, registeredUsers]);

  // Compute Statistics for each category & option
  const allCategoryStats: CategoryStats[] = useMemo(() => {
    return categories.map((cat) => {
      const categoryVotes = votes.filter((v) => v.categoryId === cat.id);
      const totalCatVotes = categoryVotes.length;

      // Group by option
      const countMap: Record<string, number> = {};
      cat.options.forEach((o) => {
        countMap[o.id] = 0;
      });
      categoryVotes.forEach((v) => {
        if (countMap[v.optionId] !== undefined) {
          countMap[v.optionId] += 1;
        }
      });

      // Find max count for leading badge
      let maxCount = 0;
      Object.values(countMap).forEach((cnt) => {
        if (cnt > maxCount) maxCount = cnt;
      });

      const optionsStats: OptionStats[] = cat.options.map((opt) => {
        const count = countMap[opt.id] || 0;
        const percentage = totalCatVotes > 0 ? (count / totalCatVotes) * 100 : 0;
        const isLeading = totalCatVotes > 0 && count === maxCount && count > 0;
        const userVoted = !!(currentUser && categoryVotes.some((v) => v.optionId === opt.id && v.userId === currentUser.id));

        return {
          option: opt,
          count,
          percentage,
          isLeading,
          userVoted,
        };
      });

      const leadingOptionStat = optionsStats.find((os) => os.isLeading);

      return {
        category: cat,
        totalVotes: totalCatVotes,
        optionsStats,
        winnerOption: leadingOptionStat?.option,
      };
    });
  }, [categories, votes, currentUser]);

  // Cast vote logic
  const executeVote = (targetCategory: Category, targetOption: VoteOption, userToVote: User) => {
    setVotes((prevVotes) => {
      // Remove previous vote by this user in this category (one vote per category policy)
      const filtered = prevVotes.filter(
        (v) => !(v.categoryId === targetCategory.id && v.userId === userToVote.id)
      );

      const newRecord: VoteRecord = {
        id: `vote-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        categoryId: targetCategory.id,
        optionId: targetOption.id,
        userId: userToVote.id,
        username: userToVote.username,
        timestamp: new Date().toISOString(),
      };

      return [...filtered, newRecord];
    });

    triggerConfetti();
    showToast(
      `Oyunuz kaydedildi: "${targetOption.title}" (${targetCategory.title}). Teşekkürler @${userToVote.username}!`,
      'success'
    );
  };

  // Called when user clicks "Oy Ver" in CategoryCard
  const handleVoteRequest = (category: Category, option: VoteOption) => {
    if (!currentUser) {
      // If not logged in, request username first!
      setPendingVote({ category, option });
      setIsAuthModalOpen(true);
      return;
    }

    executeVote(category, option, currentUser);
  };

  // Auth modal login callback
  const handleAuthLogin = (user: User) => {
    setCurrentUserId(user.id);
    if (pendingVote) {
      executeVote(pendingVote.category, pendingVote.option, user);
      setPendingVote(null);
    } else {
      showToast(`Hoş geldiniz, @${user.username}!`, 'info');
    }
  };

  // Auth modal register callback
  const handleAuthRegister = (newUser: User) => {
    setRegisteredUsers((prev) => [...prev, newUser]);
    setCurrentUserId(newUser.id);
    if (pendingVote) {
      executeVote(pendingVote.category, pendingVote.option, newUser);
      setPendingVote(null);
      showToast(`Kaydınız tamamlandı ve oyunuz gönderildi, @${newUser.username}!`, 'success');
    } else {
      showToast(`Aramıza hoş geldiniz, @${newUser.username}! Hesabınız oluşturuldu.`, 'success');
    }
  };

  // Add custom category
  const handleAddCategory = (newCat: Category) => {
    setCategories((prev) => [newCat, ...prev]);
    showToast(`"${newCat.title}" kategorisi oylamaya başarıyla eklendi!`, 'success');
    triggerConfetti();
  };

  // Sign out
  const handleSignOut = () => {
    setCurrentUserId(null);
    showToast('Oturum kapatıldı. Oy vermek için tekrar giriş yapabilirsiniz.', 'info');
  };

  // Reset demo data to defaults
  const handleResetData = () => {
    if (window.confirm('Tüm oyları ve kategorileri varsayılan başlangıç durumuna sıfırlamak istiyor musunuz?')) {
      setCategories(DEFAULT_CATEGORIES);
      setRegisteredUsers(DEFAULT_USERS);
      setVotes(INITIAL_VOTES);
      setCurrentUserId('user-enes');
      setIsResultsView(false);
      showToast('Tüm veriler varsayılan haline sıfırlandı.', 'info');
    }
  };

  // Filtered categories
  const filteredCategories = useMemo(() => {
    return categories.filter((cat) => {
      const matchesSearch =
        cat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.options.some((o) => o.title.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesTheme =
        selectedThemeFilter === 'all' || cat.themeColor === selectedThemeFilter;

      return matchesSearch && matchesTheme;
    });
  }, [categories, searchQuery, selectedThemeFilter]);

  // User voting progress
  const currentUserVoteCount = useMemo(() => {
    if (!currentUser) return 0;
    const userVoteCatIds = new Set(votes.filter((v) => v.userId === currentUser.id).map((v) => v.categoryId));
    return userVoteCatIds.size;
  }, [currentUser, votes]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
          <div className="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-slate-900 border border-indigo-500/50 shadow-2xl shadow-indigo-500/20 text-xs font-semibold text-white">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage.text}</span>
          </div>
        </div>
      )}

      {/* Main Header */}
      <Header
        currentUser={currentUser}
        registeredUsersCount={registeredUsers.length}
        totalVotesCount={votes.length}
        onOpenAuthModal={() => {
          setPendingVote(null);
          setIsAuthModalOpen(true);
        }}
        onSwitchUser={() => setIsUserManagementOpen(true)}
        onSignOut={handleSignOut}
        onOpenAddCategory={() => setIsAddCategoryOpen(true)}
        onToggleResults={() => {
          setIsResultsView(!isResultsView);
          if (!isResultsView) {
            triggerConfetti();
          }
        }}
        isResultsView={isResultsView}
        onResetData={handleResetData}
      />

      {/* Main Body */}
      <main className="flex-1">
        {isResultsView ? (
          /* FINAL RESULTS VIEW (Rakamsal ve Yüzdesel) */
          <ResultsView
            categories={categories}
            allStats={allCategoryStats}
            totalVotes={votes.length}
            registeredUsers={registeredUsers}
            votes={votes}
            onBackToVoting={() => setIsResultsView(false)}
            currentUser={currentUser}
          />
        ) : (
          /* ACTIVE VOTING VIEW */
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            {/* Hero & Information Section */}
            <div className="relative rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/50 to-slate-900 border border-slate-800 p-6 sm:p-8 overflow-hidden shadow-2xl">
              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="max-w-2xl">
                  <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>Canlı Seçmen & Kategori Oylaması</span>
                  </div>

                  <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight mb-3">
                    Fikrinizi Belirtin, <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Geleceğe Oy Verin</span>
                  </h2>

                  <p className="text-sm text-slate-300 leading-relaxed">
                    Sistemde önceden tanımlanmış <strong className="text-white">Film</strong>, <strong className="text-white">Tech Stack</strong> ve <strong className="text-white">Spor</strong> kategorileri başta olmak üzere tüm başlıklarda oyunuzu kullanın. 
                    Yalnızca kayıtlı kullanıcılar oy verebilir. Oylama sonunda sonuçlar anlık olarak hem rakamsal hem yüzdesel hesaplanır.
                  </p>

                  {/* User voting status pill */}
                  <div className="mt-5 flex flex-wrap items-center gap-3">
                    {currentUser ? (
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-xs text-indigo-300">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>
                          Giriş Yapıldı: <strong className="text-white">@{currentUser.username}</strong> ({currentUserVoteCount}/{categories.length} kategoride oyunuz var)
                        </span>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setPendingVote(null);
                          setIsAuthModalOpen(true);
                        }}
                        className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300 hover:bg-amber-500/20 transition-colors cursor-pointer"
                      >
                        <Info className="w-4 h-4 text-amber-400" />
                        <span>Henüz giriş yapmadınız. Oy vermek için tıklayıp kullanıcı adınızı girin.</span>
                      </button>
                    )}

                    <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-slate-950/60 px-3 py-1.5 rounded-xl border border-slate-800">
                      <ShieldCheck className="w-4 h-4 text-indigo-400" />
                      <span>Enes Öztürk İmzalı Telif</span>
                    </div>
                  </div>
                </div>

                {/* Finalize Action Box */}
                <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 shrink-0 flex flex-col justify-center items-center text-center max-w-xs shadow-inner">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white mb-3 shadow-lg shadow-indigo-500/30">
                    <BarChart3 className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-bold text-white mb-1">
                    Oylama Sonuçlarını Gör
                  </h4>
                  <p className="text-xs text-slate-400 mb-4">
                    Oylamayı sonlandırıp tüm rakamsal ve yüzdesel sonuç analizlerini inceleyin.
                  </p>
                  <button
                    onClick={() => {
                      setIsResultsView(true);
                      triggerConfetti();
                    }}
                    className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all cursor-pointer hover:scale-[1.02]"
                  >
                    Oylamayı Sonlandır & Sonuçlar
                  </button>
                </div>
              </div>
            </div>

            {/* Predefined Categories Showcase Header / Filter Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2">
              <div>
                <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                  <Flame className="w-5 h-5 text-amber-500" />
                  <span>Oylamaya Sunulan Kategoriler</span>
                  <span className="text-xs text-slate-500 font-mono">({filteredCategories.length})</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Her kategoride bir oy hakkınız bulunmaktadır. Dilediğiniz zaman oyunuzu değiştirebilirsiniz.
                </p>
              </div>

              {/* Search & Quick Category Filters */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Kategori veya seçenek ara..."
                    className="pl-8 pr-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 w-44 sm:w-56"
                  />
                </div>

                <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
                  <button
                    onClick={() => setSelectedThemeFilter('all')}
                    className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                      selectedThemeFilter === 'all'
                        ? 'bg-indigo-600 text-white'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Tümü
                  </button>
                  <button
                    onClick={() => setSelectedThemeFilter('purple')}
                    className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer flex items-center gap-1 ${
                      selectedThemeFilter === 'purple'
                        ? 'bg-purple-600 text-white'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Film className="w-3 h-3" />
                    <span>Film</span>
                  </button>
                  <button
                    onClick={() => setSelectedThemeFilter('cyan')}
                    className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer flex items-center gap-1 ${
                      selectedThemeFilter === 'cyan'
                        ? 'bg-cyan-600 text-white'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Cpu className="w-3 h-3" />
                    <span>Tech</span>
                  </button>
                  <button
                    onClick={() => setSelectedThemeFilter('emerald')}
                    className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer flex items-center gap-1 ${
                      selectedThemeFilter === 'emerald'
                        ? 'bg-emerald-600 text-white'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Trophy className="w-3 h-3" />
                    <span>Spor</span>
                  </button>
                </div>

                <button
                  onClick={() => setIsAddCategoryOpen(true)}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-indigo-400 border border-slate-800 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Kategori Ekle</span>
                </button>
              </div>
            </div>

            {/* Category Cards Grid */}
            {filteredCategories.length === 0 ? (
              <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-12 text-center max-w-md mx-auto">
                <Search className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                <h4 className="text-base font-bold text-white mb-1">Aramanıza Uygun Kategori Bulunamadı</h4>
                <p className="text-xs text-slate-400 mb-4">
                  Arama kriterlerinizi değiştirebilir ya da yeni bir kategori ekleyebilirsiniz.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedThemeFilter('all');
                  }}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold"
                >
                  Filtreleri Temizle
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                {filteredCategories.map((cat) => {
                  const catStats = allCategoryStats.find((s) => s.category.id === cat.id)!;
                  const userVoteInThisCat = currentUser
                    ? votes.find((v) => v.categoryId === cat.id && v.userId === currentUser.id)
                    : undefined;

                  return (
                    <CategoryCard
                      key={cat.id}
                      category={cat}
                      stats={catStats}
                      currentUser={currentUser}
                      userVoteInThisCategory={userVoteInThisCat}
                      onCastVote={handleVoteRequest}
                    />
                  );
                })}
              </div>
            )}

            {/* Bottom Callout to End Voting */}
            <div className="mt-12 p-8 rounded-3xl bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 border border-indigo-500/30 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
              <div>
                <h3 className="text-lg font-bold text-white mb-1">
                  Oylamanızı Tamamladınız mı?
                </h3>
                <p className="text-xs text-slate-300">
                  Oturumu sonlandırarak tüm katılımcıların oy dağılımını rakamsal ve yüzdesel grafiklerle inceleyin.
                </p>
              </div>

              <button
                onClick={() => {
                  setIsResultsView(true);
                  triggerConfetti();
                }}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-xl shadow-indigo-600/30 transition-all cursor-pointer shrink-0"
              >
                Oylamayı Sonlandır ve Sonuçları Göster
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Auth / Username verification modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => {
          setIsAuthModalOpen(false);
          setPendingVote(null);
        }}
        registeredUsers={registeredUsers}
        onLogin={handleAuthLogin}
        onRegister={handleAuthRegister}
        pendingVote={pendingVote}
      />

      {/* Add Custom Category Modal */}
      <AddCategoryModal
        isOpen={isAddCategoryOpen}
        onClose={() => setIsAddCategoryOpen(false)}
        onAddCategory={handleAddCategory}
      />

      {/* User Switch & Management Modal */}
      <UserManagementModal
        isOpen={isUserManagementOpen}
        onClose={() => setIsUserManagementOpen(false)}
        registeredUsers={registeredUsers}
        currentUser={currentUser}
        onSelectUser={(u) => {
          setCurrentUserId(u.id);
          showToast(`Aktif kullanıcı değiştirildi: @${u.username}`, 'info');
        }}
        onOpenRegister={() => {
          setPendingVote(null);
          setIsAuthModalOpen(true);
        }}
        votes={votes}
        categories={categories}
      />

      {/* Copyright Footer */}
      <Footer />
    </div>
  );
}
