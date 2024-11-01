import { useEffect, useState, useCallback } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import "./App.css";
import PhotoDetail from "./PhotoDetail";

const UNPLASH_API = import.meta.env.VITE_UNPLASH_API;
const ACCESS_KEY = import.meta.env.VITE_UNPLASH_ACCESS_KEY;

function ImageCard({
  src,
  alt,
  author,
}: {
  readonly src: string;
  readonly alt: string;
  readonly author: string;
}) {
  return (
    <div className="image-card">
      <img src={src} alt={alt} />
      <div>{author}</div>
    </div>
  );
}

function PhotoGrid() {
  const [photos, setPhotos] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPhotos = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${UNPLASH_API}photos?page=${page}&client_id=${ACCESS_KEY}`
      );
      if (response.status === 403) {
        setError("Access denied. Please check your API key.");
        setHasMore(false);
        return;
      }
      const data = await response.json();
      if (data.length === 0) {
        setHasMore(false);
      } else {
        setPhotos((prevPhotos) => [...prevPhotos, ...data]);
        setPage((prevPage) => prevPage + 1);
      }
    } catch (error) {
      console.error("Error fetching photos:", error);
      setError("An error occurred while fetching photos.");
    } finally {
      setLoading(false);
    }
  }, [page, loading, hasMore]);

  useEffect(() => {
    fetchPhotos();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
          document.documentElement.offsetHeight - 1 &&
        !loading
      ) {
        fetchPhotos();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [fetchPhotos, loading]);

  return (
    <>
      <div className="photo-grid">
        {error && <div className="error">{error}</div>}
        {photos.map((photo) => (
          <Link key={photo.id} to={`/photo/${photo.id}`}>
            <ImageCard
              src={photo.urls.thumb}
              alt={photo.alt_description}
              author={photo.user.name}
            />
          </Link>
        ))}
      </div>
      {loading && <div className="loading">Loading...</div>}
      {!hasMore && !error && (
        <div className="end-of-list">No more photos to load</div>
      )}
    </>
  );
}

function App() {
  return (
    <Router basename="/photo-gallery">
      <Routes>
        <Route path="/" element={<PhotoGrid />} />
        <Route path="/photo/:id" element={<PhotoDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
