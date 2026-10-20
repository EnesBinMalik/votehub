import React from 'react';
import { Category, VoteOption, User, VoteRecord, CategoryStats } from '../types';
import { IconHelper } from './IconHelper';
import { 
  Check, 
  Crown, 
  Sparkles, 
  TrendingUp,
  UserCheck
} from 'lucide-react';

interface CategoryCardProps {
  category: Category;
  stats: CategoryStats;
  currentUser: User | null;
  userVoteInThisCategory?: VoteRecord;
  onCastVote: (category: Category, option: VoteOption) => void;
  onRemoveVote?: (voteId: string) => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  stats,
  currentUser,
  userVoteInThisCategory,
  onCastVote,
}) => {
  const getThemeGradient = (theme: string) => {
    switch (theme) {
      case 'purple':
        return 'from-purple-500/10 via-slate-900 to-slate-950 border-purple-500/30';
      case 'cyan':
        return 'from-cyan-500/10 via-slate-900 to-slate-950 border-cyan-500/30';
      case 'emerald':
        return 'from-emerald-500/10 via-slate-900 to-slate-950 border-emerald-500/30';
      case 'amber':
        return 'from-amber-500/10 via-slate-900 to-slate-950 border-amber-500/30';
      default:
        return 'from-indigo-500/10 via-slate-900 to-slate-950 border-indigo-500/30';
    }
  };

  const getThemeAccent = (theme: string) => {
    switch (theme) {
      case 'purple': return 'text-purple-400 bg-purple-500/10 border-purple-500/30';
      case 'cyan': return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30';
      case 'emerald': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
      case 'amber': return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
      default: return 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30';
    }
  };

  const getBarColor = (isLeading: boolean, isUserVoted: boolean) => {
    if (isUserVoted) return 'bg-gradient-to-r from-indigo-500 to-purple-500';
    if (isLeading) return 'bg-gradient-to-r from-amber-500 to-orange-500';
    return 'bg-gradient-to-r from-slate-700 to-slate-600';
  };

  return (
    <div className={`relative rounded-3xl bg-gradient-to-b ${getThemeGradient(category.themeColor)} border p-6 sm:p-7 shadow-xl shadow-black/40 transition-all hover:border-slate-700/80 group flex flex-col justify-between`}>
      {/* Category Top Banner */}
      <div>
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border shadow-inner ${getThemeAccent(category.themeColor)}`}>
              <IconHelper name={category.icon} className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-white tracking-tight">
                  {category.title}
                </h3>
                {category.isCustom && (
                  <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    Özel
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">
                {category.description}
              </p>
            </div>
          </div>

          <div className="text-right shrink-0">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/90 border border-slate-800 text-xs font-semibold text-slate-300">
              <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />
              <span>{stats.totalVotes} Oy</span>
            </span>
          </div>
        </div>

        {/* Voting Options List */}
        <div className="space-y-3 my-5">
          {stats.optionsStats.map((optStat) => {
            const isUserVotedThis = userVoteInThisCategory?.optionId === optStat.option.id;
            const hasLeading = stats.totalVotes > 0 && optStat.isLeading;

            return (
              <div
                key={optStat.option.id}
                className={`relative rounded-2xl p-4 transition-all border ${
                  isUserVotedThis
                    ? 'bg-indigo-950/40 border-indigo-500/60 shadow-lg shadow-indigo-500/10'
                    : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/40'
                }`}
              >
                {/* Progress bar background */}
                <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none opacity-20">
                  <div
                    className={`h-full transition-all duration-500 ${getBarColor(hasLeading, isUserVotedThis)}`}
                    style={{ width: `${optStat.percentage}%` }}
                  />
                </div>

                <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  {/* Left: Option Info */}
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0 mt-0.5">
                      <IconHelper name={optStat.option.iconName || 'Check'} className="w-4 h-4 text-slate-300" />
                    </div>
                    
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center flex-wrap gap-2">
                        <span className="font-semibold text-sm text-white truncate">
                          {optStat.option.title}
                        </span>
                        
                        {optStat.option.badge && (
                          <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-900 text-slate-400 border border-slate-800">
                            {optStat.option.badge}
                          </span>
                        )}

                        {hasLeading && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                            <Crown className="w-3 h-3 text-amber-400" />
                            Lider
                          </span>
                        )}

                        {isUserVotedThis && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                            <Sparkles className="w-3 h-3 text-indigo-400" />
                            Sizin Oyunuz
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-400 mt-1 line-clamp-1">
                        {optStat.option.description}
                      </p>

                      {/* Percentage and Numeric Counts */}
                      <div className="flex items-center gap-3 mt-2 text-xs">
                        <div className="flex items-center gap-1.5">
                          <span className="text-slate-400 text-[11px]">Rakamsal:</span>
                          <strong className="text-white font-mono">{optStat.count} oy</strong>
                        </div>
                        <span className="text-slate-700">•</span>
                        <div className="flex items-center gap-1.5">
                          <span className="text-slate-400 text-[11px]">Yüzdesel:</span>
                          <strong className="text-indigo-300 font-mono">%{optStat.percentage.toFixed(1)}</strong>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right: Vote Action Button */}
                  <div className="shrink-0 flex items-center justify-end pt-1 sm:pt-0">
                    {isUserVotedThis ? (
                      <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-500/20 border border-indigo-500/40 text-xs font-semibold text-indigo-300">
                        <Check className="w-4 h-4 text-indigo-400" />
                        <span>Oyunuz Bu</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => onCastVote(category, optStat.option)}
                        className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm ${
                          userVoteInThisCategory
                            ? 'bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 hover:border-slate-600'
                            : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/20 hover:scale-[1.02]'
                        }`}
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>{userVoteInThisCategory ? 'Oyu Değiştir' : 'Oy Ver'}</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Category Footer Status */}
      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
        <div>
          {userVoteInThisCategory ? (
            <span className="text-emerald-400 flex items-center gap-1">
              <Check className="w-3.5 h-3.5" />
              Bu kategoride oyunuz kaydedildi
            </span>
          ) : (
            <span className="text-slate-400">
              {currentUser ? 'Henüz bu kategoride oy kullanmadınız' : 'Oy vermek için giriş yapın'}
            </span>
          )}
        </div>
        <div className="text-[11px] text-slate-400 font-mono">
          {category.options.length} Seçenek
        </div>
      </div>
    </div>
  );
};
