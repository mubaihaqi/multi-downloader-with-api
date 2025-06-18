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
      const audioApiUrl = `https://api.ryzumi.vip/api/downloader/ytmp3?url=${encodeURIComponent(
        videoUrl
      )}`;
      const videoApiUrl = `https://api.ryzumi.vip/api/downloader/ytmp4?url=${encodeURIComponent(
        videoUrl
      )}`;

      const [audioOutcome, videoOutcome] = await Promise.allSettled([
        fetch(audioApiUrl).then((res) => {
          if (!res.ok)
            throw new Error(
              `Audio API request failed: ${res.status} ${res.statusText}`
            );
          return res.json();
        }),
        fetch(videoApiUrl).then((res) => {
          if (!res.ok)
            throw new Error(
              `Video API request failed: ${res.status} ${res.statusText}`
            );
          return res.json();
        }),
      ]);

      let fetchedTitle = null;
      let fetchedThumbnail = null;
      let fetchedAuthor = null;
      let fetchedAudioUrl = null;
      let fetchedAudioQuality = null;
      let fetchedVideoUrl = null;
      let fetchedVideoQuality = null;
      let apiErrorMessages = [];

      if (audioOutcome.status === "fulfilled") {
        const data = audioOutcome.value;
        if (data && data.url) {
          fetchedAudioUrl = data.url;
          fetchedAudioQuality = data.quality;
          fetchedTitle = fetchedTitle || data.title;
          fetchedThumbnail = fetchedThumbnail || data.thumbnail;
          fetchedAuthor = fetchedAuthor || data.author;
        } else {
          apiErrorMessages.push(
            `Audio: ${
              data.message || "Link tidak ditemukan atau format tidak didukung."
            }`
          );
        }
      } else {
        apiErrorMessages.push(`Audio API: ${audioOutcome.reason.message}`);
      }

      if (videoOutcome.status === "fulfilled") {
        const data = videoOutcome.value;
        if (data && data.url) {
          fetchedVideoUrl = data.url;
          fetchedVideoQuality = data.quality;
          fetchedTitle = data.title || fetchedTitle;
          fetchedThumbnail = data.thumbnail || fetchedThumbnail;
          fetchedAuthor = data.author || fetchedAuthor;
        } else {
          apiErrorMessages.push(
            `Video: ${
              data.message || "Link tidak ditemukan atau format tidak didukung."
            }`
          );
        }
      } else {
        apiErrorMessages.push(`Video API: ${videoOutcome.reason.message}`);
      }

      if (fetchedAudioUrl || fetchedVideoUrl) {
        setResult({
          title: fetchedTitle,
          thumbnail: fetchedThumbnail,
          author: fetchedAuthor,
          audio: fetchedAudioUrl,
          audioQuality: fetchedAudioQuality,
          video: fetchedVideoUrl,
          videoQuality: fetchedVideoQuality,
          apiErrors:
            apiErrorMessages.filter((msg) =>
              (fetchedAudioUrl && msg.startsWith("Video:")) ||
              (fetchedVideoUrl && msg.startsWith("Audio:"))
                ? !(
                    msg.toLowerCase().includes("tidak ditemukan") ||
                    msg.toLowerCase().includes("format tidak didukung")
                  )
                : true
            ).length > 0
              ? apiErrorMessages.filter((msg) =>
                  (fetchedAudioUrl && msg.startsWith("Video:")) ||
                  (fetchedVideoUrl && msg.startsWith("Audio:"))
                    ? !(
                        msg.toLowerCase().includes("tidak ditemukan") ||
                        msg.toLowerCase().includes("format tidak didukung")
                      )
                    : true
                )
              : null,
        });
      } else {
        setResult({
          error:
            apiErrorMessages.join("; ") ||
            "Gagal mengambil data dari kedua API.",
        });
      }
    } catch (err) {
      console.error("Error dalam handleSubmit:", err);
      setResult({ error: "Terjadi kesalahan. Periksa koneksi atau URL Anda." });
    }
    setLoading(false);
  };

  return (
    <div className="h-auto flex flex-col items-center justify-start p-4 pt-2 lg:pt-8">
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
                    : "border-base-300"
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
              ) : (
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

                  {result.apiErrors && result.apiErrors.length > 0 && (
                    <div className="alert alert-warning mb-3 rounded-lg py-2 px-4 text-sm">
                      <div className="flex-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          className="w-5 h-5 mr-2 stroke-current inline-block"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                          ></path>
                        </svg>
                        Beberapa info/kendala:
                        <ul className="list-disc list-inside ml-2">
                          {result.apiErrors.map((msg, idx) => (
                            <li key={idx}>{msg}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  <div className="space-y-3">
                    {result.audio && (
                      <a
                        href={result.audio}
                        className="btn btn-outline btn-error w-full"
                        target="_blank"
                        rel="noopener noreferrer"
                        download={
                          result.title
                            ? `${result.title} (Audio).mp3`
                            : "youtube_audio.mp3"
                        }
                      >
                        Unduh Audio (MP3)
                        {result.audioQuality && (
                          <span className="ml-2 badge badge-sm badge-outline">
                            {result.audioQuality}
                          </span>
                        )}
                      </a>
                    )}
                    {result.video && (
                      <a
                        href={result.video}
                        className="btn btn-outline btn-error w-full"
                        target="_blank"
                        rel="noopener noreferrer"
                        download={
                          result.title
                            ? `${result.title} (Video).mp4`
                            : "youtube_video.mp4"
                        }
                      >
                        Unduh Video (MP4)
                        {result.videoQuality && (
                          <span className="ml-2 badge badge-sm badge-outline">
                            {result.videoQuality}p
                          </span>
                        )}
                      </a>
                    )}
                    {!result.audio &&
                      !result.video &&
                      !result.error &&
                      (!result.apiErrors || result.apiErrors.length === 0) && (
                        <div
                          role="alert"
                          className="alert alert-warning rounded-full py-[9px] flex items-center justify-center"
                        >
                          <span>
                            Tidak ada media yang ditemukan atau format tidak
                            didukung.
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
