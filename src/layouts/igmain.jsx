import React, { useState } from "react";

export default function InstagramLayout() {
  const [videoUrl, setVideoUrl] = useState("");
  const [apiResponse, setApiResponse] = useState(null);
  const [apiResponse2, setApiResponse2] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorMessage2, setErrorMessage2] = useState("");
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [captionCopied, setCaptionCopied] = useState(false);

  const isIOS =
    /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  const MAX_SAFE_BLOB_SIZE = 30 * 1024 * 1024; // 30 MB

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiResponse(null);
    setApiResponse2(null);
    setErrorMessage("");
    setErrorMessage2("");
    setLoading(true);
    setLoading2(false); // Don't start loading for API 2 yet

    // First API call (existing) - Priority API
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
          setLoading(false);
          return; // Stop here if API 1 succeeds
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

    // Second API call (new) - Only if API 1 fails
    setLoading2(true);
    try {
      const encodedUrl = encodeURIComponent(videoUrl);
      const response2 = await fetch(
        `https://api.ryzumi.vip/api/downloader/igdl?url=${encodedUrl}`,
        {
          method: "GET",
          headers: {
            accept: "application/json",
          },
        }
      );

      const data2 = await response2.json();
      if (response2.ok) {
        if (data2 && (data2.data || data2.result)) {
          setApiResponse2(data2);
        } else {
          setErrorMessage2("Media tidak ditemukan atau format tidak didukung.");
        }
      } else {
        setErrorMessage2(data2.message || "Gagal memproses permintaan.");
      }
    } catch (err) {
      setErrorMessage2(
        "Gagal mengambil data dari API kedua. Periksa koneksi Anda."
      );
    }
    setLoading2(false);
  };

  const handleCopyCaption = async () => {
    if (
      navigator.clipboard &&
      typeof navigator.clipboard.writeText === "function" &&
      apiResponse?.caption
    ) {
      try {
        await navigator.clipboard.writeText(apiResponse.caption);
        setCaptionCopied(true);
        setTimeout(() => setCaptionCopied(false), 2000);
      } catch (err) {
        console.error("Gagal menyalin caption: ", err);
      }
    } else {
      console.warn("Clipboard API tidak didukung atau caption kosong.");
    }
  };

  const handleSmartDownload = async (url, filename = "instagram-media") => {
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
      window.open(url, "_blank");
    }
  };

  return (
    <div className="h-auto flex flex-col items-center justify-start p-4 pt-2 lg:pt-8">
      <div className="card w-full max-w-lg bg-base-100/90 backdrop-blur-md shadow-md">
        <div className="card-body">
          <h2 className="card-title text-3xl font-bold text-accent justify-center mb-6 text-center">
            Instagram Downloader
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              className={`input input-bordered w-full outline-0 input-ghost focus:input-accent ${
                videoUrl.trim() ? "border-accent" : "border-base-300"
              }`}
              placeholder="Tempel tautan video Instagram di sini..."
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              required
            />
            <button
              type="submit"
              className={`btn btn-accent w-full ${loading ? "loading" : ""}`}
              disabled={loading}
            >
              {loading ? "Memuat..." : "Download"}
            </button>
          </form>

          {/* Main Results - Priority API */}
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
                {apiResponse.type && (
                  <button
                    className="btn btn-accent w-full"
                    onClick={() =>
                      handleSmartDownload(
                        apiResponse.download_url,
                        `instagram-${apiResponse.type}`
                      )
                    }
                  >
                    {apiResponse.type === "video"
                      ? "Unduh Video"
                      : apiResponse.type === "image"
                      ? "Unduh Gambar"
                      : "Unduh Media"}
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Alternative Results - Only show if main API fails */}
          {(!apiResponse || errorMessage) &&
            !errorMessage2 &&
            apiResponse2 &&
            (apiResponse2.data || apiResponse2.result) && (
              <div className="mt-6">
                <div className="space-y-3">
                  {apiResponse2.data &&
                    Array.isArray(apiResponse2.data) &&
                    apiResponse2.data.map((item, index) => (
                      <div
                        key={index}
                        className="p-3 border border-base-300 rounded-md bg-base-200/50"
                      >
                        {item.url && (
                          <button
                            className="btn btn-outline btn-accent w-full mb-2"
                            onClick={() =>
                              handleSmartDownload(
                                item.url,
                                `instagram-media-${index + 1}`
                              )
                            }
                          >
                            Unduh Media {index + 1}
                          </button>
                        )}
                        {item.thumbnail && (
                          <img
                            src={item.thumbnail}
                            alt={`Thumbnail ${index + 1}`}
                            className="w-full h-auto rounded-md"
                          />
                        )}
                      </div>
                    ))}
                  {apiResponse2.result &&
                    Array.isArray(apiResponse2.result) &&
                    apiResponse2.result.map((item, index) => (
                      <div
                        key={index}
                        className="p-3 border border-base-300 rounded-md bg-base-200/50"
                      >
                        {item.url && (
                          <button
                            className="btn btn-outline btn-accent w-full mb-2"
                            onClick={() =>
                              handleSmartDownload(
                                item.url,
                                `instagram-media-${index + 1}`
                              )
                            }
                          >
                            Unduh Media {index + 1}
                          </button>
                        )}
                        {item.thumbnail && (
                          <img
                            src={item.thumbnail}
                            alt={`Thumbnail ${index + 1}`}
                            className="w-full h-auto rounded-md"
                          />
                        )}
                      </div>
                    ))}
                </div>
              </div>
            )}

          {/* Error Messages */}
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
                <span>API Utama: {errorMessage}</span>
              </div>
            </div>
          )}

          {errorMessage2 && (
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
                <span>API Alternatif: {errorMessage2}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
