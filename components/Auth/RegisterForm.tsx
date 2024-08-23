
import React, { useReducer } from 'react';
import Link from 'next/link';
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, updateProfile } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import OrDivider from '@/components/OrDivider';
import { Label } from '@/components/ui/label';
import GoogleIcon from "@/assets/Images/googleIcon.svg";
import FacebookIcon from "@/assets/Images/facebookIcon.svg"
import Image from 'next/image';
import Loader from '@/components/Loader';
import { initialRegisterState, registerReducer } from '@/reducers/registerReducer';
import { useToast } from '@/components/ToastContainer';
import { useRouter } from 'next/navigation';
import { getDatabase, ref, set } from 'firebase/database';

const SignUp: React.FC = () => {
  const [state, dispatch] = useReducer(registerReducer, initialRegisterState);
  const { name, email, password, confirmPassword, isCreatingTodo } = state;
  const { addToast } = useToast();
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({ type: 'SET_IS_CREATING_TODO', payload: true });
    try {
      if (!name) {
        addToast("Please enter your name", 'error');
        return;
      }
      if (!email) {
        addToast("Please enter your email", 'error');
        return;
      }
      if (password.length < 8) {
        addToast("Please must be atleast 8 characters", 'error');
        return;
      }
      if (!password) {
        addToast("Please enter your password", 'error');
        return;
      }
      if (password !== confirmPassword) {
        addToast("Password and confirm password does not match", 'error');
        return;
      }

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: name });

      const db = getDatabase();
      await set(ref(db, 'users/' + userCredential.user.uid), {
        fullName: name,
        email: email
      });
      addToast("Sign up was successful", 'success');
      dispatch({ type: 'RESET_FORM' });
      router.push("/")
    } catch (error: any) {
      if (error.message === "Firebase: Error (auth/email-already-in-use).") {
        addToast("Email already in use", 'error');
      } else {
        addToast("Something went wrong", 'error');
      }
    } finally {
      dispatch({ type: 'SET_IS_CREATING_TODO', payload: false });
    }
  };

  const handleGoogleSignUp = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);

      if (!result.user.displayName && state.name) {
        await updateProfile(result.user, { displayName: state.name });
        const db = getDatabase();
        await set(ref(db, 'users/' + result.user.uid), {
          fullName: name,
          email: email
        });
      }

      addToast("Sign up was successful", 'success');
      router.push("/")
    } catch (error: any) {
      console.error('Error signing up with Google:', error);
      addToast(error.message, 'error');
    }
  };
  const handleFacebookSignIn = async () => {

  };

  return (
    <div className='mx-auto'>
      <div className='mb-6'>
        <h2 className='text-2xl mb-2'>Welcome back</h2>
        <p className='text-sm text-opacity-80 leading-6'>Today is a new day.It&apos;s your day. You shape it.
          Sign in to start managing your projects.</p>
      </div>
      <form onSubmit={handleSignUp} className="space-y-4 w-full">
        <div className="flex flex-col">
          <Label htmlFor="name" className='mb-2'>Name</Label>
          <Input
            type="text"
            value={name}
            onChange={(e) => dispatch({ type: 'SET_NAME', payload: e.target.value })}
            placeholder="Igwe Chinonso"
            className='bg-[#f6faff] outline-none border border-[#e6e8f0] rounded-xl'
          />
        </div>

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
        <div className="flex flex-col">
          <Label htmlFor="confirmPassword" className='mb-2'>Confirm Password</Label>
          <Input
            type="password"
            value={confirmPassword}
            onChange={(e) => dispatch({ type: 'SET_CONFIRM_PASSWORD', payload: e.target.value })}
            placeholder="At least 8 characters"
            className='bg-[#f6faff] outline-none  border border-[#e6e8f0]'
          />
        </div>

        <Button disabled={isCreatingTodo} type="submit" size="lg" className="w-full bg-[#142c3a]">
          {isCreatingTodo ? <Loader /> : "Sign up"}
        </Button>
      </form>
      <OrDivider />
      <div>
        <Button onClick={handleGoogleSignUp} variant="outline" className="w-full mb-4 border-none bg-[#f2f8fa]" size="lg">
          <Image src={GoogleIcon} alt='GoogleIcon' className='mr-2' />
          Sign up with Google
        </Button>
        <Button onClick={handleFacebookSignIn} variant="outline" className="w-full border-none bg-[#f2f8fa]" size="lg">
          <Image src={FacebookIcon} alt='FacebookIcon' className='mr-2' />
          Sign up with Facebook
        </Button>
      </div>
      <p className="text-sm text-center w-full mt-4">
        Already have an account? <Link href="/auth/login" className="text-blue-500">Login here</Link>
      </p>
    </div>
  );
};

export default SignUp;