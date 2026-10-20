import React, { useState } from 'react';
import { Category, CategoryStats, User, VoteRecord } from '../types';
import { IconHelper } from './IconHelper';
import { 
  Trophy, 
  BarChart3, 
  PieChart, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowLeft, 
  Copy, 
  Check, 
  Sparkles,
  Users,
  Award,
  Vote,
  Share2
} from 'lucide-react';

interface ResultsViewProps {
  categories: Category[];
  allStats: CategoryStats[];
  totalVotes: number;
  registeredUsers: User[];
  votes: VoteRecord[];
  onBackToVoting: () => void;
  currentUser: User | null;
}

interface TopOptionSummary {
  optionTitle: string;
  categoryTitle: string;
  count: number;
  percentage: number;
}

export const ResultsView: React.FC<ResultsViewProps> = ({
  categories,
  allStats,
  totalVotes,
  registeredUsers,
  votes,
  onBackToVoting,
  currentUser,
}) => {
  const [copied, setCopied] = useState(false);
  const [selectedFilterCategory, setSelectedFilterCategory] = useState<string>('all');

  const filteredStats = selectedFilterCategory === 'all'
    ? allStats
    : allStats.filter((s) => s.category.id === selectedFilterCategory);

  // Overall winner across all categories
  const overallMostVotedOption = React.useMemo<TopOptionSummary | null>(() => {
    let topOption: TopOptionSummary | null = null;
    for (const cs of allStats) {
      for (const os of cs.optionsStats) {
        if (topOption === null || os.count > topOption.count) {
          topOption = {
            optionTitle: os.option.title,
            categoryTitle: cs.category.title,
            count: os.count,
            percentage: os.percentage,
          };
        }
      }
    }
    return topOption;
  }, [allStats]);

  // Calculate unique voters count
  const uniqueVoterUserIds = new Set(votes.map((v) => v.userId));
  const participationRate = registeredUsers.length > 0 
    ? ((uniqueVoterUserIds.size / registeredUsers.length) * 100).toFixed(1)
    : '0';

  const handleCopyReport = () => {
    let reportText = `📊 OYLAMA SONUÇLARI RAPORU - VOTEHUB\n`;
    reportText += `© 2026 Enes Öztürk İmzasıyla - Tüm Hakları Saklıdır\n`;
    reportText += `Toplam Oy: ${totalVotes} | Kayıtlı Seçmen: ${registeredUsers.length} | Katılım: %${participationRate}\n\n`;

    allStats.forEach((cs) => {
      reportText += `==============================\n`;
      reportText += `📌 ${cs.category.title} (Toplam: ${cs.totalVotes} oy)\n`;
      cs.optionsStats.forEach((os, idx) => {
        reportText += `  ${idx + 1}. ${os.option.title}: ${os.count} oy (%${os.percentage.toFixed(1)})\n`;
      });
      reportText += `\n`;
    });

    navigator.clipboard.writeText(reportText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-300">
      {/* Top Navigation & Status Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-800">
        <button
          onClick={onBackToVoting}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 text-xs font-semibold transition-colors cursor-pointer w-fit"
        >
          <ArrowLeft className="w-4 h-4 text-indigo-400" />
          <span>Oylamaya Geri Dön</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyReport}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-medium transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-400" />}
            <span>{copied ? 'Rapor Kopyalandı!' : 'Metin Olarak Kopyala'}</span>
          </button>

          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
            <span>Raporu Yazdır / Paylaş</span>
          </button>
        </div>
      </div>

      {/* Official Summary Card */}
      <div className="relative rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 border border-indigo-500/30 p-6 sm:p-8 mb-8 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Trophy className="w-64 h-64 text-amber-400" />
        </div>

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold mb-3">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Oylama Oturumu Sonuçlandı
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-2">
            Resmi Oylama & İstatistik Raporu
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed mb-6">
            Pre-defined ve özel kategorilerde kayıtlı kullanıcılar tarafından kullanılan oyların 
            hem <span className="text-amber-400 font-bold">rakamsal (oy sayıları)</span> hem de{' '}
            <span className="text-indigo-400 font-bold">yüzdesel (% oranları)</span> dökümü aşağıda listelenmiştir.
          </p>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-3.5">
              <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                <Vote className="w-3.5 h-3.5 text-indigo-400" />
                <span>Toplam Kullanılan</span>
              </div>
              <div className="text-xl sm:text-2xl font-black text-white font-mono">
                {totalVotes} <span className="text-xs font-normal text-slate-400">Oy</span>
              </div>
            </div>

            <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-3.5">
              <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                <Users className="w-3.5 h-3.5 text-sky-400" />
                <span>Katılım Oranı</span>
              </div>
              <div className="text-xl sm:text-2xl font-black text-white font-mono">
                %{participationRate}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                {uniqueVoterUserIds.size}/{registeredUsers.length} Seçmen
              </div>
            </div>

            <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-3.5">
              <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                <BarChart3 className="w-3.5 h-3.5 text-purple-400" />
                <span>Kategori Sayısı</span>
              </div>
              <div className="text-xl sm:text-2xl font-black text-white font-mono">
                {categories.length} <span className="text-xs font-normal text-slate-400">Adet</span>
              </div>
            </div>

            <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-3.5">
              <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                <span>En Çok Oy Alan</span>
              </div>
              <div className="text-sm font-bold text-amber-300 truncate font-mono">
                {overallMostVotedOption ? overallMostVotedOption.optionTitle : '-'}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                {overallMostVotedOption ? `${overallMostVotedOption.count} oy` : ''}
              </div>
            </div>
          </div>
        </div>

        {/* Official Signature Badge */}
        <div className="mt-6 pt-4 border-t border-indigo-500/20 flex flex-wrap items-center justify-between gap-3 text-xs text-indigo-300">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Tescilli Oylama Raporu: <strong className="text-white">Enes Öztürk</strong></span>
          </div>
          <div className="text-slate-400 font-mono text-[11px]">
            Tarih: {new Date().toLocaleDateString('tr-TR')} {new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 no-scrollbar">
        <button
          onClick={() => setSelectedFilterCategory('all')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer shrink-0 ${
            selectedFilterCategory === 'all'
              ? 'bg-indigo-600 text-white'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          Tüm Kategoriler ({allStats.length})
        </button>

        {allStats.map((cs) => (
          <button
            key={cs.category.id}
            onClick={() => setSelectedFilterCategory(cs.category.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer shrink-0 flex items-center gap-1.5 ${
              selectedFilterCategory === cs.category.id
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <IconHelper name={cs.category.icon} className="w-3.5 h-3.5" />
            <span>{cs.category.title}</span>
          </button>
        ))}
      </div>

      {/* Categories Detailed Results Section */}
      <div className="space-y-8">
        {filteredStats.map((cs) => {
          // Sort options by vote count descending
          const sortedOptions = [...cs.optionsStats].sort((a, b) => b.count - a.count);
          const winner = sortedOptions[0]?.count > 0 ? sortedOptions[0] : null;

          return (
            <div
              key={cs.category.id}
              className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xl overflow-hidden"
            >
              {/* Category Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center">
                    <IconHelper name={cs.category.icon} className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      {cs.category.title}
                    </h3>
                    <p className="text-xs text-slate-400">
                      {cs.category.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono font-bold text-indigo-300">
                    Toplam: {cs.totalVotes} Oy
                  </span>
                </div>
              </div>

              {/* Options Results Breakdown (Numerical + Percentage) */}
              <div className="space-y-3.5">
                {sortedOptions.map((optStat, index) => {
                  const isTop = index === 0 && optStat.count > 0;
                  const votersForThis = votes
                    .filter((v) => v.categoryId === cs.category.id && v.optionId === optStat.option.id)
                    .map((v) => v.username);

                  return (
                    <div
                      key={optStat.option.id}
                      className={`rounded-2xl p-4 border transition-all ${
                        isTop
                          ? 'bg-amber-950/20 border-amber-500/40'
                          : 'bg-slate-950/60 border-slate-800/80'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
                        {/* Left: Rank, Title, Badge */}
                        <div className="flex items-center gap-3">
                          <span
                            className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold font-mono ${
                              index === 0
                                ? 'bg-amber-500 text-black shadow-md shadow-amber-500/30'
                                : index === 1
                                ? 'bg-slate-300 text-black'
                                : index === 2
                                ? 'bg-amber-700 text-white'
                                : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            #{index + 1}
                          </span>

                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-sm text-white">
                                {optStat.option.title}
                              </span>
                              {isTop && (
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                                  <Trophy className="w-3 h-3 text-amber-400" />
                                  Kategori Birincisi
                                </span>
                              )}
                              {optStat.userVoted && (
                                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                                  Oyunuz
                                </span>
                              )}
                            </div>
                            <span className="text-xs text-slate-400">
                              {optStat.option.description}
                            </span>
                          </div>
                        </div>

                        {/* Right: Rakamsal & Yüzdesel Result Stats */}
                        <div className="flex items-center gap-4 text-right sm:text-right">
                          <div className="px-3 py-1 rounded-xl bg-slate-900 border border-slate-800">
                            <span className="block text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                              Rakamsal
                            </span>
                            <span className="text-sm font-bold text-white font-mono">
                              {optStat.count} Oy
                            </span>
                          </div>

                          <div className="px-3.5 py-1 rounded-xl bg-indigo-950/60 border border-indigo-500/30">
                            <span className="block text-[10px] text-indigo-400 uppercase tracking-wider font-semibold">
                              Yüzdesel
                            </span>
                            <span className="text-base font-extrabold text-indigo-300 font-mono">
                              %{optStat.percentage.toFixed(1)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Visual Progress Bar */}
                      <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800/80">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ${
                            isTop
                              ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-400'
                              : 'bg-gradient-to-r from-indigo-500 to-purple-500'
                          }`}
                          style={{ width: `${Math.max(optStat.percentage, 2)}%` }}
                        />
                      </div>

                      {/* Voter Usernames list for transparency */}
                      {votersForThis.length > 0 && (
                        <div className="mt-2.5 pt-2 border-t border-slate-900 flex items-center flex-wrap gap-1 text-[11px] text-slate-500">
                          <span className="text-slate-400 font-medium">Oy Verenler:</span>
                          {votersForThis.map((uname) => (
                            <span
                              key={uname}
                              className="px-2 py-0.5 rounded-md bg-slate-900/90 text-indigo-300/80 border border-slate-800 font-mono text-[10px]"
                            >
                              @{uname}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Return Button */}
      <div className="mt-10 text-center">
        <button
          onClick={onBackToVoting}
          className="px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/25 transition-all cursor-pointer"
        >
          Oylama Ekranına Geri Dön
        </button>
      </div>
    </div>
  );
};
