// src/pages/index.js

import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import useWindowWidth from '../hooks/useWindowWidth';

const Home = dynamic(() => import('../components/Home'), { ssr: false });
const HomeDesktop = dynamic(() => import('../components/HomeDesktop'), { ssr: false });

const HomePage = () => {
  const width = useWindowWidth();
  const breakpoint = 1024;
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    // Afficher un loader ou rien côté serveur
    return (
      <>
        <Head>
          <title>Gabriel Taca - Portfolio | Idéation créative en mode solution</title>
          <meta name="description" content="Portfolio de Gabriel Taca - Développeur créatif spécialisé en solutions web innovantes. Découvrez mes projets, mon CV et mes idées créatives." />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
        <div>Chargement...</div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Gabriel Taca - Portfolio | Idéation créative en mode solution</title>
        <meta name="description" content="Portfolio de Gabriel Taca - Développeur créatif spécialisé en solutions web innovantes. Découvrez mes projets, mon CV et mes idées créatives." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      {width >= breakpoint ? <HomeDesktop /> : <Home />}
    </>
  );
};

export default HomePage;
