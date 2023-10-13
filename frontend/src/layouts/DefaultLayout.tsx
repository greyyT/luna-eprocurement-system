import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';
import Loader from '@/components/ui/Loader';
import useCurrentUser from '@/hooks/useCurrentUser';
import EntityError from '@/pages/EntityError';
import { Suspense } from 'react';

const DefaultLayout = ({ children }: { children: React.ReactNode }) => {
  const { data: user, isLoading } = useCurrentUser();

  if (isLoading) return <Loader />;

  return (
    <>
      <Sidebar />
      <main className="pl-70 min-h-screen bg-mainBg flex flex-col">
        <Topbar />
        {user?.legalEntityCode === null ? <EntityError /> : <Suspense>{children}</Suspense>}
      </main>
    </>
  );
};

export default DefaultLayout;
