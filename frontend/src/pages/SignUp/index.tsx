import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
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

const schema = z
  .object({
    email: z.string().email().min(1, { message: 'Email is required' }),
    name: z.string().min(1, { message: 'Username is required' }),
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
  });

const SignUp = () => {
  useEffect(() => {
    document.title = 'Sign Up';
  }, []);

  const [loading, setLoading] = useState<boolean>(false);

  const [formData, setFormData] = useState({
    email: '',
    name: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState({
    email: '',
    name: '',
    password: '',
    confirmPassword: '',
  });

  // Mutate the current user data after signing up
  const { mutate } = useCurrentUser();

  // Reset the error messages when the user changes the input
  useEffect(() => {
    setError({ email: '', name: '', password: '', confirmPassword: '' });
  }, [formData]);

  // Handle the sign up form submission
  const onSubmit = async (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();

    if (loading) return;

    // Validate the input
    const validationResult = schema.safeParse(formData);

    // If the input is invalid, display the first error messages
    if (!validationResult.success) {
      const errors = validationResult.error.errors;

      if (errors.length > 0) {
        if (errors[0].code === 'custom') {
          setError({ ...error, password: errors[0].message, confirmPassword: errors[0].message });
          return;
        } else {
          setError({ ...error, [errors[0].path[0]]: errors[0].message });
          return;
        }
      }
    }

    setLoading(true);
    const toastLoading = toast.loading('Signing up...');

    try {
      await axiosInstance.post('/auth/register', {
        email: formData.email,
        username: formData.name,
        password: formData.password,
      });
      await axiosInstance.post('/auth/login', { email: formData.email, password: formData.password });
      await mutate();
      toast.success('User signed up successfully');
    } catch (error) {
      if (error instanceof AxiosError) {
        const message: string = handleError(error);
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
    <form onSubmit={onSubmit}>
      <h1 className="font-bold font-inter text-3xl">Sign up</h1>
      <div className="flex flex-col gap-4 mt-10">
        <Input
          label="Email"
          id="email"
          type="email"
          error={error.email}
          value={formData.email}
          onChange={(ev) => setFormData({ ...formData, email: ev.target.value })}
          loading={loading}
        />

        <Input
          label="Username"
          id="name"
          type="text"
          error={error.name}
          value={formData.name}
          onChange={(ev) => setFormData({ ...formData, name: ev.target.value })}
          loading={loading}
        />

        <Input
          label="Password"
          id="password"
          type="password"
          error={error.password}
          value={formData.password}
          onChange={(ev) => setFormData({ ...formData, password: ev.target.value })}
          loading={loading}
        />
        <Input
          label="Confirm Password"
          id="confirm-password"
          type="text"
          error={error.confirmPassword}
          value={formData.confirmPassword}
          onChange={(ev) => setFormData({ ...formData, confirmPassword: ev.target.value })}
          loading={loading}
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
          Sign up
        </button>
      </div>
      <div className="flex justify-center text-zinc-400 font-inter mt-4 text-sm">
        <div className="">
          Already have an account?{' '}
          <span className={`${loading ? 'cursor-not-allowed' : ''}`}>
            <Link
              to="/sign-in"
              className={`
                text-primary 
                font-montserrat 
                cursor-pointer 
                hover:underline 
                ${loading ? 'pointer-events-none' : ''}
              `}
            >
              Sign in
            </Link>
          </span>
        </div>
      </div>
    </form>
  );
};

export default SignUp;
