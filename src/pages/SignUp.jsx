import React, { useState } from 'react';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
 const [email, setEmail] = useState('');
 const [password, setPassword] = useState('');
 const [error, setError] = useState('');
 const navigate = useNavigate();

 const handleEmailPasswordSignUp = async (e) => {
 e.preventDefault();
 setError('');
 try {
 await createUserWithEmailAndPassword(auth, email, password);
 navigate('/app'); // Navigate to the app after successful signup
 } catch (error) {
 console.error("Sign-up error:", error); // Log the error object
 setError(error.message);
 }
 };

 return (
 <div>
 <h2>Sign Up</h2>
 {error && <p style={{ color: 'red' }}>{error}</p>}
 <form onSubmit={handleEmailPasswordSignUp}>
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
 <button type="submit">Sign Up</button>
 </form>
 </div>
 );
};

export default SignUp;