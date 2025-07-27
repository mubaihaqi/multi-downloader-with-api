import React, { useState } from "react";

export default function YoutubeLayout() {
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
      const audioApiUrl = `https://api.ryzumi.vip/api/downloader/ytmp3?url=${encodeURIComponent(
        videoUrl
      )}`;
      const videoApiUrl = `https://api.ryzumi.vip/api/downloader/ytmp4?url=${encodeURIComponent(
        videoUrl
      )}`;

      const [audioOutcome, videoOutcome] = await Promise.allSettled([
        fetch(audioApiUrl).then((res) =>
          res.ok
            ? res.json()
            : Promise.reject(new Error(`Audio API: ${res.status}`))
        ),
        fetch(videoApiUrl).then((res) =>
          res.ok
            ? res.json()
            : Promise.reject(new Error(`Video API: ${res.status}`))
        ),
      ]);

      let data = {
        title: null,
        thumbnail: null,
        author: null,
        audio: null,
        audioQuality: null,
        video: null,
        videoQuality: null,
        apiErrors: [],
      };

      if (audioOutcome.status === "fulfilled" && audioOutcome.value?.url) {
        const d = audioOutcome.value;
        data.audio = d.url;
        data.audioQuality = d.quality;
        data.title = d.title || data.title;
        data.thumbnail = d.thumbnail || data.thumbnail;
        data.author = d.author || data.author;
      } else if (audioOutcome.status === "rejected") {
        data.apiErrors.push(`Audio API: ${audioOutcome.reason.message}`);
      }

      if (videoOutcome.status === "fulfilled" && videoOutcome.value?.url) {
        const d = videoOutcome.value;
        data.video = d.url;
        data.videoQuality = d.quality;
        data.title = d.title || data.title;
        data.thumbnail = d.thumbnail || data.thumbnail;
        data.author = d.author || data.author;
      } else if (videoOutcome.status === "rejected") {
        data.apiErrors.push(`Video API: ${videoOutcome.reason.message}`);
      }

      if (data.audio || data.video) {
        setResult(data);
      } else {
        setResult({
          error: data.apiErrors.join(" | ") || "Tidak ada media ditemukan.",
        });
      }
    } catch (err) {
      console.error(err);
      setResult({ error: "Terjadi kesalahan. Periksa koneksi atau URL." });
    }

    setLoading(false);
  };

  const handleSmartDownload = async (url, filename) => {
    if (isIOS) {
      try {
        const response = await fetch(url);
        const blob = await response.blob();
        if (blob.size > MAX_SAFE_BLOB_SIZE) {
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
      } catch {
        window.open(url, "_blank");
      }
    } else {
      window.open(url, "_blank");
    }
  };

  return (
    <div className="h-auto flex flex-col items-center justify-start p-4 pt-2 lg:pt-8">
      <div className="card w-full max-w-lg bg-base-100/90 backdrop-blur-md shadow-md">
        <div className="card-body">
          <h2 className="card-title text-3xl font-bold text-error justify-center mb-6 text-center">
            Youtube Downloader
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              className={`input input-bordered w-full outline-0 input-ghost focus:input-error ${
                videoUrl.trim() ? "border-error" : "border-base-300"
              }`}
              placeholder="Tempel tautan video YouTube di sini..."
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              required
            />
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
                  <span>{result.error}</span>
                </div>
              ) : (
                <>
                  {result.thumbnail && (
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

                  {result.apiErrors.length > 0 && (
                    <div className="alert alert-warning mb-3 rounded-lg py-2 px-4 text-sm">
                      <b>Kendala:</b>
                      <ul className="list-disc list-inside ml-4">
                        {result.apiErrors.map((msg, i) => (
                          <li key={i}>{msg}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="space-y-3">
                    {result.audio && (
                      <button
                        onClick={() =>
                          handleSmartDownload(
                            result.audio,
                            `${result.title || "youtube"} (Audio).mp3`
                          )
                        }
                        className="btn btn-outline btn-error w-full"
                      >
                        Unduh Audio (MP3)
                        {result.audioQuality && (
                          <span className="ml-2 badge badge-sm badge-outline">
                            {result.audioQuality}
                          </span>
                        )}
                      </button>
                    )}
                    {result.video && (
                      <button
                        onClick={() =>
                          handleSmartDownload(
                            result.video,
                            `${result.title || "youtube"} (Video).mp4`
                          )
                        }
                        className="btn btn-outline btn-error w-full"
                      >
                        Unduh Video (MP4)
                        {result.videoQuality && (
                          <span className="ml-2 badge badge-sm badge-outline">
                            {result.videoQuality}p
                          </span>
                        )}
                      </button>
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
