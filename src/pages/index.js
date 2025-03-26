// src/pages/index.js

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import useWindowWidth from '../hooks/useWindowWidth';

const Home = dynamic(() => import('../components/Home'), { ssr: false });
const HomeDesktop = dynamic(() => import('../components/HomeDesktop'), { ssr: false });

const HomePage = () => {
  const width = useWindowWidth();
  const breakpoint = 1200;
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    // Afficher un loader ou rien côté serveur
    return <div>Chargement...</div>;
  }

  return width >= breakpoint ? <HomeDesktop /> : <Home />;
};

export default HomePage;
