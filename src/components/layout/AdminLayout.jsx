export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-primary-50 dark:bg-warmGray-950">
      <div className="max-w-7xl mx-auto">
        {children}
      </div>
    </div>
  );
}
