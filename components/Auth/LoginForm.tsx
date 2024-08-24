
import React, { useReducer } from 'react';
import Link from 'next/link';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from '@/components/ui/label';
import GoogleIcon from "@/assets/Images/googleIcon.svg";
import FacebookIcon from "@/assets/Images/facebookIcon.svg"
import Image from 'next/image';
import { initialLoginState, loginReducer } from '@/reducers/loginReducer';
import dynamic from 'next/dynamic'
import { useToast } from '../ToastContainer';
import { useRouter } from 'next/navigation';
import { setCookie } from 'cookies-next';

const OrDivider = dynamic(() => import('@/components/OrDivider'), { ssr: false })
const Loader = dynamic(() => import('@/components/Loader'), { ssr: false })

const Login: React.FC = () => {
  const [state, dispatch] = useReducer(loginReducer, initialLoginState);
  const { addToast } = useToast();
  const router = useRouter();
  const { email, password, isCreatingTodo } = state;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({ type: 'SET_IS_CREATING_TODO', payload: true });
    try {
      if (!email) {
        addToast("Please enter your email", 'error');
        return;
      }
      if (!password) {
        addToast("Please enter your password", 'error');
        return;
      }
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      addToast("Sign in was successful", 'success');
      setCookie('authToken', await user.getIdToken(), {
        maxAge: 30 * 24 * 60 * 60,
        path: '/',
      });
      router.push("/")
      dispatch({ type: 'RESET_FORM' });
    } catch (error: any) {
      console.error('Error signing up:', error);
      if (error.message === "Firebase: Error (auth/invalid-credential).") {
        addToast("Invalid Credentials", 'error');
      } else {
        addToast("Something went wrong", 'error');
      }

    } finally {
      dispatch({ type: 'SET_IS_CREATING_TODO', payload: false });
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;
      addToast("Sign in was successful", 'success');
      setCookie('authToken', await user.getIdToken(), {
        maxAge: 30 * 24 * 60 * 60,
        path: '/',
      });
      router.push("/")
    } catch (error: any) {
      console.error('Error signing in with Google:', error);
      addToast(error.message, 'error');
    }
  };

  const handleFacebookSignIn = async () => { };

  return (
    <div className='mx-auto lg:w-[70%] w-full'>
      <div className='mb-6 mt-8'>
        <h2 className='text-2xl mb-2'>Welcome back <span className="text-2xl animate-wave">👋</span>
        </h2>
        <p className='text-sm text-opacity-80 leading-6'>Today is a new day.It&apos;s your day. You shape it.
          Sign in to start managing your projects.</p>
      </div>
      <form onSubmit={handleLogin} className="space-y-4 w-full">
        <div className="flex flex-col">
          <Label htmlFor="email" className='mb-2'>Email</Label>
          <Input
            type="email"
            value={email}
            onChange={(e) => dispatch({ type: 'SET_EMAIL', payload: e.target.value })}
            placeholder="Example@email.com"
            className='bg-[#f6faff] outline-none  border border-[#e6e8f0]'
          />
        </div>

        <div className="flex flex-col">
          <Label htmlFor="password" className='mb-2'>Password</Label>
          <Input
            type="password"
            value={password}
            onChange={(e) => dispatch({ type: 'SET_PASSWORD', payload: e.target.value })}
            placeholder="At least 8 characters"
            className='bg-[#f6faff] outline-none  border border-[#e6e8f0]'
          />
        </div>
        <div className='flex items-center justify-between'>
          <div></div>
          <Link href="/auth/register" className="text-sm text-blue-500">Forgot Password?</Link>
        </div>
        <Button disabled={isCreatingTodo} type="submit" size="lg" className="w-full bg-[#142c3a]">
          {isCreatingTodo ? <Loader /> : "Sign in"}
        </Button>
      </form>
      <div className='mt-12'><OrDivider /></div>
      <div>
        <Button onClick={handleGoogleSignIn} variant="outline" className="w-full mb-4 border-none bg-[#f2f8fa]" size="lg">
          <Image
            src={GoogleIcon}
            alt='GoogleIcon'
            width={20}
            height={20}
            className='mr-2'
            loading="lazy"
          />
          Sign in with Google
        </Button>
        <Button onClick={handleFacebookSignIn} variant="outline" className="w-full border-none bg-[#f2f8fa]" size="lg">
          <Image src={FacebookIcon} alt='FacebookIcon' className='mr-2' loading="lazy" />
          Sign in with Facebook
        </Button>
      </div>
      <p className="text-sm text-center w-full mt-10">
        Don&apos;t you have an account? <Link href="/auth/register" className="text-blue-500">Sign Up</Link>
      </p>
      <p className="text-center text-gray-600 text-sm uppercase mt-24">
        © {new Date().getFullYear()} All rights reserved.
      </p>
    </div>
  );
};

export default Login;