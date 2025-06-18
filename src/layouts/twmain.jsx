import React, { useState } from "react";

export default function TwitterLayout() {
  const [videoUrl, setVideoUrl] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResult(null);
    setLoading(true);

    try {
      const apiUrl = `https://api.ryzumi.vip/api/downloader/twitter?url=${encodeURIComponent(
        videoUrl
      )}`;
      const res = await fetch(apiUrl, {
        method: "GET",
      });
      const data = await res.json();
      if (data.status && data.media && data.media.length > 0) {
        setResult(data);
      } else {
        setResult({
          error:
            data.message || "Media tidak ditemukan atau format tidak didukung.",
        });
      }
    } catch (err) {
      setResult({ error: "Media tidak ditemukan atau format tidak didukung." });
    }
    setLoading(false);
  };

  return (
    <div className="h-auto flex flex-col items-center justify-start p-4 pt-2 lg:pt-8">
      <div className="card w-full max-w-lg bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-3xl font-bold text-primary justify-center mb-6">
            Twitter Downloader
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                className={`input input-bordered w-full outline-0 input-ghost focus:input-primary ${
                  videoUrl && videoUrl.trim() !== ""
                    ? "border-primary"
                    : "border-base-300"
                }`}
                placeholder="Tempel tautan video Twitter di sini..."
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className={`btn btn-primary w-full ${loading ? "loading" : ""}`}
              disabled={loading}
            >
              {loading ? "Memuat..." : "Download"}
            </button>
          </form>
          {result && (
            <div className="mt-6">
              {result.error ? (
                <div
                  role="alert"
                  className="alert alert-warning rounded-full py-[9px] flex items-center justify-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="stroke-current shrink-0 h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                  <span>{result.error}</span>
                </div>
              ) : result.media && result.media.length > 0 ? (
                <div className="space-y-3">
                  {result.media.map((item, index) => (
                    <a
                      key={index}
                      href={item.url}
                      className="btn btn-outline btn-primary w-full"
                      target="_blank"
                      rel="noopener noreferrer"
                      download={`twitter_video_${item.quality || index}.mp4`}
                    >
                      {`Unduh Video Twitter ${
                        item.quality
                          ? `${item.quality}p`
                          : `(Kualitas ${index + 1})`
                      }`}
                    </a>
                  ))}
                </div>
              ) : (
                // Fallback jika tidak ada error tapi juga tidak ada media yang valid
                <div className="alert alert-primary rounded-full py-[9px] flex items-center justify-center">
                  <span>
                    Tidak ada media yang ditemukan untuk URL ini atau format
                    tidak didukung.
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
