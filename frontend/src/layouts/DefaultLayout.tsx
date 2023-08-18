import { useLocation, useNavigate } from 'react-router-dom';
import useToken from '@/hooks/useToken';
import { useEffect, useMemo, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';
import useCurrentUser from '@/hooks/useCurrentUser';
import EntityError from '@/pages/EntityError';

const DefaultLayout = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Initialize the 'params' object with the current search parameters
  const params = useMemo(() => new URLSearchParams(location.search), [location.search]);

  const { token } = useToken();
  const { data: user } = useCurrentUser(token);

  const [entityCode, setEntityCode] = useState<string | null>(params.get('entityCode'));

  useEffect(() => {
    if (!token) {
      navigate('/sign-in');
    }
    if (user && user.legalEntityCode !== entityCode) {
      setEntityCode(user.legalEntityCode);
      params.set('entityCode', user.legalEntityCode || 'null');
      navigate({ search: params.toString() });
    }
  }, [token, navigate, location, user, entityCode, params]);

  return (
    <>
      <Sidebar />
      <main className="pl-70 min-h-screen bg-mainBg">
        <Topbar />
        {entityCode === null ? <EntityError /> : children}
      </main>
    </>
  );
};

export default DefaultLayout;
