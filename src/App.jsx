import { useEffect, useState } from 'react';
import { auth, googleProvider } from './firebase';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  signInWithPopup
} from 'firebase/auth';
import './App.css';

export default function App() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const [formError, setFormError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const validateForm = () => {
    const errors = {};
    if (!email) errors.email = 'Email is required';
    if (!password) errors.password = 'Password is required';

    if (isSignup) {
      if (!confirmPassword) errors.confirmPassword = 'Please confirm your password';
      if (password && confirmPassword && password !== confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
      }
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!validateForm()) return;

    try {
      if (isSignup) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (error) {
      setFormError(error.message);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  const inputClass = "p-2 border border-gray-300 rounded w-full";

  const passwordField = (label, value, onChange, show, setShow, error) => (
    <div className="mb-4 relative">
      <input
        className={inputClass}
        type={show ? 'text' : 'password'}
        placeholder={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <button
        type="button"
        onClick={() => setShow(!show)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-indigo-500"
      >
        {show ? 'Hide' : 'Show'}
      </button>
      {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
    </div>
  );

  if (!user) {
    return (
      <form onSubmit={handleSubmit} className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gray-100 px-4">
        <div className="w-full max-w-sm bg-white p-6 rounded shadow">
          <h1 className="text-2xl font-bold mb-4">{isSignup ? 'Sign Up' : 'Login'}</h1>

          {formError && <div className="mb-4 text-red-600 text-sm">{formError}</div>}

          <div className="mb-4">
            <input
              className={inputClass}
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {fieldErrors.email && <p className="text-red-600 text-sm mt-1">{fieldErrors.email}</p>}
          </div>

          {passwordField('Password', password, setPassword, showPassword, setShowPassword, fieldErrors.password)}

          {isSignup &&
            passwordField('Confirm Password', confirmPassword, setConfirmPassword, showConfirmPassword, setShowConfirmPassword, fieldErrors.confirmPassword)
          }

          <button type="submit" className="w-full py-2 bg-indigo-500 text-white rounded mb-4">
            {isSignup ? 'Create Account' : 'Sign In'}
          </button>

          <div className="flex flex-col gap-2 mb-4">
            <button
              type="button"
              onClick={() => signInWithPopup(auth, googleProvider).catch((err) => setFormError(err.message))}
              className="w-full py-2 bg-white text-black border border-gray-300 rounded"
            >
              Sign in with Google
            </button>
          </div>

          <button
            type="button"
            className="text-sm text-indigo-600 underline w-full"
            onClick={() => {
              setIsSignup(!isSignup);
              setFormError('');
              setFieldErrors({});
              setConfirmPassword('');
            }}
          >
            {isSignup ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
          </button>
        </div>
      </form>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gradient-to-r from-indigo-500 to-pink-500 text-white text-3xl font-bold text-center px-4">
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
