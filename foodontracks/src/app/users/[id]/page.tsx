import Link from 'next/link';

interface Props {
  params: { id: string };
}

export default async function UserProfile({ params }: Props) {
  const { id } = params;

  // Mock fetch user data
  const user = {
    id,
    name: `User ${id}`,
    email: `user${id}@example.com`,
    role: id === '1' ? 'Admin' : 'User',
    joinDate: '2025-01-15',
  };

  return (
    <main className="flex flex-col items-center mt-10">
      <div className="bg-white border border-gray-200 rounded-lg shadow-md p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6">User Profile</h2>

        <div className="space-y-4">
          <div className="border-b pb-4">
            <p className="text-gray-600 text-sm">ID</p>
            <p className="text-lg font-semibold">{user.id}</p>
          </div>

          <div className="border-b pb-4">
            <p className="text-gray-600 text-sm">Name</p>
            <p className="text-lg font-semibold">{user.name}</p>
          </div>

          <div className="border-b pb-4">
            <p className="text-gray-600 text-sm">Email</p>
            <p className="text-lg font-semibold">{user.email}</p>
          </div>

          <div className="border-b pb-4">
            <p className="text-gray-600 text-sm">Role</p>
            <p className="text-lg font-semibold text-blue-600">{user.role}</p>
          </div>

          <div className="pb-4">
            <p className="text-gray-600 text-sm">Join Date</p>
            <p className="text-lg font-semibold">{user.joinDate}</p>
          </div>
        </div>

        <div className="mt-6 flex gap-2">
          <Link href="/dashboard" className="flex-1 bg-gray-600 text-white py-2 rounded text-center hover:bg-gray-700">
            Back to Dashboard
          </Link>
          <Link href={`/users/${parseInt(id) + 1}`} className="flex-1 bg-blue-600 text-white py-2 rounded text-center hover:bg-blue-700">
            Next User
          </Link>
        </div>
      </div>

      {/* Breadcrumbs for SEO and navigation */}
      <nav aria-label="breadcrumb" className="mt-8 text-sm text-gray-600">
        <ol className="flex gap-2">
          <li>
            <Link href="/" className="text-blue-600 hover:underline">
              Home
            </Link>
          </li>
          <li>/</li>
          <li>
            <Link href="/dashboard" className="text-blue-600 hover:underline">
              Dashboard
            </Link>
          </li>
          <li>/</li>
          <li className="text-gray-900 font-semibold">User {id}</li>
        </ol>
      </nav>
    </main>
  );
}
