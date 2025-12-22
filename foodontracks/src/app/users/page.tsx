import Link from 'next/link';

export default function UsersList() {
  const users = [
    { id: 1, name: 'User 1', email: 'user1@example.com', role: 'Admin' },
    { id: 2, name: 'User 2', email: 'user2@example.com', role: 'User' },
    { id: 3, name: 'User 3', email: 'user3@example.com', role: 'User' },
    { id: 4, name: 'User 4', email: 'user4@example.com', role: 'Moderator' },
  ];

  return (
    <main className="flex flex-col items-center mt-10">
      <h1 className="text-2xl font-bold mb-6">All Users</h1>

      <div className="bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden max-w-2xl w-full">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">ID</th>
              <th className="px-4 py-3 text-left font-semibold">Name</th>
              <th className="px-4 py-3 text-left font-semibold">Email</th>
              <th className="px-4 py-3 text-left font-semibold">Role</th>
              <th className="px-4 py-3 text-left font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3">{user.id}</td>
                <td className="px-4 py-3">{user.name}</td>
                <td className="px-4 py-3">{user.email}</td>
                <td className="px-4 py-3">
                  <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded text-sm">
                    {user.role}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <Link href={`/users/${user.id}`} className="text-blue-600 hover:underline font-semibold">
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Link href="/dashboard" className="mt-6 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700">
        Back to Dashboard
      </Link>
    </main>
  );
}
