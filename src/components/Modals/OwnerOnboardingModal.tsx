// ====================================================================
// KRIBLASEMSAR — OWNER ONBOARDING WORKFLOW MODAL
// Pilot Markets: Benguerir (UM6P) & Casablanca
// ====================================================================

import React, { useState } from 'react';
import {
  X,
  Building2,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  GraduationCap,
  Sparkles,
  PhoneCall,
  FileText
} from 'lucide-react';

interface OwnerOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartPublish: () => void;
  defaultCity?: string;
}

export const OwnerOnboardingModal: React.FC<OwnerOnboardingModalProps> = ({
  isOpen,
  onClose,
  onStartPublish,
  defaultCity = 'Benguerir'
}) => {
  const [targetMarket, setTargetMarket] = useState<'Benguerir' | 'Casablanca'>(
    defaultCity === 'Casablanca' ? 'Casablanca' : 'Benguerir'
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 relative overflow-hidden">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              Programme Bailleurs Partenaires
            </span>
            <span className="text-slate-400 text-xs font-semibold">• Pilote Officiel</span>
          </div>

          <h3 className="text-xl font-extrabold text-white">
            Louez votre bien en direct sans aucun intermédiaire
          </h3>
          <p className="text-xs text-slate-300 mt-1 leading-relaxed">
            Économisez 1 mois de loyer d'honoraires de semsar. Connectez-vous directement à des locataires vérifiés.
          </p>
        </div>

        {/* Market Selector Chips */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-2">
          <span className="text-xs font-bold text-slate-700">Votre marché pilote :</span>
          <div className="flex gap-2">
            <button
              onClick={() => setTargetMarket('Benguerir')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                targetMarket === 'Benguerir'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Benguerir (UM6P)</span>
            </button>
            <button
              onClick={() => setTargetMarket('Casablanca')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                targetMarket === 'Casablanca'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Casablanca</span>
            </button>
          </div>
        </div>

        {/* Value Proposition Steps */}
        <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
          {targetMarket === 'Benguerir' ? (
            <div className="p-3 bg-emerald-50/80 border border-emerald-200 rounded-2xl text-xs text-emerald-900 space-y-1">
              <p className="font-extrabold flex items-center gap-1.5">
                🎓 Spécificité Campus UM6P / Benguerir
              </p>
              <p className="text-[11px] text-emerald-800 leading-relaxed">
                Forte demande d'étudiants, chercheurs, ingénieurs et cadres de l'UM6P et de l'école 1337. Profils sérieux, loyers garantis par les familles ou allocations de recherche.
              </p>
            </div>
          ) : (
            <div className="p-3 bg-blue-50/80 border border-blue-200 rounded-2xl text-xs text-blue-900 space-y-1">
              <p className="font-extrabold flex items-center gap-1.5">
                🏢 Spécificité Grand Casablanca
              </p>
              <p className="text-[11px] text-blue-800 leading-relaxed">
                Quartiers prioritaires : Maârif, Gauthier, Bourgogne, Racine, CFC, Sidi Maârouf. Forte demande de jeunes actifs en colocation studieuse ou appartements meublés.
              </p>
            </div>
          )}

          {/* 3 Step Onboarding Journey */}
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="w-7 h-7 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                1
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-slate-900">Vérification de votre statut bailleur</h4>
                <p className="text-[11px] text-slate-500">
                  Numéro marocain actif (+212) et signature de la charte de zéro commission pour protéger votre annonce.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="w-7 h-7 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                2
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-slate-900">Publication assistée avec photos WebP</h4>
                <p className="text-[11px] text-slate-500">
                  Ajoutez vos photos avec géolocalisation floutée (150m) pour préserver l'adresse exacte de votre logement.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="w-7 h-7 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                3
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-slate-900">Contacts filtrés selon vos créneaux d'appel</h4>
                <p className="text-[11px] text-slate-500">
                  Définissez vos horaires de contact (ex: 18h30 - 21h00). Aucune nuisance d'agences ou d'intermédiaires.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900"
          >
            Fermer
          </button>
          <button
            onClick={() => {
              onClose();
              onStartPublish();
            }}
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm py-3 px-4 rounded-2xl shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all"
          >
            <span>Déposer mon annonce bailleur</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
