import React from 'react';
import { signIn } from 'next-auth/react';

const SignUpPage = () => {
  async function handleSignUp(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const email = form.email.value;
    const password = form.password.value;
    const username = form.username.value;

    if (!email || !password || !username) {
      alert('Please fill in all fields.');
      return;
    }

    try {
      // Step 1: Call our custom registration API endpoint using fetch
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, username }),
      });

      const data = await response.json();

      if (!response.ok) {
        // If the server returns an error (e.g., user already exists), show it
        throw new Error(data.message || 'Something went wrong with the signup.');
      }

      // Step 2: If signup is successful, automatically sign the user in
      // using the 'credentials' provider from next-auth.
      alert('Signup successful! You will now be logged in.');
      
      const signInResponse = await signIn('credentials', {
        redirect: false, // We will handle the redirect manually
        email: email,    // Use the same credentials to log in
        password: password,
      });

      if (signInResponse?.error) {
        // This case is unlikely if signup just succeeded, but we handle it just in case.
        throw new Error(`Sign-in failed after registration: ${signInResponse.error}`);
      }
      
      // Step 3: If sign-in is successful, redirect to the homepage
      window.location.href = '/';

    } catch (error: any) {
      console.error('Signup Process Error:', error);
      alert(`Error: ${error.message}`);
    }
  }

  return (
    <div style={{ maxWidth: '400px', margin: 'auto', padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>Sign Up</h1>
      <form onSubmit={handleSignUp}>
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="username" style={{ display: 'block', marginBottom: '0.5rem' }}>Username</label>
          <input
            id="username"
            name="username"
            type="text"
            required
            style={{ width: '100%', padding: '0.5rem', boxSizing: 'border-box' }}
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="email" style={{ display: 'block', marginBottom: '0.5rem' }}>Email</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            style={{ width: '100%', padding: '0.5rem', boxSizing: 'border-box' }}
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="password" style={{ display: 'block', marginBottom: '0.5rem' }}>Password</label>
          <input
            id="password"
            name="password"
            type="password"
            required
            style={{ width: '100%', padding: '0.5rem', boxSizing: 'border-box' }}
          />
        </div>
        <button type="submit" style={{ padding: '0.75rem 1.5rem', cursor: 'pointer', width: '100%', fontSize: '1rem' }}>
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default SignUpPage;
