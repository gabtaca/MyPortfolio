export default function Layout({ children }) {
  return (
    <div className="body_layout">
      {/* <LightningHeader /> */}
      <main className="main_layout">
        {children}
      </main>
      <footer className="footer_layout"></footer>
    </div>
  );
}