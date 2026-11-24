/** @jsxImportSource preact */
import { useEffect, useRef, useState } from 'preact/hooks';

interface PaletteItem {
  id: string;
  title: string;
  category: 'Navigation' | 'Actions';
  action: () => void;
  shortcut?: string;
}

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const lastActiveElement = useRef<HTMLElement | null>(null);

  const baseUrl = '/NewWebsite';

  const navigate = (path: string) => {
    setIsOpen(false);
    window.location.href = `${baseUrl}${path}`;
  };

  const copyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    const toast = document.getElementById('a11y-toast');
    if (toast) {
      toast.textContent = `Copied ${label} to clipboard`;
      setTimeout(() => {
        if (toast.textContent?.includes(label)) toast.textContent = '';
      }, 3000);
    }
    setIsOpen(false);
  };

  const items: PaletteItem[] = [
    { id: 'nav-home', title: 'Home', category: 'Navigation', action: () => navigate('/') },
    { id: 'nav-services', title: 'Practice Areas & Services', category: 'Navigation', action: () => navigate('/services/') },
    { id: 'nav-why-apt', title: 'Why Apt', category: 'Navigation', action: () => navigate('/why-apt/') },
    { id: 'nav-about', title: 'About Us', category: 'Navigation', action: () => navigate('/about/') },
    { id: 'nav-careers', title: 'Careers', category: 'Navigation', action: () => navigate('/careers/') },
    { id: 'nav-contact', title: 'Contact Us', category: 'Navigation', action: () => navigate('/contact/') },
    { id: 'act-copy-email', title: 'Copy email', category: 'Actions', action: () => copyText('info@aptinfosoft.com', 'email (info@aptinfosoft.com)') },
    { id: 'act-copy-sales', title: 'Copy sales email', category: 'Actions', action: () => copyText('sales@aptinfosoft.com', 'sales email (sales@aptinfosoft.com)') },
    { id: 'act-copy-phone-us', title: 'Copy phone (US)', category: 'Actions', action: () => copyText('+1-678-389-2238', 'US phone (+1-678-389-2238)') },
    { id: 'act-copy-phone-in', title: 'Copy phone (India)', category: 'Actions', action: () => copyText('+91-9902999224', 'India phone (+91-9902999224)') },
    { id: 'act-contact', title: 'Contact us', category: 'Actions', action: () => navigate('/contact/') },
  ];

  const filteredItems = items.filter((item) =>
    item.title.toLowerCase().includes(query.trim().toLowerCase())
  );

  const openPalette = () => {
    lastActiveElement.current = document.activeElement as HTMLElement | null;
    setIsOpen(true);
    setQuery('');
    setSelectedIndex(0);
  };

  const closePalette = () => {
    setIsOpen(false);
    if (lastActiveElement.current) {
      lastActiveElement.current.focus();
    }
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) closePalette();
        else openPalette();
      } else if (e.key === 'Escape' && isOpen) {
        e.preventDefault();
        closePalette();
      }
    };

    window.addEventListener('keydown', onKeyDown);

    // Global trigger for header search button
    const onCustomOpen = () => openPalette();
    window.addEventListener('apt:open-command-palette', onCustomOpen);

    // Astro ClientRouter safety: close on page navigation
    document.addEventListener('astro:before-swap', closePalette);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('apt:open-command-palette', onCustomOpen);
      document.removeEventListener('astro:before-swap', closePalette);
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const handleInputKeyDown = (e: any) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredItems.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % Math.max(1, filteredItems.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        filteredItems[selectedIndex].action();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div
      class="fixed inset-0 z-[10000] bg-[#003074]/40 backdrop-blur-sm flex items-start justify-center p-4 sm:p-6 pt-20 sm:pt-28"
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
      onClick={(e) => { if (e.target === e.currentTarget) closePalette(); }}
    >
      <div class="w-full max-w-xl rounded-2xl bg-white border border-[#d4e8f7] shadow-2xl overflow-hidden flex flex-col">
        {/* Search Input Box */}
        <div class="flex items-center px-4 py-3.5 border-b border-[#d4e8f7]">
          <svg class="w-5 h-5 text-[#0070a8] mr-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            role="combobox"
            aria-autocomplete="list"
            aria-expanded="true"
            aria-controls="palette-results-list"
            aria-activedescendant={filteredItems[selectedIndex]?.id}
            placeholder="Search routes or actions (e.g. Services, Copy email)..."
            value={query}
            onInput={(e: any) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleInputKeyDown}
            class="w-full bg-transparent text-sm sm:text-base font-semibold text-[#003074] placeholder-[#0070a8]/60 focus:outline-none"
          />
          <kbd class="hidden sm:inline-block px-2 py-0.5 text-[10px] font-bold text-[#0070a8] bg-[#eef7fd] rounded border border-[#d4e8f7]">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <ul
          id="palette-results-list"
          role="listbox"
          aria-label="Commands and navigation"
          class="max-h-72 overflow-y-auto p-2 space-y-1 focus:outline-none"
        >
          {filteredItems.length === 0 ? (
            <li class="p-4 text-center text-xs text-[#003074]/70">No matching commands found.</li>
          ) : (
            filteredItems.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <li
                  id={item.id}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => item.action()}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  class={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold cursor-pointer transition-colors ${
                    isSelected ? 'bg-[#0070a8] text-white' : 'text-[#003074] hover:bg-[#eef7fd]'
                  }`}
                >
                  <div class="flex items-center gap-2.5">
                    <span class={`text-[10px] px-2 py-0.5 rounded uppercase tracking-wider font-extrabold ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-[#eef7fd] text-[#0070a8]'
                    }`}>
                      {item.category}
                    </span>
                    <span>{item.title}</span>
                  </div>
                  <span class={`text-xs ${isSelected ? 'text-white' : 'text-[#0070a8]'}`}>↵</span>
                </li>
              );
            })
          )}
        </ul>

        {/* Helper Footer */}
        <div class="px-4 py-2.5 bg-[#eef7fd]/50 border-t border-[#d4e8f7] flex items-center justify-between text-[11px] font-medium text-[#0070a8]">
          <span>Navigate with ↑↓, select with Enter</span>
          <span class="sr-only" aria-live="polite">{filteredItems.length} options available</span>
          <span>Apt Infosoft Command Menu</span>
        </div>
      </div>
    </div>
  );
}
