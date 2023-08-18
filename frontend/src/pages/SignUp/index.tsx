import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

import Input from '@/components/ui/Input';
import handleInput from '@/utils/validator';
import { signIn, signUp } from '@/api/auth';
import useToken from '@/hooks/useToken';

const SignUp = () => {
  useEffect(() => {
    document.title = 'Sign Up';
  }, []);

  const [loading, setLoading] = useState<boolean>(false);
  const { setToken } = useToken();
  const navigate = useNavigate();

  const [email, setEmail] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<{ email: string; name: string; password: string }>({
    email: '',
    name: '',
    password: '',
  });

  useEffect(() => {
    setError({ email: '', name: '', password: '' });
  }, [email, name, password]);

  const onSubmit = async (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();

    const emailError = handleInput(email, 'required', 'email');

    if (emailError) {
      setError({ ...error, email: emailError });
      toast.error('Check your input');
      return;
    }

    const nameError = handleInput(name, 'required');

    if (nameError) {
      setError({ ...error, name: nameError });
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
    const toastLoading = toast.loading('Signing up...');

    const res = await signUp(email, name, password, setError);

    if (!res) {
      toast.error('Something went wrong');
      setLoading(false);
      return;
    }

    const accessToken = await signIn(email, password);

    if (accessToken) {
      setToken(accessToken);
      navigate('/create-entity');
    }

    toast.dismiss(toastLoading);
  };

  return (
    <form onSubmit={onSubmit}>
      <h1 className="font-bold font-inter text-3xl">Sign up</h1>
      <div className="flex flex-col gap-4 mt-10">
        <Input
          label="Email"
          onChange={(ev) => setEmail(ev.target.value)}
          id="email"
          type="email"
          value={email}
          error={error.email}
        />

        <Input
          label="Username"
          onChange={(ev) => setName(ev.target.value)}
          id="name"
          type="text"
          value={name}
          error={error.name}
        />

        <Input
          label="Password"
          onChange={(ev) => setPassword(ev.target.value)}
          id="password"
          type="password"
          value={password}
          error={error.password}
        />
        <button
          className={`h-12 bg-primary mt-4 text-white font-inter rounded-md ${
            loading ? 'bg-opacity-80 cursor-not-allowed' : ''
          }`}
          type="submit"
        >
          Sign up
        </button>
      </div>
      <div className="flex justify-center text-zinc-400 font-inter mt-4 text-sm">
        <div className="">
          Already have an account?{' '}
          <Link to="/sign-in" className="text-primary font-montserrat cursor-pointer hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </form>
  );
};

export default SignUp;
