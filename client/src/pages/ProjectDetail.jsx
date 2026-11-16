import "./styles/ProjectDetail.css";
import { useParams } from "react-router";
import { useTranslation } from "react-i18next";
import ContributorAvatars from "../components/ContributorAvatars";
import FormattedDescription from "../components/FormattedDescription";
import ProjectHero from "../components/ProjectHero";
import ProjectLivePreview from "../components/ProjectLivePreview";
import Seo from "../components/Seo";
import Button from "../components/ui/Button";
import Section from "../components/ui/Section";
import useProjectDetails from "../hooks/useProjectDetails";
import { getContributors } from "../utils/contributors";
import getProjectDescription from "../utils/projectDescription";

const ProjectDetail = () => {
  const { t, i18n } = useTranslation();
  const { project: projectSlug } = useParams();
  const { project, hasError, isLoading } = useProjectDetails(projectSlug);

  if (isLoading) {
    return (
      <main className="project-page">
        <Section className="hero" data-enter>
          <div className="project-loading" aria-live="polite">
            <div className="spinner" />
            <p>{t("project.loading")}</p>
          </div>
        </Section>
      </main>
    );
  }

  if (hasError || !project) {
    return (
      <main className="project-page">
        <Seo
          title={t("project.notFoundTitle")}
          description={t("project.notFoundText")}
          path={`/projects/${projectSlug}`}
          noIndex
        />
        <Section className="hero project-notfound" data-enter>
          <small>404</small>
          <h1>{t("project.notFoundTitle")}</h1>
          <p>{t("project.notFoundText")}</p>
          <div>
            <Button to="/projects">{t("project.back")}</Button>
          </div>
        </Section>
      </main>
    );
  }

  const description = getProjectDescription(project, i18n.resolvedLanguage);
  const contributors = getContributors(project);
  const createdAt = new Date(project.createdAt);
  const formattedDate = Number.isNaN(createdAt.getTime())
    ? null
    : new Intl.DateTimeFormat(
        i18n.resolvedLanguage === "en" ? "en-GB" : "fr-FR",
        { day: "2-digit", month: "long", year: "numeric" },
      ).format(createdAt);

  return (
    <main className="project-page">
      <Seo
        title={`${project.name} | Portfolio Adrien`}
        description={description}
        path={`/projects/${project.fileName}`}
        image={project.hasImage ? `/og-image/${project.fileName}` : undefined}
      />

      <Section className="hero project-stage" data-enter>
        <ProjectHero project={project} />
        <ProjectLivePreview key={project.fileName} project={project} />
      </Section>

      <Section id="about">
        <div className="grid">
          <div className="span-8 project-case">
            <h2>{t("project.aboutTitle")}</h2>
            <p>
              <FormattedDescription>{description}</FormattedDescription>
            </p>
            {/* Future case-study sections (contexte, rôle, difficultés) go
                here, rendered only when they have content. */}
          </div>

          <aside className="span-4 project-aside">
            {contributors.length > 0 && (
              <div className="project-aside__block">
                <small>{t("contributors.label")}</small>
                <ContributorAvatars contributors={contributors} align="start" />
              </div>
            )}
            {formattedDate && (
              <time dateTime={project.createdAt}>{formattedDate}</time>
            )}
            <Button
              href={`/api/projects/${project.fileName}`}
              external
              variant="secondary"
            >
              {t("project.openTab")}
            </Button>
          </aside>
        </div>
      </Section>
    </main>
  );
};

export default ProjectDetail;
