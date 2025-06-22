import React, { useState } from "react";

export default function TiktokLayout() {
  const [videoUrl, setVideoUrl] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [links, setLinks] = useState(null);
  const [captionCopied, setCaptionCopied] = useState(false);
  const [copyError, setCopyError] = useState("");

  const isIOS =
    /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  const MAX_SAFE_BLOB_SIZE = 30 * 1024 * 1024; // 30 MB

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
      const res = await fetch(apiUrl, { method: "GET" });
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
      setCopyError("Caption kosong, tidak ada yang bisa disalin.");
      setTimeout(() => setCopyError(""), 3000);
      return;
    }

    if (navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(captionToCopy);
        setCaptionCopied(true);
        setTimeout(() => setCaptionCopied(false), 2000);
      } catch (err) {
        setCopyError("Gagal menyalin caption. Coba lagi.");
        setTimeout(() => setCopyError(""), 3000);
      }
    } else {
      setCopyError("Fitur salin tidak didukung di browser ini.");
      setTimeout(() => setCopyError(""), 4000);
    }
  };

  const handleSmartDownload = async (url, filename = "video.mp4") => {
    if (isIOS) {
      try {
        const response = await fetch(url);
        const blob = await response.blob();

        if (blob.size > MAX_SAFE_BLOB_SIZE) {
          console.warn(`File ${blob.size} terlalu besar, fallback open tab`);
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
        console.error("Gagal Blob, fallback open tab", err);
        window.open(url, "_blank");
      }
    } else {
      // Android/Desktop: buka tab
      window.open(url, "_blank");
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
            <input
              type="text"
              className={`input input-bordered w-full outline-0 input-ghost focus:input-neutral ${
                videoUrl.trim() ? "border-neutral" : "border-base-300"
              }`}
              placeholder="Tempel tautan video TikTok di sini..."
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              required
            />
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
                <>
                  {result.data?.data?.cover && (
                    <div className="mb-4 text-center">
                      <img
                        src={result.data.data.cover}
                        alt={result.data.data.title}
                        className="w-48 max-h-64 object-contain rounded-lg mx-auto shadow-lg mb-2"
                      />
                      <h3 className="text-lg font-semibold">
                        {result.data.data.title.length > 70
                          ? result.data.data.title.slice(0, 70) + "..."
                          : result.data.data.title}
                      </h3>
                      {result.data.data.author?.nickname && (
                        <p className="text-sm text-base-content/70">
                          @{result.data.data.author.nickname}
                        </p>
                      )}
                    </div>
                  )}

                  {result.data?.data?.title && (
                    <div className="mt-1 mb-4 p-3 border border-base-300 rounded-md bg-base-200/50 text-left">
                      <p className="text-sm text-base-content whitespace-pre-wrap mb-2 max-h-24 overflow-y-auto">
                        {result.data.data.title}
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
                    {links?.play && (
                      <button
                        className="btn btn-outline btn-neutral w-full"
                        onClick={() =>
                          handleSmartDownload(links.play, "tiktok-nowm.mp4")
                        }
                      >
                        Unduh Tanpa Watermark
                      </button>
                    )}
                    {links?.wmplay && (
                      <button
                        className="btn btn-outline btn-neutral w-full"
                        onClick={() =>
                          handleSmartDownload(links.wmplay, "tiktok-wm.mp4")
                        }
                      >
                        Unduh Dengan Watermark
                      </button>
                    )}
                    {links?.hdplay && (
                      <button
                        className="btn btn-outline btn-neutral w-full"
                        onClick={() =>
                          handleSmartDownload(links.hdplay, "tiktok-hd.mp4")
                        }
                      >
                        Unduh Kualitas HD
                      </button>
                    )}
                    {links?.music && (
                      <button
                        className="btn btn-outline btn-neutral w-full"
                        onClick={() =>
                          handleSmartDownload(links.music, "tiktok-music.mp3")
                        }
                      >
                        Unduh Audio / Music
                      </button>
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
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
