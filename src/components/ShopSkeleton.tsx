/* Shop / category page load hone tak dikhne wala dhancha. */
export function ShopSkeleton() {
  return (
    <main className="container" aria-busy="true" aria-label="Loading products">
      <div className="crumbs">Home / …</div>
      <div className="skeleton skeleton-line" style={{ width: 220, height: 30, margin: "6px 0 20px" }} />
      <div className="shop">
        <div className="card filters skeleton" style={{ height: 380 }} />
        <div className="grid grid-3">
          {Array.from({ length: 6 }, (_, i) => (
            <div className="pcard" key={i}>
              <div className="pcard-media skeleton" style={{ borderRadius: 0 }} />
              <div className="pcard-body">
                <div className="skeleton skeleton-line" style={{ width: "85%" }} />
                <div className="skeleton skeleton-line" style={{ width: "40%" }} />
                <div className="skeleton skeleton-line" style={{ width: "55%", height: 24, marginTop: 10 }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
