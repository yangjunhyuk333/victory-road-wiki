import { useState, useEffect } from 'react';
import { db } from '../config/firebase';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { MessageSquare, Edit3, Calendar, User as UserIcon, X, Send } from 'lucide-react';

export default function Board({ user }) {
    const [posts, setPosts] = useState([]);                  // 게시글 배열 데이터
    const [isWriteMode, setIsWriteMode] = useState(false);    // 글쓰기 폼 노출 여부
    const [selectedPost, setSelectedPost] = useState(null);  // 상세보기 클릭한 단일 게시글
    const [title, setTitle] = useState('');                  // 작성 중인 글 제목
    const [content, setContent] = useState('');              // 작성 중인 글 본문
    const [isLoading, setIsLoading] = useState(false);

    // 컴포넌트 마운트 시 Firestore 'posts' 컬렉션의 실시간 변화 감지 (onSnapshot)
    useEffect(() => {
        const postsRef = collection(db, 'posts');
        // 생성일자(createdAt) 내림차순 정렬
        const q = query(postsRef, orderBy('createdAt', 'desc'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const postsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setPosts(postsData);
        }, (error) => {
            console.error("Firestore 글 로드 에러:", error);
        });

        // 언마운트 시 리스너 해제
        return () => unsubscribe();
    }, []);

    // 신규 게시글 등록 함수
    const handleSubmitPost = async (e) => {
        e.preventDefault();
        if (!user) {
            alert("로그인이 필요한 작업입니다.");
            return;
        }
        if (!title.trim() || !content.trim()) {
            alert("제목과 내용을 모두 작성해 주세요.");
            return;
        }

        setIsLoading(true);
        try {
            await addDoc(collection(db, 'posts'), {
                title: title.trim(),
                content: content.trim(),
                authorName: user.displayName || user.email.split('@')[0], // 닉네임 백업
                authorUid: user.uid,
                createdAt: serverTimestamp() // 서버 시간 기준 생성
            });

            // 폼 초기화 및 글쓰기 모드 종료
            setTitle('');
            setContent('');
            setIsWriteMode(false);
        } catch (error) {
            console.error("Firestore 글 등록 오류:", error);
            alert(`글을 등록하는 동안 오류가 발생했습니다.\n\n[오류 설명] ${error.message || error}\n\n※ 파이어베이스 권한 규칙이나 인덱스 생성이 필요할 수 있습니다. 동봉된 FIREBASE_GUIDE.md를 참고해 주세요.`);
        } finally {
            setIsLoading(false);
        }
    };

    // 타임스탬프 변환 포맷 헬퍼 함수
    const formatTimestamp = (timestamp) => {
        if (!timestamp) return '방금 전';
        const date = timestamp.toDate();
        return date.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div style={{ maxWidth: '960px', margin: '0 auto', padding: '2.5rem 1.5rem' }}>
            
            {/* 타이틀 헤더 영역 */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-1px', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <MessageSquare size={32} color="var(--primary-color)" /> 커뮤니티 광장
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginTop: '0.4rem', fontWeight: 600 }}>
                        이나즈마 감독님들이 자유롭게 전술과 공략을 토론하는 공간입니다.
                    </p>
                </div>
                
                {/* 글쓰기 토글 버튼 */}
                {!isWriteMode && (
                    <button 
                        className="btn btn-primary"
                        onClick={() => {
                            if (!user) {
                                alert("로그인이 필요한 기능입니다. 먼저 로그인해 주세요!");
                                return;
                            }
                            setIsWriteMode(true);
                        }}
                    >
                        <Edit3 size={18} /> 새 글 작성
                    </button>
                )}
            </div>

            {/* 글쓰기 양식 폼 활성화 시 */}
            {isWriteMode && (
                <div className="glass-card" style={{ marginBottom: '2.5rem', animation: 'floatUp 0.4s ease-out' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <Edit3 size={20} color="var(--primary-color)" /> 새로운 이야기 등록
                        </h2>
                        <button 
                            onClick={() => setIsWriteMode(false)}
                            style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmitPost} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        {/* 제목 입력 */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                            <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)' }}>글 제목</label>
                            <input 
                                type="text"
                                className="input-field"
                                placeholder="전술 추천, 선수 분석 등의 제목을 입력해 주세요..."
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                        </div>

                        {/* 본문 입력 */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                            <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)' }}>글 내용</label>
                            <textarea 
                                className="input-field"
                                placeholder="본문 내용을 입력해 주세요..."
                                style={{ minHeight: '180px', resize: 'vertical', lineHeight: '1.6' }}
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                required
                            />
                        </div>

                        {/* 버튼 패널 */}
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                            <button 
                                type="button" 
                                className="btn btn-secondary"
                                onClick={() => setIsWriteMode(false)}
                                style={{ padding: '0.6rem 1.5rem' }}
                            >
                                취소
                            </button>
                            <button 
                                type="submit" 
                                className="btn btn-primary"
                                disabled={isLoading}
                                style={{ padding: '0.6rem 2rem' }}
                            >
                                <Send size={16} /> {isLoading ? '등록 중...' : '등록'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* 게시판 글 리스트 영역 (테이블 구조) */}
            <div className="glass-card" style={{ padding: '1rem', overflowX: 'auto' }}>
                {posts.length > 0 ? (
                    <table className="board-table">
                        <thead>
                            <tr>
                                <th style={{ width: '60%' }}>제목</th>
                                <th style={{ width: '20%' }}>작성자</th>
                                <th style={{ width: '20%', textAlign: 'right' }}>작성일</th>
                            </tr>
                        </thead>
                        <tbody>
                            {posts.map((post) => (
                                <tr 
                                    key={post.id} 
                                    className="board-row"
                                    onClick={() => setSelectedPost(post)}
                                >
                                    <td style={{ fontWeight: 700 }}>
                                        {post.title}
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600 }}>
                                            <UserIcon size={14} /> {post.authorName}
                                        </div>
                                    </td>
                                    <td style={{ textAlign: 'right', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                                            <Calendar size={13} /> {formatTimestamp(post.createdAt)}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    // 글이 하나도 없을 경우 예외 뷰
                    <div style={{ textAlign: 'center', padding: '6rem 0', color: 'var(--text-muted)' }}>
                        <MessageSquare size={48} style={{ opacity: 0.15, marginBottom: '1.25rem' }} />
                        <h3 style={{ fontWeight: 700 }}>작성된 커뮤니티 글이 없습니다.</h3>
                        <p style={{ marginTop: '0.5rem', fontSize: '0.95rem' }}>가장 먼저 이야기를 등록해 보세요!</p>
                    </div>
                )}
            </div>

            {/* 게시글 상세보기 모달 팝업 */}
            {selectedPost && (
                <div style={{
                    position: 'fixed',
                    top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.45)',
                    backdropFilter: 'blur(8px)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 2000,
                    padding: '1.5rem'
                }}
                    onClick={() => setSelectedPost(null)}
                >
                    <div className="glass-card" style={{
                        width: '100%',
                        maxWidth: '650px',
                        background: 'var(--bg-surface-pure)',
                        maxHeight: '85vh',
                        overflowY: 'auto',
                        padding: '2.5rem',
                        position: 'relative'
                    }}
                        onClick={e => e.stopPropagation()} // 모달 안 클릭 시 닫힘 차단
                    >
                        {/* 모달 닫기 버튼 */}
                        <button
                            onClick={() => setSelectedPost(null)}
                            style={{
                                position: 'absolute',
                                top: '1.5rem',
                                right: '1.5rem',
                                background: 'transparent',
                                border: 'none',
                                cursor: 'pointer',
                                color: 'var(--text-muted)'
                            }}
                        >
                            <X size={22} />
                        </button>

                        {/* 상세 내용 헤더 */}
                        <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1.25rem' }}>
                            <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.75rem', lineHeight: '1.4' }}>
                                {selectedPost.title}
                            </h2>
                            <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: 600 }}>
                                    <UserIcon size={14} color="var(--primary-color)" /> {selectedPost.authorName}
                                </span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                    <Calendar size={14} /> {formatTimestamp(selectedPost.createdAt)}
                                </span>
                            </div>
                        </div>

                        {/* 상세 내용 본문 */}
                        <div style={{ 
                            fontSize: '1rem', 
                            lineHeight: '1.7', 
                            color: 'var(--text-main)', 
                            whiteSpace: 'pre-wrap', 
                            wordBreak: 'break-word',
                            minHeight: '150px'
                        }}>
                            {selectedPost.content}
                        </div>

                        {/* 모달 닫기 확인 */}
                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2.5rem' }}>
                            <button 
                                className="btn btn-secondary"
                                onClick={() => setSelectedPost(null)}
                                style={{ padding: '0.65rem 2rem' }}
                            >
                                닫기
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
