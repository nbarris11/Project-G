"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/Logo";

interface Trip {
  id: string;
  name: string;
  destination: string;
  startDate: string;
  endDate: string;
  numberOfGolfers: number;
  budgetPerPerson: number;
  skillLevel: string;
  joinCode: string;
  createdAt: string;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }
    if (status === "authenticated") {
      fetch("/api/trips")
        .then((r) => r.json())
        .then((data) => {
          setTrips(Array.isArray(data) ? data : []);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [status, router]);

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-400 text-sm">Loading...</div>
      </div>
    );
  }

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const skillBadge: Record<string, string> = {
    beginner: "🌱 Beginner",
    intermediate: "⛳ Intermediate",
    advanced: "🏆 Advanced",
    mixed: "👥 Mixed",
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Nav */}
      <nav className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <Logo size={26} />
        <div className="flex items-center gap-4">
          <p className="text-sm text-gray-500">
            Hi, {session?.user?.name?.split(" ")[0]}
          </p>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="text-sm text-gray-400 hover:text-gray-700"
          >
            Log out
          </button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">Your Trips</h1>
            <p className="text-gray-500 mt-1">
              Plan, coordinate, and manage all your golf outings.
            </p>
          </div>
          <Link
            href="/trips/new"
            className="text-white px-5 py-3 rounded-xl font-semibold hover:opacity-90 text-sm"
            style={{ backgroundColor: "#1C5C3A" }}
          >
            + New Trip
          </Link>
        </div>

        {trips.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
            <div className="flex justify-center mb-5">
              <Logo size={48} showText={false} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Plan your first golf outing
            </h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              Tell us your destination, group size, and budget — and
              we&apos;ll help coordinate your group and recommend the best courses.
            </p>
            <Link
              href="/trips/new"
              className="text-white px-8 py-3 rounded-xl font-semibold hover:opacity-90 inline-block"
              style={{ backgroundColor: "#1C5C3A" }}
            >
              Plan a Golf Trip →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {trips.map((trip) => {
              const nights = Math.round(
                (new Date(trip.endDate).getTime() -
                  new Date(trip.startDate).getTime()) /
                  (1000 * 60 * 60 * 24)
              );
              return (
                <Link
                  key={trip.id}
                  href={`/trips/${trip.id}`}
                  className="bg-white rounded-2xl border border-gray-100 p-6 hover:border-green-200 hover:shadow-sm transition-all block group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-bold text-gray-900 text-lg group-hover:text-green-800">
                      {trip.name}
                    </h3>
                    <span className="text-xs bg-gray-50 text-gray-500 px-2 py-1 rounded-full font-mono border border-gray-100">
                      {trip.joinCode}
                    </span>
                  </div>
                  <p className="text-gray-500 text-sm mb-4">
                    📍 {trip.destination}
                  </p>
                  <div className="grid grid-cols-3 gap-3 text-sm">
                    <div>
                      <p className="text-gray-400 text-xs">Dates</p>
                      <p className="font-medium text-gray-700 text-xs mt-0.5">
                        {formatDate(trip.startDate)}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs">Duration</p>
                      <p className="font-medium text-gray-700 text-xs mt-0.5">
                        {nights} nights
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs">Golfers</p>
                      <p className="font-medium text-gray-700 text-xs mt-0.5">
                        {trip.numberOfGolfers} people
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-50">
                    <span className="text-xs text-gray-500">
                      {skillBadge[trip.skillLevel] || trip.skillLevel}
                    </span>
                    <span className="text-xs font-semibold" style={{ color: "#1C5C3A" }}>
                      ${trip.budgetPerPerson.toLocaleString()}/person
                    </span>
                  </div>
                </Link>
              );
            })}

            {/* Add new trip card */}
            <Link
              href="/trips/new"
              className="bg-white rounded-2xl border-2 border-dashed border-gray-100 p-6 hover:border-green-200 hover:bg-green-50/30 transition-all flex flex-col items-center justify-center text-center min-h-48"
            >
              <div className="text-4xl mb-3">➕</div>
              <p className="font-semibold text-gray-600">Plan a new trip</p>
              <p className="text-gray-400 text-sm mt-1">Add another golf adventure</p>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
