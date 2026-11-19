/** @jsxImportSource preact */
import { useState } from 'preact/hooks';

export interface TabModel {
  id: string;
  name: string;
  shortDescription: string;
  fullDescription: string;
}

interface TabsProps {
  models: TabModel[];
}

export default function Tabs({ models }: TabsProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!models || models.length === 0) return null;

  return (
    <div class="w-full space-y-6">
      {/* Morphing Tab Pill Switcher */}
      <div class="flex items-center justify-start">
        <div
          class="relative inline-flex p-1.5 rounded-2xl bg-[#eef7fd] border border-[#d4e8f7]"
          role="tablist"
          aria-label="Engagement Models"
        >
          {models.map((model, idx) => {
            const isActive = activeIndex === idx;
            return (
              <button
                key={model.id}
                type="button"
                role="tab"
                id={`tab-btn-${model.id}`}
                aria-selected={isActive}
                aria-controls={`tab-panel-${model.id}`}
                onClick={() => setActiveIndex(idx)}
                class={`relative z-10 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'text-white bg-[#0070a8] shadow-sm'
                    : 'text-[#003074] hover:text-[#0070a8] hover:bg-white/50'
                }`}
              >
                {model.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Panels */}
      <div class="relative">
        {models.map((model, idx) => {
          if (activeIndex !== idx) return null;
          return (
            <div
              key={model.id}
              id={`tab-panel-${model.id}`}
              role="tabpanel"
              aria-labelledby={`tab-btn-${model.id}`}
              class="p-6 sm:p-8 rounded-2xl bg-white border border-[#d4e8f7] shadow-sm space-y-4 animate-in fade-in zoom-in-95 duration-200"
            >
              <div class="flex items-center gap-3">
                <span class="px-3 py-1 rounded-full bg-[#eef7fd] text-[#0070a8] text-xs font-bold uppercase tracking-wider border border-[#d4e8f7]">
                  Engagement Framework
                </span>
                <h4 class="text-xl sm:text-2xl font-black text-[#003074]">{model.name}</h4>
              </div>
              <p class="text-sm sm:text-base text-[#003074]/90 leading-relaxed font-normal">
                {model.fullDescription}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
