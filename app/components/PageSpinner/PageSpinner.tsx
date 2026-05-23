import "./style.css";

export default function PageSpinner() {
  return (
    <div className="page-spinner" role="status" aria-label="Carregando">
      <span className="page-spinner__ring" aria-hidden />
    </div>
  );
}
