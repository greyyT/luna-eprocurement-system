import { Toaster } from 'react-hot-toast';

export const ToasterProvider = () => {
  return (
    <Toaster
      toastOptions={{
        className: 'font-inter text-base font-medium px-4 py-2',
        style: {
          maxWidth: '400px',
        },
      }}
      gutter={24}
    />
  );
};
