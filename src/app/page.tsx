import Link from 'next/link';

export default function Home() {
  return (
    <main className="space-y-4">
      <h1 className="text-2xl font-semibold">Project Management MVP</h1>
      <Link href="/workspace" className="text-blue-600 underline">Go to Workspace</Link>
    </main>
  );
}
