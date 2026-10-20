import React, { useState } from 'react';
import { User, VoteRecord, Category } from '../types';
import { 
  X, 
  Users, 
  Check, 
  Vote, 
  ShieldCheck, 
  Plus, 
  Sparkles,
  Calendar
} from 'lucide-react';

interface UserManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  registeredUsers: User[];
  currentUser: User | null;
  onSelectUser: (user: User) => void;
  onOpenRegister: () => void;
  votes: VoteRecord[];
  categories: Category[];
}

export const UserManagementModal: React.FC<UserManagementModalProps> = ({
  isOpen,
  onClose,
  registeredUsers,
  currentUser,
  onSelectUser,
  onOpenRegister,
  votes,
  categories,
}) => {
  const [activeTab, setActiveTab] = useState<'users' | 'activity'>('users');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-800 bg-slate-950/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Kayıtlı Kullanıcı Yönetimi</h2>
              <p className="text-xs text-slate-400">
                Sistemdeki seçmenleri görüntüleyin veya aktif kullanıcıyı değiştirin
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-800 px-6 pt-2 bg-slate-950/20">
          <button
            onClick={() => setActiveTab('users')}
            className={`pb-2.5 text-xs font-semibold border-b-2 mr-4 transition-colors cursor-pointer ${
              activeTab === 'users'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Seçmen Listesi ({registeredUsers.length})
          </button>
          <button
            onClick={() => setActiveTab('activity')}
            className={`pb-2.5 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'activity'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Son Oylama Hareketleri ({votes.length})
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-3 flex-1">
          {activeTab === 'users' ? (
            <>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-400">Kullanıcı seçerek oy kullanmaya devam edebilirsiniz:</span>
                <button
                  onClick={() => {
                    onClose();
                    onOpenRegister();
                  }}
                  className="inline-flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Yeni Kayıt
                </button>
              </div>

              {registeredUsers.map((user) => {
                const isCurrent = currentUser?.id === user.id;
                const userVotesCount = votes.filter((v) => v.userId === user.id).length;

                return (
                  <div
                    key={user.id}
                    onClick={() => {
                      onSelectUser(user);
                      onClose();
                    }}
                    className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all cursor-pointer ${
                      isCurrent
                        ? 'bg-indigo-950/40 border-indigo-500/60 shadow-lg shadow-indigo-500/10'
                        : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${user.avatarColor} flex items-center justify-center font-bold text-xs text-white shadow`}>
                        {user.avatarInitial}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-white">
                            {user.fullName}
                          </span>
                          {user.username === 'enes' && (
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                              Yönetici & Telif Sahibi
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-indigo-400 font-mono">
                          @{user.username}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="text-xs font-semibold text-slate-300 block">
                          {userVotesCount}/{categories.length} Oy
                        </span>
                        <span className="text-[10px] text-slate-500">
                          {userVotesCount === categories.length ? 'Tamamladı' : 'Oyluyor'}
                        </span>
                      </div>

                      {isCurrent ? (
                        <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/40 flex items-center justify-center">
                          <Check className="w-4 h-4" />
                        </div>
                      ) : (
                        <span className="text-xs text-slate-500 hover:text-white px-2 py-1 rounded-md bg-slate-900 border border-slate-800">
                          Seç
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </>
          ) : (
            <div className="space-y-2.5">
              {votes.length === 0 ? (
                <div className="text-center py-8 text-slate-500 text-xs">
                  Henüz kaydedilmiş bir oy hareketi bulunmuyor.
                </div>
              ) : (
                [...votes].reverse().map((vote) => {
                  const cat = categories.find((c) => c.id === vote.categoryId);
                  const opt = cat?.options.find((o) => o.id === vote.optionId);

                  return (
                    <div
                      key={vote.id}
                      className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <Vote className="w-4 h-4 text-indigo-400 shrink-0" />
                        <div>
                          <div>
                            <strong className="text-indigo-400 font-mono">@{vote.username}</strong>{' '}
                            <span className="text-slate-400">{cat?.title} için</span>{' '}
                            <strong className="text-white">"{opt?.title || 'Seçenek'}"</strong>{' '}
                            <span className="text-slate-400">oyunu verdi.</span>
                          </div>
                          <span className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                            <Calendar className="w-3 h-3" />
                            {new Date(vote.timestamp).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950/80 border-t border-slate-800 text-center text-xs text-slate-400">
          <span className="text-indigo-400 font-medium">Enes Öztürk</span> Oy Doğrulama Sistemi
        </div>
      </div>
    </div>
  );
};
