import React, { useState } from "react";

export default function YoutubeLayout() {
  const [videoUrl, setVideoUrl] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResult(null);
    setLoading(true);
    try {
      const apiUrl = `https://yt-downloader-api.example.com/api/get?url=${encodeURIComponent(
        videoUrl
      )}`;
      const res = await fetch(apiUrl, {
        method: "GET",
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setResult({ error: "Gagal mengambil data." });
    }
    setLoading(false);
  };

  return (
    <div className="h-auto flex flex-col items-center justify-start p-4 pt-8">
      <div className="card w-full max-w-lg bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-3xl font-bold text-error justify-center mb-6">
            Youtube Downloader
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                className={`input input-bordered w-full outline-0 input-ghost focus:input-error ${
                  videoUrl && videoUrl.trim() !== ""
                    ? "border-error"
                    : "border-primary"
                }`}
                placeholder="Tempel tautan video YouTube di sini..."
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className={`btn btn-error w-full ${loading ? "loading" : ""}`}
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
                  className="alert alert-error rounded-full py-[9px] flex items-center justify-center"
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
                      d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>{result.error}</span>
                </div>
              ) : (
                <div className="space-y-3">
                  {result.audio && (
                    <a
                      href={result.audio}
                      className="btn btn-outline btn-error w-full"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Unduh Audio
                    </a>
                  )}
                  {result.video && (
                    <a
                      href={result.video}
                      className="btn btn-outline btn-error w-full"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Unduh Video
                    </a>
                  )}
                  {!result.audio && !result.video && (
                    <div role="alert" className="alert alert-warning">
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
                      <span>
                        Video tidak ditemukan atau tidak ada kualitas yang
                        tersedia.
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
