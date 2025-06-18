import React, { useState } from "react";

export default function SpotifyLayout() {
  const [songUrl, setSongUrl] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResult(null);
    setErrorMessage("");
    setLoading(true);

    try {
      const apiUrl = `https://api.ryzumi.vip/api/downloader/spotify?url=${encodeURIComponent(
        songUrl
      )}`;
      const res = await fetch(apiUrl, {
        method: "GET",
      });
      const data = await res.json();

      if (data.success && data.link && data.metadata) {
        setResult(data);
      } else {
        setErrorMessage(
          data.message || "Lagu tidak ditemukan atau format tidak didukung."
        );
      }
    } catch (err) {
      setErrorMessage("Gagal mengambil data. Periksa koneksi Anda.");
    }
    setLoading(false);
  };

  return (
    <div className="h-auto flex flex-col items-center justify-start p-4 pt-2 lg:pt-8">
      <div className="card w-full max-w-lg bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-3xl font-bold text-success justify-center mb-6">
            Spotify Downloader
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                className={`input input-bordered w-full outline-0 input-ghost focus:input-success ${
                  songUrl && songUrl.trim() !== ""
                    ? "border-success"
                    : "border-base-300"
                }`}
                placeholder="Tempel tautan lagu Spotify di sini..."
                value={songUrl}
                onChange={(e) => setSongUrl(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className={`btn btn-success w-full ${loading ? "loading" : ""}`}
              disabled={loading}
            >
              {loading ? "Memuat..." : "Download"}
            </button>
          </form>

          {errorMessage && (
            <div className="mt-6">
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
                <span>{errorMessage}</span>
              </div>
            </div>
          )}

          {!errorMessage && result && result.link && result.metadata && (
            <div className="mt-6 text-center">
              <div className="mb-4">
                {result.metadata.cover && (
                  <img
                    src={result.metadata.cover}
                    alt={result.metadata.title}
                    className="w-32 h-32 object-cover rounded-lg mx-auto shadow-lg"
                  />
                )}
                <h3 className="text-xl font-semibold mt-3">
                  {result.metadata.title}
                </h3>
                <p className="text-sm text-base-content/70">
                  {result.metadata.artists}
                </p>
              </div>
              <a
                href={result.link}
                className="btn btn-outline btn-success w-full"
                target="_blank"
                rel="noopener noreferrer"
                download={`${result.metadata.artists} - ${result.metadata.title}.mp3`}
              >
                Unduh Lagu
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
