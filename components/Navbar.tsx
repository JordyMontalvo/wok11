"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { useCart } from '@/context/CartContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  ShoppingCart, 
  Menu, 
  X, 
  User, 
  ShoppingBag, 
  LogOut, 
  UserPlus, 
  LogIn, 
  Search, 
  Moon, 
  Sun, 
  Home,
  Users
} from 'lucide-react'
import { useTheme } from 'next-themes'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth()
  const { getItemCount } = useCart()
  const { theme, setTheme } = useTheme()
  const router = useRouter()
  const pathname = usePathname()
  const [isMounted, setIsMounted] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  // Prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery)}`)
    }
  }

  const NavItems = () => (
    <>
      <Link href="/" className={`text-lg font-medium hover:text-primary transition-colors ${pathname === '/' ? 'text-primary' : 'text-muted-foreground'}`}>
        Home
      </Link>
      <Link href="/products" className={`text-lg font-medium hover:text-primary transition-colors ${pathname === '/products' ? 'text-primary' : 'text-muted-foreground'}`}>
        Products
      </Link>
      {isAdmin() && (
        <Link href="/admin/users" className={`text-lg font-medium hover:text-primary transition-colors ${pathname === '/admin/users' ? 'text-primary' : 'text-muted-foreground'}`}>
          Manage Users
        </Link>
      )}
    </>
  )

  if (!isMounted) {
    return null
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex items-center justify-between h-16 px-4 md:px-6">
        <div className="flex items-center gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col gap-6 mt-6">
                <Link href="/" className="flex items-center gap-2">
                  <ShoppingBag className="h-6 w-6" />
                  <span className="font-bold text-xl">E-Store</span>
                </Link>
                <div className="grid gap-4">
                  <SheetClose asChild>
                    <Link href="/" className="flex items-center gap-2 text-lg font-medium hover:text-primary transition-colors">
                      <Home className="h-5 w-5" />
                      Home
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link href="/products" className="flex items-center gap-2 text-lg font-medium hover:text-primary transition-colors">
                      <ShoppingBag className="h-5 w-5" />
                      Products
                    </Link>
                  </SheetClose>
                  {isAdmin() && (
                    <SheetClose asChild>
                      <Link href="/admin/users" className="flex items-center gap-2 text-lg font-medium hover:text-primary transition-colors">
                        <Users className="h-5 w-5" />
                        Manage Users
                      </Link>
                    </SheetClose>
                  )}
                  {user ? (
                    <>
                      <SheetClose asChild>
                        <Link href="/profile" className="flex items-center gap-2 text-lg font-medium hover:text-primary transition-colors">
                          <User className="h-5 w-5" />
                          Profile
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Button 
                          variant="ghost" 
                          className="flex items-center justify-start gap-2 text-lg font-medium hover:text-primary transition-colors px-2"
                          onClick={() => logout()}
                        >
                          <LogOut className="h-5 w-5" />
                          Logout
                        </Button>
                      </SheetClose>
                    </>
                  ) : (
                    <>
                      <SheetClose asChild>
                        <Link href="/login" className="flex items-center gap-2 text-lg font-medium hover:text-primary transition-colors">
                          <LogIn className="h-5 w-5" />
                          Login
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link href="/register" className="flex items-center gap-2 text-lg font-medium hover:text-primary transition-colors">
                          <UserPlus className="h-5 w-5" />
                          Register
                        </Link>
                      </SheetClose>
                    </>
                  )}
                </div>
              </nav>
            </SheetContent>
          </Sheet>
          <Link href="/" className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            <span className="font-bold text-xl hidden md:inline-block">E-Store</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 ml-6">
            <NavItems />
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <form onSubmit={handleSearch} className="hidden md:flex relative w-48 lg:w-64">
            <Input
              type="search"
              placeholder="Search products..."
              className="w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button type="submit" variant="ghost" size="icon" className="absolute right-0 top-0">
              <Search className="h-4 w-4" />
              <span className="sr-only">Search</span>
            </Button>
          </form>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                {theme === 'dark' ? (
                  <Moon className="h-5 w-5" />
                ) : (
                  <Sun className="h-5 w-5" />
                )}
                <span className="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme('light')}>
                Light
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme('dark')}>
                Dark
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme('system')}>
                System
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Link href="/cart">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {getItemCount() > 0 && (
                <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                  {getItemCount()}
                </Badge>
              )}
              <span className="sr-only">Cart</span>
            </Button>
          </Link>
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <User className="h-5 w-5" />
                  <span className="sr-only">User menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/orders">Orders</Link>
                </DropdownMenuItem>
                {isAdmin() && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin/users">Manage Users</Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={() => logout()}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                  <span className="sr-only">User menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="/login">Login</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/register">Register</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  )
}