const Footer = () => {
  return (
    <footer className="pt-20 pb-10 border-t border-white/5 text-center">
      <div className="flex flex-col items-center gap-6">
        <div className="flex items-center gap-6 text-gray-500">
          <a
            href="https://github.com/NirajPujari/HackatonP3/tree/main/backend"
            className="hover:text-amber-500 transition-colors text-xs font-bold uppercase tracking-wider"
          >
            Docs
          </a>
          <a
            href="https://github.com/NirajPujari/HackatonP3"
            className="hover:text-amber-500 transition-colors text-xs font-bold uppercase tracking-wider"
          >
            GitHub
          </a>
        </div>
        <p className="text-[10px] font-mono text-gray-600 tracking-widest uppercase">
          Build with Next.js 14 & Framer Motion • Hackaton OS
        </p>
      </div>
    </footer>
  );
};

export default Footer;
