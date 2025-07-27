import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useTypewriter, Cursor } from "react-simple-typewriter";

const themes = [
  "light",
  "dark",
  "cupcake",
  "bumblebee",
  "emerald",
  "corporate",
  "synthwave",
  "retro",
  "cyberpunk",
  "valentine",
  "halloween",
  "garden",
  "forest",
  "aqua",
  "lofi",
  "pastel",
  "fantasy",
  "wireframe",
  "black",
  "luxury",
  "dracula",
  "cmyk",
  "autumn",
  "business",
  "acid",
  "lemonade",
  "night",
  "coffee",
  "winter",
  "dim",
  "nord",
  "sunset",
  "caramellatte",
  "abyss",
  "silk",
];

const capitalize = (str) => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export default function Navbar() {
  const [activeThemeName, setActiveThemeName] = useState(capitalize("retro"));

  useEffect(() => {
    const toastShown = sessionStorage.getItem("themeToastShown");

    if (!toastShown) {
      setTimeout(() => {
        // Ambil warna base-100 dari CSS variable DaisyUI
        const base100 =
          getComputedStyle(document.documentElement).getPropertyValue("--b1") ||
          "#424753";
        Swal.fire({
          toast: true,
          position: "top",
          title: "🎨 Personalisasi Tema",
          text: "Klik judul website untuk mengganti tema sesuai mood kamu!",
          showConfirmButton: false,
          timer: 6000,
          background: base100.trim(),
          color: "#3ABFF8",
          timerProgressBar: true,
          customClass: {
            popup: "glass-toast border-0 text-info",
            title: "text-lg font-bold text-info",
            htmlContainer: "text-sm text-info",
          },
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          },
        });
        sessionStorage.setItem("themeToastShown", "true");
      }, 3000);
    }

    const savedThemeFromStorage = localStorage.getItem("selectedTheme");
    let initialTheme = "retro";
    if (savedThemeFromStorage) {
      initialTheme = savedThemeFromStorage;
    }
    document.documentElement.setAttribute("data-theme", initialTheme);
    setActiveThemeName(capitalize(initialTheme));
  }, []);

  const [text] = useTypewriter({
    words: ["Downloader", activeThemeName],
    loop: 0,
    typeSpeed: 120,
    deleteSpeed: 80,
    delaySpeed: 1500,
  });

  const handleThemeChange = (theme) => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("selectedTheme", theme);
    setActiveThemeName(capitalize(theme));
  };

  return (
    <div className="navbar fixed z-20 bg-base-100/90 backdrop-blur-md shadow-md rounded-b-xl px-4 py-2 mb-2">
      <div className="flex-1">
        <div className="dropdown">
          <div
            tabIndex={0}
            role="button"
            className="cursor-pointer hover:scale-105 transition-transform duration-200"
          >
            <span className="text-2xl font-extrabold text-info tracking-wide">
              Multi <span className="text-neutral">{text}</span>
              <Cursor cursorStyle="|" />
            </span>
          </div>
          <ul
            tabIndex={0}
            className="dropdown-content bg-base-200/95 backdrop-blur-md rounded-box z-[1] w-64 p-4 shadow-2xl menu menu-sm max-h-96 overflow-y-auto no-scrollbar border border-base-content/10 theme-dropdown modal-animate"
          >
            <li className="menu-title mb-3">
              <span className="text-sm font-bold text-base-content flex items-center gap-2">
                🎨 Pilih Tema
              </span>
            </li>
            <div className="grid grid-cols-1 gap-1">
              {themes.map((theme) => (
                <li key={theme}>
                  <input
                    type="radio"
                    name="theme-dropdown"
                    className="theme-controller btn btn-sm btn-block btn-ghost justify-start hover:bg-base-300/50 transition-all duration-200 hover:scale-105"
                    aria-label={theme.charAt(0).toUpperCase() + theme.slice(1)}
                    value={theme}
                    onClick={() => handleThemeChange(theme)}
                  />
                </li>
              ))}
            </div>
          </ul>
        </div>
      </div>
      <div className="flex-none">
        <span className="badge badge-accent badge-md font-semibold hover:scale-105 transition-transform duration-200">
          <a href="https://github.com/mubaihaqi">@mubaihaqi</a>
        </span>
      </div>
    </div>
  );
}
