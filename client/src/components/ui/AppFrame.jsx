import "./AppFrame.css";

const AppFrame = ({
  title,
  actions,
  className = "",
  bodyClassName = "",
  children,
}) => (
  <div className={`app-frame ${className}`.trim()}>
    <div className="app-frame__bar">
      <span className="app-frame__dots" aria-hidden="true">
        <i className="app-frame__dot app-frame__dot--red" />
        <i className="app-frame__dot app-frame__dot--yellow" />
        <i className="app-frame__dot app-frame__dot--green" />
      </span>
      <span className="app-frame__title">{title}</span>
      {actions && <div className="app-frame__actions">{actions}</div>}
    </div>
    <div className={`app-frame__body ${bodyClassName}`.trim()}>{children}</div>
  </div>
);

export default AppFrame;
