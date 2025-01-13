import React, { createContext, useContext, useState, useEffect } from 'react';

interface SocialMediaLinks {
  instagram: string;
  twitter: string;
  facebook: string;
  linkedin: string;
}

interface SocialMediaContextType {
  links: SocialMediaLinks;
  updateLinks: (newLinks: SocialMediaLinks) => void;
}

const SocialMediaContext = createContext<SocialMediaContextType | undefined>(undefined);

export const SocialMediaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [links, setLinks] = useState<SocialMediaLinks>(() => {
    const savedLinks = localStorage.getItem('socialMediaLinks');
    return savedLinks ? JSON.parse(savedLinks) : {
      instagram: 'https://instagram.com',
      twitter: 'https://twitter.com',
      facebook: 'https://facebook.com',
      linkedin: 'https://linkedin.com'
    };
  });

  const updateLinks = (newLinks: SocialMediaLinks) => {
    setLinks(newLinks);
    localStorage.setItem('socialMediaLinks', JSON.stringify(newLinks));
  };

  return (
    <SocialMediaContext.Provider value={{ links, updateLinks }}>
      {children}
    </SocialMediaContext.Provider>
  );
};

export const useSocialMedia = () => {
  const context = useContext(SocialMediaContext);
  if (context === undefined) {
    throw new Error('useSocialMedia must be used within a SocialMediaProvider');
  }
  return context;
};
