import React from 'react';
import { ShieldCheck, Heart, Award, Layers } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-20 border-t border-slate-800/80 bg-slate-950/80 text-slate-400 py-10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-800/60">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs shadow-md shadow-indigo-500/20">
                VH
              </span>
              <span className="text-lg font-black text-white tracking-tight">VoteHub Platformu</span>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Resmi Sürüm
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-md">
              Kayıtlı seçmen doğrulamalı, pre-defined ve esnek kategorilerle donatılmış, 
              hem rakamsal hem yüzdesel analizler sunan yeni nesil oylama yazılımı.
            </p>
          </div>

          {/* Enes Öztürk Copyright Notice Card */}
          <div className="bg-slate-900/90 border border-indigo-500/30 rounded-2xl p-4 max-w-md shadow-lg shadow-indigo-500/5">
            <div className="flex items-center gap-2 text-indigo-300 font-semibold text-xs mb-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Telif Hakkı & Müelliflik Onayı</span>
            </div>
            <p className="text-xs text-slate-300">
              Bu uygulamanın tüm mimari ve görsel telif hakları{' '}
              <strong className="text-white underline decoration-indigo-500 decoration-2 font-bold">Enes Öztürk</strong>{' '}
              imzasıyla tescillenmiş olup korunmaktadır.
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <span>© 2026</span>
            <strong className="text-slate-200">Enes Öztürk</strong>
            <span>• Tüm Hakları Saklıdır.</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span className="flex items-center gap-1 hover:text-slate-300">
              <Layers className="w-3.5 h-3.5 text-indigo-400" /> Pre-defined Kategoriler
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 hover:text-slate-300">
              <Award className="w-3.5 h-3.5 text-amber-400" /> Rakamsal & Yüzdesel Rapor
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
