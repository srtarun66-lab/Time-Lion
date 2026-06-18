'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

export interface Product {
  _id: string;
  name: string;
  description?: string;
  price: number;
  originalPrice?: number;
  image: string;
  badge?: string;
  rating?: number;
  category?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (id: string) => void;
  changeQty: (id: string, delta: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  checkoutProduct: Product | null;
  setCheckoutProduct: (product: Product | null) => void;
  wishlist: Product[];
  toggleWishlist: (product: Product) => void;
  isInWishlist: (id: string) => boolean;
  setCartState: (c: CartItem[]) => void;
  setWishlistState: (w: Product[]) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [checkoutProduct, setCheckoutProduct] = useState<Product | null>(null);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const { user } = useAuth();

  const syncCartToDB = async (newCart: CartItem[]) => {
    if (user?.phone) {
      fetch('/api/users/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: user.phone, cart: newCart })
      }).catch(console.error);
    }
  };

  const syncWishlistToDB = async (newWishlist: Product[]) => {
    if (user?.phone) {
      fetch('/api/users/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: user.phone, wishlist: newWishlist })
      }).catch(console.error);
    }
  };

  useEffect(() => {
    try {
      const saved = localStorage.getItem('timelion_cart');
      if (saved) setCart(JSON.parse(saved));
      const savedWish = localStorage.getItem('timelion_wishlist');
      if (savedWish) setWishlist(JSON.parse(savedWish));
    } catch (err) {}
  }, []);

  const saveCart = (newCart: CartItem[]) => {
    setCart(newCart);
    try {
      localStorage.setItem('timelion_cart', JSON.stringify(newCart));
    } catch (err) {}
    syncCartToDB(newCart);
  };

  const setCartState = (c: CartItem[]) => {
    setCart(c);
    try { localStorage.setItem('timelion_cart', JSON.stringify(c)); } catch (err) {}
  };

  const setWishlistState = (w: Product[]) => {
    setWishlist(w);
    try { localStorage.setItem('timelion_wishlist', JSON.stringify(w)); } catch (err) {}
  };

  const toggleWishlist = (product: Product) => {
    const exists = wishlist.some((i) => i._id === product._id);
    const newWishlist = exists 
      ? wishlist.filter((i) => i._id !== product._id)
      : [...wishlist, product];
    
    setWishlist(newWishlist);
    
    try {
      localStorage.setItem('timelion_wishlist', JSON.stringify(newWishlist));
    } catch (e) {}
    syncWishlistToDB(newWishlist);
  };

  const isInWishlist = (id: string) => {
    return wishlist.some(i => i._id === id);
  };

  const addToCart = (product: Product) => {
    const existing = cart.find((i) => i._id === product._id);
    if (existing) {
      saveCart(
        cart.map((i) =>
          i._id === product._id ? { ...i, quantity: i.quantity + 1 } : i
        )
      );
    } else {
      saveCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (id: string) => {
    saveCart(cart.filter((i) => i._id !== id));
  };

  const changeQty = (id: string, delta: number) => {
    saveCart(
      cart.map((i) => {
        if (i._id === id) {
          return { ...i, quantity: Math.max(1, i.quantity + delta) };
        }
        return i;
      })
    );
  };

  const clearCart = () => {
    saveCart([]);
  };

  const getCartTotal = () => {
    return cart.reduce((s, i) => s + i.price * i.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        changeQty,
        clearCart,
        getCartTotal,
        isCartOpen,
        setIsCartOpen,
        checkoutProduct,
        setCheckoutProduct,
        wishlist,
        toggleWishlist,
        isInWishlist,
        setCartState,
        setWishlistState,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

