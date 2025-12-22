// app/page.tsx
export default function Home() {
  return (
    <main className="flex flex-col items-center mt-10">
      <h1 className="text-2xl font-bold">Welcome to FoodONtracks 🚀</h1>
      <p className="text-gray-600 mt-2">Your batch traceability system</p>
      <div className="mt-6 flex gap-4">
        <a href="/login" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Login
        </a>
        <a href="/dashboard" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          Dashboard
        </a>
      </div>
    </main>
  );
}
