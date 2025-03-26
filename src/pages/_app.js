import '../styles/styles.scss'; // Import des styles globaux
import { useEffect } from 'react';
import Layout from '../components/Layout';
import { ThemeProvider } from '../context/ThemeContext'; // Import du ThemeProvider

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    const setVH = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };
  
    setVH();
    window.addEventListener("resize", setVH);
  
    return () => window.removeEventListener("resize", setVH);
  }, []);


  return (
    <ThemeProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ThemeProvider>
  );
}

export default MyApp;