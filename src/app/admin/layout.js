// Root admin layout — no auth check here.
// Login lives under /admin/login (no protection needed).
// Protected pages live under /admin/(panel)/ which has its own auth layout.

export const metadata = { title: 'Admin Panel' };

export default function AdminRootLayout({ children }) {
  return <>{children}</>;
}
