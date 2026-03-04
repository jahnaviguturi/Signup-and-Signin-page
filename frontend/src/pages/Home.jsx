import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { courseService } from '../services/api';
import { Play } from 'lucide-react';

const Home = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await courseService.getAll();
                setCourses(response.data);
            } catch (error) {
                console.error('Failed to fetch courses', error);
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, []);

    if (loading) {
        return (
            <div className="container" style={{ marginTop: '4rem' }}>
                <h2>Explore Courses</h2>
                <div className="course-grid">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="course-card skeleton" style={{ height: '300px' }}></div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="container" style={{ marginTop: '4rem', paddingBottom: '4rem' }}>
            <div style={{ marginBottom: '3rem' }}>
                <h1 style={{ marginBottom: '0.5rem' }}>What will you learn today?</h1>
                <p className="text-muted">Explore high-quality, curated courses on DevPath.</p>
            </div>

            <div className="course-grid">
                {courses.map((course) => (
                    <Link to={`/course/${course.id}`} key={course.id} className="course-card">
                        <img src={course.thumbnail} alt={course.title} className="course-thumb" />
                        <div className="course-content">
                            <span className="course-category">{course.category}</span>
                            <h3 className="course-title">{course.title}</h3>
                            <p className="text-muted" style={{ fontSize: '0.875rem', marginBottom: '1rem' }}>
                                {course.description.substring(0, 100)}...
                            </p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent)', fontWeight: 600 }}>
                                <Play size={16} />
                                <span>View Details</span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div >
    );
};

export default Home;
