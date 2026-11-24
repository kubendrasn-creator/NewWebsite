/** @jsxImportSource preact */
import { useEffect, useState } from 'preact/hooks';

export default function DualTimeClocks() {
  const [mounted, setMounted] = useState(false);
  const [visitorTime, setVisitorTime] = useState('');
  const [visitorTz, setVisitorTz] = useState('Local');
  const [bengaluruTime, setBengaluruTime] = useState('');
  const [srAnnouncement, setSrAnnouncement] = useState('');

  useEffect(() => {
    setMounted(true);
    let userTz = 'UTC';
    try {
      userTz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Local';
    } catch {
      userTz = 'Local';
    }
    const cleanTz = userTz.split('/').pop()?.replace(/_/g, ' ') || 'Local';
    setVisitorTz(cleanTz);

    const updateTimes = () => {
      const now = new Date();
      const timeFmt = new Intl.DateTimeFormat('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      });

      const bFmt = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      });

      setVisitorTime(timeFmt.format(now));
      setBengaluruTime(bFmt.format(now));
    };

    updateTimes();
    const interval = setInterval(updateTimes, 1000);

    const updateSr = () => {
      const now = new Date();
      const srFmt = new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
      const bSrFmt = new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Kolkata', hour: 'numeric', minute: 'numeric', hour12: true });
      setSrAnnouncement(`Visitor local time is ${srFmt.format(now)}. Bengaluru, India time is ${bSrFmt.format(now)}.`);
    };
    updateSr();
    const srInterval = setInterval(updateSr, 60000);

    return () => {
      clearInterval(interval);
      clearInterval(srInterval);
    };
  }, []);

  return (
    <div class="p-6 sm:p-8 rounded-3xl border border-[#d4e8f7] bg-[#eef7fd]/50 shadow-sm relative overflow-hidden mb-6">
      <span class="sr-only" aria-live="polite">{srAnnouncement}</span>
      <div class="flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10" aria-hidden="true">
        {/* Visitor Clock */}
        <div class="text-center sm:text-left space-y-1">
          <p class="text-xs font-bold uppercase tracking-wider text-[#0070a8]">Your Time ({mounted ? visitorTz : 'Local'})</p>
          <p class="text-2xl sm:text-3xl font-black text-[#003074] font-mono tracking-tight tabular-nums">
            {mounted ? visitorTime : '--:--:--'}
          </p>
        </div>

        {/* Animated Route Line */}
        <div class="flex-1 max-w-[200px] w-full px-4 flex flex-col items-center">
          <svg class="w-full h-8 overflow-visible" viewBox="0 0 160 24" fill="none">
            <path d="M 10 12 C 50 2, 110 2, 150 12" stroke="#d4e8f7" stroke-width="2" stroke-dasharray="4 4" />
            <path d="M 10 12 C 50 2, 110 2, 150 12" stroke="#0088cc" stroke-width="2" stroke-dasharray="30 90" class="agile-route" />
            <circle cx="10" cy="12" r="3.5" fill="#0070a8" />
            <circle cx="150" cy="12" r="3.5" fill="#0088cc" />
          </svg>
          <span class="text-[10px] font-bold text-[#0070a8] uppercase tracking-widest mt-1">Global Time Link</span>
        </div>

        {/* Bengaluru Clock */}
        <div class="text-center sm:text-right space-y-1">
          <p class="text-xs font-bold uppercase tracking-wider text-[#0070a8]">Bengaluru, India</p>
          <p class="text-2xl sm:text-3xl font-black text-[#003074] font-mono tracking-tight tabular-nums">
            {mounted ? bengaluruTime : '--:--:--'}
          </p>
        </div>
      </div>
    </div>
  );
}
