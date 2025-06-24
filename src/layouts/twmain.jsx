import React, { useState } from "react";

export default function TwitterLayout() {
  const [videoUrl, setVideoUrl] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const isIOS =
    /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  const MAX_SAFE_BLOB_SIZE = 30 * 1024 * 1024; // 30 MB

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResult(null);
    setLoading(true);

    try {
      const apiUrl = `https://api.ryzumi.vip/api/downloader/twitter?url=${encodeURIComponent(
        videoUrl
      )}`;
      const res = await fetch(apiUrl);
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
      setResult({
        error: "Media tidak ditemukan atau format tidak didukung.",
      });
    }
    setLoading(false);
  };

  const handleSmartDownload = async (url, filename) => {
    if (isIOS) {
      try {
        const response = await fetch(url);
        const blob = await response.blob();

        if (blob.size > MAX_SAFE_BLOB_SIZE) {
          console.warn(`File terlalu besar (${blob.size}). Fallback open tab.`);
          window.open(url, "_blank");
          return;
        }

        const blobUrl = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = blobUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(blobUrl);
      } catch (err) {
        console.error("Gagal Blob download, fallback open tab:", err);
        window.open(url, "_blank");
      }
    } else {
      window.open(url, "_blank");
    }
  };

  return (
    <div className="h-auto flex flex-col items-center justify-start p-4 pt-2 lg:pt-8">
      <div className="card w-full max-w-lg bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-3xl font-bold text-primary justify-center mb-6 text-center">
            Twitter Downloader
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              className={`input input-bordered w-full outline-0 input-ghost focus:input-primary ${
                videoUrl.trim() ? "border-primary" : "border-base-300"
              }`}
              placeholder="Tempel tautan video Twitter di sini..."
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              required
            />
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
                    <button
                      key={index}
                      onClick={() =>
                        handleSmartDownload(
                          item.url,
                          `twitter_video_${item.quality || index}.mp4`
                        )
                      }
                      className="btn btn-outline btn-primary w-full"
                    >
                      {`Unduh Video Twitter ${
                        item.quality
                          ? `${item.quality}p`
                          : `(Kualitas ${index + 1})`
                      }`}
                    </button>
                  ))}
                </div>
              ) : (
                <div
                  className="alert alert-warning rounded-full py-[9px] flex items-center justify-center"
                  role="alert"
                >
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
