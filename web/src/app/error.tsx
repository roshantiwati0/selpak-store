"use client";

export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  return (
    <main className="container">
      <div className="card empty" style={{ marginTop: 40 }}>
        <h1 style={{ fontSize: 28, marginBottom: 6 }}>Something went wrong</h1>
        <p>Please try again. If the problem continues, contact us.</p>
        <button type="button" className="btn btn-primary" onClick={reset}>
          Try again
        </button>
      </div>
    </main>
  );
}
