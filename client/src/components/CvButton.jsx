import { useTranslation } from "react-i18next";
import Button from "./ui/Button";
import { getCvUrl } from "../utils/cv";

const CvButton = ({ variant = "secondary", ...rest }) => {
  const { t, i18n } = useTranslation();

  return (
    <Button
      variant={variant}
      href={getCvUrl(i18n.resolvedLanguage)}
      external
      {...rest}
    >
      {t("home.cvButton")}
    </Button>
  );
};

export default CvButton;
