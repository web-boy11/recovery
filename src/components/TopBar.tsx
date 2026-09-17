import { useState } from "react";

export default function TopBar() {
  const [lang, setLang] = useState<"en" | "es">("en");
  return (
    <div className="bg-[#0b1f3a] text-xs text-white/90">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2">
        <div className="flex items-center gap-2">
          <img
            src="https://upload.wikimedia.org/wikipedia/en/thumb/a/a4/Flag_of_the_United_States.svg/320px-Flag_of_the_United_States.svg.png"
            alt="U.S. flag"
            className="h-3 w-5 object-cover"
          />
          <span className="font-medium tracking-wide">
            An official website of the United States government
          </span>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setLang("en")}
            className={`hover:text-white ${lang === "en" ? "text-white underline" : ""}`}
          >
            English
          </button>
          <button
            onClick={() => setLang("es")}
            className={`hover:text-white ${lang === "es" ? "text-white underline" : ""}`}
          >
            Español
          </button>
          <a href="#contact" className="hidden hover:text-white sm:inline">
            Contact
          </a>
          <a href="#report" className="hidden hover:text-white sm:inline">
            File a Report
          </a>
        </div>
      </div>
    </div>
  );
}
