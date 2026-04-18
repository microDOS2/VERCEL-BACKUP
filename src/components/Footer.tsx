import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="py-12 footer-bg border-t border-white/5">
      <div className="max-w-6xl mx-auto px-4">
        {/* Main Footer Content - Centered */}
        <div className="text-center mb-12">
          {/* Brand */}
          <Link to="/" className="inline-block mb-4">
            <span className="text-2xl font-bold">
              <span className="text-[#44f80c]">micro</span>
              <span className="text-[#9a02d0]">DOS</span>
              <span className="text-[#ff66c4]">(2)</span>
            </span>
          </Link>
          <p className="text-gray-400 text-sm mb-8">
            Research-backed • Safety-first • Quality assured
          </p>

          {/* Navigation Links - Consumer only */}
          <div className="flex flex-wrap justify-center gap-8">
            <Link
              to="/store-locator"
              className="text-gray-400 hover:text-[#9a02d0] transition-colors"
            >
              Store Locator
            </Link>
          </div>
        </div>

        {/* Copyright & Disclaimer */}
        <div className="pt-8 border-t border-white/5 text-center">
          <p className="text-xs text-gray-500 mb-2">
            © 2026 <span className="text-[#44f80c]">micro</span>
            <span className="text-[#9a02d0]">DOS</span>
            <span className="text-[#ff66c4]">(2)</span> Inc. All rights reserved.
          </p>
          <p className="text-xs text-gray-500">
            These statements have not been evaluated by the FDA. This product is not intended to
            diagnose, treat, cure, or prevent any disease.
          </p>
        </div>
      </div>
    </footer>
  );
}
