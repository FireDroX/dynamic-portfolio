import { Link } from "react-router";

const Card = ({ to, className = "", children, ...rest }) => {
  const classes = `card ${className}`.trim();

  if (to) {
    return (
      <Link to={to} className={classes} {...rest}>
        {children}
      </Link>
    );
  }

  return (
    <div className={classes} {...rest}>
      {children}
    </div>
  );
};

export default Card;
