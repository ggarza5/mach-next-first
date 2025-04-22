import Link from 'next/link';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-900">
      <header className="p-4 border-b border-gray-800 bg-black/40">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-semibold text-white">Mach SDK Example</h1>
          <Link
            href="https://app.mach.exchange"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 transition-colors"
          >
            Visit Mach.Exchange
          </Link>
        </div>
      </header>

      <main className="flex-1 container mx-auto flex items-center justify-center p-4">{children}</main>

      <footer className="p-4 border-t border-gray-800 bg-black/40">
        <div className="container mx-auto text-center text-sm text-gray-400">MIT License</div>
      </footer>
    </div>
  );
}
