import React, { useState } from "react";

export default function TiktokLayout() {
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
    try {
      setCopyError("");
      setCaptionCopied(false);
      const apiUrl = `https://api.ryzumi.vip/api/downloader/ttdl?url=${encodeURIComponent(
        videoUrl
      )}`;
      const res = await fetch(apiUrl, {
        method: "GET",
      });
      const data = await res.json();
      setResult(data);

      if (data.success && data.data?.data) {
        setLinks({
          play: data.data.data.play,
          wmplay: data.data.data.wmplay,
          hdplay: data.data.data.hdplay,
          music: data.data.data.music,
        });
      } else {
        setLinks(null);
      }
    } catch (err) {
      setResult({ error: "Gagal mengambil data." });
      setLinks(null);
    }
    setLoading(false);
  };

  const handleCopyCaption = async () => {
    setCopyError("");
    const captionToCopy = result?.data?.data?.title;

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
      <div className="card w-full max-w-lg bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-3xl font-bold text-neutral justify-center mb-6">
            TikTok Downloader
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
                placeholder="Tempel tautan video TikTok di sini..."
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
                <div className="space-y-3">
                  {links?.play && (
                    <a
                      href={links.play}
                      className="btn btn-outline btn-neutral w-full"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Unduh Tanpa Watermark
                    </a>
                  )}
                  {links?.wmplay && (
                    <a
                      href={links.wmplay}
                      className="btn btn-outline btn-neutral w-full"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Unduh Dengan Watermark
                    </a>
                  )}
                  {links?.hdplay && (
                    <a
                      href={links.hdplay}
                      className="btn btn-outline btn-neutral w-full"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Unduh Kualitas HD
                    </a>
                  )}
                  {links?.music && (
                    <a
                      href={links.music}
                      className="btn btn-outline btn-neutral w-full"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Unduh Audio / Music
                    </a>
                  )}

                  {result.data &&
                    result.data.data &&
                    result.data.data.title && (
                      <div className="mt-4 p-4 border border-base-300 rounded-md bg-base-200 text-left">
                        <p className="text-sm text-base-content whitespace-pre-wrap mb-2">
                          {result.data.data.title}
                        </p>
                        <button
                          onClick={handleCopyCaption}
                          className="btn btn-sm btn-outline btn-neutral w-full mt-2 py-4"
                        >
                          {captionCopied ? "Caption Disalin!" : "Salin Caption"}
                        </button>
                        {copyError && (
                          <p className="text-error text-xs mt-2 text-center">
                            {copyError}
                          </p>
                        )}
                      </div>
                    )}
                  {!links && (
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
                        Media tidak ditemukan atau format tidak didukung.
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
