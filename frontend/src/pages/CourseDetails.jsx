import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { courseService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Clock, Book, User, ChevronRight } from 'lucide-react';

const CourseDetails = () => {
    const { id } = useParams();
    const [course, setCourse] = useState(null);
    const [enrolled, setEnrolled] = useState(false);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [courseRes, statusRes] = await Promise.all([
                    courseService.getById(id),
                    user ? courseService.getEnrollmentStatus(id) : Promise.resolve({ data: { enrolled: false } })
                ]);
                setCourse(courseRes.data);
                setEnrolled(statusRes.data.enrolled);
            } catch (error) {
                console.error('Failed to fetch course details', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id, user]);

    const handleEnroll = async () => {
        if (!user) {
            navigate('/login');
            return;
        }
        try {
            await courseService.enroll(id);
            setEnrolled(true);
            navigate(`/course/${id}/learn`);
        } catch (error) {
            console.error('Enrollment failed', error);
        }
    };

    if (loading) return <div className="container" style={{ marginTop: '4rem' }}>Loading course...</div>;
    if (!course) return <div className="container" style={{ marginTop: '4rem' }}>Course not found</div>;

    const totalLessons = course.sections.reduce((acc, section) => acc + section.lessons.length, 0);

    return (
        <div className="container" style={{ marginTop: '4rem', paddingBottom: '4rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '4rem' }}>
                <div>
                    <span className="course-category">{course.category}</span>
                    <h1 style={{ marginTop: '0.5rem', marginBottom: '1.5rem' }}>{course.title}</h1>
                    <p style={{ fontSize: '1.125rem', color: 'var(--text-muted)', marginBottom: '2.5rem' }}>
                        {course.description}
                    </p>

                    <div style={{ display: 'flex', gap: '2rem', marginBottom: '3rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Clock size={20} className="text-muted" />
                            <span>Self-paced</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Book size={20} className="text-muted" />
                            <span>{totalLessons} Lessons</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <User size={20} className="text-muted" />
                            <span>Expert Instructor</span>
                        </div>
                    </div>

                    <h3>Course Syllabus</h3>
                    <div style={{ marginTop: '1.5rem' }}>
                        {course.sections.map((section) => (
                            <div key={section.id} style={{ marginBottom: '1.5rem', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}>
                                <div style={{ padding: '1rem', background: 'var(--bg-card)', fontWeight: 600 }}>
                                    {section.title}
                                </div>
                                <div>
                                    {section.lessons.map((lesson) => (
                                        <div key={lesson.id} style={{ padding: '0.75rem 1rem', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.875rem' }}>
                                            <span>{lesson.title}</span>
                                            <span className="text-muted">{lesson.duration}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <div style={{ position: 'sticky', top: '100px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
                        <img src={course.thumbnail} alt={course.title} style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover' }} />
                        <div style={{ padding: '1.5rem' }}>
                            <button
                                onClick={enrolled ? () => navigate(`/course/${id}/learn`) : handleEnroll}
                                className="btn-primary"
                                style={{ width: '100%', padding: '1rem', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                            >
                                {enrolled ? 'Go to Dashboard' : 'Enroll Now'}
                                <ChevronRight size={18} />
                            </button>
                            <p style={{ marginTop: '1rem', fontSize: '0.75rem', textAlign: 'center' }} className="text-muted">
                                Free access to all videos and exercises.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseDetails;
