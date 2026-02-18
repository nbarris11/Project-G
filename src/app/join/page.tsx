"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function JoinTripPage() {
  const router = useRouter();
  const [form, setForm] = useState({ joinCode: "", joinPassword: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/trips/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          joinCode: form.joinCode.trim().toUpperCase(),
          joinPassword: form.joinPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not join trip.");
        return;
      }

      // Store the password in sessionStorage so the trip page can use it
      sessionStorage.setItem(`trip_${data.tripId}_pw`, form.joinPassword);
      router.push(`/trips/${data.tripId}`);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-green flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">🔗</div>
          <h1 className="text-2xl font-bold text-gray-900">Join a Golf Trip</h1>
          <p className="text-gray-500 mt-1">
            Enter the trip code and password from your group organizer
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 mb-5 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Trip Code
            </label>
            <input
              type="text"
              required
              value={form.joinCode}
              onChange={(e) =>
                setForm({ ...form, joinCode: e.target.value.toUpperCase() })
              }
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm font-mono tracking-widest uppercase focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="e.g. ABC12345"
              maxLength={8}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Trip Password
            </label>
            <input
              type="password"
              required
              value={form.joinPassword}
              onChange={(e) => setForm({ ...form, joinPassword: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Shared trip password"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-700 text-white font-semibold py-3 rounded-lg hover:bg-green-800 disabled:opacity-50 mt-2"
          >
            {loading ? "Joining..." : "Join Trip →"}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-100 text-center">
          <p className="text-sm text-gray-500">
            Planning your own trip?{" "}
            <Link
              href="/register"
              className="text-green-700 font-medium hover:underline"
            >
              Create an account
            </Link>
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-green-700 font-medium hover:underline"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
