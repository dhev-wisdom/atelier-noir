import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Register = () => {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        password_confirm: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { register, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        // If already authenticated, redirect to home
        if (isAuthenticated) {
            navigate('/');
        }
        
        // Set document title
        document.title = 'Register | Atelier Noir';
        
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
        
        // Validate passwords match
        if (formData.password !== formData.password_confirm) {
            setError('Passwords do not match');
            return;
        }
        
        setLoading(true);
        
        try {
            await register({
                first_name: formData.first_name,
                last_name: formData.last_name,
                email: formData.email,
                password: formData.password
            });
            
            // Redirect to login after successful registration
            navigate('/login', { state: { message: 'Registration successful! Please login.' } });
        } catch (err) {
            setError(err.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="checkout spad">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-8">
                        <div className="checkout__form">
                            <h4>Create an Account</h4>
                            {error && (
                                <div className="alert alert-danger" role="alert">
                                    {error}
                                </div>
                            )}
                            <form onSubmit={handleSubmit}>
                                <div className="row">
                                    <div className="col-lg-6">
                                        <div className="checkout__input">
                                            <p>First Name<span>*</span></p>
                                            <input 
                                                type="text" 
                                                name="first_name"
                                                value={formData.first_name}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="col-lg-6">
                                        <div className="checkout__input">
                                            <p>Last Name<span>*</span></p>
                                            <input 
                                                type="text" 
                                                name="last_name"
                                                value={formData.last_name}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
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
                                <div className="checkout__input">
                                    <p>Confirm Password<span>*</span></p>
                                    <input 
                                        type="password" 
                                        name="password_confirm"
                                        value={formData.password_confirm}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <button type="submit" className="site-btn" disabled={loading}>
                                    {loading ? 'Creating Account...' : 'Register'}
                                </button>
                                <div className="checkout__input__checkbox mt-3">
                                    <p>Already have an account? <Link to="/login">Login here</Link></p>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Register;