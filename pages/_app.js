import '../styles/globals.css';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import '@fortawesome/fontawesome-free/css/all.min.css';
import Player from '../components/Player/Player';

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    if (router.pathname === '/_error') {
      router.push('/');
    }
  }, [router]);

  return (
    <>
      <Component {...pageProps} />
      <Player />
    </>
  );
}

export default MyApp; 