"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { navigationItems } from "@/lib/constants";

interface SearchInputProps {
  mobile?: boolean;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  onSearch: (query: string) => void;
  onClear: () => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
}

function SearchInput({ mobile = false, searchQuery, setSearchQuery, onSearch, onClear, inputRef }: SearchInputProps) {
  return (
    <div className={`flex items-center bg-gray-100 rounded-full px-4 py-2 ${mobile ? "w-full" : ""}`}>
      <svg className="w-5 h-5 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <input
        ref={inputRef}
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search news..."
        className="bg-transparent border-none outline-none ml-2 flex-1 text-sm text-gray-900 placeholder-gray-500"
        onKeyDown={(e) => {
          if (e.key === "Escape") onClear();
          if (e.key === "Enter") onSearch(searchQuery);
        }}
      />
      {searchQuery && (
        <button onClick={() => setSearchQuery("")} className="ml-1 text-gray-400 hover:text-gray-600" aria-label="Clear search">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
      <button
        onClick={() => onSearch(searchQuery)}
        className="ml-2 bg-red-600 text-white p-1.5 rounded-full hover:bg-red-700 transition-colors flex-shrink-0"
        aria-label="Submit search"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </button>
      <button onClick={onClear} className="ml-2 text-gray-500 hover:text-red-600 flex-shrink-0" aria-label="Close search">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

export default function Header() {
  const router = useRouter();
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchHistory, setSearchHistory] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const stored = localStorage.getItem("searchHistory");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const searchInputRef = useRef<HTMLInputElement>(null);
  const menuTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  const persistSearchHistory = useCallback((history: string[]) => {
    try {
      localStorage.setItem("searchHistory", JSON.stringify(history));
    } catch {}
  }, []);

  const handleSearch = useCallback((query: string) => {
    const trimmed = query.trim();
    if (!trimmed) return;
    setSearchHistory((prev) => {
      const next = [trimmed, ...prev.filter((s) => s !== trimmed)].slice(0, 10);
      persistSearchHistory(next);
      return next;
    });
    setIsSearchOpen(false);
    setSearchQuery("");
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
  }, [router, persistSearchHistory]);

  const clearSearch = useCallback(() => {
    setSearchQuery("");
    setIsSearchOpen(false);
  }, []);

  const clearHistory = useCallback(() => {
    setSearchHistory([]);
    persistSearchHistory([]);
  }, [persistSearchHistory]);

  const searchProps = { searchQuery, setSearchQuery, onSearch: handleSearch, onClear: clearSearch, inputRef: searchInputRef };

  const handleMenuEnter = useCallback((label: string) => {
    if (menuTimeoutRef.current) {
      clearTimeout(menuTimeoutRef.current);
      menuTimeoutRef.current = null;
    }
    setActiveMenu(label);
  }, []);

  const handleMenuLeave = useCallback(() => {
    menuTimeoutRef.current = setTimeout(() => setActiveMenu(null), 150);
  }, []);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold text-red-600">
              NEWS
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-1" aria-label="Main navigation">
            {navigationItems.map((item) => (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => item.submenu.length > 0 && handleMenuEnter(item.label)}
                onMouseLeave={() => item.submenu.length > 0 && handleMenuLeave()}
              >
                {item.submenu.length > 0 ? (
                  <>
                    <button
                      onClick={() => setActiveMenu(activeMenu === item.label ? null : item.label)}
                      onKeyDown={(e) => {
                        if (e.key === "Escape") setActiveMenu(null);
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setActiveMenu(activeMenu === item.label ? null : item.label);
                        }
                      }}
                      className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-red-600 transition-colors inline-flex items-center"
                      aria-haspopup="true"
                      aria-expanded={activeMenu === item.label}
                    >
                      {item.label}
                      <svg
                        className={`inline-block ml-1 w-4 h-4 transition-transform ${activeMenu === item.label ? "rotate-180" : ""}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {activeMenu === item.label && (
                      <div
                        className="absolute left-0 mt-0 w-64 bg-white rounded-b-lg shadow-lg border border-gray-100 py-4 z-50"
                        role="menu"
                        onMouseEnter={() => handleMenuEnter(item.label)}
                        onMouseLeave={handleMenuLeave}
                      >
                        <div className="px-4 mb-2">
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            {item.label}
                          </p>
                        </div>
                        <div className="grid grid-cols-1 gap-1">
                          {item.submenu.map((subItem) => (
                            <Link
                              key={subItem.label}
                              href={subItem.href}
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                              role="menuitem"
                              onClick={() => setActiveMenu(null)}
                            >
                              {subItem.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href={item.href}
                    className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-red-600 transition-colors"
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 text-gray-500 hover:text-red-600 transition-colors"
              aria-label="Toggle search"
              aria-expanded={isSearchOpen}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            <Link href="/subscribe" className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 transition-colors">
              Subscribe
            </Link>
          </div>

          <div className="flex items-center md:hidden space-x-2">
            <button
              onClick={() => {
                setIsSearchOpen(!isSearchOpen);
                setIsMobileMenuOpen(false);
              }}
              className="p-2 text-gray-500 hover:text-red-600 transition-colors"
              aria-label="Toggle search"
              aria-expanded={isSearchOpen}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            <button
              className="p-2 text-gray-500"
              onClick={() => {
                setIsMobileMenuOpen(!isMobileMenuOpen);
                setIsSearchOpen(false);
              }}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMobileMenuOpen}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {isSearchOpen && (
        <div className="border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="hidden md:block">
              <SearchInput {...searchProps} />
            </div>
            <div className="md:hidden">
              <SearchInput mobile {...searchProps} />
            </div>

            {!searchQuery && searchHistory.length > 0 && (
              <div className="mt-3">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Recent Searches</p>
                  <button
                    onClick={clearHistory}
                    className="text-xs text-red-600 hover:text-red-700"
                  >
                    Clear all
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {searchHistory.map((term, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setSearchQuery(term);
                        handleSearch(term);
                      }}
                      className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-red-50 hover:text-red-600 transition-colors"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="px-4 py-2 space-y-1">
            {navigationItems.map((item) => (
              <div key={item.label}>
                <Link
                  href={item.href}
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-md"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
                {item.submenu.length > 0 && (
                  <div className="pl-4">
                    {item.submenu.map((subItem) => (
                      <Link
                        key={subItem.label}
                        href={subItem.href}
                        className="block px-3 py-2 text-sm text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {subItem.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="pt-4 border-t border-gray-100">
              <Link href="/subscribe" className="block w-full bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 transition-colors text-center">
                Subscribe
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
