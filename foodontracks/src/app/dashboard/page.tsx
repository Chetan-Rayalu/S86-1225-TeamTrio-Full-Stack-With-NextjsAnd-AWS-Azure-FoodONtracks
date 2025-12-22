export default function Dashboard() {
  return (
    <main className="flex flex-col items-center mt-10">
      <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded mb-6">
        ✓ You are logged in — only authenticated users can see this page.
      </div>
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="text-gray-600 mt-2">Welcome back! This is your protected area.</p>
      <div className="mt-6 flex gap-4">
        <a href="/users/1" className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
          View User 1
        </a>
        <a href="/users/2" className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
          View User 2
        </a>
      </div>
    </main>
  );
}
