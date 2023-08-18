import { useEffect } from 'react';
import { Link } from 'react-router-dom';

const EntityError = () => {
  useEffect(() => {
    document.title = 'NaN';
  }, []);
  return (
    <div className="flex items-center justify-center flex-col h-[calc(100vh-5.25rem)] gap-3">
      <h1>The current user has not joined a Legal Entity</h1>
      <Link to="/join-entity" className="py-2 px-4 bg-primary rounded-md text-white font-inter font-semibold">
        Join now
      </Link>
    </div>
  );
};

export default EntityError;
