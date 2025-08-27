import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-primary">Welcome to MareJS</h1>

      <p className="text-base">
        MareJS uses a <strong>file-based routing</strong> system inspired by Next.js.
        Each file inside <code>src/pages/</code> automatically becomes a route.
      </p>

      <section>
        
      </section>

      <section>
        <h2 className="text-xl font-semibold mt-4 mb-2">Layouts:</h2>
        <p className="text-base">
          MareJS supports layouts using special files like <code>_MainLayout.jsx</code> and
          <code> layout.jsx</code>. Layouts help you reuse navigation, headers, or other UI
          components across pages — and you can nest layouts for different sections.
        </p>
      </section>
    </div>
  );
}
