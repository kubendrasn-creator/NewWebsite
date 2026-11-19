/** @jsxImportSource preact */
import { useState, useEffect, useRef } from 'preact/hooks';
import type { ServiceDetail } from '../../content/site';

interface ServiceDetailModalProps {
  services: ServiceDetail[];
}

export default function ServiceDetailModal({ services }: ServiceDetailModalProps) {
  const [selectedService, setSelectedService] = useState<ServiceDetail | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const openService = (service: ServiceDetail) => {
    if (typeof document !== 'undefined' && 'startViewTransition' in document) {
      (document as any).startViewTransition(() => {
        setSelectedService(service);
      });
    } else {
      setSelectedService(service);
    }
  };

  const closeService = () => {
    if (typeof document !== 'undefined' && 'startViewTransition' in document) {
      (document as any).startViewTransition(() => {
        setSelectedService(null);
      });
    } else {
      setSelectedService(null);
    }
  };

  // Listen to custom event from desktop stacked card deck
  useEffect(() => {
    const handleDesktopOpen = (e: CustomEvent<{ id: string }>) => {
      const found = services.find((s) => s.id === e.detail.id);
      if (found) {
        openService(found);
      }
    };

    window.addEventListener('open-service-modal' as any, handleDesktopOpen);
    return () => window.removeEventListener('open-service-modal' as any, handleDesktopOpen);
  }, [services]);

  // Keyboard navigation: Escape key closes modal & focus trapping
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedService) {
        closeService();
      }
    };

    if (selectedService) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
      setTimeout(() => {
        closeButtonRef.current?.focus();
      }, 50);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedService]);

  return (
    <>
      {/* Mobile / Tablet cards */}
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        {services.map((svc) => (
          <div
            key={svc.id}
            data-cursor="view"
            onClick={() => openService(svc)}
            class="bento-conic-border group p-8 rounded-2xl flex flex-col justify-between cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-900/5 focus-within:ring-2 focus-within:ring-[#0070a8]"
          >
            <div>
              <div class="flex items-center justify-between mb-4">
                <span class="text-xs font-black tracking-widest text-[#0070a8] uppercase">
                  {svc.number}
                </span>
                <span class="inline-flex items-center px-3 py-1 rounded-full bg-[#eef7fd] text-[#0070a8] text-xs font-bold uppercase tracking-wider border border-[#d4e8f7]">
                  Practice Area
                </span>
              </div>

              <h3
                id={`service-card-title-${svc.id}`}
                class="text-xl sm:text-2xl font-black text-[#003074] mb-2 group-hover:text-[#0088cc] transition-colors"
              >
                {svc.title}
              </h3>

              <p class="text-xs font-bold uppercase tracking-wider text-[#0070a8] mb-3">
                {svc.tagline}
              </p>

              <p class="text-sm text-[#003074]/80 leading-relaxed font-normal line-clamp-3 mb-6">
                {svc.summary}
              </p>
            </div>

            <div class="pt-4 border-t border-[#d4e8f7] flex items-center justify-between">
              <button
                type="button"
                aria-haspopup="dialog"
                aria-label={`Explore capability: ${svc.title}`}
                onClick={(e) => {
                  e.stopPropagation();
                  openService(svc);
                }}
                class="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#0070a8] group-hover:text-[#003074] transition-colors cursor-pointer focus:outline-none"
              >
                <span>Explore Capability</span>
                <span class="transform group-hover:translate-x-1.5 transition-transform duration-200" aria-hidden="true">
                  →
                </span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Accessible Detail Modal */}
      {selectedService && (
        <div
          class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#003074]/50 backdrop-blur-sm animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
          aria-labelledby="service-modal-title"
          onClick={closeService}
        >
          <div
            ref={modalRef}
            class="relative w-full max-w-2xl bg-white rounded-3xl p-8 sm:p-10 shadow-2xl border-2 border-[#0088cc] space-y-6 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
            style={{ viewTransitionName: 'service-card-panel' }}
          >
            {/* Modal Header */}
            <div class="flex items-start justify-between gap-4">
              <div class="space-y-1">
                <span class="text-xs font-black tracking-widest text-[#0088cc] uppercase">
                  Service {selectedService.number}
                </span>
                <h3 id="service-modal-title" class="text-2xl sm:text-3xl font-black text-[#003074]">
                  {selectedService.title}
                </h3>
                <p class="text-xs sm:text-sm font-bold text-[#0070a8] uppercase tracking-wider">
                  {selectedService.tagline}
                </p>
              </div>

              <button
                ref={closeButtonRef}
                type="button"
                onClick={closeService}
                aria-label="Close dialog"
                class="p-2 rounded-xl text-[#003074] hover:bg-[#eef7fd] hover:text-[#0088cc] transition-colors focus:ring-2 focus:ring-[#0070a8] cursor-pointer"
              >
                <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div class="space-y-4 text-sm sm:text-base text-[#003074]/90 leading-relaxed font-normal">
              <p>{selectedService.summary}</p>
              <p>{selectedService.fullDescription}</p>

              {selectedService.bulletPoints && selectedService.bulletPoints.length > 0 && (
                <div class="p-6 rounded-2xl bg-[#eef7fd] border border-[#d4e8f7] space-y-3">
                  <span class="text-xs font-bold uppercase tracking-wider text-[#0070a8]">
                    Key Capabilities &amp; Advantages
                  </span>
                  <ul class="space-y-2">
                    {selectedService.bulletPoints.map((pt, i) => (
                      <li key={i} class="flex items-start gap-2.5 text-xs sm:text-sm text-[#003074] font-medium">
                        <span class="w-2 h-2 rounded-full bg-[#0088cc] mt-1.5 shrink-0" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Modal Footer CTA */}
            <div class="pt-4 border-t border-[#d4e8f7] flex items-center justify-between">
              <a
                href="#contact"
                onClick={closeService}
                class="inline-flex items-center justify-center px-6 py-3 rounded-xl text-xs sm:text-sm font-bold text-white bg-[#0070a8] hover:bg-[#003074] transition-colors shadow-md shadow-blue-900/10"
              >
                Inquire About This Service
              </a>
              <button
                type="button"
                onClick={closeService}
                class="px-5 py-3 rounded-xl text-xs sm:text-sm font-bold text-[#003074] hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
