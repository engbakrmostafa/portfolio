export default function ContactButton() {
  return (
    <button
      className="px-8 py-3 sm:px-10 sm:py-3.5 md:px-12 md:py-4 text-xs sm:text-sm md:text-base text-white font-medium uppercase tracking-widest rounded-full relative group"
      style={{
        background: 'linear-gradient(123deg, #18011F 7%, #B600A8 37%, #7621B0 72%, #BE4C00 100%)',
        boxShadow: '0px 4px 4px rgba(181, 1, 167, 0.25), 4px 4px 12px #7721B1 inset',
      }}
    >
      <span
        className="absolute inset-0 rounded-full border-2 border-white -translate-x-1 -translate-y-1 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-200"
        style={{ top: '3px', left: '3px', right: '-3px', bottom: '-3px' }}
      />
      <span className="relative z-10">Contact Me</span>
    </button>
  );
}