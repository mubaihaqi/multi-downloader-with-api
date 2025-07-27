import React, { useState } from "react";

export default function XiaohongshuLayout() {
  const [videoUrl, setVideoUrl] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResult(null);
    setLoading(true);

    try {
      const apiUrl = `http://localhost:3000/api/xiaohongshu?url=${encodeURIComponent(
        videoUrl
      )}`;
      const res = await fetch(apiUrl);

      if (!res.ok) {
        throw new Error(
          `Permintaan API gagal: ${res.status} ${res.statusText}`
        );
      }

      const data = await res.json();

      if (data.success && data.media && data.media.length > 0) {
        setResult(data);
      } else {
        setResult({
          error:
            data.message || "Media tidak ditemukan atau format tidak didukung.",
        });
      }
    } catch (err) {
      console.error("Error dalam handleSubmit:", err);
      setResult({
        error:
          err.message || "Terjadi kesalahan. Periksa koneksi atau URL Anda.",
      });
    }
    setLoading(false);
  };

  return (
    <div className="h-auto flex flex-col items-center justify-start p-4 pt-2 lg:pt-8">
      <div className="card w-full max-w-lg bg-base-100/90 backdrop-blur-md shadow-md">
        <div className="card-body">
          <h2 className="card-title text-3xl font-bold text-error justify-center mb-6 text-center">
            Xiaohongshu Downloader
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                className={`input input-bordered w-full outline-0 input-ghost focus:input-error ${
                  videoUrl && videoUrl.trim() !== ""
                    ? "border-error"
                    : "border-base-300"
                }`}
                placeholder="Tempel tautan Xiaohongshu (Red) di sini..."
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
              ) : result.success && result.media && result.media.length > 0 ? (
                <>
                  {result.thumbnail && result.title && (
                    <div className="mb-4 text-center">
                      <img
                        src={result.thumbnail}
                        alt={result.title}
                        className="w-48 max-h-48 object-contain rounded-lg mx-auto shadow-lg mb-2"
                      />
                      <h3 className="text-xl font-semibold">{result.title}</h3>
                      {result.author && (
                        <p className="text-sm text-base-content/70">
                          {result.author}
                        </p>
                      )}
                    </div>
                  )}

                  <div className="space-y-3">
                    {result.media.map((item, index) => (
                      <a
                        key={index}
                        href={item.url}
                        className="btn btn-outline btn-error w-full"
                        target="_blank"
                        rel="noopener noreferrer"
                        download
                      >
                        {`Unduh ${item.type === "video" ? "Video" : "Gambar"} ${
                          item.quality
                            ? `(${item.quality})`
                            : `(Media ${index + 1})`
                        }`}
                      </a>
                    ))}
                  </div>
                </>
              ) : (
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
                  <span>
                    Tidak ada media yang ditemukan atau format tidak didukung.
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
