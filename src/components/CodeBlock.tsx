import React, { useState } from 'react';
import { Copy, Check, Code2, Terminal, FileCode, Layers } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
  explanation?: string;
}

const LANGUAGE_CONFIG: Record<
  string,
  { label: string; icon: React.ReactNode; color: string }
> = {
  typescript: { label: 'TypeScript', icon: <FileCode className="w-3.5 h-3.5 text-sky-400" />, color: 'text-sky-400' },
  javascript: { label: 'JavaScript', icon: <FileCode className="w-3.5 h-3.5 text-amber-300" />, color: 'text-amber-300' },
  react: { label: 'React / JSX', icon: <FileCode className="w-3.5 h-3.5 text-cyan-400" />, color: 'text-cyan-400' },
  sql: { label: 'PostgreSQL / SQL', icon: <Terminal className="w-3.5 h-3.5 text-emerald-400" />, color: 'text-emerald-400' },
  python: { label: 'Python', icon: <Code2 className="w-3.5 h-3.5 text-blue-400" />, color: 'text-blue-400' },
  bash: { label: 'Terminal / Docker', icon: <Terminal className="w-3.5 h-3.5 text-green-400" />, color: 'text-green-400' },
  json: { label: 'JSON Config', icon: <Layers className="w-3.5 h-3.5 text-amber-400" />, color: 'text-amber-400' },
  css: { label: 'Tailwind / CSS', icon: <Layers className="w-3.5 h-3.5 text-pink-400" />, color: 'text-pink-400' },
  html: { label: 'HTML5', icon: <Code2 className="w-3.5 h-3.5 text-orange-400" />, color: 'text-orange-400' },
};

export const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  language = 'typescript',
  title,
  explanation,
}) => {
  const { language: lang } = useLanguage();
  const isAr = lang === 'ar';
  const [copied, setCopied] = useState(false);

  const normalizedLang = language.toLowerCase();
  const config = LANGUAGE_CONFIG[normalizedLang] || {
    label: language.toUpperCase(),
    icon: <Code2 className="w-3.5 h-3.5 text-[#89AACC]" />,
    color: 'text-[#89AACC]',
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const codeLines = code.split('\n');

  return (
    <div className="rounded-2xl bg-[#0B0F17] border border-stroke/90 overflow-hidden my-6 shadow-2xl font-mono text-xs text-start">
      {/* Code Header Bar */}
      <div className="px-4 py-2.5 bg-[#121824] border-b border-stroke/70 flex items-center justify-between gap-3 select-none">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
          </div>

          <div className="h-3 w-px bg-stroke/60 mx-1 shrink-0" />

          <div className="flex items-center gap-1.5 min-w-0">
            {config.icon}
            <span className={`text-[11px] font-bold ${config.color} truncate`}>
              {title || config.label}
            </span>
          </div>
        </div>

        <button
          onClick={handleCopy}
          className="px-3 py-1 rounded-lg bg-surface/80 hover:bg-stroke text-muted hover:text-white border border-stroke/60 transition-all cursor-pointer flex items-center gap-1.5 text-[11px] shrink-0"
          title={isAr ? 'نسخ الكود المصدر' : 'Copy source code'}
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-emerald-400" />
              <span className="text-emerald-400 font-bold">{isAr ? 'تم النسخ ✓' : 'Copied ✓'}</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span>{isAr ? 'نسخ الكود' : 'Copy'}</span>
            </>
          )}
        </button>
      </div>

      {/* Code Viewport with Line Numbers */}
      <div className="p-4 overflow-x-auto leading-relaxed text-[#E2E8F0] bg-[#070A0F]">
        <table className="border-collapse w-full">
          <tbody>
            {codeLines.map((line, index) => (
              <tr key={index} className="hover:bg-white/[0.03] transition-colors">
                <td className="pr-4 rtl:pr-0 rtl:pl-4 text-muted/40 text-end select-none font-mono text-[11px] w-8 shrink-0 border-r rtl:border-r-0 rtl:border-l border-stroke/30">
                  {index + 1}
                </td>
                <td className="pl-4 rtl:pl-0 rtl:pr-4 whitespace-pre font-mono text-xs py-0.5">
                  {line || ' '}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Optional Explanation Note */}
      {explanation && (
        <div className="px-4 py-2.5 bg-[#0F141E] border-t border-stroke/60 text-xs text-muted leading-relaxed flex items-center gap-2">
          <span className="text-[#89AACC] font-bold">💡 {isAr ? 'ملاحظة:' : 'Note:'}</span>
          <span>{explanation}</span>
        </div>
      )}
    </div>
  );
};
