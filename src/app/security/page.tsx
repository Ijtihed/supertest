"use client";

import { useApp } from "@/lib/i18n/context";
import { Footer } from "@/components/layout/footer";
import Link from "next/link";

export default function SecurityPage() {
  const { locale, setLocale, t } = useApp();

  return (
    <div className="bg-black-absolute text-primary min-h-screen flex flex-col">
      <nav className="fixed top-0 right-0 left-0 h-14 bg-black-absolute flex justify-between items-center px-6 z-50 border-b border-outline-variant">
        <Link href="/" className="font-mono font-black text-sm tracking-widest text-primary">
          {t.brand}
        </Link>
        <div className="flex items-center gap-4">
          <div className="flex">
            <button
              type="button"
              onClick={() => setLocale("en")}
              className={`font-mono text-[14px] tracking-wider px-3 py-1 border transition-all cursor-pointer ${
                locale === "en" ? "bg-primary text-on-primary border-primary" : "border-outline-variant text-secondary hover:text-primary"
              }`}
            >
              English
            </button>
            <button
              type="button"
              onClick={() => setLocale("ja")}
              className={`font-mono text-[14px] tracking-wider px-3 py-1 border-y border-r transition-all cursor-pointer ${
                locale === "ja" ? "bg-primary text-on-primary border-primary" : "border-outline-variant text-secondary hover:text-primary"
              }`}
            >
              日本語
            </button>
          </div>
        </div>
      </nav>

      <main className="pt-14 flex-1 px-6 md:px-12 py-24 max-w-4xl mx-auto w-full">
        <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tighter mb-4">
          {locale === "ja" ? "セキュリティ＆プライバシー" : "Security & Privacy"}
        </h1>
        <p className="font-mono text-[14px] text-muted tracking-widest mb-16">
          {locale === "ja" ? "このプラットフォームの構築方法と保護方法" : "How this platform was built and how it's protected"}
        </p>

        <div className="space-y-16">
          {/* Overview */}
          <section>
            <h2 className="font-mono text-xs tracking-widest uppercase text-primary mb-6 flex items-center gap-3">
              <span className="w-8 h-px bg-outline-variant" />
              {locale === "ja" ? "概要" : "Overview"}
            </h2>
            <p className="font-body text-secondary leading-relaxed text-lg">
              {locale === "ja"
                ? "Supertestは、Supercell AI Labバッチのために一人の開発者がサイドプロジェクトとして構築しました。セキュリティのベストプラクティスに従っていますが、専門のセキュリティチームによる監査は受けていません。以下はその仕組みの正直な説明です。"
                : "Supertest was built by one developer as a side project for the Supercell AI Lab batch. It follows security best practices but has not been audited by a dedicated security team. Here's an honest breakdown of how it works."}
            </p>
          </section>

          {/* Auth */}
          <section>
            <h2 className="font-mono text-xs tracking-widest uppercase text-primary mb-6 flex items-center gap-3">
              <span className="w-8 h-px bg-outline-variant" />
              {locale === "ja" ? "認証" : "Authentication"}
            </h2>
            <div className="space-y-4 font-body text-secondary leading-relaxed">
              <p>
                {locale === "ja"
                  ? "Google OAuthをSupabase Auth経由で使用。パスワードは保存されません。セッショントークンはHTTPOnly cookieで管理され、Supabaseが自動的にリフレッシュします。"
                  : "Google OAuth via Supabase Auth. No passwords are stored. Session tokens are managed as HTTP-only cookies and automatically refreshed by Supabase."}
              </p>
              <p>
                {locale === "ja"
                  ? "アカウントアクセスには管理者の承認が必要です。サインアップ後、ステータスが「承認済み」になるまでプラットフォームにアクセスできません。"
                  : "Account access requires admin approval. After signup, you cannot access the platform until your status is set to 'approved' by an admin."}
              </p>
            </div>
          </section>

          {/* Database */}
          <section>
            <h2 className="font-mono text-xs tracking-widest uppercase text-primary mb-6 flex items-center gap-3">
              <span className="w-8 h-px bg-outline-variant" />
              {locale === "ja" ? "データベース" : "Database"}
            </h2>
            <div className="space-y-4 font-body text-secondary leading-relaxed">
              <p>
                {locale === "ja"
                  ? "PostgreSQL（Supabase）で行レベルセキュリティ（RLS）ポリシーが有効。すべてのテーブルにRLSが設定されています："
                  : "PostgreSQL on Supabase with Row Level Security (RLS) policies enabled. Every table has RLS enforced:"}
              </p>
              <ul className="list-none space-y-3 pl-4">
                {[
                  locale === "ja"
                    ? "プロフィール — 誰でも閲覧可能、自分のみ更新可能"
                    : "Profiles — viewable by everyone, only you can update yours",
                  locale === "ja"
                    ? "ゲーム — 公開ゲームは全員閲覧可能、作成・編集・削除はオーナーのみ"
                    : "Games — public games viewable by all, create/edit/delete restricted to owner",
                  locale === "ja"
                    ? "フィードバック — レビュアーとゲームオーナーのみ閲覧可能"
                    : "Feedback — only visible to the reviewer and the game owner",
                  locale === "ja"
                    ? "ストレージ — 認証ユーザーのみアップロード可能、自分のファイルのみ削除可能"
                    : "Storage — authenticated users can upload, only delete their own files",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="text-muted mt-1.5 shrink-0">—</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p>
                {locale === "ja"
                  ? "すべてのデータベースクエリはSupabaseクライアントライブラリのパラメータ化クエリを使用しており、SQLインジェクションを防止します。生のSQL文字列は一切使用していません。"
                  : "All database queries use Supabase client library's parameterized queries, which prevent SQL injection. No raw SQL strings are constructed in application code."}
              </p>
            </div>
          </section>

          {/* Data Storage */}
          <section>
            <h2 className="font-mono text-xs tracking-widest uppercase text-primary mb-6 flex items-center gap-3">
              <span className="w-8 h-px bg-outline-variant" />
              {locale === "ja" ? "データ保存" : "Data Storage"}
            </h2>
            <div className="space-y-4 font-body text-secondary leading-relaxed">
              <p>
                {locale === "ja"
                  ? "保存されるデータ：Googleプロフィール情報（名前、アバターURL）、Supercellメール、コーホート選択、ゲームビルド/カバー画像（Supabase Storage）、フィードバック回答、レビューポイント。"
                  : "Data stored: Google profile info (name, avatar URL), Supercell email, cohort selection, game builds/cover images (Supabase Storage), feedback responses, review points."}
              </p>
              <p>
                {locale === "ja"
                  ? "ゲームファイルとカバー画像はSupabase Storageの公開バケットに保存されます。アップロードには認証が必要ですが、URLを知っている人は誰でもダウンロードできます。"
                  : "Game files and cover images are stored in a public Supabase Storage bucket. Upload requires authentication, but anyone with the URL can download them."}
              </p>
            </div>
          </section>

          {/* What's NOT covered */}
          <section>
            <h2 className="font-mono text-xs tracking-widest uppercase text-primary mb-6 flex items-center gap-3">
              <span className="w-8 h-px bg-outline-variant" />
              {locale === "ja" ? "カバーされていないこと" : "What's NOT Covered"}
            </h2>
            <div className="space-y-4 font-body text-secondary leading-relaxed">
              <ul className="list-none space-y-3 pl-4">
                {[
                  locale === "ja"
                    ? "エンドツーエンド暗号化なし — データはSupabaseのインフラで保管時に暗号化されますが、E2EEではありません"
                    : "No end-to-end encryption — data is encrypted at rest by Supabase infrastructure, but not E2E encrypted",
                  locale === "ja"
                    ? "レート制限なし — APIレート制限は実装されていません（Supabaseのデフォルト制限に依存）"
                    : "No rate limiting — API rate limiting is not implemented (relies on Supabase defaults)",
                  locale === "ja"
                    ? "ペネトレーションテスト未実施 — プロのセキュリティ監査は受けていません"
                    : "No penetration testing — has not been professionally security audited",
                  locale === "ja"
                    ? "ストレージバケットは公開 — URLを知っていればアップロードされたファイルにアクセス可能"
                    : "Storage bucket is public — uploaded files are accessible if you know the URL",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="text-muted mt-1.5 shrink-0">—</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Tech Stack */}
          <section>
            <h2 className="font-mono text-xs tracking-widest uppercase text-primary mb-6 flex items-center gap-3">
              <span className="w-8 h-px bg-outline-variant" />
              {locale === "ja" ? "技術スタック" : "Tech Stack"}
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {[
                ["Framework", "Next.js 16 (App Router)"],
                ["Auth", "Supabase Auth (Google OAuth)"],
                ["Database", "Supabase PostgreSQL + RLS"],
                ["Storage", "Supabase Storage"],
                ["Styling", "Tailwind CSS v4"],
                ["i18n", "EN / JA (client-side)"],
                ["Testing", "Vitest + RTL"],
                ["CI", "GitHub Actions"],
              ].map(([label, value]) => (
                <div key={label} className="border border-outline-variant bg-surface-lowest p-4">
                  <p className="font-mono text-[13px] text-muted uppercase tracking-widest mb-1">{label}</p>
                  <p className="font-mono text-[14px] text-primary">{value}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Recommendation */}
          <section className="border border-outline-variant bg-surface-lowest p-8">
            <p className="font-body text-secondary leading-relaxed">
              {locale === "ja"
                ? "このプラットフォームはSupercell AI Labコーホート内での内部テスト用に設計されています。高度に機密性のあるデータのアップロードは避けてください。懸念やバグを発見した場合は、Slackで @ijtihedk にDMしてください。"
                : "This platform is designed for internal testing within the Supercell AI Lab cohort. Avoid uploading highly sensitive data. If you find a concern or a bug, DM @ijtihedk on Slack."}
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
