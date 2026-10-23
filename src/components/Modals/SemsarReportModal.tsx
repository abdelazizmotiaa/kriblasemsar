// ====================================================================
// SEMSAR & ABUSE REPORT MODAL (Community Protection)
// Platform: https://kriblasemsar.com
// ====================================================================

import React, { useState } from 'react';
import {
  X,
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
  Send,
  HelpCircle
} from 'lucide-react';
import { Listing } from '../../types';

interface SemsarReportModalProps {
  isOpen: boolean;
  listing: Listing | null;
  onClose: () => void;
  onSubmitReport: (listingId: string, reason: string, notes: string) => void;
}

export const SemsarReportModal: React.FC<SemsarReportModalProps> = ({
  isOpen,
  listing,
  onClose,
  onSubmitReport,
}) => {
  const [reason, setReason] = useState<string>('brokerage_commission_requested');
  const [evidenceNotes, setEvidenceNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen || !listing) return null;

  const reasonsList = [
    {
      id: 'brokerage_commission_requested',
      title: 'Frais de courtage ou semsar demandés',
      titleAr: 'طلب عمولة سمسرة أو وسيط',
      icon: '💰'
    },
    {
      id: 'suspected_broker_semsar',
      title: 'Intermédiaire / Semsar suspecté',
      titleAr: 'وسيط عقاري أو سمسار مشتبه به',
      icon: '🕵️'
    },
    {
      id: 'fake_listing',
      title: 'Fausse annonce ou photos non réelles',
      titleAr: 'إعلان وهمي أو صور غير حقيقية',
      icon: '🚫'
    },
    {
      id: 'incorrect_price',
      title: 'Prix réel différent du prix affiché',
      titleAr: 'السعر الحقيقي مختلف عن السعر المعلن',
      icon: '🏷️'
    },
    {
      id: 'property_unavailable',
      title: 'Logement déjà loué ou indisponible',
      titleAr: 'السكن مؤجر بالفعل أو غير متاح',
      icon: '🔒'
    },
    {
      id: 'stolen_photos',
      title: 'Photos volées sur un autre site',
      titleAr: 'صور مسروقة من موقع آخر',
      icon: '📸'
    },
    {
      id: 'harassment',
      title: 'Comportement déplacé ou harcèlement',
      titleAr: 'سلوك غير لائق أو مضايقة',
      icon: '⚠️'
    },
    {
      id: 'other',
      title: 'Autre motif',
      titleAr: 'سبب آخر',
      icon: '📝'
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitReport(listing.id, reason, evidenceNotes);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setEvidenceNotes('');
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col">
        
        {/* Header */}
        <div className="bg-rose-950 text-white px-5 py-4 flex items-center justify-between border-b border-rose-900">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5 text-rose-400" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base">Signaler cette annonce</h3>
              <p className="text-[10px] text-rose-300 font-medium">Protection de la communauté KriblaSemsar</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-rose-900 text-rose-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        {submitted ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-2xl shadow-sm">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="font-extrabold text-slate-900 text-base">Signalement bien reçu !</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
              Notre équipe de modération analyse cette annonce en priorité. Merci de nous aider à garder KriblaSemsar 100% sans intermédiaire.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            
            {/* Listing recap card */}
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center gap-3">
              <img
                src={listing.photos[0]}
                alt={listing.title}
                className="w-12 h-12 rounded-xl object-cover shrink-0"
              />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-slate-900 truncate">{listing.title}</p>
                <p className="text-[11px] text-slate-500 truncate">
                  📍 {listing.neighborhood} ({listing.city}) • {listing.price_amount.toLocaleString('fr-FR')} DH
                </p>
              </div>
            </div>

            {/* Motifs de signalement */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Motif principal du signalement :
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
                {reasonsList.map((r) => {
                  const isSelected = reason === r.id;
                  return (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setReason(r.id)}
                      className={`p-2.5 rounded-xl text-left border text-xs transition-all flex items-start gap-2 ${
                        isSelected
                          ? 'border-rose-500 bg-rose-50/70 ring-2 ring-rose-500/20 text-rose-950 font-bold'
                          : 'border-slate-200 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <span className="text-sm shrink-0">{r.icon}</span>
                      <div className="min-w-0">
                        <p className="leading-tight text-[11px]">{r.title}</p>
                        <p className="text-[9px] text-slate-400 font-normal" dir="rtl">{r.titleAr}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Textarea for details / evidence */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Précisions ou preuves (facultatif mais recommandé) :
              </label>
              <textarea
                rows={3}
                value={evidenceNotes}
                onChange={(e) => setEvidenceNotes(e.target.value)}
                placeholder="Ex : L'annonceur m'a demandé 1 500 DH de frais de semsar par message WhatsApp..."
                className="w-full bg-slate-50 border border-slate-200 focus:border-rose-500 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
              />
            </div>

            {/* Zero fee reminder note */}
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                <strong>Engagement Zéro Semsar :</strong> Si un annonceur vous réclame une commission de courtage, refusez tout paiement et signalez-le immédiatement. Son compte sera banni.
              </span>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 rounded-xl transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Envoyer le signalement</span>
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
