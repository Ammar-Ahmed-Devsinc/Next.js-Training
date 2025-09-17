// app/page.tsx
"use client";

import { useQuery } from "@apollo/client/react";
import { GET_COUNTRIES } from "@/app/graphql/queries";
import { useState } from "react";

export default function Home() {
  const { data, loading, error } = useQuery(GET_COUNTRIES);
  const [search, setSearch] = useState("");

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error fetching countries</p>;

  const filtered = data.countries.filter((c: any) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">🌍 Country Search (Apollo)</h1>

      <input
        type="text"
        placeholder="Search countries..."
        className="border px-3 py-2 mb-4 w-full rounded"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <ul className="space-y-2">
        {filtered.map((c: any) => (
          <li key={c.code} className="p-3 border rounded flex justify-between">
            <span>
              {c.emoji} {c.name} — {c.capital}
            </span>
          </li>
        ))}
      </ul>
    </main>
  );
}
