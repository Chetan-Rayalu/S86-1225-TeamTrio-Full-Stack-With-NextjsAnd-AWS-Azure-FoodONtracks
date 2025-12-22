import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'FoodONtracks - Food Traceability System',
  description: 'A comprehensive batch traceability system for food management',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50">
        {/* Navigation Bar */}
        <nav className="bg-gray-900 text-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <Link href="/" className="text-xl font-bold hover:text-gray-200">
              🍔 FoodONtracks
            </Link>
            <ul className="flex gap-6">
              <li>
                <Link href="/" className="hover:text-gray-300 transition">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-gray-300 transition">
                  Login
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-gray-300 transition">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/users" className="hover:text-gray-300 transition">
                  Users
                </Link>
              </li>
            </ul>
          </div>
        </nav>

        {/* Main Content */}
        <div className="min-h-screen">
          {children}
        </div>

        {/* Footer */}
        <footer className="bg-gray-800 text-white text-center py-4 mt-10">
          <p>&copy; 2025 FoodONtracks. All rights reserved.</p>
        </footer>
      </body>
    </html>
  );
}
