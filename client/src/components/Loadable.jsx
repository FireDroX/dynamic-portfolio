import { Suspense } from "react";

const Loader = () => (
  <section id="Loader">
    <div className="spinner-container">
      <div className="spinner" />
    </div>
  </section>
);

export default function Loadable(Component, props = {}) {
  return (
    <Suspense fallback={<Loader />}>
      <Component {...props} />
    </Suspense>
  );
}
