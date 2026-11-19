/** @jsxImportSource preact */
import { useState, useEffect } from 'preact/hooks';

interface NavItem {
  name: string;
  href: string;
  children?: { name: string; href: string }[];
}

interface MobileMenuProps {
  nav: NavItem[];
  currentPath: string;
}

export default function MobileMenu({ nav, currentPath }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const toggle = () => setIsOpen(!isOpen);
  const close = () => setIsOpen(false);

  return (
    <div class="md:hidden">
      <button
        type="button"
        onClick={toggle}
        aria-expanded={isOpen}
        aria-controls="mobile-navigation-drawer"
        aria-label="Toggle navigation menu"
        class="inline-flex items-center justify-center p-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 hover:text-[#0073df] hover:border-blue-200 transition-colors focus-visible:outline-2 focus-visible:outline-[#0073df]"
      >
        {isOpen ? (
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {isOpen && (
        <div class="fixed inset-0 top-[73px] z-50 bg-white/95 backdrop-blur-xl border-t border-slate-200 overflow-y-auto">
          <div class="px-6 py-8 space-y-4 max-w-lg mx-auto">
            {nav.map((item) => {
              if (item.children) {
                return (
                  <div key={item.name} class="border-b border-slate-100 pb-3">
                    <div class="flex items-center justify-between py-2">
                      <a
                        href={item.href}
                        onClick={close}
                        class={`text-base font-bold ${
                          currentPath.startsWith(item.href) ? 'text-[#0073df]' : 'text-slate-800'
                        }`}
                      >
                        {item.name}
                      </a>
                      <button
                        type="button"
                        onClick={() => setServicesOpen(!servicesOpen)}
                        class="p-1 text-slate-500 hover:text-[#0073df]"
                        aria-label="Expand services"
                      >
                        <svg
                          class={`w-5 h-5 transition-transform duration-200 ${servicesOpen ? 'rotate-180' : ''}`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          stroke-width="2"
                        >
                          <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    </div>
                    {servicesOpen && (
                      <div class="pl-4 mt-2 space-y-2 border-l-2 border-blue-200">
                        {item.children.map((child) => (
                          <a
                            key={child.name}
                            href={child.href}
                            onClick={close}
                            class={`block py-1.5 text-sm ${
                              currentPath === child.href ? 'text-[#0073df] font-semibold' : 'text-slate-600'
                            } hover:text-[#0073df]`}
                          >
                            {child.name}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              const isActive = currentPath === item.href || (item.href !== '/' && currentPath.startsWith(item.href));
              return (
                <div key={item.name} class="border-b border-slate-100 pb-3">
                  <a
                    href={item.href}
                    onClick={close}
                    class={`block py-2 text-base font-bold ${
                      isActive ? 'text-[#0073df]' : 'text-slate-800'
                    } hover:text-[#0073df] transition-colors`}
                  >
                    {item.name}
                  </a>
                </div>
              );
            })}

            <div class="pt-4">
              <a
                href="/contact/"
                onClick={close}
                class="block w-full py-3.5 px-6 text-center text-sm font-bold text-white bg-gradient-to-r from-[#0073df] to-[#028ace] rounded-xl shadow-md hover:from-[#005bb5] hover:to-[#0073df] transition-colors"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
