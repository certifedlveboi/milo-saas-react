import React, { useState } from 'react';
import { auth, googleAuthProvider } from '../firebase';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const Login = () => {
 const [email, setEmail] = useState('');
 const [password, setPassword] = useState('');
 const [error, setError] = useState('');
 const navigate = useNavigate();

 const handleEmailPasswordSignIn = async (e) => {
 e.preventDefault();
 setError('');
 try {
 await signInWithEmailAndPassword(auth, email, password);
 navigate('/app'); // Navigate to the app after successful login
 } catch (error) {
 console.error("Login error:", error); // Log the error object
 setError(error.message);
 }
 };

  const handleGoogleSignIn = async () => {
    setError('');
    try {
      await signInWithPopup(auth, googleAuthProvider);
      navigate('/app');
    } catch (error) {
      console.error("Google sign-in error:", error);
      setError(error.message);
    }
  };

 return (
 <div>
 <h2>Login</h2>
 {error && <p style={{ color: 'red' }}>{error}</p>}
 <form onSubmit={handleEmailPasswordSignIn}>
 <input
 type="email"
 placeholder="Email"
 value={email}
 onChange={(e) => setEmail(e.target.value)}
 required
 />
 <input
 type="password"
 placeholder="Password"
 value={password}
 onChange={(e) => setPassword(e.target.value)}
 required
 />
 <button type="submit">Login</button>
 </form>

       <button type="button" onClick={handleGoogleSignIn}>
        Sign in with Google
      </button>
 </div>
 );
};

export default Login;