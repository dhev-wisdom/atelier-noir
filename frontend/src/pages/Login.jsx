import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { login, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        // If already authenticated, redirect to home
        if (isAuthenticated) {
            navigate('/');
        }
        
        // Set document title
        document.title = 'Login | Atelier Noir';
        
        // Scroll to top
        window.scrollTo(0, 0);
    }, [isAuthenticated, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        
        try {
            await login(formData.email, formData.password);
            navigate('/');
        } catch (err) {
            setError(err.message || 'Failed to login. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="checkout spad">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-6">
                        <div className="checkout__form">
                            <h4>Login to Your Account</h4>
                            {error && (
                                <div className="alert alert-danger" role="alert">
                                    {error}
                                </div>
                            )}
                            <form onSubmit={handleSubmit}>
                                <div className="checkout__input">
                                    <p>Email<span>*</span></p>
                                    <input 
                                        type="email" 
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="checkout__input">
                                    <p>Password<span>*</span></p>
                                    <input 
                                        type="password" 
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <button type="submit" className="site-btn" disabled={loading}>
                                    {loading ? 'Logging in...' : 'Login'}
                                </button>
                                <div className="checkout__input__checkbox mt-3">
                                    <p>Don't have an account? <Link to="/signup">Register here</Link></p>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Login;