"use client"

import React, { createContext, useContext, useState, useEffect } from 'react';
import { cartAPI } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from './AuthContext';

// Define types
type CartItem = {
  productId: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
};

type Cart = {
  userId: number;
  items: CartItem[];
};

type CartContextType = {
  cart: Cart | null;
  loading: boolean;
  addToCart: (productId: number, quantity?: number) => Promise<void>;
  updateQuantity: (productId: number, quantity: number) => Promise<void>;
  removeFromCart: (productId: number) => Promise<void>;
  clearCart: () => void;
  getCartTotal: () => number;
  getItemCount: () => number;
};

// Create context with default values
const CartContext = createContext<CartContextType>({
  cart: null,
  loading: false,
  addToCart: async () => {},
  updateQuantity: async () => {},
  removeFromCart: async () => {},
  clearCart: () => {},
  getCartTotal: () => 0,
  getItemCount: () => 0,
});

// Hook to use the cart context
export const useCart = () => useContext(CartContext);

// Provider component that wraps the app
export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  // Fetch cart when user changes
  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setCart(null);
    }
  }, [user]);

  // Fetch cart from API
  const fetchCart = async () => {
    try {
      setLoading(true);
      const data = await cartAPI.getCart();
      setCart(data);
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  // Add item to cart
  const addToCart = async (productId: number, quantity: number = 1) => {
    try {
      setLoading(true);
      const updatedCart = await cartAPI.addToCart(productId, quantity);
      setCart(updatedCart);
      toast({
        title: "Added to cart",
        description: "Item added to your cart successfully",
      });
    } catch (error: any) {
      console.error('Error adding to cart:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to add item to cart",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Update item quantity
  const updateQuantity = async (productId: number, quantity: number) => {
    try {
      setLoading(true);
      const updatedCart = await cartAPI.updateQuantity(productId, quantity);
      setCart(updatedCart);
      toast({
        title: "Cart updated",
        description: "Cart quantity updated successfully",
      });
    } catch (error: any) {
      console.error('Error updating cart:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update cart",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Remove item from cart
  const removeFromCart = async (productId: number) => {
    try {
      setLoading(true);
      const updatedCart = await cartAPI.removeFromCart(productId);
      setCart(updatedCart);
      toast({
        title: "Removed from cart",
        description: "Item removed from your cart",
      });
    } catch (error: any) {
      console.error('Error removing from cart:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to remove item from cart",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Clear cart
  const clearCart = () => {
    // Just for frontend state management, doesn't affect backend
    setCart(user ? { userId: user.id, items: [] } : null);
  };

  // Calculate cart total
  const getCartTotal = () => {
    if (!cart) return 0;
    return cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  // Calculate total number of items in cart
  const getItemCount = () => {
    if (!cart) return 0;
    return cart.items.reduce((sum, item) => sum + item.quantity, 0);
  };

  // Value object to be provided by context
  const value = {
    cart,
    loading,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getCartTotal,
    getItemCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};