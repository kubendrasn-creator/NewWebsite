/** @jsxImportSource preact */
import { useState } from 'preact/hooks';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    botcheck: '',
  });

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setStatus('error');
      setErrorMessage('Please fill in your name, email, and message.');
      return;
    }

    if (formData.botcheck) {
      // Honeypot tripped: silently simulate success
      setStatus('success');
      return;
    }

    const apiKey = (typeof import.meta !== 'undefined' && import.meta.env?.PUBLIC_WEB3FORMS_KEY) || '';

    // If no API key configured, gracefully open mailto fallback
    if (!apiKey || apiKey === 'YOUR_ACCESS_KEY_HERE') {
      const subject = encodeURIComponent(formData.subject || 'Project Inquiry - Apt Infosoft');
      const body = encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`);
      window.location.href = `mailto:info@aptinfosoft.com?subject=${subject}&body=${body}`;
      setStatus('success');
      return;
    }

    setStatus('submitting');
    setErrorMessage('');

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          access_key: apiKey,
          name: formData.name,
          email: formData.email,
          subject: formData.subject || 'New Website Inquiry',
          message: formData.message,
        }),
      });

      const result = await response.json();
      if (result.success) {
        setStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '', botcheck: '' });
      } else {
        setStatus('error');
        setErrorMessage(result.message || 'Transmission failed. Please reach us directly at info@aptinfosoft.com');
      }
    } catch (err) {
      setStatus('error');
      setErrorMessage('Network error during transmission. Please email us directly at info@aptinfosoft.com');
    }
  };

  if (status === 'success') {
    return (
      <div
        role="alert"
        aria-live="polite"
        class="p-8 sm:p-12 rounded-2xl bg-[#eef7fd] border-2 border-[#0088cc] text-center space-y-4 animate-in fade-in zoom-in-95 duration-300"
      >
        <div class="w-16 h-16 mx-auto rounded-full bg-[#0070a8] text-white flex items-center justify-center shadow-lg shadow-blue-900/20">
          <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 class="text-2xl font-black text-[#003074] tracking-tight">Message Received</h3>
        <p class="text-sm sm:text-base text-[#003074]/80 max-w-md mx-auto leading-relaxed">
          Thank you for reaching out. Our engineering leadership will review your inquiry and connect with you within 24 hours.
        </p>
        <button
          type="button"
          onClick={() => setStatus('idle')}
          class="inline-flex items-center px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-[#0070a8] hover:bg-[#003074] transition-colors"
        >
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} class="space-y-6" novalidate>
      {/* Honeypot field */}
      <input
        type="checkbox"
        name="botcheck"
        class="hidden"
        style={{ display: 'none' }}
        tabIndex={-1}
        autoComplete="off"
        checked={!!formData.botcheck}
        onChange={(e: any) => setFormData({ ...formData, botcheck: e.target.checked ? 'bot' : '' })}
      />

      {status === 'error' && (
        <div role="alert" class="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm font-semibold">
          {errorMessage}
        </div>
      )}

      {/* Floating Label: Name */}
      <div class="relative">
        <input
          type="text"
          id="contact-name"
          name="name"
          required
          value={formData.name}
          onChange={handleChange}
          placeholder=" "
          class="peer w-full px-4 pt-6 pb-2 text-sm text-[#003074] bg-[#f5fafe] border border-[#d4e8f7] rounded-xl focus:bg-white focus:border-[#0070a8] focus:ring-2 focus:ring-[#0070a8]/20 focus:outline-none transition-all"
        />
        <label
          htmlFor="contact-name"
          class="absolute left-4 top-2 text-xs font-bold uppercase tracking-wider text-[#003074]/70 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:normal-case peer-focus:top-2 peer-focus:text-xs peer-focus:uppercase peer-focus:text-[#0070a8]"
        >
          Your Name <span class="text-red-500">*</span>
        </label>
      </div>

      {/* Floating Label: Email */}
      <div class="relative">
        <input
          type="email"
          id="contact-email"
          name="email"
          required
          value={formData.email}
          onChange={handleChange}
          placeholder=" "
          class="peer w-full px-4 pt-6 pb-2 text-sm text-[#003074] bg-[#f5fafe] border border-[#d4e8f7] rounded-xl focus:bg-white focus:border-[#0070a8] focus:ring-2 focus:ring-[#0070a8]/20 focus:outline-none transition-all"
        />
        <label
          htmlFor="contact-email"
          class="absolute left-4 top-2 text-xs font-bold uppercase tracking-wider text-[#003074]/70 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:normal-case peer-focus:top-2 peer-focus:text-xs peer-focus:uppercase peer-focus:text-[#0070a8]"
        >
          Work Email <span class="text-red-500">*</span>
        </label>
      </div>

      {/* Floating Label: Subject */}
      <div class="relative">
        <input
          type="text"
          id="contact-subject"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          placeholder=" "
          class="peer w-full px-4 pt-6 pb-2 text-sm text-[#003074] bg-[#f5fafe] border border-[#d4e8f7] rounded-xl focus:bg-white focus:border-[#0070a8] focus:ring-2 focus:ring-[#0070a8]/20 focus:outline-none transition-all"
        />
        <label
          htmlFor="contact-subject"
          class="absolute left-4 top-2 text-xs font-bold uppercase tracking-wider text-[#003074]/70 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:normal-case peer-focus:top-2 peer-focus:text-xs peer-focus:uppercase peer-focus:text-[#0070a8]"
        >
          Subject
        </label>
      </div>

      {/* Floating Label: Message */}
      <div class="relative">
        <textarea
          id="contact-message"
          name="message"
          rows={4}
          required
          value={formData.message}
          onChange={handleChange}
          placeholder=" "
          class="peer w-full px-4 pt-6 pb-2 text-sm text-[#003074] bg-[#f5fafe] border border-[#d4e8f7] rounded-xl focus:bg-white focus:border-[#0070a8] focus:ring-2 focus:ring-[#0070a8]/20 focus:outline-none transition-all resize-y"
        />
        <label
          htmlFor="contact-message"
          class="absolute left-4 top-2 text-xs font-bold uppercase tracking-wider text-[#003074]/70 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:normal-case peer-focus:top-2 peer-focus:text-xs peer-focus:uppercase peer-focus:text-[#0070a8]"
        >
          Project Details / Message <span class="text-red-500">*</span>
        </label>
      </div>

      <button
        type="submit"
        disabled={status === 'submitting'}
        class="w-full inline-flex items-center justify-center px-8 py-4 rounded-xl text-sm font-bold text-white bg-[#0070a8] hover:bg-[#003074] shadow-md shadow-blue-900/15 transition-all duration-200 cursor-pointer disabled:opacity-50"
      >
        {status === 'submitting' ? (
          <span class="inline-flex items-center gap-2">
            <svg class="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            Transmitting Message...
          </span>
        ) : (
          <span>Send Message</span>
        )}
      </button>
    </form>
  );
}
