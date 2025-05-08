import React, { useState } from 'react';

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Step 1: Send code
  const handleSendCode = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('A verification code has been sent to your email.');
        setStep(2);
      } else {
        setError(data.message || 'Failed to send code.');
      }
    } catch (err) {
      setError('Network error.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Reset password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code, newPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('Password reset successful! You can now log in.');
        setStep(3);
      } else {
        setError(data.message || 'Failed to reset password.');
      }
    } catch (err) {
      setError('Network error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <h2 className="mt-6 text-center text-3xl font-bold text-brown">Forgot Password</h2>
        {step === 1 && (
          <form className="mt-8 space-y-6" onSubmit={handleSendCode}>
            {error && <div className="text-red-500 text-center">{error}</div>}
            {message && <div className="text-green-600 text-center">{message}</div>}
            <div>
              <label htmlFor="email" className="block text-brown mb-2">Email address</label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-brown/20 rounded-lg"
                disabled={loading}
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-coral text-white rounded-lg font-bold"
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send Verification Code'}
            </button>
          </form>
        )}
        {step === 2 && (
          <form className="mt-8 space-y-6" onSubmit={handleResetPassword}>
            {error && <div className="text-red-500 text-center">{error}</div>}
            {message && <div className="text-green-600 text-center">{message}</div>}
            <div>
              <label htmlFor="code" className="block text-brown mb-2">Verification Code</label>
              <input
                id="code"
                type="text"
                required
                value={code}
                onChange={e => setCode(e.target.value)}
                className="w-full px-3 py-2 border border-brown/20 rounded-lg"
                disabled={loading}
              />
            </div>
            <div>
              <label htmlFor="newPassword" className="block text-brown mb-2">New Password</label>
              <input
                id="newPassword"
                type="password"
                required
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                className="w-full px-3 py-2 border border-brown/20 rounded-lg"
                disabled={loading}
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-coral text-white rounded-lg font-bold"
              disabled={loading}
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        )}
        {step === 3 && (
          <div className="text-center text-green-700 font-bold">
            Password reset successful! <a href="/login" className="text-coral underline">Go to Login</a>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword; 