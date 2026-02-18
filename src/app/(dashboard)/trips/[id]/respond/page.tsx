"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

interface TripInfo {
  id: string;
  name: string;
  destination: string;
  responseDeadline: string;
  numberOfGolfers: number;
  notes: string | null;
}

function getWeekendsBetween(start: Date, end: Date): Date[] {
  const weekends: Date[] = [];
  const d = new Date(start);
  // Advance to next Saturday
  d.setDate(d.getDate() + ((6 - d.getDay() + 7) % 7));
  while (d <= end) {
    weekends.push(new Date(d));
    d.setDate(d.getDate() + 7);
  }
  return weekends;
}

function formatWeekend(sat: Date): string {
  const sun = new Date(sat);
  sun.setDate(sun.getDate() + 1);
  return sat.toLocaleDateString("en-US", { month: "short", day: "numeric" }) +
    " – " + sun.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function toISO(d: Date): string {
  return d.toISOString().split("T")[0];
}

export default function RespondPage() {
  const params = useParams();
  const router = useRouter();
  const tripId = params.id as string;

  const [trip, setTrip] = useState<TripInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const [memberName, setMemberName] = useState("");
  const [homeLocation, setHomeLocation] = useState("");
  const [budget, setBudget] = useState("");
  const [selectedWeekends, setSelectedWeekends] = useState<string[]>([]);

  const joinPassword =
    typeof window !== "undefined"
      ? sessionStorage.getItem(`trip_${tripId}_pw`) ?? ""
      : "";

  useEffect(() => {
    if (!tripId) return;
    const pw = sessionStorage.getItem(`trip_${tripId}_pw`);
    fetch(`/api/trips/${tripId}?joinPassword=${encodeURIComponent(pw ?? "")}`)
      .then((r) => r.json())
      .then((data) => { setTrip(data); setLoading(false); })
      .catch(() => { setError("Could not load trip."); setLoading(false); });
  }, [tripId]);

  const toggleWeekend = (iso: string) => {
    setSelectedWeekends((prev) =>
      prev.includes(iso) ? prev.filter((d) => d !== iso) : [...prev, iso]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!memberName.trim()) { setError("Please enter your name."); return; }
    if (!homeLocation.trim()) { setError("Please enter your home city."); return; }
    if (!budget || parseFloat(budget) <= 0) { setError("Please enter your budget."); return; }
    if (selectedWeekends.length === 0) { setError("Please select at least one available weekend."); return; }

    setSubmitting(true);
    try {
      const res = await fetch(`/api/trips/${tripId}/respond`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          memberName: memberName.trim(),
          homeLocation: homeLocation.trim(),
          budgetPerPerson: parseFloat(budget),
          availableWeekends: selectedWeekends,
          joinPassword,
        }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Failed to submit."); return; }
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen gradient-green flex items-center justify-center">
        <div className="text-white text-lg">Loading trip...</div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="min-h-screen gradient-green flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl p-8 text-center max-w-md w-full">
          <div className="text-5xl mb-4">⛳</div>
          <p className="text-gray-500">{error || "Trip not found."}</p>
          <Link href="/join" className="mt-4 inline-block text-green-700 font-medium hover:underline">Try again</Link>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen gradient-green flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-xl p-10 text-center max-w-md w-full">
          <div className="text-6xl mb-5">🎉</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">You&apos;re in!</h2>
          <p className="text-gray-500 mb-2">
            Your availability and budget have been submitted for <strong>{trip.name}</strong>.
          </p>
          <p className="text-gray-400 text-sm mb-6">
            The organizer will review everyone&apos;s responses and lock in the dates.
            Check back once the deadline passes!
          </p>
          <Link
            href={`/trips/${tripId}`}
            className="bg-green-700 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-800 inline-block"
          >
            View Trip Details →
          </Link>
        </div>
      </div>
    );
  }

  const deadline = new Date(trip.responseDeadline);
  const now = new Date();
  const weekends = getWeekendsBetween(now, deadline);

  // Group weekends by month
  const byMonth: Record<string, Date[]> = {};
  weekends.forEach((w) => {
    const key = w.toLocaleDateString("en-US", { month: "long", year: "numeric" });
    if (!byMonth[key]) byMonth[key] = [];
    byMonth[key].push(w);
  });

  return (
    <div className="min-h-screen gradient-green py-12 px-4">
      <div className="max-w-xl mx-auto">
        <div className="text-center text-white mb-8">
          <div className="text-4xl mb-2">⛳</div>
          <h1 className="text-2xl font-bold">{trip.name}</h1>
          <p className="text-green-200 mt-1">📍 {trip.destination}</p>
          <p className="text-green-300 text-sm mt-1">
            Respond by {deadline.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8 space-y-8">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
              {error}
            </div>
          )}

          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-1">Your Name</label>
            <input
              type="text"
              value={memberName}
              onChange={(e) => setMemberName(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="e.g. Mike Johnson"
            />
          </div>

          {/* Home Location */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-1">Your Home City</label>
            <p className="text-xs text-gray-400 mb-2">
              Used to suggest courses that are easy to reach for everyone in the group.
            </p>
            <input
              type="text"
              value={homeLocation}
              onChange={(e) => setHomeLocation(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="e.g. Chicago, IL"
            />
          </div>

          {/* Budget */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-1">
              Your Max Budget Per Person
            </label>
            <p className="text-xs text-gray-400 mb-2">
              Total trip cost you&apos;re comfortable with — golf, stay, and travel included.
            </p>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-gray-400 text-sm">$</span>
              <input
                type="number"
                min={0}
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full border border-gray-300 rounded-lg pl-7 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="e.g. 1500"
              />
            </div>
          </div>

          {/* Weekend picker */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-1">
              Available Weekends
            </label>
            <p className="text-xs text-gray-400 mb-4">
              Select every weekend you could make it. Pick as many as you like.
            </p>

            {weekends.length === 0 ? (
              <p className="text-gray-400 text-sm">No weekends available before the deadline.</p>
            ) : (
              <div className="space-y-5">
                {Object.entries(byMonth).map(([month, wkends]) => (
                  <div key={month}>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{month}</p>
                    <div className="space-y-2">
                      {wkends.map((sat) => {
                        const iso = toISO(sat);
                        const selected = selectedWeekends.includes(iso);
                        return (
                          <button
                            key={iso}
                            type="button"
                            onClick={() => toggleWeekend(iso)}
                            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 text-sm transition-all ${
                              selected
                                ? "border-green-600 bg-green-50 text-green-800 font-semibold"
                                : "border-gray-200 text-gray-600 hover:border-gray-300"
                            }`}
                          >
                            <span>{formatWeekend(sat)}</span>
                            <span className={`text-lg ${selected ? "text-green-600" : "text-gray-300"}`}>
                              {selected ? "✓" : "+"}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {selectedWeekends.length > 0 && (
              <p className="text-xs text-green-700 font-medium mt-3">
                ✓ {selectedWeekends.length} weekend{selectedWeekends.length !== 1 ? "s" : ""} selected
              </p>
            )}
          </div>

          {trip.notes && (
            <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-600">
              <p className="font-semibold text-gray-700 mb-1">Note from the organizer:</p>
              <p>{trip.notes}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-green-700 text-white font-semibold py-3 rounded-xl hover:bg-green-800 disabled:opacity-50 text-sm"
          >
            {submitting ? "Submitting..." : "Submit My Availability ⛳"}
          </button>
        </form>
      </div>
    </div>
  );
}
