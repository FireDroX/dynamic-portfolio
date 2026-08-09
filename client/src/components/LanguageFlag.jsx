const LanguageFlag = ({ language }) => {
  if (language === "en") {
    return (
      <svg viewBox="0 0 60 36" aria-hidden="true">
        <rect width="60" height="36" fill="#012169" />
        <path d="M0 0 60 36M60 0 0 36" stroke="#fff" strokeWidth="7.2" />
        <path d="M0 0 60 36M60 0 0 36" stroke="#c8102e" strokeWidth="4.2" />
        <path d="M30 0v36M0 18h60" stroke="#fff" strokeWidth="12" />
        <path d="M30 0v36M0 18h60" stroke="#c8102e" strokeWidth="7.2" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 3 2" aria-hidden="true">
      <path fill="#002654" d="M0 0h1v2H0z" />
      <path fill="#fff" d="M1 0h1v2H1z" />
      <path fill="#ed2939" d="M2 0h1v2H2z" />
    </svg>
  );
};

export default LanguageFlag;
