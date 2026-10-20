"use client";

import { useState, useEffect, useId } from "react";

interface InquiryItem {
  id: string;
  name: string;
  contact: string;
  category: string;
  title: string;
  message: string;
  createdAt: string;
}

const CATEGORIES = [
  { id: "project", label: "💼 프로젝트 의뢰", desc: "새로운 웹사이트나 서비스 개발" },
  { id: "collab", label: "🤝 협업 및 제휴", desc: "비즈니스 제안 및 아이디어 공유" },
  { id: "coffee", label: "☕ 커피챗 / 네트워킹", desc: "가벼운 질문과 대화 나누기" },
  { id: "etc", label: "💬 기타 문의", desc: "기타 궁금하신 내용" },
];

export default function InquirySection() {
  const formId = useId();
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [category, setCategory] = useState("project");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [privacyAgreed, setPrivacyAgreed] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [savedInquiries, setSavedInquiries] = useState<InquiryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [apiNotice, setApiNotice] = useState<string | null>(null);

  // 로컬스토리지에서 기존 보낸 문의 불러오기
  useEffect(() => {
    try {
      const stored = localStorage.getItem("my-site-inquiries");
      if (stored) {
        setSavedInquiries(JSON.parse(stored));
      }
    } catch {
      // ignore
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    setApiNotice(null);

    if (!name.trim()) {
      setValidationError("성함 또는 회사명을 입력해 주세요.");
      return;
    }
    if (!contact.trim()) {
      setValidationError("회신받으실 이메일 또는 연락처를 입력해 주세요.");
      return;
    }
    if (!title.trim()) {
      setValidationError("문의 제목을 입력해 주세요.");
      return;
    }
    if (!message.trim() || message.trim().length < 5) {
      setValidationError("문의 내용을 5자 이상 자세히 남겨주세요.");
      return;
    }
    if (!privacyAgreed) {
      setValidationError("문의 처리를 위한 개인정보 수집에 동의해 주세요.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          contact: contact.trim(),
          category: CATEGORIES.find((c) => c.id === category)?.label || category,
          title: title.trim(),
          message: message.trim(),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "문의 전송 중 오류가 발생했습니다.");
      }

      if (result.isMock) {
        setApiNotice(result.message);
      }

      const newInquiry: InquiryItem = {
        id: "INQ-" + Date.now().toString(36).toUpperCase(),
        name: name.trim(),
        contact: contact.trim(),
        category: CATEGORIES.find((c) => c.id === category)?.label || category,
        title: title.trim(),
        message: message.trim(),
        createdAt: new Date().toLocaleString("ko-KR", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      const updated = [newInquiry, ...savedInquiries];
      setSavedInquiries(updated);
      try {
        localStorage.setItem("my-site-inquiries", JSON.stringify(updated));
      } catch {
        // ignore
      }

      setIsSubmitted(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "문의 전송에 실패했습니다.";
      setValidationError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForm = () => {
    setName("");
    setContact("");
    setTitle("");
    setMessage("");
    setIsSubmitted(false);
    setValidationError(null);
    setApiNotice(null);
  };

  const handleDeleteInquiry = (id: string) => {
    const updated = savedInquiries.filter((item) => item.id !== id);
    setSavedInquiries(updated);
    try {
      localStorage.setItem("my-site-inquiries", JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const handleCopyEmail = (emailStr: string) => {
    navigator.clipboard.writeText(emailStr);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  return (
    <section id="contact-section" className="w-full max-w-4xl mt-24 sm:mt-32">
      {/* Section Header */}
      <div className="text-center mb-10 sm:mb-14">
        <div className="point-text point-border mb-3 inline-flex items-center gap-1.5 rounded-full px-4 py-1 text-xs font-semibold tracking-wide border bg-blue-900/30">
          <span>✉️</span>
          <span>문의사항 남기기</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--text-highlight)]">
          궁금한 점이나 <span className="point-text">협업 제안</span>이 있으신가요?
        </h2>
        <p className="mt-3 text-sm sm:text-base text-blue-200/80 max-w-xl mx-auto">
          소중한 의견이나 프로젝트 제안을 남겨주시면 확인 후 신속하고 정성껏 회신드리겠습니다.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side: Direct Contact & Info Card */}
        <div className="lg:col-span-1 flex flex-col gap-5">
          {/* Direct Card */}
          <div className="glass-card rounded-2xl p-6 sm:p-7 relative overflow-hidden flex flex-col justify-between">
            <div>
              <div className="point-text point-border mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl text-xl font-bold shadow-md border bg-blue-900/40">
                📬
              </div>
              <h3 className="text-lg font-bold text-[var(--text-highlight)]">
                빠른 다이렉트 소통
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-blue-200/80 leading-relaxed">
                폼 작성이 번거로우시다면 이메일로 바로 문의 내용을 보내셔도 좋습니다.
              </p>

              <div className="mt-6 space-y-3.5">
                <div className="rounded-xl border border-blue-400/20 bg-blue-950/40 p-3.5">
                  <div className="text-[11px] font-semibold text-blue-300">이메일 주소</div>
                  <div className="mt-1 flex items-center justify-between gap-2">
                    <span className="font-mono text-xs sm:text-sm text-yellow-200 truncate">
                      jh.kim@example.com
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopyEmail("jh.kim@example.com")}
                      className="text-xs px-2.5 py-1 rounded-lg border border-blue-400/30 bg-blue-900/50 hover:bg-blue-800 text-blue-100 transition-colors"
                    >
                      {copiedEmail ? "✓ 복사됨" : "복사"}
                    </button>
                  </div>
                </div>

                <div className="rounded-xl border border-blue-400/20 bg-blue-950/40 p-3.5">
                  <div className="text-[11px] font-semibold text-blue-300">답변 소요 시간</div>
                  <div className="mt-1 text-xs sm:text-sm text-yellow-200 font-medium">
                    평균 <span className="point-text font-bold">24시간 이내</span> 확인 및 회신
                  </div>
                </div>
              </div>
            </div>

            {/* Inquiries History Button */}
            {savedInquiries.length > 0 && (
              <div className="mt-6 pt-5 border-t border-blue-400/15">
                <button
                  type="button"
                  onClick={() => setShowHistory(!showHistory)}
                  className="w-full flex items-center justify-between rounded-xl border border-yellow-300/30 bg-yellow-400/10 hover:bg-yellow-400/20 px-3.5 py-2.5 text-xs font-semibold text-yellow-200 transition-colors"
                >
                  <span>📋 내가 남긴 문의 ({savedInquiries.length}건)</span>
                  <span className="text-[10px] text-yellow-300">{showHistory ? "닫기 ▲" : "열기 ▼"}</span>
                </button>
              </div>
            )}
          </div>

          {/* Quick FAQ Card */}
          <div className="glass-card rounded-2xl p-5 border border-blue-400/15 bg-blue-950/30">
            <div className="text-xs font-bold text-[var(--text-highlight)] flex items-center gap-1.5 mb-2">
              <span>💡</span> 주로 어떤 문의가 가능한가요?
            </div>
            <ul className="text-xs text-blue-200/75 space-y-1.5 list-disc list-inside">
              <li>신규 웹 사이트 및 UI/UX 개발 의뢰</li>
              <li>프론트엔드 / 풀스택 협업 및 프로젝트 참여</li>
              <li>기술 멘토링, 커피챗 및 기술 교류</li>
            </ul>
          </div>
        </div>

        {/* Right Side: Main Inquiry Form / Submitted State */}
        <div className="lg:col-span-2">
          {/* History Accordion if opened */}
          {showHistory && savedInquiries.length > 0 && (
            <div className="mb-6 rounded-2xl border border-blue-400/25 bg-blue-950/80 p-5 backdrop-blur-md">
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-blue-400/20">
                <h4 className="text-sm font-bold text-yellow-200 flex items-center gap-2">
                  <span>📜</span> 최근 남겨주신 문의 내역
                </h4>
                <button
                  onClick={() => setShowHistory(false)}
                  className="text-xs text-blue-300 hover:text-white"
                >
                  ✕ 닫기
                </button>
              </div>

              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {savedInquiries.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-xl border border-blue-400/20 bg-blue-900/30 text-xs flex flex-col gap-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-yellow-300 flex items-center gap-1.5">
                        <span className="px-1.5 py-0.5 rounded bg-blue-800/80 text-[10px] text-blue-200">
                          {item.category}
                        </span>
                        {item.title}
                      </span>
                      <button
                        onClick={() => handleDeleteInquiry(item.id)}
                        className="text-[11px] text-red-400 hover:text-red-300 ml-2"
                        title="내역 삭제"
                      >
                        삭제
                      </button>
                    </div>
                    <p className="text-blue-100 whitespace-pre-wrap">{item.message}</p>
                    <div className="flex items-center justify-between text-[11px] text-blue-300/70 pt-1 border-t border-blue-400/10">
                      <span>작성자: {item.name} ({item.contact})</span>
                      <span>{item.createdAt}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Form Card or Submitted Success Card */}
          <div className="glass-card rounded-2xl p-6 sm:p-8 relative">
            {isSubmitted ? (
              /* Success View */
              <div className="flex flex-col items-center text-center py-10 px-4 animate-in fade-in zoom-in-95 duration-200">
                <div className="point-bg flex h-16 w-16 items-center justify-center rounded-2xl text-3xl font-extrabold text-white shadow-xl mb-5">
                  ✓
                </div>
                <h3 className="text-2xl font-bold text-[var(--text-highlight)]">
                  문의가 성공적으로 접수되었습니다!
                </h3>
                <p className="mt-3 text-sm text-blue-200/90 max-w-md leading-relaxed">
                  <span className="text-yellow-200 font-semibold">{name}</span> 님, 문의해 주셔서 진심으로 감사드립니다. 남겨주신 연락처(
                  <span className="text-yellow-200 font-mono">{contact}</span>
                  )로 검토 후 빠르게 회신드리겠습니다.
                </p>

                <div className="mt-6 p-4 rounded-xl border border-blue-400/20 bg-blue-950/60 max-w-sm w-full text-xs text-blue-300/90 text-left space-y-1">
                  <div>📌 접수 구분: <span className="text-white">{CATEGORIES.find((c) => c.id === category)?.label}</span></div>
                  <div>📌 문의 제목: <span className="text-white">{title}</span></div>
                  <div>📌 접수 일시: <span className="text-white">{new Date().toLocaleString("ko-KR")}</span></div>
                </div>

                {apiNotice && (
                  <div className="mt-4 p-3.5 rounded-xl border border-yellow-400/30 bg-yellow-400/10 max-w-sm w-full text-xs text-yellow-200 text-left leading-relaxed">
                    <span className="font-bold">ℹ️ 안내:</span> {apiNotice}
                  </div>
                )}

                <div className="mt-8 flex gap-3">
                  <button
                    type="button"
                    onClick={handleResetForm}
                    className="point-bg px-6 py-2.5 rounded-xl font-bold text-white text-sm shadow-lg transition-transform hover:scale-105 active:scale-95"
                  >
                    추가 문의 작성하기
                  </button>
                </div>
              </div>
            ) : (
              /* Inquiry Form */
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Error Banner */}
                {validationError && (
                  <div className="rounded-xl border border-red-500/50 bg-red-950/60 p-3 text-xs text-red-200 flex items-center gap-2">
                    <span className="font-bold text-red-400">⚠️</span>
                    <span>{validationError}</span>
                  </div>
                )}

                {/* 1. Category Chips */}
                <div>
                  <label className="block text-xs font-bold text-[var(--text-highlight)] mb-2">
                    문의 유형 <span className="point-text">*</span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {CATEGORIES.map((cat) => {
                      const isSelected = category === cat.id;
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => setCategory(cat.id)}
                          className={`rounded-xl p-2.5 text-xs text-left font-semibold border transition-all ${
                            isSelected
                              ? "border-yellow-400 bg-yellow-400/15 text-yellow-200 ring-2 ring-yellow-400/40"
                              : "border-blue-400/20 bg-blue-950/40 text-blue-200 hover:border-blue-300/40 hover:bg-blue-900/30"
                          }`}
                        >
                          <div className="truncate">{cat.label}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Name & Contact Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor={`${formId}-name`}
                      className="block text-xs font-bold text-[var(--text-highlight)] mb-1.5"
                    >
                      성함 / 회사명 <span className="point-text">*</span>
                    </label>
                    <input
                      id={`${formId}-name`}
                      type="text"
                      placeholder="예: 홍길동 또는 회사명"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full rounded-xl border border-blue-400/25 bg-[#08152e]/90 px-3.5 py-2.5 text-sm text-yellow-100 placeholder-blue-300/40 focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/30 transition-all"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor={`${formId}-contact`}
                      className="block text-xs font-bold text-[var(--text-highlight)] mb-1.5"
                    >
                      회신받을 연락처 / 이메일 <span className="point-text">*</span>
                    </label>
                    <input
                      id={`${formId}-contact`}
                      type="text"
                      placeholder="예: example@email.com 또는 010-XXXX-XXXX"
                      value={contact}
                      onChange={(e) => setContact(e.target.value)}
                      className="w-full rounded-xl border border-blue-400/25 bg-[#08152e]/90 px-3.5 py-2.5 text-sm text-yellow-100 placeholder-blue-300/40 focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/30 transition-all"
                    />
                  </div>
                </div>

                {/* 3. Inquiry Title */}
                <div>
                  <label
                    htmlFor={`${formId}-title`}
                    className="block text-xs font-bold text-[var(--text-highlight)] mb-1.5"
                  >
                    문의 제목 <span className="point-text">*</span>
                  </label>
                  <input
                    id={`${formId}-title`}
                    type="text"
                    placeholder="문의하시려는 핵심 제목을 간략히 적어주세요"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full rounded-xl border border-blue-400/25 bg-[#08152e]/90 px-3.5 py-2.5 text-sm text-yellow-100 placeholder-blue-300/40 focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/30 transition-all"
                  />
                </div>

                {/* 4. Inquiry Message */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label
                      htmlFor={`${formId}-message`}
                      className="block text-xs font-bold text-[var(--text-highlight)]"
                    >
                      문의 내용 <span className="point-text">*</span>
                    </label>
                    <span className="text-[11px] text-blue-300/70 font-mono">
                      {message.length}자
                    </span>
                  </div>
                  <textarea
                    id={`${formId}-message`}
                    rows={5}
                    placeholder="프로젝트 일정, 예산, 원하시는 기능, 협업 제안 등 궁금한 점을 자유롭게 남겨주세요."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full rounded-xl border border-blue-400/25 bg-[#08152e]/90 px-3.5 py-3 text-sm text-yellow-100 placeholder-blue-300/40 focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/30 transition-all resize-y min-h-[120px]"
                  />
                </div>

                {/* 5. Privacy Agreement Checkbox */}
                <div className="flex items-center gap-2.5 pt-1">
                  <input
                    id={`${formId}-privacy`}
                    type="checkbox"
                    checked={privacyAgreed}
                    onChange={(e) => setPrivacyAgreed(e.target.checked)}
                    className="h-4 w-4 rounded border-blue-400/40 bg-[#08152e] text-red-500 focus:ring-yellow-400 cursor-pointer"
                  />
                  <label
                    htmlFor={`${formId}-privacy`}
                    className="text-xs text-blue-200/80 cursor-pointer select-none"
                  >
                    문의 회신 및 답변 처리를 위한 개인정보(이름, 연락처) 수집 및 이용에 동의합니다.
                  </label>
                </div>

                {/* 6. Submit Button with Point Accent */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="point-bg w-full h-12 flex items-center justify-center gap-2 rounded-xl font-bold text-white shadow-lg transition-all hover:brightness-110 hover:shadow-xl active:scale-[0.99] disabled:opacity-60 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <span className="inline-flex items-center gap-2">
                        <svg
                          className="animate-spin h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                          ></path>
                        </svg>
                        문의사항 전송 중...
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-2">
                        <span>✉️</span> 문의사항 보내기
                      </span>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
