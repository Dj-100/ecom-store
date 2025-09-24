
import React, { useState } from 'react';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword, updateProfile, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom'; 
import './AuthPage.css';

const SignupPage = () => {
  const [name, setName] = useState(''); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      // Create the user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // Add their name to their profile
      await updateProfile(userCredential.user, {
        displayName: name
      });
      navigate('/'); // Redirect to homepage after signup
    } catch (err) {
      setError(err.message);
    }
  };

   const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      
      await signInWithPopup(auth, provider);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };



  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="auth-form">
        <h2>Create an Account</h2>
        {error && <p className="auth-error">{error}</p>}
        <input
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password (min. 6 characters)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Sign Up</button>
        <button type="button" onClick={handleGoogleSignIn} className="google-btn">
          Sign up with Google
        </button>
        <p className="auth-switch-link">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </form>
    </div>
  );
};

export default SignupPage;