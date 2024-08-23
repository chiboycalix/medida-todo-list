
import React, { useEffect, useReducer } from 'react';
import Link from 'next/link';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import OrDivider from '@/components/OrDivider';
import { Label } from '@/components/ui/label';
import GoogleIcon from "@/assets/Images/googleIcon.svg";
import FacebookIcon from "@/assets/Images/facebookIcon.svg"
import Image from 'next/image';
import { initialLoginState, loginReducer } from '@/reducers/loginReducer';
import Loader from '../Loader';
import { useToast } from '../ToastContainer';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRouter } from 'next/navigation';

const Login: React.FC = () => {
  const [state, dispatch] = useReducer(loginReducer, initialLoginState);
  const { addToast } = useToast();
  const [user] = useAuthState(auth);
  const router = useRouter();
  const { email, password, isCreatingTodo } = state;

  useEffect(() => {
    if (!user) {
      router.push("/auth/login")
    } else {
      router.push("/")
    }
  }, [user, router])

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
      await signInWithEmailAndPassword(auth, email, password);
      addToast("Sign in was successful", 'success');
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
      await signInWithPopup(auth, provider);
      addToast("Sign in was successful", 'success');
      router.push("/")
    } catch (error: any) {
      console.error('Error signing in with Google:', error);
      addToast(error.message, 'error');
    }
  };

  const handleFacebookSignIn = async () => { };

  return (
    <div className='mx-auto'>
      <div className='mb-6'>
        <h2 className='text-2xl mb-2'>Welcome back</h2>
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
          <Image src={GoogleIcon} alt='GoogleIcon' className='mr-2' />
          Sign up with Google
        </Button>
        <Button onClick={handleFacebookSignIn} variant="outline" className="w-full border-none bg-[#f2f8fa]" size="lg">
          <Image src={FacebookIcon} alt='FacebookIcon' className='mr-2' />
          Sign up with Facebook
        </Button>
      </div>
      <p className="text-sm text-center w-full mt-10">
        Don&apos;t you have an account? <Link href="/auth/register" className="text-blue-500">Sign Up</Link>
      </p>
    </div>
  );
};

export default Login;