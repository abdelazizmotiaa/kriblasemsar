import React, { useState } from 'react';
import { X, Phone, Clock, AlertTriangle, ShieldCheck, Copy, Check, Flag } from 'lucide-react';
import { Listing } from '../../types';

interface CallConditionsModalProps {
  listing: Listing;
  isOpen: boolean;
  onClose: () => void;
  onReportSemsar: (listingId: string, reason: string) => void;
}

export const CallConditionsModal: React.FC<CallConditionsModalProps> = ({
  listing,
  isOpen,
  onClose,
  onReportSemsar,
}) => {
  const [hasCertifiedNonSemsar, setHasCertifiedNonSemsar] = useState(false);
  const [copied, setCopied] = useState(false);
  const [reportSuccess, setReportSuccess] = useState(false);
  const [reportReason, setReportReason] = useState('Demande une commission / frais de semsar');

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(listing.user.phone_number);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleReport = () => {
    onReportSemsar(listing.id, reportReason);
    setReportSuccess(true);
    setTimeout(() => {
      setReportSuccess(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-brand-800 to-brand-700 text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
              <Phone className="w-4 h-4 text-emerald-300" />
            </div>
            <div>
              <h3 className="font-bold text-base">Contacter l'annonceur</h3>
              <p className="text-xs text-emerald-200">Conditions d'appel & Anti-Semsar</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white/10 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4">
          
          {/* Poster Call Hours Card */}
          <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-4 text-slate-800">
            <div className="flex items-center gap-2 text-amber-800 font-bold text-sm mb-1">
              <Clock className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Créneaux d'appel autorisés par {listing.user.full_name.split(' ')[0]} :</span>
            </div>
            <p className="text-base font-extrabold text-amber-950 pl-6">
              🕒 {listing.call_conditions_hours}
            </p>
            {listing.call_conditions_note && (
              <p className="text-xs text-amber-800 mt-2 pl-6 italic bg-amber-100/60 p-2 rounded-lg">
                "{listing.call_conditions_note}"
              </p>
            )}
          </div>

          {/* Anti-Semsar Warning & Checkbox */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2">
            <div className="flex items-center gap-2 text-brand-700 font-bold text-xs uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-brand-600" />
              <span>Charte Zéro Semsar</span>
            </div>
            <p className="text-xs text-slate-600">
              KriblaSemsar est strictement réservé aux particuliers (futurs colocataires ou locataires directs). Tout intermédiaire exigeant des honoraires sera banni.
            </p>

            <label className="flex items-start gap-3 mt-3 pt-2 border-t border-slate-200 cursor-pointer">
              <input
                type="checkbox"
                checked={hasCertifiedNonSemsar}
                onChange={(e) => setHasCertifiedNonSemsar(e.target.checked)}
                className="mt-1 w-4 h-4 rounded text-brand-600 focus:ring-brand-500 border-slate-300"
              />
              <span className="text-xs font-semibold text-slate-800">
                Je certifie être un particulier à la recherche d'un logement et non un intermédiaire/semsar.
              </span>
            </label>
          </div>

          {/* Unlocked Number View */}
          {hasCertifiedNonSemsar ? (
            <div className="space-y-3 pt-1 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-center">
                <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wide">
                  Numéro vérifié de l'annonceur :
                </span>
                <p className="text-2xl font-extrabold text-slate-900 tracking-wider my-1">
                  {listing.user.phone_number}
                </p>
                <p className="text-[11px] text-emerald-700 font-medium">
                  Identité vérifiée par KriblaSemsar
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <a
                  href={`tel:${listing.user.phone_number}`}
                  className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 text-sm shadow-md transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  <span>Appeler</span>
                </a>
                <button
                  onClick={handleCopy}
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-3 rounded-xl flex items-center justify-center gap-2 text-sm transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span className="text-emerald-700">Copié !</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copier</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-2 text-xs text-slate-400 font-medium">
              Veuillez cocher la déclaration sur l'honneur pour afficher le numéro de téléphone.
            </div>
          )}

          {/* Report Broker Button */}
          <div className="pt-2 border-t border-slate-100">
            {reportSuccess ? (
              <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium text-center">
                ✅ Signalement enregistré. Notre équipe vérifie cette annonce sous 1h.
              </div>
            ) : (
              <button
                onClick={handleReport}
                className="w-full text-slate-500 hover:text-rose-600 text-xs font-semibold py-1.5 flex items-center justify-center gap-1.5 transition-colors"
              >
                <Flag className="w-3.5 h-3.5" />
                <span>Signaler un Semsar (Demande des honoraires ou commission)</span>
              </button>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
