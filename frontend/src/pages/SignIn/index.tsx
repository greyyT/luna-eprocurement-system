import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { z } from 'zod';

import Input from '@/components/ui/Input';
import axiosInstance, { handleError } from '@/api/axios';
import useCurrentUser from '@/hooks/useCurrentUser';
import { AxiosError } from 'axios';

const passwordSchema = z
  .string()
  .min(8)
  .max(32)
  .refine(
    (password) => {
      // Use regular expressions to check for at least one uppercase letter and one number
      const uppercaseRegex = /[A-Z]/;
      const numberRegex = /[0-9]/;

      return uppercaseRegex.test(password) && numberRegex.test(password);
    },
    {
      message: 'Password must have 8 to 32 characters, at least one uppercase letter, and one number',
    },
  );

const schema = z.object({
  email: z.string().min(1, { message: 'Email is required' }).email(),
  password: passwordSchema,
});

const SignIn = () => {
  useEffect(() => {
    document.title = 'Sign In';
  }, []);

  console.log('ENV', import.meta.env.VITE_BACKEND_API);

  const [loading, setLoading] = useState<boolean>(false);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState({ email: '', password: '' });

  // Mutate the current user data after signing in
  const { mutate } = useCurrentUser();

  // Reset the error messages when the user changes the input
  useEffect(() => {
    setError({ email: '', password: '' });
  }, [formData]);

  // Handle the sign in form submission
  const onSubmit = async (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();

    // Validate the input
    const validationResult = schema.safeParse(formData);

    // If the input is invalid, display the first error messages
    if (!validationResult.success) {
      const errors = validationResult.error.errors;

      if (errors.length > 0) {
        setError({ ...error, [errors[0].path[0]]: errors[0].message });
        return;
      }
    }

    setLoading(true);
    const toastLoading = toast.loading('Signing in...');

    try {
      const response = await axiosInstance.post('/auth/login', formData);
      localStorage.setItem('accessToken', response.data.access_token);
      await mutate();
      toast.success('User signed in successfully');
    } catch (error) {
      if (error instanceof AxiosError) {
        const message = handleError(error);
        toast.error(message);
      } else {
        toast.error('Something went wrong');
      }
    } finally {
      setLoading(false);
      toast.dismiss(toastLoading);
    }
  };

  return (
    <>
      <form onSubmit={onSubmit}>
        <h1 className="font-bold font-inter text-3xl">Sign In</h1>
        <div className="flex flex-col gap-4 mt-10">
          <Input
            label="Email"
            id="email"
            type="email"
            error={error.email}
            loading={loading}
            value={formData.email}
            onChange={(ev) => setFormData({ ...formData, email: ev.target.value })}
          />
          <Input
            label="Password"
            id="password"
            type="password"
            error={error.password}
            loading={loading}
            value={formData.password}
            onChange={(ev) => setFormData({ ...formData, password: ev.target.value })}
          />
          <button
            className={`
            h-12 
            mt-4
            bg-primary 
            text-white font-inter 
            rounded-md 
            ${loading ? 'bg-opacity-80 cursor-not-allowed' : ''}
          `}
            type="submit"
          >
            Sign in
          </button>
        </div>
        <div className="text-zinc-400 font-inter mt-4 text-sm">
          Don't have an account?{' '}
          <span className={`${loading ? 'cursor-not-allowed' : ''}`}>
            <Link
              to="/sign-up"
              className={`
              text-primary 
              font-montserrat 
              cursor-pointer 
              hover:underline 
              ${loading ? 'pointer-events-none' : ''}
            `}
            >
              Sign up
            </Link>
          </span>
        </div>
      </form>
    </>
  );
};

export default SignIn;
