import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./PhotoDetail.css";

const UNPLASH_API = import.meta.env.VITE_UNPLASH_API;
const ACCESS_KEY = import.meta.env.VITE_UNPLASH_ACCESS_KEY;

function PhotoDetail() {
  const { id } = useParams<{ id: string }>();
  const [photo, setPhoto] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPhoto = async () => {
      try {
        const response = await fetch(
          `${UNPLASH_API}photos/${id}?client_id=${ACCESS_KEY}`
        );
        const data = await response.json();
        setPhoto(data);
      } catch (error) {
        console.error("Error fetching photo details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPhoto();
  }, [id]);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!photo) {
    return <div className="error">Photo not found</div>;
  }

  return (
    <div className="photo-detail">
      <img src={photo.urls.full} alt={photo.alt_description} />
      <h2>{photo.description || "No description available"}</h2>
      <p>Author: {photo.user.name}</p>
    </div>
  );
}

export default PhotoDetail;
