"use client";

import { useApp } from "@/lib/i18n/context";
import { useRouter } from "next/navigation";
import { CohortSelector } from "@/components/onboarding/cohort-selector";
import { EmailStep } from "@/components/onboarding/email-step";

export function OnboardingFlow({ showEmailStep }: { showEmailStep: boolean }) {
  const { t } = useApp();
  const router = useRouter();

  return (
    <>
      <div className="text-center mb-12">
        <h1 className="font-headline font-bold text-4xl tracking-tighter text-white mb-3">
          {t.onboarding.welcome}
        </h1>
        <p className="font-mono text-[14px] tracking-widest text-muted uppercase">
          {showEmailStep ? t.onboarding.emailStepSubtitle : t.onboarding.selectCohort}
        </p>
      </div>
      {showEmailStep ? (
        <EmailStep />
      ) : (
        <CohortSelector onCohortSaved={() => router.refresh()} />
      )}
    </>
  );
}
