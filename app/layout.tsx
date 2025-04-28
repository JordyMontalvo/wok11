import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { ThemeProvider } from '@/components/ThemeProvider';
import Navbar from '@/components/Navbar';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'E-Commerce Store',
  description: 'Modern e-commerce platform for all your shopping needs',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            <CartProvider>
              <div className="flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-1">
                  {children}
                </main>
                <footer className="py-6 border-t">
                  <div className="container px-4 md:px-6">
                    <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
                      <div>
                        <h4 className="font-medium">Shop</h4>
                        <nav className="mt-4 space-y-2">
                          <div className="text-sm text-muted-foreground hover:text-foreground">All Products</div>
                          <div className="text-sm text-muted-foreground hover:text-foreground">Featured</div>
                          <div className="text-sm text-muted-foreground hover:text-foreground">New Arrivals</div>
                        </nav>
                      </div>
                      <div>
                        <h4 className="font-medium">Company</h4>
                        <nav className="mt-4 space-y-2">
                          <div className="text-sm text-muted-foreground hover:text-foreground">About Us</div>
                          <div className="text-sm text-muted-foreground hover:text-foreground">Contact</div>
                          <div className="text-sm text-muted-foreground hover:text-foreground">Terms & Conditions</div>
                        </nav>
                      </div>
                      <div>
                        <h4 className="font-medium">Customer Service</h4>
                        <nav className="mt-4 space-y-2">
                          <div className="text-sm text-muted-foreground hover:text-foreground">FAQ</div>
                          <div className="text-sm text-muted-foreground hover:text-foreground">Shipping</div>
                          <div className="text-sm text-muted-foreground hover:text-foreground">Returns</div>
                        </nav>
                      </div>
                      <div>
                        <h4 className="font-medium">Contact</h4>
                        <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                          <p>Email: support@estore.com</p>
                          <p>Phone: (123) 456-7890</p>
                          <p>Address: 123 Commerce St, City</p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-8 pt-6 border-t text-center text-sm text-muted-foreground">
                      © {new Date().getFullYear()} E-Commerce Store. All rights reserved.
                    </div>
                  </div>
                </footer>
              </div>
              <Toaster />
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}