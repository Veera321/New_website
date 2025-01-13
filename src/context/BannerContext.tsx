import React, { createContext, useContext, useState, useEffect } from 'react';

interface Banner {
  id: string;
  imageUrl: string;
  title: string;
  description?: string;
  link?: string;
  order: number;
}

interface BannerContextType {
  banners: Banner[];
  addBanner: (banner: Omit<Banner, 'id'>) => void;
  updateBanner: (id: string, banner: Partial<Banner>) => void;
  deleteBanner: (id: string) => void;
  reorderBanners: (bannerId: string, newOrder: number) => void;
  saveBanners: () => Promise<void>;
  loading: boolean;
}

const BannerContext = createContext<BannerContextType | undefined>(undefined);

export const BannerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load banners from localStorage on mount
    const loadBanners = () => {
      const savedBanners = localStorage.getItem('banners');
      if (savedBanners) {
        setBanners(JSON.parse(savedBanners));
      }
      setLoading(false);
    };
    loadBanners();
  }, []);

  const addBanner = (banner: Omit<Banner, 'id'>) => {
    const newBanner: Banner = {
      ...banner,
      id: Math.random().toString(36).substr(2, 9),
    };
    setBanners(prev => [...prev, newBanner]);
  };

  const updateBanner = (id: string, updatedFields: Partial<Banner>) => {
    setBanners(prev =>
      prev.map(banner =>
        banner.id === id ? { ...banner, ...updatedFields } : banner
      )
    );
  };

  const deleteBanner = (id: string) => {
    setBanners(prev => prev.filter(banner => banner.id !== id));
  };

  const reorderBanners = (bannerId: string, newOrder: number) => {
    setBanners(prev => {
      const banner = prev.find(b => b.id === bannerId);
      if (!banner) return prev;

      const filtered = prev.filter(b => b.id !== bannerId);
      const reordered = [
        ...filtered.slice(0, newOrder),
        banner,
        ...filtered.slice(newOrder)
      ];

      return reordered.map((b, index) => ({ ...b, order: index }));
    });
  };

  const saveBanners = async () => {
    setLoading(true);
    try {
      localStorage.setItem('banners', JSON.stringify(banners));
    } catch (error) {
      console.error('Error saving banners:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <BannerContext.Provider
      value={{
        banners,
        addBanner,
        updateBanner,
        deleteBanner,
        reorderBanners,
        saveBanners,
        loading
      }}
    >
      {children}
    </BannerContext.Provider>
  );
};

export const useBanner = () => {
  const context = useContext(BannerContext);
  if (context === undefined) {
    throw new Error('useBanner must be used within a BannerProvider');
  }
  return context;
};
