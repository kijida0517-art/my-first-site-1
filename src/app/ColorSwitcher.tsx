"use client";

import { useState, useEffect } from "react";

interface ColorPreset {
  name: string;
  color: string;
}

const BG_PRESETS: ColorPreset[] = [
  { name: "딥 네이비", color: "#0a192f" },
  { name: "미드나잇 블루", color: "#081126" },
  { name: "코발트 블루", color: "#0f2b5c" },
  { name: "사파이어 딥블루", color: "#0c1e3d" },
];

const TEXT_PRESETS: ColorPreset[] = [
  { name: "소프트 옐로우 (기본)", color: "#fef08a" },
  { name: "골든 옐로우", color: "#fde047" },
  { name: "크림 아이보리", color: "#fffbeb" },
  { name: "앰버 옐로우", color: "#f59e0b" },
];

const RED_PRESETS: ColorPreset[] = [
  { name: "크림슨 레드 (기본)", color: "#ef4444" },
  { name: "루비 레드", color: "#dc2626" },
  { name: "스칼렛 레드", color: "#ff3838" },
  { name: "코랄 레드", color: "#ff4757" },
];

export default function ColorSwitcher() {
  const [bgColor, setBgColor] = useState<string>("#0a192f");
  const [textColor, setTextColor] = useState<string>("#fef08a");
  const [pointColor, setPointColor] = useState<string>("#ef4444");
  const [isOpen, setIsOpen] = useState<boolean>(false);

  // 초기 로드 시 로컬 스토리지 또는 기본값 적용
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedBg = localStorage.getItem("site-bg-color");
      const savedText = localStorage.getItem("site-text-color");
      const savedPoint = localStorage.getItem("site-point-color");

      if (savedBg) applyBgColor(savedBg);
      if (savedText) applyTextColor(savedText);
      if (savedPoint) applyPointColor(savedPoint);
    }
  }, []);

  const applyBgColor = (color: string) => {
    setBgColor(color);
    if (typeof document !== "undefined") {
      document.documentElement.style.setProperty("--bg-primary", color);
      document.documentElement.style.setProperty("--bg-secondary", `${color}dd`);
      localStorage.setItem("site-bg-color", color);
    }
  };

  const applyTextColor = (color: string) => {
    setTextColor(color);
    if (typeof document !== "undefined") {
      document.documentElement.style.setProperty("--text-primary", color);
      localStorage.setItem("site-text-color", color);
    }
  };

  const applyPointColor = (color: string) => {
    setPointColor(color);
    if (typeof document !== "undefined") {
      document.documentElement.style.setProperty("--point-color", color);
      document.documentElement.style.setProperty("--point-glow", `${color}55`);
      localStorage.setItem("site-point-color", color);
    }
  };

  const resetToDefault = () => {
    applyBgColor("#0a192f");
    applyTextColor("#fef08a");
    applyPointColor("#ef4444");
  };

  return (
    <div className="relative">
      {/* 토글 버튼 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-full border border-blue-400/30 bg-[#0d1e3d]/80 px-3.5 py-1.5 text-xs font-semibold text-blue-100 shadow-md backdrop-blur-md transition-all hover:border-yellow-300/60 hover:bg-[#162b55] active:scale-95"
      >
        <span className="flex items-center gap-1">
          <span
            className="inline-block h-3 w-3 rounded-full border border-white/50"
            style={{ backgroundColor: bgColor }}
            title="현재 배경 파랑"
          />
          <span
            className="inline-block h-3 w-3 rounded-full border border-white/50"
            style={{ backgroundColor: textColor }}
            title="현재 글자 노랑"
          />
          <span
            className="inline-block h-3 w-3 rounded-full border border-white/50"
            style={{ backgroundColor: pointColor }}
            title="현재 포인트 빨강"
          />
        </span>
        <span className="hidden sm:inline">🎨 내 색상 설정</span>
        <span className="text-[10px] text-blue-300">{isOpen ? "▲" : "▼"}</span>
      </button>

      {/* 색상 조절 팝오버 메뉴 */}
      {isOpen && (
        <div className="absolute right-0 top-11 z-50 w-72 rounded-2xl border border-blue-400/25 bg-[#0b1b36]/95 p-4 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="flex items-center justify-between border-b border-blue-400/20 pb-2 mb-3">
            <h3 className="text-xs font-bold text-[#fef9c3]">
              🎨 맞춤 컬러 팔레트
            </h3>
            <button
              onClick={resetToDefault}
              className="text-[10px] text-blue-300/80 hover:text-yellow-300 transition-colors underline"
            >
              기본값 복원
            </button>
          </div>

          {/* 1. [내가 정한 파랑색] - 배경색 */}
          <div className="mb-3.5">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold text-blue-200">
                🔵 배경 파랑색:
              </span>
              <span className="font-mono text-[10px] text-blue-300/90">{bgColor}</span>
            </div>
            <div className="flex items-center gap-1.5">
              {BG_PRESETS.map((preset) => (
                <button
                  key={preset.color}
                  onClick={() => applyBgColor(preset.color)}
                  className={`h-6 w-6 rounded-full border-2 transition-all hover:scale-110 ${
                    bgColor === preset.color
                      ? "border-white ring-2 ring-yellow-400/60 scale-105"
                      : "border-transparent opacity-80 hover:opacity-100"
                  }`}
                  style={{ backgroundColor: preset.color }}
                  title={preset.name}
                  aria-label={preset.name}
                />
              ))}
              {/* 커스텀 파랑색 피커 */}
              <label
                className="relative flex h-6 w-6 cursor-pointer items-center justify-center rounded-full border border-blue-400/50 bg-blue-900/50 text-[10px] hover:border-yellow-300 hover:scale-110 transition-transform"
                title="내가 원하는 파랑색 직접 지정"
              >
                +
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => applyBgColor(e.target.value)}
                  className="absolute inset-0 cursor-pointer opacity-0"
                />
              </label>
            </div>
          </div>

          {/* 2. [노랑 또는 잘 보이는 글자색] */}
          <div className="mb-3.5">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold text-yellow-200">
                🟡 글자 노랑색:
              </span>
              <span className="font-mono text-[10px] text-yellow-300/90">{textColor}</span>
            </div>
            <div className="flex items-center gap-1.5">
              {TEXT_PRESETS.map((preset) => (
                <button
                  key={preset.color}
                  onClick={() => applyTextColor(preset.color)}
                  className={`h-6 w-6 rounded-full border-2 transition-all hover:scale-110 ${
                    textColor === preset.color
                      ? "border-white ring-2 ring-yellow-400/60 scale-105"
                      : "border-transparent opacity-80 hover:opacity-100"
                  }`}
                  style={{ backgroundColor: preset.color }}
                  title={preset.name}
                  aria-label={preset.name}
                />
              ))}
              {/* 커스텀 노랑 글자색 피커 */}
              <label
                className="relative flex h-6 w-6 cursor-pointer items-center justify-center rounded-full border border-blue-400/50 bg-blue-900/50 text-[10px] hover:border-yellow-300 hover:scale-110 transition-transform"
                title="내가 원하는 글자색 직접 지정"
              >
                +
                <input
                  type="color"
                  value={textColor}
                  onChange={(e) => applyTextColor(e.target.value)}
                  className="absolute inset-0 cursor-pointer opacity-0"
                />
              </label>
            </div>
          </div>

          {/* 3. [내가 정한 빨강색] - 중요/제목 포인트 */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold text-red-300">
                🔴 포인트 빨강색 (제목/중요):
              </span>
              <span className="font-mono text-[10px] text-red-300/90">{pointColor}</span>
            </div>
            <div className="flex items-center gap-1.5">
              {RED_PRESETS.map((preset) => (
                <button
                  key={preset.color}
                  onClick={() => applyPointColor(preset.color)}
                  className={`h-6 w-6 rounded-full border-2 transition-all hover:scale-110 ${
                    pointColor === preset.color
                      ? "border-white ring-2 ring-yellow-400/60 scale-105"
                      : "border-transparent opacity-80 hover:opacity-100"
                  }`}
                  style={{ backgroundColor: preset.color }}
                  title={preset.name}
                  aria-label={preset.name}
                />
              ))}
              {/* 커스텀 빨강색 피커 */}
              <label
                className="relative flex h-6 w-6 cursor-pointer items-center justify-center rounded-full border border-blue-400/50 bg-blue-900/50 text-[10px] hover:border-yellow-300 hover:scale-110 transition-transform"
                title="내가 원하는 빨강색 직접 지정"
              >
                +
                <input
                  type="color"
                  value={pointColor}
                  onChange={(e) => applyPointColor(e.target.value)}
                  className="absolute inset-0 cursor-pointer opacity-0"
                />
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
