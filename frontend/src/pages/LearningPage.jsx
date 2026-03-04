import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { courseService, progressService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { CheckCircle, Play, ChevronLeft, ChevronRight, Menu } from 'lucide-react';

const LearningPage = () => {
    const { id } = useParams();
    const [course, setCourse] = useState(null);
    const [activeLesson, setActiveLesson] = useState(null);
    const [completedLessons, setCompletedLessons] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        const fetchData = async () => {
            try {
                const [courseRes, progressRes, resumeRes] = await Promise.all([
                    courseService.getById(id),
                    progressService.getCourseProgress(id),
                    progressService.resumeLastWatched(id)
                ]);

                setCourse(courseRes.data);
                const completed = progressRes.data
                    .filter(p => p.status === 'COMPLETED')
                    .map(p => p.lessonId);
                setCompletedLessons(completed);

                // Auto-select first lesson or resume last watched
                if (resumeRes.status === 200 && resumeRes.data) {
                    const allLessons = courseRes.data.sections.flatMap(s => s.lessons);
                    const resumeLesson = allLessons.find(l => l.id === resumeRes.data.lessonId);
                    setActiveLesson(resumeLesson || courseRes.data.sections[0].lessons[0]);
                } else {
                    setActiveLesson(courseRes.data.sections[0].lessons[0]);
                }
            } catch (error) {
                console.error('Failed to fetch learning data', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id, user, navigate]);

    const handleLessonComplete = async (lessonId) => {
        try {
            await progressService.completeLesson(id, lessonId);
            if (!completedLessons.includes(lessonId)) {
                setCompletedLessons([...completedLessons, lessonId]);
            }
        } catch (error) {
            console.error('Failed to update progress', error);
        }
    };

    if (loading) return <div className="learning-layout">Loading dashboard...</div>;
    if (!course || !activeLesson) return <div className="learning-layout">Course not found</div>;

    const allLessons = course.sections.flatMap(s => s.lessons);
    const currentIndex = allLessons.findIndex(l => l.id === activeLesson.id);

    const handleNext = () => {
        if (currentIndex < allLessons.length - 1) {
            setActiveLesson(allLessons[currentIndex + 1]);
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            setActiveLesson(allLessons[currentIndex - 1]);
        }
    };

    const progressPercent = Math.round((completedLessons.length / allLessons.length) * 100);

    return (
        <div className="learning-layout">
            <aside className="learning-sidebar">
                <div className="sidebar-header">
                    <div style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>{course.title}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{progressPercent}% Complete</div>
                    <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${progressPercent}%` }}></div>
                    </div>
                </div>

                {course.sections.map((section) => (
                    <div key={section.id}>
                        <div style={{ padding: '0.75rem 1.5rem', background: 'var(--bg-card)', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', borderBottom: '1px solid var(--border)' }}>
                            {section.title}
                        </div>
                        {section.lessons.map((lesson) => (
                            <div
                                key={lesson.id}
                                className={`sidebar-item ${activeLesson.id === lesson.id ? 'active' : ''}`}
                                onClick={() => setActiveLesson(lesson)}
                            >
                                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                                    {completedLessons.includes(lesson.id) ? (
                                        <CheckCircle size={18} color="var(--success)" style={{ marginTop: '2px' }} />
                                    ) : (
                                        <Play size={18} className="text-muted" style={{ marginTop: '2px' }} />
                                    )}
                                    <div>
                                        <div style={{ fontSize: '0.875rem', fontWeight: activeLesson.id === lesson.id ? 600 : 400 }}>{lesson.title}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{lesson.duration}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
            </aside>

            <main className="video-section">
                <div className="video-container">
                    <iframe
                        width="100%"
                        height="100%"
                        src={`https://www.youtube.com/embed/${activeLesson.youtubeVideoId}?autoplay=1`}
                        title={activeLesson.title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                </div>

                <div className="video-content">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
                        <div>
                            <h2 style={{ marginBottom: '0.5rem' }}>{activeLesson.title}</h2>
                            <p className="text-muted">Part of {course.title}</p>
                        </div>
                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                            <button
                                onClick={handlePrev}
                                className="btn-outline"
                                disabled={currentIndex === 0}
                                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                            >
                                <ChevronLeft size={18} /> Previous
                            </button>
                            <button
                                onClick={handleNext}
                                className="btn-outline"
                                disabled={currentIndex === allLessons.length - 1}
                                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                            >
                                Next <ChevronRight size={18} />
                            </button>
                            <button
                                onClick={() => handleLessonComplete(activeLesson.id)}
                                className="btn-primary"
                                disabled={completedLessons.includes(activeLesson.id)}
                            >
                                {completedLessons.includes(activeLesson.id) ? 'Completed' : 'Mark as Complete'}
                            </button>
                        </div>
                    </div>
                    <hr style={{ borderColor: 'var(--border)', marginBottom: '2rem' }} />
                    <h3>About this lesson</h3>
                    <p className="text-muted">
                        In this lesson, we cover the core concepts of {activeLesson.title}.
                        Follow along with the video and try the exercises mentioned in the tutorial.
                    </p>
                </div>
            </main>
        </div>
    );
};

export default LearningPage;
