import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, BookOpen, User as UserIcon } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <Link to="/" className="logo">
                <BookOpen size={24} />
                LMS <span>Pro</span>
            </Link>

            <div className="nav-links">
                {user ? (
                    <>
                        <Link to="/" className="btn-outline">All Courses</Link>
                        <div className="user-info" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <UserIcon size={20} className="text-muted" />
                            <span>{user.name}</span>
                            <button onClick={handleLogout} className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <LogOut size={16} />
                                Logout
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="btn-outline">Login</Link>
                        <Link to="/signup" className="btn-primary">Get Started</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
