import React, { useState } from "react";

export default function InstagramLayout() {
  const [videoUrl, setVideoUrl] = useState("");
  const [apiResponse, setApiResponse] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [captionCopied, setCaptionCopied] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiResponse(null);
    setErrorMessage("");
    setLoading(true);

    try {
      const response = await fetch(
        "https://instagram-downloader-api-nine.vercel.app/download",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ url: videoUrl }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        if (data && data.download_url) {
          setCaptionCopied(false);
          setApiResponse(data);
        } else {
          setErrorMessage(
            data.message || "Media tidak ditemukan atau format tidak didukung."
          );
        }
      } else {
        setErrorMessage(data.message || "Gagal memproses permintaan.");
      }
    } catch (err) {
      setErrorMessage("Gagal mengambil data. Periksa koneksi Anda.");
    }
    setLoading(false);
  };

  const handleCopyCaption = async () => {
    console.log("Mencoba menyalin caption...");
    console.log("navigator.clipboard:", navigator.clipboard);

    if (
      navigator.clipboard &&
      typeof navigator.clipboard.writeText === "function" &&
      apiResponse &&
      apiResponse.caption
    ) {
      try {
        await navigator.clipboard.writeText(apiResponse.caption);
        setCaptionCopied(true);
        setTimeout(() => setCaptionCopied(false), 2000);
      } catch (err) {
        console.error("Gagal menyalin caption: ", err);
      }
    } else {
      console.warn(
        "Tidak dapat menyalin: Clipboard API tidak didukung atau caption kosong."
      );
    }
  };

  return (
    <div className="h-auto flex flex-col items-center justify-start p-4 pt-2 lg:pt-8">
      <div className="card w-full max-w-lg bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-3xl font-bold text-accent justify-center mb-6 text-center">
            Instagram Downloader
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                className={`input input-bordered w-full outline-0 input-ghost focus:input-accent ${
                  videoUrl && videoUrl.trim() !== ""
                    ? "border-accent"
                    : "border-base-300"
                }`}
                placeholder="Tempel tautan video Instagram di sini..."
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className={`btn btn-accent w-full ${loading ? "loading" : ""}`}
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

          {!errorMessage && apiResponse && apiResponse.download_url && (
            <div className="mt-2">
              {apiResponse.caption && (
                <div className="mt-1 mb-4 p-3 border border-base-300 rounded-md bg-base-200/50 text-left">
                  <p className="text-sm text-base-content whitespace-pre-wrap mb-2 max-h-24 overflow-y-auto">
                    {apiResponse.caption}
                  </p>
                  <button
                    onClick={handleCopyCaption}
                    className="btn btn-xs btn-outline btn-accent w-full mt-2"
                  >
                    {captionCopied ? "Caption Disalin!" : "Salin Caption"}
                  </button>
                </div>
              )}

              <div className="space-y-3">
                {apiResponse.type === "video" && (
                  <a
                    href={apiResponse.download_url}
                    className="btn btn-outline btn-accent w-full"
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                  >
                    Unduh Video
                  </a>
                )}
                {apiResponse.type === "image" && (
                  <a
                    href={apiResponse.download_url}
                    className="btn btn-outline btn-accent w-full"
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                  >
                    Unduh Gambar
                  </a>
                )}
                {apiResponse.type !== "video" &&
                  apiResponse.type !== "image" &&
                  apiResponse.download_url && (
                    <a
                      href={apiResponse.download_url}
                      className="btn btn-outline btn-accent w-full"
                      target="_blank"
                      rel="noopener noreferrer"
                      download
                    >
                      Unduh Media
                    </a>
                  )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
