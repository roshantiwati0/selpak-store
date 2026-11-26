import Link from "next/link";

export default function NotFound() {
  return (
    <main className="container">
      <div className="card empty" style={{ marginTop: 40 }}>
        <h1 style={{ fontSize: 28, marginBottom: 6 }}>Page not found</h1>
        <p>The page you are looking for does not exist or has moved.</p>
        <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
          <Link className="btn btn-primary" href="/">
            Go to home
          </Link>
          <Link className="btn btn-secondary" href="/shop">
            Shop all products
          </Link>
        </div>
      </div>
    </main>
  );
}
