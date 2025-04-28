import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ShoppingBag, TrendingUp, Award, Shield } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-background to-muted">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  Discover Quality Products for Every Need
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Shop the latest trends and essentials. Fast shipping, secure checkout, and exceptional customer service.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/products">
                  <Button size="lg" className="px-8">
                    Shop Now <ShoppingBag className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="lg" variant="outline" className="px-8">
                    Create Account
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="relative w-full max-w-[500px] aspect-[4/3] overflow-hidden rounded-xl">
                <img
                  alt="Electronics showcase"
                  className="object-cover w-full h-full"
                  src="https://images.pexels.com/photos/1029757/pexels-photo-1029757.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="w-full py-12 md:py-24 bg-background">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Shop by Category
              </h2>
              <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed">
                Explore our wide range of quality products for every need and occasion.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <Link href="/products?category=Electronics" className="group">
              <div className="relative overflow-hidden rounded-lg">
                <img
                  src="https://images.pexels.com/photos/3183177/pexels-photo-3183177.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                  alt="Electronics"
                  className="w-full h-[250px] object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-white">Electronics</h3>
                    <p className="text-white/80">Latest gadgets and tech</p>
                  </div>
                </div>
              </div>
            </Link>
            <Link href="/products?category=Clothing" className="group">
              <div className="relative overflow-hidden rounded-lg">
                <img
                  src="https://images.pexels.com/photos/934070/pexels-photo-934070.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                  alt="Clothing"
                  className="w-full h-[250px] object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-white">Clothing</h3>
                    <p className="text-white/80">Stylish apparel for all</p>
                  </div>
                </div>
              </div>
            </Link>
            <Link href="/products?category=Home" className="group">
              <div className="relative overflow-hidden rounded-lg">
                <img
                  src="https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                  alt="Home & Living"
                  className="w-full h-[250px] object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-white">Home & Living</h3>
                    <p className="text-white/80">Decorations and essentials</p>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-12 md:py-24 bg-muted">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Why Choose Us
              </h2>
              <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed">
                Discover the advantages of shopping with our trusted e-commerce platform.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="bg-primary/10 p-4 rounded-full">
                <TrendingUp className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Fast Shipping</h3>
              <p className="text-muted-foreground">
                Get your orders delivered quickly and reliably with our expedited shipping options.
              </p>
            </div>
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="bg-primary/10 p-4 rounded-full">
                <Award className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Quality Products</h3>
              <p className="text-muted-foreground">
                We carefully select each product to ensure the highest quality standards.
              </p>
            </div>
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="bg-primary/10 p-4 rounded-full">
                <Shield className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Secure Payments</h3>
              <p className="text-muted-foreground">
                Shop with confidence using our secure and encrypted payment processing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-12 md:py-24 bg-primary">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter text-primary-foreground sm:text-4xl md:text-5xl">
                Ready to Start Shopping?
              </h2>
              <p className="max-w-[700px] text-primary-foreground/80 md:text-xl/relaxed">
                Create an account today and get access to exclusive deals and offers.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link href="/register">
                <Button size="lg" className="px-8 bg-background text-primary hover:bg-muted">
                  Sign Up Now
                </Button>
              </Link>
              <Link href="/products">
                <Button size="lg" variant="outline" className="px-8 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                  Browse Products
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}