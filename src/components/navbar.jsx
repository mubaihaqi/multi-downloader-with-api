import React from "react";

export default function Navbar() {
  return (
    <div className="navbar fixed z-20 bg-base-100 shadow-md rounded-b-xl px-4 py-2 mb-2">
      <div className="flex-1">
        <span className="text-2xl font-extrabold text-info tracking-wide">
          Multi <span className="text-neutral">Downloader</span>
        </span>
      </div>
      <div className="flex-none">
        <span className="badge badge-accent badge-md font-semibold">
          <a href="https://github.com/mubaihaqi">@ mubaihaqi</a>
        </span>
      </div>
    </div>
  );
}
