import React, { useState } from 'react';
import {
  X,
  Phone,
  Clock,
  ShieldCheck,
  Copy,
  Check,
  Flag,
  MessageCircle,
  AlertCircle,
  Smartphone,
  Lock,
} from 'lucide-react';
import { Listing } from '../../types';
import {
  revealContactInfo,
  buildWhatsAppMessage,
  buildWhatsAppUrl,
  UserSessionState,
} from '../../services/contact/contactService';

interface CallConditionsModalProps {
  listing: Listing;
  isOpen: boolean;
  onClose: () => void;
  userSession: UserSessionState;
  onRequestPhoneVerification: () => void;
  onOpenReportModal: (listingId: string) => void;
  preferredLanguage?: 'fr' | 'ar';
}

export const CallConditionsModal: React.FC<CallConditionsModalProps> = ({
  listing,
  isOpen,
  onClose,
  userSession,
  onRequestPhoneVerification,
  onOpenReportModal,
  preferredLanguage = 'fr',
}) => {
  const [hasCertifiedNonSemsar, setHasCertifiedNonSemsar] = useState(false);
  const [revealedPhone, setRevealedPhone] = useState<string | null>(null);
  const [isRevealing, setIsRevealing] = useState(false);
  const [revealError, setRevealError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleReveal = async () => {
    if (!hasCertifiedNonSemsar) return;

    if (!userSession.isPhoneVerified) {
      onRequestPhoneVerification();
      return;
    }

    setIsRevealing(true);
    setRevealError(null);

    const res = await revealContactInfo(
      listing.id,
      'phone_call',
      userSession,
      listing.user.phone_number
    );

    setIsRevealing(false);

    if (res.success && res.phoneNumber) {
      setRevealedPhone(res.phoneNumber);
    } else {
      setRevealError(res.error || 'Impossible d\'accéder au numéro.');
    }
  };

  const handleCopy = () => {
    if (revealedPhone) {
      navigator.clipboard.writeText(revealedPhone);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const whatsappMessage = buildWhatsAppMessage(
    listing.city,
    listing.neighborhood,
    listing.title,
    preferredLanguage
  );

  const whatsappUrl = revealedPhone
    ? buildWhatsAppUrl(revealedPhone, whatsappMessage)
    : undefined;

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
              <p className="text-xs text-emerald-200">Conditions d'appel & Confidentialité</p>
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
        <div className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Poster Call Hours Card */}
          <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-4 text-slate-800">
            <div className="flex items-center gap-2 text-amber-800 font-bold text-sm mb-1">
              <Clock className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Créneaux d'appel indiqués par {listing.user.full_name.split(' ')[0]} :</span>
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
              <span>Charte Zéro Semsar & 0% Commission</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              KriblaSemsar est strictement réservé aux particuliers (locataires directs ou colocataires). Tout courtier ou intermédiaire exigeant des frais sera immédiatement exclu.
            </p>

            <label className="flex items-start gap-3 mt-3 pt-2 border-t border-slate-200 cursor-pointer">
              <input
                type="checkbox"
                checked={hasCertifiedNonSemsar}
                onChange={(e) => {
                  setHasCertifiedNonSemsar(e.target.checked);
                  if (e.target.checked && userSession.isPhoneVerified && !revealedPhone) {
                    handleReveal();
                  }
                }}
                className="mt-1 w-4 h-4 rounded text-brand-600 focus:ring-brand-500 border-slate-300"
              />
              <span className="text-xs font-semibold text-slate-800">
                Je certifie être un particulier à la recherche d'un logement et non un intermédiaire/semsar.
              </span>
            </label>
          </div>

          {/* Verification Requirement Banner if user has not verified their phone */}
          {!userSession.isPhoneVerified && hasCertifiedNonSemsar && (
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 space-y-2 text-blue-900">
              <div className="flex items-center gap-2 font-bold text-xs text-blue-800">
                <Smartphone className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Vérification téléphonique obligatoire (+212)</span>
              </div>
              <p className="text-xs text-blue-800/90 leading-relaxed">
                Pour empêcher le démarchage agressif et les faux comptes semsars, un numéro marocain vérifié par SMS/WhatsApp est requis pour voir les coordonnées.
              </p>
              <button
                type="button"
                onClick={onRequestPhoneVerification}
                className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Vérifier mon numéro en 30 secondes</span>
              </button>
            </div>
          )}

          {revealError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{revealError}</span>
            </div>
          )}

          {/* Unlocked Number View */}
          {revealedPhone ? (
            <div className="space-y-3 pt-1 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-center">
                <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wide">
                  Coordonnées vérifiées de l'annonceur :
                </span>
                <p className="text-2xl font-extrabold text-slate-900 tracking-wider my-1">
                  {revealedPhone}
                </p>
                <p className="text-[11px] text-emerald-700 font-medium flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Annonce vérifiée sans commission d'intermédiaire</span>
                </p>
              </div>

              {/* Action Buttons: Phone call & WhatsApp direct */}
              <div className="grid grid-cols-2 gap-2">
                <a
                  href={`tel:${revealedPhone}`}
                  className="bg-brand-600 hover:bg-brand-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 text-sm shadow-md transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  <span>Appeler</span>
                </a>

                {whatsappUrl && (
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 text-sm shadow-md transition-colors"
                  >
                    <MessageCircle className="w-4 h-4 fill-white" />
                    <span>WhatsApp</span>
                  </a>
                )}
              </div>

              {/* Copy button */}
              <button
                type="button"
                onClick={handleCopy}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 text-xs transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span className="text-emerald-700">Numéro copié dans le presse-papier !</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-500" />
                    <span>Copier le numéro de téléphone</span>
                  </>
                )}
              </button>

              <p className="text-[10px] text-slate-400 text-center italic">
                Note de transparence : l'ouverture de WhatsApp partage votre numéro avec l'annonceur pour initier l'échange.
              </p>
            </div>
          ) : (
            userSession.isPhoneVerified && hasCertifiedNonSemsar && (
              <button
                type="button"
                onClick={handleReveal}
                disabled={isRevealing}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 text-sm shadow-md transition"
              >
                <Lock className="w-4 h-4" />
                <span>{isRevealing ? 'Déverrouillage...' : 'Afficher les coordonnées'}</span>
              </button>
            )
          )}

          {/* Report Broker Button */}
          <div className="pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenReportModal(listing.id);
              }}
              className="w-full text-slate-500 hover:text-rose-600 text-xs font-semibold py-1.5 flex items-center justify-center gap-1.5 transition-colors"
            >
              <Flag className="w-3.5 h-3.5 text-rose-500" />
              <span>Signaler un intermédiaire ou une commission demandée</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
