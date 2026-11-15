import { Link } from "react-router";

const Button = ({
  variant = "primary",
  to,
  href,
  external = false,
  className = "",
  children,
  ...rest
}) => {
  const classes = `btn btn--${variant} ${className}`.trim();

  if (to) {
    return (
      <Link to={to} className={classes} {...rest}>
        {children}
      </Link>
    );
  }

  if (href) {
    const externalProps = external
      ? { target: "_blank", rel: "noopener noreferrer" }
      : {};
    return (
      <a href={href} className={classes} {...externalProps} {...rest}>
        {children}
      </a>
    );
  }

  return (
    <button type="button" className={classes} {...rest}>
      {children}
    </button>
  );
};

export default Button;
