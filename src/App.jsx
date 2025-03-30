import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Link
} from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  auth,
  googleProvider
} from './firebase';
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from 'firebase/auth';
import './App.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-lg">
        Loading...
      </div>
    );
  }

  return (
    <Router>
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="min-h-screen bg-gray-100">
        <nav className="bg-white shadow px-4 py-2 flex justify-between items-center">
          <div className="flex gap-4">
            <Link to="/" className="text-indigo-600 font-bold">Home</Link>
            {user && <Link to="/dashboard" className="text-indigo-600">Dashboard</Link>}
            {user && <Link to="/profile" className="text-indigo-600">Profile</Link>}
          </div>
          {user ? (
            <button onClick={() => signOut(auth)} className="text-sm text-red-600">Logout</button>
          ) : (
            <Link to="/login" className="text-sm text-indigo-600 underline">Login</Link>
          )}
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login user={user} authLoading={authLoading} />} />
          <Route path="/dashboard" element={
            <ProtectedRoute user={user}>
              <Dashboard user={user} />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute user={user}>
              <Profile user={user} />
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </Router>
  );
}

function Home() {
  return (
    <div className="p-6 text-center text-xl text-indigo-700 font-semibold">
      Welcome to the Home Page
    </div>
  );
}

function Dashboard({ user }) {
  return (
    <div className="p-6 text-center text-xl text-green-700 font-semibold">
      Hello {user?.email}, this is your private Dashboard.
    </div>
  );
}

function Profile({ user }) {
  const photoURL = user?.photoURL;
  const displayName = user?.displayName;
  const email = user?.email;
  const uid = user?.uid;
  const provider = user?.providerData?.[0]?.providerId;

  return (
    <div className="p-6 max-w-md mx-auto bg-white shadow rounded text-center">
      <h2 className="text-2xl font-bold text-indigo-700 mb-4">User Profile</h2>
      {photoURL && (
        <img
          src={photoURL}
          alt="Profile"
          className="w-24 h-24 rounded-full mx-auto mb-4"
        />
      )}
      <p className="text-gray-700 mb-2"><strong>Name:</strong> {displayName || 'N/A'}</p>
      <p className="text-gray-700 mb-2"><strong>Email:</strong> {email}</p>
      <p className="text-gray-700 mb-2"><strong>UID:</strong> {uid}</p>
      <p className="text-gray-700"><strong>Provider:</strong> {provider}</p>
    </div>
  );
}

function ProtectedRoute({ user, children }) {
  return user ? children : <Navigate to="/login" />;
}

function Login({ user, authLoading }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-lg">
        Loading...
      </div>
    );
  }

  if (user) return <Navigate to="/dashboard" />;

  const validateForm = () => {
    const errors = {};
    if (!email) errors.email = 'Email is required';
    if (!password) errors.password = 'Password is required';
    if (isSignup) {
      if (!confirmPassword) errors.confirmPassword = 'Please confirm your password';
      if (password !== confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
      }
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      if (isSignup) {
        await createUserWithEmailAndPassword(auth, email, password);
        toast.success("Account created!");
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        toast.success("Signed in!");
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      toast.success("Signed in with Google!");
    } catch (err) {
      toast.error(err.message);
    }
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

  return (
    <form onSubmit={handleSubmit} className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gray-100 px-4">
      <div className="w-full max-w-sm bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold mb-4">{isSignup ? 'Sign Up' : 'Login'}</h1>

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
            onClick={handleGoogleLogin}
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
