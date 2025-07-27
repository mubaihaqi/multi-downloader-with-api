import React, { useState } from "react";

export default function ThreadsLayout() {
  const [videoUrl, setVideoUrl] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [links, setLinks] = useState(null);
  const [captionCopied, setCaptionCopied] = useState(false);
  const [copyError, setCopyError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResult(null);
    setLinks(null);
    setLoading(true);
    setCopyError("");
    setCaptionCopied(false);
    try {
      const apiUrl = `http://localhost:3000/api/threads?url=${encodeURIComponent(
        videoUrl
      )}`;

      const res = await fetch(apiUrl, {
        method: "GET",
      });
      const data = await res.json();

      if (data && data.videoUrl) {
        setResult({ success: true, data: data });
        setLinks({
          video: data.videoUrl,
        });
      } else if (data && data.error) {
        setResult({ success: false, error: data.error });
        setLinks(null);
      } else {
        setResult({
          success: false,
          error:
            "Gagal mengambil data video Threads atau format respons tidak dikenal.",
        });
        setLinks(null);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setResult({
        success: false,
        error: "Terjadi kesalahan saat menghubungi server.",
      });
      setLinks(null);
    }
    setLoading(false);
  };

  const handleCopyCaption = async () => {
    setCopyError("");
    const captionToCopy = result?.data?.caption;

    if (!captionToCopy) {
      console.warn("Caption kosong, tidak ada yang disalin.");
      setCopyError("Caption kosong, tidak ada yang bisa disalin.");
      setTimeout(() => setCopyError(""), 3000);
      return;
    }

    if (
      navigator.clipboard &&
      typeof navigator.clipboard.writeText === "function"
    ) {
      try {
        await navigator.clipboard.writeText(captionToCopy);
        setCaptionCopied(true);
        setTimeout(() => setCaptionCopied(false), 2000);
      } catch (err) {
        console.error("Gagal menyalin caption: ", err);
        setCopyError("Gagal menyalin caption. Coba lagi.");
        setTimeout(() => setCopyError(""), 3000);
      }
    } else {
      console.warn(
        "Fitur salin tidak didukung di browser ini atau halaman tidak aman (non-HTTPS)."
      );
      setCopyError(
        "Fitur salin tidak didukung di browser ini / halaman tidak aman."
      );
      setTimeout(() => setCopyError(""), 4000);
    }
  };

  return (
    <div className="h-auto flex flex-col items-center justify-start p-4 pt-2 lg:pt-8">
      <div className="card w-full max-w-lg bg-base-100/90 backdrop-blur-md shadow-md">
        <div className="card-body">
          <h2 className="card-title text-3xl font-bold text-neutral justify-center mb-6 text-center">
            Threads Downloader
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                className={`input input-bordered w-full outline-0 input-ghost focus:input-neutral ${
                  videoUrl && videoUrl.trim() !== ""
                    ? "border-neutral"
                    : "border-base-300"
                }`}
                placeholder="Tempel tautan video Threads di sini..."
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className={`btn btn-neutral w-full ${loading ? "loading" : ""}`}
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
                result.success &&
                result.data && (
                  <>
                    {result.data.coverUrl && result.data.caption && (
                      <div className="mb-4 text-center">
                        <img
                          src={result.data.coverUrl}
                          alt={
                            result.data.caption.substring(0, 50) ||
                            "Threads Video Cover"
                          }
                          className="w-48 max-h-64 object-contain rounded-lg mx-auto shadow-lg mb-2"
                        />
                        <h3 className="text-lg font-semibold">
                          {result.data.caption.length > 70
                            ? result.data.caption.substring(0, 70) + "..."
                            : result.data.caption}
                        </h3>
                        {result.data.username && (
                          <p className="text-sm text-base-content/70">
                            {result.data.username}
                          </p>
                        )}
                      </div>
                    )}
                    {result.data.caption && (
                      <div className="mt-1 mb-4 p-3 border border-base-300 rounded-md bg-base-200/50 text-left">
                        <p className="text-sm text-base-content whitespace-pre-wrap mb-2 max-h-24 overflow-y-auto">
                          {result.data.caption}
                        </p>
                        <button
                          onClick={handleCopyCaption}
                          className="btn btn-xs btn-outline btn-neutral w-full mt-2"
                        >
                          {captionCopied ? "Caption Disalin!" : "Salin Caption"}
                        </button>
                        {copyError && (
                          <p className="text-error text-xs mt-1 text-center">
                            {copyError}
                          </p>
                        )}
                      </div>
                    )}
                    <div className="space-y-3">
                      {links?.video ? (
                        <a
                          href={links.video}
                          className="btn btn-outline btn-neutral w-full"
                          target="_blank"
                          rel="noopener noreferrer"
                          download
                        >
                          Unduh Video
                        </a>
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
                          <span>Link video tidak ditemukan dalam respons.</span>
                        </div>
                      )}
                    </div>
                  </>
                )
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
