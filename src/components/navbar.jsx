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
  const [activeThemeName, setActiveThemeName] = useState(capitalize("cupcake"));

  useEffect(() => {
    const toastShown = sessionStorage.getItem("themeToastShown");

    if (!toastShown) {
      setTimeout(() => {
        Swal.fire({
          toast: true,
          position: "top",
          title:
            "Bosen dengan tema? Bisa ganti, lo! Coba pencet judul web ini.",
          showConfirmButton: false,
          timer: 4000,
          background: "rgba(255, 255, 255, 0.1)",
          color: "#3ABFF8",
          timerProgressBar: true,
          customClass: {
            popup: "glass-toast",
          },
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          },
        });
        sessionStorage.setItem("themeToastShown", "true");
      }, 0);
    }

    const savedThemeFromStorage = localStorage.getItem("selectedTheme");
    let initialTheme = "cupcake";
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
    <div className="navbar fixed z-20 bg-base-100 shadow-md rounded-b-xl px-4 py-2 mb-2">
      <div className="flex-1">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="cursor-pointer">
            <span className="text-2xl font-extrabold text-info tracking-wide">
              Multi <span className="text-neutral">{text}</span>
              <Cursor cursorStyle="|" />
            </span>
          </div>
          <ul
            tabIndex={0}
            className="dropdown-content bg-base-200 rounded-box z-[1] w-54 p-2 shadow-2xl menu menu-sm menu-horizontal max-h-72 overflow-x-auto no-scrollbar"
          >
            {themes.map((theme) => (
              <li key={theme}>
                <input
                  type="radio"
                  name="theme-dropdown"
                  className="theme-controller btn btn-sm btn-block btn-ghost justify-start"
                  aria-label={theme.charAt(0).toUpperCase() + theme.slice(1)}
                  value={theme}
                  onClick={() => handleThemeChange(theme)}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="flex-none">
        <span className="badge badge-accent badge-md font-semibold">
          <a href="https://github.com/mubaihaqi">@mubaihaqi</a>
        </span>
      </div>
    </div>
  );
}
