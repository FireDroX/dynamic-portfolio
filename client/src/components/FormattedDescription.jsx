import { Fragment } from "react";

const LINK_PATTERN = /\[([^\]]+)\]\(([^)]+)\)/g;
const SAFE_HREF = /^(https?:\/\/|mailto:|\/(?!\/)|#)/i;

const FormattedDescription = ({ children }) => {
  const description = String(children || "");
  const content = [];
  let cursor = 0;
  let match;

  while ((match = LINK_PATTERN.exec(description)) !== null) {
    content.push(description.slice(cursor, match.index));
    const [, label, href] = match;

    content.push(
      SAFE_HREF.test(href) ? (
        <a
          key={`${match.index}-${href}`}
          href={href}
          target={
            href.startsWith("/") || href.startsWith("#") ? undefined : "_blank"
          }
          rel="noopener noreferrer"
        >
          {label}
        </a>
      ) : (
        <Fragment key={`${match.index}-${href}`}>{label}</Fragment>
      ),
    );
    cursor = match.index + match[0].length;
  }

  content.push(description.slice(cursor));
  return content;
};

export default FormattedDescription;
