import { useEffect, useState } from 'react';

const Home = () => {
  const [windowHeight, setWindowHeight] = useState<number>(window.innerHeight);

  useEffect(() => {
    document.title = 'Home';

    window.addEventListener('resize', () => {
      setWindowHeight(window.innerHeight);
    });

    return () => {
      window.removeEventListener('resize', () => {
        setWindowHeight(window.innerHeight);
      });
    };
  }, []);
  return (
    <div
      className="bg-[url('/images/home-bg.png')] bg-center bg-contain bg-white bg-no-repeat h-[calc(100vh-5rem)]"
      style={{ height: windowHeight - 82 }}
    ></div>
  );
};

export default Home;
