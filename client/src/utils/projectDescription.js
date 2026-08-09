const getProjectDescription = (project, language) => {
  const isEnglish = language?.toLowerCase().startsWith("en");
  const primaryDescription = isEnglish
    ? project?.descriptionEn
    : project?.descriptionFr;
  const fallbackDescription = isEnglish
    ? project?.descriptionFr
    : project?.descriptionEn;

  return primaryDescription || fallbackDescription || "";
};

export default getProjectDescription;
