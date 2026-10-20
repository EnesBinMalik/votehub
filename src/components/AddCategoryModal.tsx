import React, { useState } from 'react';
import { Category, VoteOption } from '../types';
import { X, Plus, Trash2, Layers, Sparkles } from 'lucide-react';
import { IconHelper } from './IconHelper';

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCategory: (category: Category) => void;
}

const AVAILABLE_ICONS = [
  'Sparkles', 'Film', 'Cpu', 'Trophy', 'Brain', 'Music', 'Gamepad2', 'Camera', 'BookOpen', 'Globe'
];

const THEME_OPTIONS = [
  { id: 'purple', label: 'Mor', class: 'bg-purple-500' },
  { id: 'cyan', label: 'Turkuaz', class: 'bg-cyan-500' },
  { id: 'emerald', label: 'Yeşil', class: 'bg-emerald-500' },
  { id: 'amber', label: 'Kehribar', class: 'bg-amber-500' },
  { id: 'rose', label: 'Pembe', class: 'bg-rose-500' },
];

export const AddCategoryModal: React.FC<AddCategoryModalProps> = ({
  isOpen,
  onClose,
  onAddCategory,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('Sparkles');
  const [selectedTheme, setSelectedTheme] = useState('purple');
  const [options, setOptions] = useState<Array<{ title: string; description: string; badge: string }>>([
    { title: '', description: '', badge: '' },
    { title: '', description: '', badge: '' },
  ]);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleAddOptionField = () => {
    if (options.length >= 6) {
      setErrorMsg('Bir kategoriye en fazla 6 seçenek eklenebilir.');
      return;
    }
    setOptions([...options, { title: '', description: '', badge: '' }]);
  };

  const handleRemoveOptionField = (index: number) => {
    if (options.length <= 2) {
      setErrorMsg('Bir kategoride en az 2 seçenek olmalıdır.');
      return;
    }
    setOptions(options.filter((_, i) => i !== index));
  };

  const handleOptionChange = (index: number, field: 'title' | 'description' | 'badge', value: string) => {
    const updated = [...options];
    updated[index][field] = value;
    setOptions(updated);
    setErrorMsg('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setErrorMsg('Lütfen kategori başlığı girin.');
      return;
    }

    const validOptions = options.filter((o) => o.title.trim().length > 0);
    if (validOptions.length < 2) {
      setErrorMsg('Lütfen en az 2 geçerli seçenek belirleyin.');
      return;
    }

    const newCategory: Category = {
      id: `cat-custom-${Date.now()}`,
      title: title.trim(),
      description: description.trim() || 'Kullanıcı tarafından oluşturulan özel kategori.',
      icon: selectedIcon,
      themeColor: selectedTheme,
      isCustom: true,
      options: validOptions.map((o, idx) => ({
        id: `opt-${Date.now()}-${idx}`,
        title: o.title.trim(),
        description: o.description.trim() || 'Açıklama belirtilmedi.',
        badge: o.badge.trim() || undefined,
        iconName: selectedIcon,
      })),
      createdAt: new Date().toISOString(),
    };

    onAddCategory(newCategory);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg max-h-[90vh] flex flex-col bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-800 bg-slate-950/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">İsteğe Bağlı Kategori Ekle</h2>
              <p className="text-xs text-slate-400">Yeni bir oylama kategorisi ve seçenekleri belirleyin</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
          {/* Category Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Kategori Başlığı *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setErrorMsg('');
              }}
              placeholder="Örn: 2026 Yılın En İyi Müzik Albümü"
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
              autoFocus
            />
          </div>

          {/* Category Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Kategori Açıklaması
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Örn: Bu yıl en çok dinlediğiniz ve beğendiğiniz albümü oylayın."
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Icon and Theme selector */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                İkon Seçin
              </label>
              <div className="flex flex-wrap gap-1.5">
                {AVAILABLE_ICONS.map((iconName) => (
                  <button
                    key={iconName}
                    type="button"
                    onClick={() => setSelectedIcon(iconName)}
                    className={`p-2 rounded-xl border transition-all ${
                      selectedIcon === iconName
                        ? 'bg-indigo-600 border-indigo-500 text-white'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <IconHelper name={iconName} className="w-4 h-4" />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Tema Rengi
              </label>
              <div className="flex gap-2">
                {THEME_OPTIONS.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setSelectedTheme(t.id)}
                    className={`w-7 h-7 rounded-full ${t.class} transition-transform ${
                      selectedTheme === t.id ? 'ring-2 ring-white scale-110' : 'opacity-60 hover:opacity-100'
                    }`}
                    title={t.label}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Options Builder */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-300">
                Oylama Seçenekleri (En az 2 seçenek)
              </label>
              <button
                type="button"
                onClick={handleAddOptionField}
                className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium"
              >
                <Plus className="w-3.5 h-3.5" />
                Seçenek Ekle
              </button>
            </div>

            <div className="space-y-2.5">
              {options.map((opt, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl space-y-2"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-400 text-[10px] font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <input
                      type="text"
                      value={opt.title}
                      onChange={(e) => handleOptionChange(idx, 'title', e.target.value)}
                      placeholder={`Seçenek ${idx + 1} Başlığı *`}
                      className="flex-1 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-white text-xs focus:outline-none focus:border-indigo-500"
                    />
                    <input
                      type="text"
                      value={opt.badge}
                      onChange={(e) => handleOptionChange(idx, 'badge', e.target.value)}
                      placeholder="Etiket (Opsiyonel)"
                      className="w-28 px-2 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-white text-xs focus:outline-none focus:border-indigo-500"
                    />
                    {options.length > 2 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveOptionField(idx)}
                        className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    value={opt.description}
                    onChange={(e) => handleOptionChange(idx, 'description', e.target.value)}
                    placeholder="Seçenek hakkında kısa bilgi veya açıklama"
                    className="w-full px-3 py-1 bg-slate-900/60 border border-slate-800/80 rounded-lg text-slate-300 text-[11px] focus:outline-none focus:border-indigo-500"
                  />
                </div>
              ))}
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
              {errorMsg}
            </div>
          )}

          <div className="pt-4 flex items-center justify-end gap-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
            >
              Vazgeç
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/20 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Kategoriyi Yayınla</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
