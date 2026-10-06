import Image from "next/image";
import ColorSwitcher from "./ColorSwitcher";

export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col justify-between overflow-hidden">
      {/* Background Decorative Ambient Glows */}
      <div className="pointer-events-none absolute -top-40 -left-40 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl" />
      <div className="pointer-events-none absolute top-1/3 -right-40 h-[450px] w-[450px] rounded-full bg-blue-500/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 left-1/3 h-96 w-96 rounded-full bg-indigo-700/20 blur-3xl" />

      {/* Top Header / Navigation Bar */}
      <header className="relative z-10 w-full border-b border-blue-400/15 backdrop-blur-md bg-[#0a142c]/75">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 sm:px-10 lg:px-12 py-5">
          <div className="flex items-center gap-3">
            <div className="point-bg flex h-10 w-10 items-center justify-center rounded-xl font-extrabold text-white shadow-md">
              JH
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-[var(--text-highlight)]">
                김종환
              </span>
              <span className="point-text point-border ml-2 text-xs font-semibold px-2.5 py-0.5 rounded-full border bg-blue-900/30">
                포트폴리오
              </span>
            </div>
          </div>

          {/* Color Switcher (배경 파랑 / 글자 노랑 / 포인트 빨강 실시간 조절) */}
          <ColorSwitcher />
        </div>
      </header>

      {/* Main Content Area - 상하좌우 여백을 여유롭고 쾌적하게 구성 */}
      <main className="relative z-10 mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center px-6 sm:px-12 md:px-16 lg:px-20 py-16 sm:py-24 md:py-28">
        {/* Tech Stack Badge */}
        <div className="mb-8 flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-900/40 px-4 py-1.5 shadow-inner">
          <Image
            className="h-4 w-auto brightness-200 invert"
            src="/next.svg"
            alt="Next.js logo"
            width={70}
            height={16}
            style={{ width: "auto" }}
            priority
          />
          <span className="text-xs text-blue-200/90">• Next.js 16 + React 19</span>
        </div>

        {/* Hero Section */}
        <div className="flex flex-col items-center text-center max-w-3xl w-full">
          {/* Important Highlight Pill (중요한 부분에만 빨강 포인트) */}
          <div className="point-text point-border mb-6 inline-flex items-center gap-1.5 rounded-full px-4 py-1 text-xs font-semibold tracking-wide uppercase border bg-blue-900/30">
            <span>★</span>
            <span>중요 소개</span>
          </div>

          {/* Heading with Point Color on Important Part (두 줄로 구성) */}
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl text-[var(--text-highlight)] leading-tight">
            안녕하세요,<br />
            <span className="point-text inline-block mt-1 sm:mt-2">김종환</span>입니다
          </h1>

          {/* Profile Photo (핑크뮬리 프로필 사진) */}
          <div className="mt-8 sm:mt-10 relative inline-block">
            <div className="relative h-32 w-32 sm:h-40 sm:w-40 rounded-full overflow-hidden border-2 border-blue-300/40 shadow-2xl ring-4 ring-blue-500/25 transition-transform duration-300 hover:scale-105">
              <Image
                src="/profile.jpg"
                alt="프로필 사진"
                fill
                sizes="(max-width: 640px) 128px, 160px"
                className="object-cover"
                style={{ objectPosition: "center 55%" }}
                priority
              />
            </div>
          </div>

          {/* Body Text in Clear, High-Contrast Yellow (두 줄로 구성) */}
          <p className="mt-8 sm:mt-10 text-lg sm:text-xl font-normal leading-relaxed sm:leading-loose text-[var(--text-primary)] max-w-2xl px-2">
            <span className="block">시원하고 깊이 있는 파란색 배경 위에, 또렷하고 가독성 높은 노란색 글자로 구성했습니다.</span>
            <span className="block mt-1">
              제목과 중요한 핵심 부분에만 <span className="point-text font-bold underline decoration-2 underline-offset-4">붉은색 포인트</span>를 살짝 더해 시선을 집중시켰습니다.
            </span>
          </p>
        </div>

        {/* 3 Core Highlight Cards (소개글 아래 여유로운 간격) */}
        <div className="mt-16 sm:mt-20 grid w-full grid-cols-1 gap-6 sm:gap-8 md:grid-cols-3">
          <div className="glass-card rounded-2xl p-7 relative overflow-hidden">
            <div className="point-text point-border mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl text-2xl font-bold shadow-md border bg-blue-900/40">
              💡
            </div>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-[var(--text-highlight)]">창의적인 기획</h2>
              <span className="point-text point-border text-xs font-semibold px-2 py-0.5 rounded-md border bg-blue-900/30">
                중요
              </span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-[var(--text-primary)]/90">
              복잡한 아이디어를 직관적이고 감각적인 웹 사용자 경험으로 구현합니다.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-7 relative overflow-hidden">
            <div className="point-text point-border mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl text-2xl font-bold shadow-md border bg-blue-900/40">
              ⚡
            </div>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-[var(--text-highlight)]">빠른 실행력</h2>
              <span className="point-text point-border text-xs font-semibold px-2 py-0.5 rounded-md border bg-blue-900/30">
                핵심
              </span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-[var(--text-primary)]/90">
              새로운 기술과 아이디어를 신속하게 탐구하고 완성도 높은 코드로 완성합니다.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-7 relative overflow-hidden">
            <div className="point-text point-border mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl text-2xl font-bold shadow-md border bg-blue-900/40">
              🎯
            </div>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-[var(--text-highlight)]">디테일과 완성도</h2>
              <span className="point-text point-border text-xs font-semibold px-2 py-0.5 rounded-md border bg-blue-900/30">
                포인트
              </span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-[var(--text-primary)]/90">
              색상 조화, 시각적 계층 구조, 폰트 가독성까지 세심하게 조율합니다.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-14 sm:mt-16 flex flex-col gap-4 sm:flex-row w-full max-w-md justify-center">
          <a
            className="point-bg flex h-12 items-center justify-center gap-2 rounded-xl font-bold text-white px-7 transition-all duration-300 hover:brightness-110 hover:shadow-lg active:scale-95"
            href="https://vercel.com/new"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="h-3.5 w-auto brightness-200 invert"
              src="/vercel.svg"
              alt="Vercel logomark"
              width={16}
              height={14}
              style={{ width: "auto" }}
            />
            지금 배포하기
          </a>
          <a
            className="flex h-12 items-center justify-center rounded-xl border border-blue-400/25 bg-blue-950/50 px-6 font-semibold text-[var(--text-highlight)] backdrop-blur-sm transition-all duration-300 hover:border-yellow-200/50 hover:bg-blue-900/60 active:scale-95"
            href="https://nextjs.org/docs"
            target="_blank"
            rel="noopener noreferrer"
          >
            공식 문서 둘러보기
          </a>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-blue-400/15 py-8 px-6 sm:px-12 text-center backdrop-blur-sm bg-[#060c18]/60">
        <p className="text-xs text-blue-300/80">
          © {new Date().getFullYear()} 김종환. Blue & Yellow Palette with{" "}
          <span className="point-text font-semibold">
            Red Accents
          </span>
          .
        </p>
      </footer>
    </div>
  );
}
