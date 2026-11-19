/** @jsxImportSource preact */
import { useState } from 'preact/hooks';

interface AudienceItem {
  id: string;
  letter: string;
  text: string;
  matchedServices: string[];
}

interface ServiceMeta {
  id: string;
  shortTitle: string;
  href: string;
}

interface AudienceSelectorProps {
  items: AudienceItem[];
  services: ServiceMeta[];
}

export default function AudienceSelector({ items, services }: AudienceSelectorProps) {
  const [selectedId, setSelectedId] = useState<string>('a');

  const selectedItem = items.find((i) => i.id === selectedId) || items[0];
  const matchedServiceIds = selectedItem ? selectedItem.matchedServices : [];

  return (
    <div class="w-full max-w-5xl mx-auto space-y-8">
      {/* 4 Selectable Cards a-d */}
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((item) => {
          const isSelected = selectedId === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setSelectedId(item.id)}
              aria-pressed={isSelected}
              class={`text-left p-6 rounded-2xl border transition-all duration-200 cursor-pointer ${
                isSelected
                  ? 'bg-blue-50/60 border-[#0073df] ring-2 ring-[#0073df]/20 shadow-md'
                  : 'bg-white border-slate-200 hover:border-blue-200 hover:bg-slate-50/50'
              }`}
            >
              <div class="flex items-start gap-4">
                <span
                  class={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 transition-colors ${
                    isSelected
                      ? 'bg-[#0073df] text-white shadow-sm'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {item.letter.toUpperCase()}
                </span>
                <p class="text-sm sm:text-base text-slate-700 leading-relaxed font-normal">
                  {item.text}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Matching Services Highlight Band */}
      <div class="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-blue-50 via-indigo-50/40 to-blue-50 border border-blue-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div class="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#005bb5]">
          <span class="w-2 h-2 rounded-full bg-[#005bb5] animate-ping" />
          <span>Services</span>
        </div>
        <div class="flex flex-wrap items-center gap-3">
          {services.map((svc) => {
            const isMatched = matchedServiceIds.includes(svc.id);
            return (
              <a
                key={svc.id}
                href={svc.href}
                class={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                  isMatched
                    ? 'bg-[#0073df] text-white shadow-md shadow-blue-500/20 scale-105 ring-2 ring-blue-300'
                    : 'bg-white text-slate-400 border border-slate-200 opacity-60 hover:opacity-100 hover:text-slate-700'
                }`}
              >
                {svc.shortTitle}
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}
