import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone, Sparkles } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

export const PwaInstallBanner: React.FC = () => {
  const { t, language } = useLanguage();
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if dismissed previously within 7 days
    const dismissedAt = localStorage.getItem('kriblasemsar_pwa_dismissed');
    if (dismissedAt && Date.now() - Number(dismissedAt) < 7 * 24 * 60 * 60 * 1000) {
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      console.log('[PWA] User accepted the installation');
    }
    setDeferredPrompt(null);
    setIsVisible(false);
  };

  const handleDismiss = () => {
    setIsVisible(false);
    try {
      localStorage.setItem('kriblasemsar_pwa_dismissed', Date.now().toString());
    } catch {}
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-20 sm:bottom-4 left-4 right-4 sm:left-auto sm:right-4 z-40 sm:max-w-md bg-slate-900 text-white rounded-2xl p-4 shadow-2xl border border-slate-700 animate-in slide-in-from-bottom-4 duration-300">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-xs sm:text-sm flex items-center gap-1.5">
              <span>{t('pwa_install_btn')}</span>
              <span className="bg-emerald-500 text-slate-950 text-[9px] font-black px-1.5 py-0.2 rounded-full uppercase">
                Gratuit
              </span>
            </h4>
            <p className="text-[11px] text-slate-300 mt-0.5 leading-tight">
              {t('pwa_install_desc')}
            </p>
          </div>
        </div>

        <button
          onClick={handleDismiss}
          className="text-slate-400 hover:text-white p-1 rounded-full transition"
          title="Fermer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="mt-3 flex items-center gap-2">
        <button
          onClick={handleInstall}
          className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md transition active:scale-95"
        >
          <Download className="w-3.5 h-3.5" />
          <span>{language === 'ar' ? 'تثبيت الآن' : 'Installer sur mon téléphone'}</span>
        </button>

        <button
          onClick={handleDismiss}
          className="px-3 py-2 text-slate-400 hover:text-slate-200 text-xs font-semibold"
        >
          Plus tard
        </button>
      </div>
    </div>
  );
};
