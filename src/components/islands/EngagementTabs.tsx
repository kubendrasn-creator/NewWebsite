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
        <div
          class="inline-flex p-1.5 rounded-2xl bg-[#eef7fd] border border-[#d4e8f7] shadow-inner"
          role="tablist"
          aria-label="Engagement Models"
        >
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
                    ? 'bg-white text-[#0070a8] shadow-md border border-[#d4e8f7]'
                    : 'text-[#003074]/70 hover:text-[#003074]'
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
              class="p-8 sm:p-10 rounded-3xl bg-white border border-[#d4e8f7] shadow-lg shadow-blue-900/5 transition-all duration-300"
            >
              <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#eef7fd] text-[#0070a8] text-xs font-bold uppercase tracking-wider mb-4 border border-[#d4e8f7]">
                <span>Model 0{idx + 1}</span>
              </div>
              <h3 class="text-2xl sm:text-3xl font-extrabold text-[#003074] mb-4">
                {model.name}
              </h3>
              <p class="text-base sm:text-lg text-[#003074]/85 leading-relaxed font-normal">
                {model.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
