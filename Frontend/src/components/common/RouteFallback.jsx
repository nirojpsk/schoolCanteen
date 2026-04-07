import LoadingBlock from "./LoadingBlock";

export default function RouteFallback() {
  return (
    <div className="content-shell py-16">
      <LoadingBlock label="Loading page..." />
    </div>
  );
}
