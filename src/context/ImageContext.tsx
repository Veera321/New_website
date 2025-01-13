import React, { createContext, useContext, useState, useEffect } from 'react';

export enum BannerSection {
  TOP = 'top',
  MIDDLE = 'middle',
  BOTTOM = 'bottom',
}

interface BannerImage {
  id: string;
  url: string;
  title: string;
  description?: string;
  section: BannerSection;
  order: number;
}

interface PackageImage {
  id: string;
  packageId: string;
  packageName: string;
  url: string;
  alt: string;
  createdAt: string;
}

interface ImageContextType {
  bannerImages: BannerImage[];
  packageImages: PackageImage[];
  addBannerImage: (image: Omit<BannerImage, 'id'>) => void;
  updateBannerImage: (id: string, image: Partial<BannerImage>) => void;
  removeBannerImage: (id: string) => void;
  reorderBannerImages: (section: BannerSection, images: BannerImage[]) => void;
  getBannerImagesBySection: (section: BannerSection) => BannerImage[];
  addPackageImage: (image: Omit<PackageImage, 'id' | 'createdAt'>) => void;
  updatePackageImage: (id: string, image: Partial<PackageImage>) => void;
  removePackageImage: (id: string) => void;
  getPackageImages: (packageId: string) => PackageImage[];
  uploadImage: (file: File) => Promise<string>;
}

const ImageContext = createContext<ImageContextType | undefined>(undefined);

export const useImages = () => {
  const context = useContext(ImageContext);
  if (!context) {
    throw new Error('useImages must be used within an ImageProvider');
  }
  return context;
};

const generateUniqueId = () => {
  return Math.random().toString(36).substr(2, 9);
};

export const ImageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [bannerImages, setBannerImages] = useState<BannerImage[]>(() => {
    const savedImages = localStorage.getItem('bannerImages');
    return savedImages ? JSON.parse(savedImages) : [];
  });

  const [packageImages, setPackageImages] = useState<PackageImage[]>(() => {
    const savedImages = localStorage.getItem('packageImages');
    return savedImages ? JSON.parse(savedImages) : [];
  });

  useEffect(() => {
    localStorage.setItem('bannerImages', JSON.stringify(bannerImages));
  }, [bannerImages]);

  useEffect(() => {
    localStorage.setItem('packageImages', JSON.stringify(packageImages));
  }, [packageImages]);

  const addBannerImage = (image: Omit<BannerImage, 'id'>) => {
    const newImage = { ...image, id: generateUniqueId() };
    setBannerImages(prev => [...prev, newImage]);
  };

  const updateBannerImage = (id: string, image: Partial<BannerImage>) => {
    setBannerImages(prev =>
      prev.map(img => (img.id === id ? { ...img, ...image } : img))
    );
  };

  const removeBannerImage = (id: string) => {
    setBannerImages(prev => prev.filter(img => img.id !== id));
  };

  const reorderBannerImages = (section: BannerSection, images: BannerImage[]) => {
    setBannerImages(prev => {
      const otherSections = prev.filter(img => img.section !== section);
      return [...otherSections, ...images];
    });
  };

  const getBannerImagesBySection = (section: BannerSection) => {
    return bannerImages
      .filter(img => img.section === section)
      .sort((a, b) => a.order - b.order);
  };

  const addPackageImage = (image: Omit<PackageImage, 'id' | 'createdAt'>) => {
    const newImage = {
      ...image,
      id: generateUniqueId(),
      createdAt: new Date().toISOString(),
    };
    setPackageImages(prev => [...prev, newImage]);
  };

  const updatePackageImage = (id: string, image: Partial<PackageImage>) => {
    setPackageImages(prev =>
      prev.map(img => (img.id === id ? { ...img, ...image } : img))
    );
  };

  const removePackageImage = (id: string) => {
    setPackageImages(prev => prev.filter(img => img.id !== id));
  };

  const getPackageImages = (packageId: string) => {
    return packageImages.filter(img => img.packageId === packageId);
  };

  const uploadImage = async (file: File): Promise<string> => {
    // For now, we'll use a simple base64 encoding for local storage
    // In a production environment, this should be replaced with actual server upload
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject(new Error('Failed to convert image to base64'));
        }
      };
      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };
      reader.readAsDataURL(file);
    });
  };

  return (
    <ImageContext.Provider
      value={{
        bannerImages,
        packageImages,
        addBannerImage,
        updateBannerImage,
        removeBannerImage,
        reorderBannerImages,
        getBannerImagesBySection,
        addPackageImage,
        updatePackageImage,
        removePackageImage,
        getPackageImages,
        uploadImage,
      }}
    >
      {children}
    </ImageContext.Provider>
  );
};
