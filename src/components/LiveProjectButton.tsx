interface LiveProjectButtonProps {
  href?: string | null;
}

export default function LiveProjectButton({ href }: LiveProjectButtonProps) {
  if (!href) return null;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-block px-4 py-1.5 sm:px-6 sm:py-2 md:px-8 md:py-3 text-[10px] sm:text-xs md:text-sm text-[#F3F4F6] font-semibold uppercase tracking-widest rounded-full border border-[#F3F4F6]/40 hover:border-[#B501A7] hover:text-[#B501A7] hover:bg-[#B501A7]/5 transition-all duration-300 text-center"
    >
      Live Project
    </a>
  );
}