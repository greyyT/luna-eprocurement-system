import { useEffect } from 'react';

const Home = () => {
  useEffect(() => {
    document.title = 'Home';
  }, []);
  return (
    <div>
      <h1>Home Page</h1>
    </div>
  );
};

export default Home;
