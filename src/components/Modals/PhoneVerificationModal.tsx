import React, { useState, useEffect } from 'react';
import {
  X,
  Phone,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  MessageCircle,
  ArrowRight,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { normalizeMoroccanPhone } from '../../services/verification/phoneNormalization';
import { defaultVerificationService } from '../../services/verification/verificationService';
import { VerificationChannel } from '../../services/verification/types';

interface PhoneVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerified: (verifiedPhoneE164: string) => void;
  initialPhone?: string;
}

export const PhoneVerificationModal: React.FC<PhoneVerificationModalProps> = ({
  isOpen,
  onClose,
  onVerified,
  initialPhone = '',
}) => {
  const [step, setStep] = useState<'phone' | 'otp' | 'success'>('phone');
  const [phoneInput, setPhoneInput] = useState(initialPhone || '06');
  const [otpCode, setOtpCode] = useState('');
  const [channel, setChannel] = useState<VerificationChannel>('whatsapp');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Cooldown timer
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (cooldown > 0) {
      timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [cooldown]);

  if (!isOpen) return null;

  const parsed = normalizeMoroccanPhone(phoneInput);

  const handleSendOtp = async (selectedChannel: VerificationChannel = channel) => {
    setLoading(true);
    setErrorMessage(null);

    const res = await defaultVerificationService.requestOtp(phoneInput, selectedChannel);
    setLoading(false);

    if (!res.success) {
      setErrorMessage(res.error || 'Erreur lors de la demande du code.');
      if (res.resendCooldownSeconds > 0) {
        setCooldown(res.resendCooldownSeconds);
      }
      return;
    }

    setChannel(selectedChannel);
    setCooldown(res.resendCooldownSeconds || 60);
    setStep('otp');
  };

  const handleVerifyOtp = async () => {
    if (otpCode.trim().length !== 6) {
      setErrorMessage('Veuillez entrer le code à 6 chiffres reçu.');
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    const res = await defaultVerificationService.verifyOtp(phoneInput, otpCode.trim());
    setLoading(false);

    if (!res.success) {
      setErrorMessage(res.error || 'Code incorrect.');
      return;
    }

    setStep('success');
    setTimeout(() => {
      onVerified(res.phoneE164);
      onClose();
    }, 1600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col">
        
        {/* Header */}
        <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base">Vérification Téléphone Maroc (+212)</h3>
              <p className="text-[10px] text-slate-400 font-medium">Communauté sécurisée • 0% Semsar</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          
          {/* STEP 1: Phone Input */}
          {step === 'phone' && (
            <div className="space-y-4">
              <div className="text-center space-y-1">
                <h4 className="font-extrabold text-slate-900 text-base">Entrez votre numéro de mobile</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Pour contacter un propriétaire ou publier une annonce sans intermédiaire, vérifiez votre possession réelle d'un numéro mobile marocain (+212).
                </p>
                <div className="pt-1">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 border border-slate-200 text-slate-700 text-[11px] font-semibold rounded-full">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Sécurité Zéro-Semsar • Aucun code fictif autorisé</span>
                  </span>
                </div>
              </div>

              {/* Input with Moroccan Flag */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Numéro marocain (commençant par 06 ou 07) :
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-3 flex items-center gap-1.5 pointer-events-none text-xs font-bold text-slate-600 border-r border-slate-200 pr-2">
                    <span className="text-base">🇲🇦</span>
                    <span>+212</span>
                  </div>
                  <input
                    type="tel"
                    value={phoneInput}
                    onChange={(e) => setPhoneInput(e.target.value)}
                    placeholder="06 12 34 56 78"
                    className="w-full bg-slate-50 border border-slate-200 focus:border-brand-500 rounded-2xl pl-24 pr-4 py-3 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all"
                  />
                </div>

                {/* Validation Indicator & Operator Badge */}
                {phoneInput.length >= 8 && (
                  <div className="mt-2 flex items-center justify-between text-xs">
                    {parsed.isValid ? (
                      <span className="text-emerald-600 font-bold flex items-center gap-1 text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Numéro valide ({parsed.operator})
                      </span>
                    ) : (
                      <span className="text-rose-500 font-medium text-[11px]">
                        {parsed.errorFr}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Error Alert */}
              {errorMessage && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Channel Select & Submit */}
              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  disabled={!parsed.isValid || loading}
                  onClick={() => handleSendOtp('whatsapp')}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-extrabold text-xs sm:text-sm py-3 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>{loading ? 'Envoi en cours...' : 'Recevoir le code sur WhatsApp'}</span>
                </button>

                <button
                  type="button"
                  disabled={!parsed.isValid || loading}
                  onClick={() => handleSendOtp('sms')}
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-2 rounded-xl transition-all"
                >
                  Recevoir par SMS classique
                </button>
              </div>

              <p className="text-[10px] text-slate-400 text-center leading-tight">
                🔒 Vos coordonnées ne sont jamais vendues. KriblaSemsar applique la Loi marocaine 09-08 relative à la protection des données personnelles.
              </p>
            </div>
          )}

          {/* STEP 2: OTP Input */}
          {step === 'otp' && (
            <div className="space-y-4">
              <div className="text-center space-y-1">
                <h4 className="font-extrabold text-slate-900 text-base">Entrez le code de sécurité</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Un code à 6 chiffres vous a été envoyé via{' '}
                  <strong className="text-slate-800">{channel === 'whatsapp' ? 'WhatsApp' : 'SMS'}</strong> au{' '}
                  <span className="font-bold text-slate-900">{parsed.nationalFormat || phoneInput}</span>.
                </p>
              </div>


              {/* 6-digit input */}
              <div>
                <input
                  type="text"
                  maxLength={6}
                  value={otpCode}
                  autoFocus
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="------"
                  className="w-full text-center tracking-[0.4em] font-mono text-2xl font-extrabold bg-slate-50 border border-slate-200 focus:border-brand-500 rounded-2xl py-3 focus:outline-none focus:ring-2 focus:ring-brand-500/20 text-slate-900 shadow-inner"
                />
              </div>

              {/* Error Alert */}
              {errorMessage && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Actions */}
              <button
                type="button"
                disabled={otpCode.length !== 6 || loading}
                onClick={handleVerifyOtp}
                className="w-full bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-extrabold text-xs sm:text-sm py-3 rounded-2xl flex items-center justify-center gap-2 shadow-lg transition-all"
              >
                <span>{loading ? 'Vérification...' : 'Confirmer et débloquer les contacts'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Resend Cooldown */}
              <div className="flex items-center justify-between text-xs pt-1">
                <button
                  type="button"
                  onClick={() => setStep('phone')}
                  className="text-slate-500 hover:text-slate-800 underline text-[11px]"
                >
                  Changer de numéro
                </button>

                {cooldown > 0 ? (
                  <span className="text-slate-400 font-medium text-[11px]">
                    Renvoyer dans {cooldown}s
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleSendOtp(channel)}
                    className="text-brand-600 hover:text-brand-700 font-bold flex items-center gap-1 text-[11px]"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Renvoyer le code</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* STEP 3: Success Confirmation */}
          {step === 'success' && (
            <div className="py-6 text-center space-y-3 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-2xl shadow-md">
                <ShieldCheck className="w-10 h-10" />
              </div>
              <h4 className="font-extrabold text-slate-900 text-lg">Numéro vérifié avec succès !</h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Badge « Particulier Vérifié » débloqué. Vous avez désormais un accès direct sans semsar aux propriétaires et colocataires.
              </p>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
