"use client";

import { Footer } from "@/components/layout/footer";
import { SignInButton } from "@/components/auth/sign-in-button";
import { useApp } from "@/lib/i18n/context";

export default function LandingPage() {
  const { locale, setLocale, t } = useApp();

  return (
    <div className="bg-black-absolute text-primary min-h-screen flex flex-col">
      {/* TopNavBar */}
      <nav className="fixed top-0 right-0 left-0 h-14 bg-black-absolute flex justify-between items-center px-6 z-50 border-b border-outline-variant">
        <div className="flex items-center gap-8">
          <span className="font-mono font-black text-sm tracking-widest text-primary">
            {t.brand}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex">
            <button
              type="button"
              onClick={() => setLocale("en")}
              className={`font-mono text-[14px] tracking-wider px-3 py-1 border transition-all cursor-pointer ${
                locale === "en"
                  ? "bg-primary text-on-primary border-primary"
                  : "border-outline-variant text-secondary hover:text-primary"
              }`}
            >
              English
            </button>
            <button
              type="button"
              onClick={() => setLocale("ja")}
              className={`font-mono text-[14px] tracking-wider px-3 py-1 border-y border-r transition-all cursor-pointer ${
                locale === "ja"
                  ? "bg-primary text-on-primary border-primary"
                  : "border-outline-variant text-secondary hover:text-primary"
              }`}
            >
              日本語
            </button>
          </div>
          <SignInButton variant="link" />
        </div>
      </nav>

      <main className="pt-14 flex-1">
        {/* Hero */}
        <section className="relative min-h-[716px] flex flex-col items-center justify-center text-center px-6 py-24 overflow-hidden">
          <div className="absolute inset-0 data-matrix-grid opacity-20 pointer-events-none" />
          <div className="relative z-10 max-w-4xl">
            <h1 className="font-headline text-5xl md:text-7xl font-bold tracking-tighter mb-6 leading-none whitespace-pre-line">
              {t.landing.headline}
            </h1>
            <p className="text-subtle text-lg md:text-xl font-body max-w-2xl mx-auto mb-10">
              {t.landing.subheadline}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <SignInButton variant="primary" />
            </div>
          </div>
        </section>

        <div className="w-full h-px bg-outline-variant opacity-50" />

        {/* How It Works */}
        <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-0">
            {[
              { num: "01", title: t.landing.step1Title, desc: t.landing.step1Desc },
              { num: "02", title: t.landing.step2Title, desc: t.landing.step2Desc },
              { num: "03", title: t.landing.step3Title, desc: t.landing.step3Desc },
            ].map((step, i) => (
              <div
                key={step.num}
                className={`md:px-8 ${i > 0 ? "border-l border-outline-variant" : ""}`}
              >
                <span className="font-mono text-4xl font-light text-primary mb-6 block opacity-50">
                  {step.num}
                </span>
                <h3 className="font-mono text-xs tracking-widest uppercase mb-4 text-primary">
                  {step.title}
                </h3>
                <p className="text-secondary text-sm leading-relaxed font-body">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section className="px-6 md:px-12 pb-24 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 border border-outline-variant">
            {[
              { icon: "rate_review", title: t.landing.feat1Title, desc: t.landing.feat1Desc },
              { icon: "videocam", title: t.landing.feat2Title, desc: t.landing.feat2Desc },
              { icon: "group", title: t.landing.feat3Title, desc: t.landing.feat3Desc },
              { icon: "smart_toy", title: t.landing.feat4Title, desc: t.landing.feat4Desc },
            ].map((feature, i) => (
              <div
                key={feature.title}
                className={`p-12 flex flex-col justify-between min-h-[250px] hover:bg-surface-lowest transition-colors group ${
                  i < 2 ? "border-b border-outline-variant" : ""
                } ${i % 2 === 0 ? "md:border-r border-outline-variant" : ""}`}
              >
                <div>
                  <span className="material-symbols-outlined text-primary mb-6 block">
                    {feature.icon}
                  </span>
                  <h4 className="font-mono text-sm tracking-widest uppercase mb-4">
                    {feature.title}
                  </h4>
                  <p className="text-secondary text-sm font-body max-w-xs">
                    {feature.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="w-full h-px bg-outline-variant opacity-50" />

        {/* Access + Security */}
        <section className="py-24 px-6 md:px-12 max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <div>
              <h3 className="font-mono text-xs tracking-widest uppercase mb-6 text-primary flex items-center gap-3">
                <span className="material-symbols-outlined text-sm">lock</span>
                {t.landing.accessTitle}
              </h3>
              <p className="text-secondary text-sm leading-relaxed font-body">
                {t.landing.accessDesc}
              </p>
            </div>
            <div>
              <h3 className="font-mono text-xs tracking-widest uppercase mb-6 text-primary flex items-center gap-3">
                <span className="material-symbols-outlined text-sm">security</span>
                {t.landing.securityTitle}
              </h3>
              <p className="text-secondary text-sm leading-relaxed font-body">
                {t.landing.securityDesc}
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
