export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="layout">
      <aside className="sidebar-left"></aside>
      <main className="site-content">{children}</main>
      <aside className="sidebar-right"></aside>
    </div>
  );
}
