import { useState } from 'react';
import { supabase } from '../supabaseClient';

export default function Auth() {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        const { error } = await supabase.auth.signInWithPassword({ email, password });

        if (error) {
            alert(error.error_description || error.message);
        }
        // The user will be logged in and the main App component will redirect
        setLoading(false);
    };

    const handleSignUp = async (e) => {
        e.preventDefault();
        setLoading(true);
        const { error } = await supabase.auth.signUp({ email, password });

        if (error) {
            alert(error.error_description || error.message);
        } else {
            alert('Check your email for the login link!');
        }
        setLoading(false);
    };

    return (
        <div className="row">
            <div className="col-6">
                <h1>Smart Tourist Safety</h1>
                <p>Sign in or create an account</p>
                <form>
                    <input
                        type="email"
                        placeholder="Your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <div>
                        <button onClick={handleLogin} disabled={loading}>
                            {loading ? <span>Loading...</span> : <span>Login</span>}
                        </button>
                        <button onClick={handleSignUp} disabled={loading}>
                             {loading ? <span>Loading...</span> : <span>Sign Up</span>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}