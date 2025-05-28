import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import defaultBook from "/img/defaultBook.svg";

const Card = React.memo(function Card({ title, image, preload }) {
  const [isLoading, setIsLoading] = useState(true);
  const [imageSrc, setImageSrc] = useState(defaultBook);
  const navigate = useNavigate();

  const navigateToBookDetails = () => {
    const formattedTitle = title.trim().replaceAll(" ", "_");
    navigate(`/viewBook/${encodeURIComponent(formattedTitle)}`);
  };

  const handleImageLoad = () => {
    setIsLoading(false);
    setImageSrc(image);
  };

  useEffect(() => {
    if (preload) {
      requestAnimationFrame(() => {
        setIsLoading(false);
      });
    } else {
      const timeout = setTimeout(() => {
        setIsLoading(false);
      }, Math.random() * (700 - 300) + 300);
      return () => clearTimeout(timeout);
    }
  }, [preload]);

  return (
    <div
      className="cardC"
      style={{ textAlign: "center", cursor: "pointer" }}
      onClick={navigateToBookDetails}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") navigateToBookDetails();
      }}
      aria-label={`See book details of ${title}`}
    >
      {isLoading ? (
        <div>
          <Skeleton width={200} height={20} className="my-3" />
          <Skeleton width={300} height={375} />
        </div>
      ) : (
        <>
          <h2 title={title}>
            {title.length > 30 ? title.slice(0, 30) + "..." : title}
          </h2>
          <img
            src={imageSrc}
            alt={`Book front page of ${title}`}
            loading={preload ? "eager" : "lazy"}
            onLoad={handleImageLoad}
            style={{
              width: "100%",
              height: "auto",
              aspectRatio: "2 / 3",
              objectFit: "contain",
              maxWidth: "220px",
              display: "block",
              margin: "0 auto",
            }}
            className="shadow"
          />
        </>
      )}
    </div>
  );
});

export default Card;
