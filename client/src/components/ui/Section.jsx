const GROUNDS = { base: "ground-base", surface: "ground-surface", inverse: "ground-inverse" };

const Section = ({ id, height = 1, ground, className = "", children, ...rest }) => {
  const classes = [ground && GROUNDS[ground], className].filter(Boolean).join(" ");

  return (
    <section
      id={id}
      className={classes || undefined}
      style={{ "--h": height }}
      {...rest}
    >
      <div className="wrap">{children}</div>
    </section>
  );
};

export default Section;
