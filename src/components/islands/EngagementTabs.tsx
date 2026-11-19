/** @jsxImportSource preact */
import { useState } from 'preact/hooks';

interface ModelItem {
  name: string;
  description: string;
}

interface EngagementTabsProps {
  models: ModelItem[];
}

export default function EngagementTabs({ models }: EngagementTabsProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div class="w-full max-w-4xl mx-auto space-y-8">
      {/* Tab Switcher */}
      <div class="flex items-center justify-center">
        <div class="inline-flex p-1.5 rounded-2xl bg-slate-100 border border-slate-200" role="tablist" aria-label="Engagement Models">
          {models.map((model, idx) => {
            const isActive = activeIndex === idx;
            return (
              <button
                key={model.name}
                type="button"
                role="tab"
                id={`tab-${idx}`}
                aria-selected={isActive}
                aria-controls={`panel-${idx}`}
                onClick={() => setActiveIndex(idx)}
                class={`relative px-6 py-3 rounded-xl text-sm font-bold transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-white text-[#0073df] shadow-sm border border-slate-200/60'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {model.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Panels */}
      <div class="relative min-h-[220px]">
        {models.map((model, idx) => {
          if (activeIndex !== idx) return null;
          return (
            <div
              key={model.name}
              id={`panel-${idx}`}
              role="tabpanel"
              aria-labelledby={`tab-${idx}`}
              class="p-8 sm:p-10 rounded-3xl bg-white border border-slate-200 shadow-sm transition-all duration-300 animate-fadeIn"
            >
              <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-[#005bb5] text-xs font-bold uppercase tracking-wider mb-4 border border-blue-100">
                <span>Model {idx + 1}</span>
              </div>
              <h2 class="text-2xl sm:text-3xl font-extrabold text-[#033275] mb-4">
                {model.name}
              </h2>
              <p class="text-base sm:text-lg text-slate-700 leading-relaxed font-normal">
                {model.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
