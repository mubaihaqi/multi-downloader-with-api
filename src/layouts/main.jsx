import React, { useState } from "react";

export default function MainLayout() {
  const [videoUrl, setVideoUrl] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResult(null);
    setLoading(true);
    try {
      const apiUrl = `https://fbdown.vercel.app/api/get?url=${encodeURIComponent(
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
    <div className="h-auto flex flex-col items-center justify-start p-4 pt-4 lg:pt-8">
      <div className="card w-full max-w-lg bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-3xl font-bold text-info justify-center mb-6">
            Fb Downloader
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                className={`input input-bordered w-full outline-0 input-ghost focus:input-info ${
                  videoUrl && videoUrl.trim() !== ""
                    ? "border-info"
                    : "border-primary"
                }`}
                placeholder="Tempel tautan video Facebook di sini..."
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className={`btn btn-info w-full ${loading ? "loading" : ""}`}
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
                  {result.hd && (
                    <a
                      href={result.hd}
                      className="btn btn-outline btn-info w-full"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Unduh HD
                    </a>
                  )}
                  {result.sd && (
                    <a
                      href={result.sd}
                      className="btn btn-outline btn-info w-full"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Unduh SD
                    </a>
                  )}
                  {!result.hd && !result.sd && (
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
