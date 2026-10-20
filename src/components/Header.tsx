import React from 'react';
import { User } from '../types';
import { 
  Vote, 
  UserCheck, 
  LogOut, 
  Users, 
  BarChart3, 
  ShieldCheck, 
  PlusCircle, 
  RotateCcw,
  Sparkles
} from 'lucide-react';

interface HeaderProps {
  currentUser: User | null;
  registeredUsersCount: number;
  totalVotesCount: number;
  onOpenAuthModal: () => void;
  onSwitchUser: () => void;
  onSignOut: () => void;
  onOpenAddCategory: () => void;
  onToggleResults: () => void;
  isResultsView: boolean;
  onResetData: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  registeredUsersCount,
  totalVotesCount,
  onOpenAuthModal,
  onSwitchUser,
  onSignOut,
  onOpenAddCategory,
  onToggleResults,
  isResultsView,
  onResetData,
}) => {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-slate-950/85 border-b border-slate-800/80 transition-all">
      {/* Top Copyright Banner */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 border-b border-indigo-500/20 px-4 py-1.5 text-xs text-slate-300 flex items-center justify-between">
        <div className="flex items-center gap-2 mx-auto sm:mx-0">
          <span className="inline-flex items-center gap-1 text-indigo-400 font-semibold bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/30">
            <ShieldCheck className="w-3.5 h-3.5" />
            Telif Hakkı Korumalı
          </span>
          <span className="hidden sm:inline text-slate-400">•</span>
          <span className="font-medium text-slate-200">
            Bu uygulama <strong className="text-white font-bold tracking-wide underline decoration-indigo-400 decoration-2 underline-offset-2">Enes Öztürk</strong> imzası ve telif haklarıyla sunulmaktadır.
          </span>
        </div>

        <div className="hidden md:flex items-center gap-3 text-[11px] text-slate-400">
          <span>Sürüm 2.4</span>
          <span>•</span>
          <span className="flex items-center gap-1 text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
            Canlı Oylama Sistemi
          </span>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
        {/* Logo and App Title */}
        <div className="flex items-center gap-3">
          <div className="relative group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 p-0.5 shadow-lg shadow-indigo-500/25 flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Vote className="w-6 h-6 text-indigo-400 group-hover:rotate-6 transition-transform" />
              </div>
            </div>
            <div className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-slate-950"></div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-1.5">
                VoteHub
                <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-indigo-300 border border-indigo-500/30">
                  Oy Uygulaması
                </span>
              </h1>
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-1.5">
              <span>Pre-defined & Özel Kategoriler</span>
              <span className="text-slate-600">•</span>
              <span className="text-indigo-400/90 font-medium">Enes Öztürk Telifiyle</span>
            </p>
          </div>
        </div>

        {/* Global Stats Pockets */}
        <div className="hidden lg:flex items-center gap-3 bg-slate-900/80 border border-slate-800 rounded-xl px-3 py-1.5 text-xs shadow-inner">
          <div className="flex items-center gap-2 pr-3 border-r border-slate-800">
            <Users className="w-4 h-4 text-sky-400" />
            <div>
              <span className="text-slate-400 block text-[10px] leading-tight">Kayıtlı Seçmen</span>
              <span className="font-bold text-white">{registeredUsersCount} Kişi</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <div>
              <span className="text-slate-400 block text-[10px] leading-tight">Kullanılan Oy</span>
              <span className="font-bold text-white">{totalVotesCount} Toplam Oy</span>
            </div>
          </div>
        </div>

        {/* User Status & Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3 ml-auto">
          {/* User Auth Section */}
          {currentUser ? (
            <div className="flex items-center gap-2 bg-slate-900/90 border border-indigo-500/30 rounded-xl pl-2 pr-1.5 py-1.5 shadow-sm">
              <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${currentUser.avatarColor} flex items-center justify-center text-xs font-bold text-white shadow`}>
                {currentUser.avatarInitial}
              </div>
              <div className="text-left hidden sm:block max-w-[120px] truncate">
                <span className="block text-xs font-bold text-white truncate leading-tight">
                  {currentUser.fullName}
                </span>
                <span className="block text-[11px] text-indigo-400 font-mono truncate leading-tight">
                  @{currentUser.username}
                </span>
              </div>
              
              <div className="flex items-center gap-1 ml-1 border-l border-slate-800 pl-1">
                <button
                  onClick={onSwitchUser}
                  title="Kullanıcı Değiştir"
                  className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors text-xs flex items-center gap-1"
                >
                  <Users className="w-4 h-4" />
                  <span className="hidden md:inline text-[11px]">Değiştir</span>
                </button>
                <button
                  onClick={onSignOut}
                  title="Çıkış Yap"
                  className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={onOpenAuthModal}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-indigo-300 hover:text-white border border-indigo-500/40 text-xs font-semibold shadow-sm transition-all hover:border-indigo-400 cursor-pointer"
            >
              <UserCheck className="w-4 h-4 text-indigo-400" />
              <span>Giriş / Kayıt Ol</span>
            </button>
          )}

          {/* Add Category Button */}
          <button
            onClick={onOpenAddCategory}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs font-medium transition-all cursor-pointer"
            title="İsteğe bağlı yeni kategori ekle"
          >
            <PlusCircle className="w-4 h-4 text-purple-400" />
            <span className="hidden sm:inline">Kategori Ekle</span>
          </button>

          {/* Primary Results / End Voting Button */}
          <button
            onClick={onToggleResults}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs shadow-lg transition-all cursor-pointer ${
              isResultsView
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white shadow-indigo-600/30 hover:scale-[1.02]'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>{isResultsView ? 'Oylamaya Dön' : 'Oylamayı Sonlandır & Sonuçlar'}</span>
          </button>

          {/* Reset Demo Data Button */}
          <button
            onClick={onResetData}
            title="Verileri Varsayılana Sıfırla"
            className="p-2 rounded-xl bg-slate-900/60 hover:bg-slate-800 text-slate-500 hover:text-slate-300 border border-slate-800/80 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
