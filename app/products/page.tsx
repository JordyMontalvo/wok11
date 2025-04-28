"use client"

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useCart } from '@/context/CartContext'
import { productAPI } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { 
  Search, 
  ShoppingCart, 
  Filter,
  SlidersHorizontal,
  Loader2
} from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"

type Product = {
  id: number
  name: string
  description: string
  price: number
  image: string
  category: string
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [priceRange, setPriceRange] = useState([0, 1000])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [sortBy, setSortBy] = useState('featured')
  const searchParams = useSearchParams()
  const { addToCart, loading: cartLoading } = useCart()
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const data = await productAPI.getAll()
        setProducts(data)
        setFilteredProducts(data)
        
        // Check for search param in URL
        const search = searchParams.get('search')
        if (search) {
          setSearchQuery(search)
          filterProducts(search, priceRange, selectedCategories, sortBy, data)
        }
        
        // Check for category param in URL
        const category = searchParams.get('category')
        if (category) {
          const categories = [category]
          setSelectedCategories(categories)
          filterProducts(searchQuery, priceRange, categories, sortBy, data)
        }
      } catch (error) {
        console.error('Error fetching products:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [searchParams])

  const filterProducts = (
    query: string,
    range: number[],
    categories: string[],
    sort: string,
    productList = products
  ) => {
    let filtered = [...productList]
    
    // Filter by search query
    if (query) {
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase())
      )
    }
    
    // Filter by price range
    filtered = filtered.filter(product => 
      product.price >= range[0] && product.price <= range[1]
    )
    
    // Filter by categories
    if (categories.length > 0) {
      filtered = filtered.filter(product => 
        categories.includes(product.category)
      )
    }
    
    // Sort products
    switch(sort) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price)
        break
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price)
        break
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name))
        break
      // default is 'featured' - no sorting needed
    }
    
    setFilteredProducts(filtered)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    filterProducts(searchQuery, priceRange, selectedCategories, sortBy)
  }

  const handleCategoryChange = (category: string) => {
    const updatedCategories = selectedCategories.includes(category)
      ? selectedCategories.filter(c => c !== category)
      : [...selectedCategories, category]
    
    setSelectedCategories(updatedCategories)
    filterProducts(searchQuery, priceRange, updatedCategories, sortBy)
  }

  const handlePriceChange = (value: number[]) => {
    setPriceRange(value)
    filterProducts(searchQuery, value, selectedCategories, sortBy)
  }

  const handleSortChange = (value: string) => {
    setSortBy(value)
    filterProducts(searchQuery, priceRange, selectedCategories, value)
  }

  const handleAddToCart = async (productId: number) => {
    await addToCart(productId, 1)
  }

  // Get unique categories from products
  const categories = [...new Set(products.map(product => product.category))]

  // Find min and max price in products
  const minPrice = Math.min(...products.map(product => product.price), 0)
  const maxPrice = Math.max(...products.map(product => product.price), 1000)

  return (
    <div className="container py-8 px-4 md:px-6">
      <div className="flex flex-col md:flex-row justify-between items-start gap-6">
        {/* Mobile Filter Button */}
        <div className="w-full md:hidden flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Products</h1>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="ml-auto">
                <Filter className="mr-2 h-4 w-4" />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle>Filter Products</SheetTitle>
              </SheetHeader>
              <div className="py-4">
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="category">
                    <AccordionTrigger>Categories</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2">
                        {categories.map(category => (
                          <div key={category} className="flex items-center space-x-2">
                            <Checkbox 
                              id={`category-mobile-${category}`} 
                              checked={selectedCategories.includes(category)}
                              onCheckedChange={() => handleCategoryChange(category)}
                            />
                            <label 
                              htmlFor={`category-mobile-${category}`}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {category}
                            </label>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="price">
                    <AccordionTrigger>Price Range</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4">
                        <Slider
                          defaultValue={[minPrice, maxPrice]}
                          max={maxPrice}
                          step={1}
                          value={priceRange}
                          onValueChange={handlePriceChange}
                        />
                        <div className="flex items-center justify-between">
                          <span>${priceRange[0]}</span>
                          <span>${priceRange[1]}</span>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
                <div className="mt-4">
                  <SheetClose asChild>
                    <Button className="w-full">Apply Filters</Button>
                  </SheetClose>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop Sidebar */}
        <div className="hidden md:block w-1/4">
          <div className="sticky top-20 space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Categories</h3>
              <div className="space-y-2">
                {categories.map(category => (
                  <div key={category} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`category-${category}`} 
                      checked={selectedCategories.includes(category)}
                      onCheckedChange={() => handleCategoryChange(category)}
                    />
                    <label 
                      htmlFor={`category-${category}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {category}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Price Range</h3>
              <div className="space-y-4">
                <Slider
                  defaultValue={[minPrice, maxPrice]}
                  max={maxPrice}
                  step={1}
                  value={priceRange}
                  onValueChange={handlePriceChange}
                />
                <div className="flex items-center justify-between">
                  <span>${priceRange[0]}</span>
                  <span>${priceRange[1]}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="w-full md:w-3/4">
          <div className="flex flex-col">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-6">
              <h1 className="text-2xl font-bold hidden md:block">Products</h1>
              <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-4 sm:items-center">
                <form onSubmit={handleSearch} className="relative w-full sm:w-[300px]">
                  <Input
                    type="search"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pr-10"
                  />
                  <Button type="submit" variant="ghost" size="icon" className="absolute right-0 top-0">
                    <Search className="h-4 w-4" />
                    <span className="sr-only">Search</span>
                  </Button>
                </form>
                <Select value={sortBy} onValueChange={handleSortChange}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <div className="flex items-center">
                      <SlidersHorizontal className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="Sort by" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="name">Name</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Applied filters */}
            {(selectedCategories.length > 0 || searchQuery) && (
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedCategories.map(category => (
                  <Badge key={category} variant="secondary" className="px-3 py-1">
                    {category}
                    <button
                      onClick={() => handleCategoryChange(category)}
                      className="ml-2 text-xs font-medium"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
                {searchQuery && (
                  <Badge variant="secondary" className="px-3 py-1">
                    Search: {searchQuery}
                    <button
                      onClick={() => {
                        setSearchQuery('')
                        filterProducts('', priceRange, selectedCategories, sortBy)
                      }}
                      className="ml-2 text-xs font-medium"
                    >
                      ×
                    </button>
                  </Badge>
                )}
                {(selectedCategories.length > 0 || searchQuery) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSearchQuery('')
                      setSelectedCategories([])
                      setPriceRange([minPrice, maxPrice])
                      setSortBy('featured')
                      setFilteredProducts(products)
                    }}
                    className="text-sm h-7 px-3"
                  >
                    Clear all
                  </Button>
                )}
              </div>
            )}

            {/* Products Grid */}
            {loading ? (
              <div className="flex justify-center items-center h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-xl font-medium mb-2">No products found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <Card key={product.id} className="overflow-hidden group">
                    <div className="aspect-square relative overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <CardContent className="p-4">
                      <CardTitle className="line-clamp-1">{product.name}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{product.description}</p>
                      <p className="mt-2 font-semibold">${product.price.toFixed(2)}</p>
                    </CardContent>
                    <CardFooter className="p-4 pt-0">
                      <Button 
                        className="w-full" 
                        onClick={() => handleAddToCart(product.id)}
                        disabled={cartLoading}
                      >
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        Add to Cart
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}