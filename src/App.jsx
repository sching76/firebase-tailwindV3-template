import { useEffect, useState } from 'react';
import { auth } from './firebase';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut
} from 'firebase/auth';
import './App.css';

export default function App() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSignup, setIsSignup] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSignup && password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      if (isSignup) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  if (!user) {
    return (
      <form onSubmit={handleSubmit} className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gray-100">
        <h1 className="text-2xl font-bold">{isSignup ? 'Sign Up' : 'Login'}</h1>
        <input
          className="p-2 border border-gray-300 rounded"
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="p-2 border border-gray-300 rounded"
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
        {isSignup && (
          <input
            className="p-2 border border-gray-300 rounded"
            type="password"
            placeholder="Confirm Password"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        )}
        <button type="submit" className="px-4 py-2 bg-indigo-500 text-white rounded">
          {isSignup ? 'Create Account' : 'Sign In'}
        </button>
        <button
          type="button"
          className="text-sm text-indigo-600 underline"
          onClick={() => {
            setIsSignup(!isSignup);
            setConfirmPassword('');
          }}
        >
          {isSignup ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
        </button>
      </form>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gradient-to-r from-indigo-500 to-pink-500 text-white text-3xl font-bold">
      Hello world template with Tailwind CSS v3.4.3 🚀
      <button
        onClick={handleLogout}
        className="mt-4 px-4 py-2 text-base bg-white text-indigo-600 rounded"
      >
        Log out
      </button>
    </div>
  );
}
