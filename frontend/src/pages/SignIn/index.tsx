import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

import Input from '@/components/ui/Input';
import handleInput from '@/utils/validator';
import useToken from '@/hooks/useToken';
import { signIn } from '@/api/auth';

const SignIn = () => {
  useEffect(() => {
    document.title = 'Sign In';
  }, []);

  const { setToken } = useToken();
  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(false);

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<{ email: string; password: string }>({ email: '', password: '' });

  useEffect(() => {
    setError({ email: '', password: '' });
  }, [email, password]);

  const onSubmit = async (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();

    const emailError = handleInput(email, 'required', 'email');

    if (emailError) {
      setError({ ...error, email: emailError });
      toast.error('Check your input');
      return;
    }

    const passwordError = handleInput(password, 'required', 'password');

    if (passwordError) {
      setError({ ...error, password: passwordError });
      toast.error('Check your input');
      return;
    }

    setLoading(true);
    const toastLoading = toast.loading('Signing in...');

    const accessToken = await signIn(email, password, setError);

    setLoading(false);
    toast.dismiss(toastLoading);

    if (accessToken) {
      setToken(accessToken);
      navigate('/');
    } else {
      toast.error('Something went wrong');
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <h1 className="font-bold font-inter text-3xl ">Sign In</h1>
      <div className="flex flex-col gap-4 mt-10">
        <Input
          label="Email"
          onChange={(ev) => setEmail(ev.target.value)}
          id="email"
          type="email"
          value={email}
          error={error.email}
          loading={loading}
        />
        <Input
          label="Password"
          onChange={(ev) => setPassword(ev.target.value)}
          id="password"
          type="password"
          value={password}
          error={error.password}
          loading={loading}
        />
        <button
          className={`h-12 bg-primary mt-4 text-white font-inter rounded-md ${
            loading ? 'bg-opacity-80 cursor-not-allowed' : ''
          }`}
          type="submit"
        >
          Sign in
        </button>
      </div>
      <div className="flex justify-between text-zinc-400 font-inter mt-4 text-sm">
        <p className="cursor-pointer hover:underline hover:text-primary">Forget password</p>
        <div className="">
          Don't have an account?{' '}
          <Link to="/sign-up" className="text-primary font-montserrat cursor-pointer hover:underline">
            Sign up
          </Link>
        </div>
      </div>
    </form>
  );
};

export default SignIn;
