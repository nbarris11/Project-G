"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  getRecommendedCourses,
  getCourseLevelColor,
  getSlopeDescription,
  type GolfCourse,
} from "@/lib/courses";

interface MemberResponse {
  id: string;
  memberName: string;
  homeLocation: string;
  budgetPerPerson: number;
  availableWeekends: string; // JSON string
  createdAt: string;
}

interface Trip {
  id: string;
  name: string;
  destination: string;
  numberOfGolfers: number;
  skillLevel: string;
  lodgingType: string;
  notes: string | null;
  joinCode: string;
  ownerId: string;
  status: string;
  responseDeadline: string;
  startDate: string | null;
  endDate: string | null;
  budgetPerPerson: number | null;
  memberResponses: MemberResponse[];
  itinerary: ItineraryItem[];
}

interface ItineraryItem {
  id: string;
  day: number;
  title: string;
  type: string;
  booked: boolean;
  cost: number | null;
}

type Tab = "responses" | "courses" | "overview";

function getWeekendOverlap(responses: MemberResponse[]): { weekend: string; count: number; names: string[] }[] {
  const tally: Record<string, string[]> = {};
  responses.forEach((r) => {
    const weekends: string[] = JSON.parse(r.availableWeekends || "[]");
    weekends.forEach((w) => {
      if (!tally[w]) tally[w] = [];
      tally[w].push(r.memberName);
    });
  });
  return Object.entries(tally)
    .map(([weekend, names]) => ({ weekend, count: names.length, names }))
    .sort((a, b) => b.count - a.count);
}

function formatWeekend(iso: string): string {
  const sat = new Date(iso + "T12:00:00");
  const sun = new Date(sat);
  sun.setDate(sun.getDate() + 1);
  return (
    sat.toLocaleDateString("en-US", { month: "short", day: "numeric" }) +
    " – " +
    sun.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  );
}

export default function TripPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tab, setTab] = useState<Tab>("responses");
  const [copied, setCopied] = useState(false);

  // Lock-in form
  const [lockForm, setLockForm] = useState({ startDate: "", endDate: "", budgetPerPerson: "" });
  const [locking, setLocking] = useState(false);
  const [lockError, setLockError] = useState("");

  const tripId = params.id as string;
  const isOwner = session?.user && trip ? (session.user as { id?: string }).id === trip.ownerId : false;

  useEffect(() => {
    if (status === "loading") return;
    const pw = typeof window !== "undefined" ? sessionStorage.getItem(`trip_${tripId}_pw`) ?? "" : "";
    const url = session?.user
      ? `/api/trips/${tripId}`
      : `/api/trips/${tripId}?joinPassword=${encodeURIComponent(pw)}`;

    fetch(url)
      .then((r) => {
        if (r.status === 401 || r.status === 403) { router.push(`/join`); return null; }
        return r.json();
      })
      .then((data) => { if (data) setTrip(data); setLoading(false); })
      .catch(() => { setError("Failed to load trip."); setLoading(false); });
  }, [tripId, session, status, router]);

  const handleLockIn = async () => {
    setLockError("");
    if (!lockForm.startDate || !lockForm.endDate || !lockForm.budgetPerPerson) {
      setLockError("Please fill in all fields."); return;
    }
    setLocking(true);
    try {
      const res = await fetch(`/api/trips/${tripId}/lock`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lockForm),
      });
      const data = await res.json();
      if (!res.ok) { setLockError(data.error || "Failed to lock in."); return; }
      setTrip((t) => t ? { ...t, ...data } : t);
      setTab("courses");
    } catch {
      setLockError("Something went wrong.");
    } finally {
      setLocking(false);
    }
  };

  const copyShareInfo = () => {
    const text = `Join our golf trip: "${trip?.name}"\nTrip Code: ${trip?.joinCode}\nJoin at: ${window.location.origin}/join`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (status === "loading" || loading) {
    return <div className="min-h-screen gradient-green flex items-center justify-center"><div className="text-white text-lg">Loading trip...</div></div>;
  }

  if (error || !trip) {
    return (
      <div className="min-h-screen gradient-green flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl p-8 text-center max-w-md">
          <div className="text-5xl mb-4">⛳</div>
          <p className="text-gray-500 mb-4">{error || "Trip not found."}</p>
          <Link href="/dashboard" className="bg-green-700 text-white px-6 py-2.5 rounded-lg text-sm font-semibold">Go to Dashboard</Link>
        </div>
      </div>
    );
  }

  const responses = trip.memberResponses ?? [];
  const overlapData = getWeekendOverlap(responses);
  const avgBudget = responses.length ? responses.reduce((s, r) => s + r.budgetPerPerson, 0) / responses.length : null;
  const minBudget = responses.length ? Math.min(...responses.map((r) => r.budgetPerPerson)) : null;
  const deadline = new Date(trip.responseDeadline);
  const deadlinePassed = new Date() > deadline;
  const locked = trip.status === "locked";

  const memberLocations = responses.map((r) => r.homeLocation).filter(Boolean);

  const recommendations = locked && trip.budgetPerPerson
    ? getRecommendedCourses({
        destination: trip.destination,
        skillLevel: trip.skillLevel as "beginner" | "intermediate" | "advanced" | "mixed",
        budgetPerPerson: trip.budgetPerPerson,
        numberOfGolfers: trip.numberOfGolfers,
        lodgingType: trip.lodgingType,
        memberLocations,
      })
    : [];

  const tabs: { key: Tab; label: string }[] = [
    { key: "responses", label: "👥 Responses" },
    { key: "courses", label: "⛳ Courses" },
    { key: "overview", label: "📋 Overview" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="gradient-green text-white">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <Link href="/dashboard" className="text-green-300 text-sm hover:text-white mb-4 inline-block">← Dashboard</Link>
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-3xl font-extrabold">{trip.name}</h1>
                {locked ? (
                  <span className="bg-green-400 text-green-900 text-xs font-bold px-2.5 py-1 rounded-full">✓ Locked In</span>
                ) : (
                  <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-2.5 py-1 rounded-full">Collecting Responses</span>
                )}
              </div>
              <p className="text-green-200 text-lg">📍 {trip.destination}</p>
              <p className="text-green-300 text-sm mt-1">
                {responses.length} of {trip.numberOfGolfers} responded ·{" "}
                {deadlinePassed ? "Deadline passed" : `Deadline: ${deadline.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`}
              </p>
            </div>
            <div className="bg-green-800 rounded-xl px-5 py-4 text-center">
              <p className="text-green-300 text-xs font-semibold uppercase tracking-wider mb-1">Trip Code</p>
              <p className="text-white text-2xl font-mono font-bold tracking-widest">{trip.joinCode}</p>
              <button onClick={copyShareInfo} className="mt-2 text-green-300 text-xs hover:text-white">
                {copied ? "✓ Copied!" : "Copy share info"}
              </button>
            </div>
          </div>
        </div>
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex gap-1">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`px-5 py-3 text-sm font-semibold rounded-t-lg transition-all ${
                  tab === t.key ? "bg-gray-50 text-green-800" : "text-green-200 hover:text-white"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">

        {/* RESPONSES TAB */}
        {tab === "responses" && (
          <div className="space-y-6">
            {/* Stats row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-2xl border border-gray-200 p-5 text-center">
                <p className="text-3xl font-bold text-gray-900">{responses.length}<span className="text-gray-400 text-xl">/{trip.numberOfGolfers}</span></p>
                <p className="text-gray-500 text-sm mt-1">Responded</p>
              </div>
              <div className="bg-white rounded-2xl border border-gray-200 p-5 text-center">
                <p className="text-3xl font-bold text-gray-900">{minBudget ? `$${minBudget.toLocaleString()}` : "—"}</p>
                <p className="text-gray-500 text-sm mt-1">Lowest budget</p>
              </div>
              <div className="bg-white rounded-2xl border border-gray-200 p-5 text-center">
                <p className="text-3xl font-bold text-gray-900">{avgBudget ? `$${Math.round(avgBudget).toLocaleString()}` : "—"}</p>
                <p className="text-gray-500 text-sm mt-1">Average budget</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Weekend overlap */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h2 className="font-bold text-gray-900 text-lg mb-4">Weekend Availability</h2>
                {overlapData.length === 0 ? (
                  <p className="text-gray-400 text-sm">No responses yet.</p>
                ) : (
                  <div className="space-y-2">
                    {overlapData.map(({ weekend, count, names }) => (
                      <div key={weekend} className="flex items-center gap-3">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm text-gray-700 font-medium">{formatWeekend(weekend)}</span>
                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                              count === responses.length ? "bg-green-100 text-green-700" :
                              count >= responses.length * 0.75 ? "bg-yellow-100 text-yellow-700" :
                              "bg-gray-100 text-gray-500"
                            }`}>
                              {count}/{responses.length}
                            </span>
                          </div>
                          <div className="w-full bg-gray-100 rounded-full h-1.5">
                            <div
                              className="bg-green-500 h-1.5 rounded-full"
                              style={{ width: `${responses.length ? (count / responses.length) * 100 : 0}%` }}
                            />
                          </div>
                          <p className="text-xs text-gray-400 mt-0.5">{names.join(", ")}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Who responded */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h2 className="font-bold text-gray-900 text-lg mb-4">Who&apos;s Responded</h2>
                {responses.length === 0 ? (
                  <div className="text-center py-6">
                    <p className="text-gray-400 text-sm">Nobody yet — share the trip code!</p>
                    <button onClick={copyShareInfo} className="mt-3 bg-green-700 text-white text-sm px-4 py-2 rounded-lg hover:bg-green-800">
                      {copied ? "✓ Copied!" : "Copy share info"}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {responses.map((r) => (
                      <div key={r.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-sm font-bold">
                            {r.memberName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 text-sm">{r.memberName}</p>
                            <p className="text-xs text-gray-400">
                              📍 {r.homeLocation} · {JSON.parse(r.availableWeekends || "[]").length} weekends available
                            </p>
                          </div>
                        </div>
                        <span className="text-sm font-semibold text-green-700">${r.budgetPerPerson.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Lock-in section — organizer only */}
            {isOwner && !locked && (
              <div className="bg-white rounded-2xl border-2 border-green-200 p-6">
                <h2 className="font-bold text-gray-900 text-lg mb-1">Lock In the Trip</h2>
                <p className="text-gray-500 text-sm mb-5">
                  Pick the final weekend based on the availability above, and set the budget. This will unlock course recommendations.
                </p>
                {lockError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 mb-4 text-sm">{lockError}</div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                    <input
                      type="date"
                      value={lockForm.startDate}
                      onChange={(e) => setLockForm({ ...lockForm, startDate: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                    <input
                      type="date"
                      value={lockForm.endDate}
                      onChange={(e) => setLockForm({ ...lockForm, endDate: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Budget Per Person ($)</label>
                    <input
                      type="number"
                      value={lockForm.budgetPerPerson}
                      onChange={(e) => setLockForm({ ...lockForm, budgetPerPerson: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder={minBudget ? `Suggested: $${minBudget}` : "e.g. 1500"}
                    />
                    {minBudget && <p className="text-xs text-gray-400 mt-1">Lowest budget in group: ${minBudget.toLocaleString()}</p>}
                  </div>
                </div>
                <button
                  onClick={handleLockIn}
                  disabled={locking}
                  className="bg-green-700 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-green-800 disabled:opacity-50 text-sm"
                >
                  {locking ? "Locking in..." : "Lock In & Get Course Recommendations →"}
                </button>
              </div>
            )}

            {locked && (
              <div className="bg-green-50 border border-green-200 rounded-2xl p-6 flex items-center justify-between flex-wrap gap-4">
                <div>
                  <p className="font-bold text-green-800 text-lg">Trip is locked in! ✓</p>
                  <p className="text-green-700 text-sm mt-0.5">
                    {trip.startDate && trip.endDate
                      ? `${new Date(trip.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })} – ${new Date(trip.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`
                      : ""}{" "}
                    · ${trip.budgetPerPerson?.toLocaleString()}/person
                  </p>
                </div>
                <button
                  onClick={() => setTab("courses")}
                  className="bg-green-700 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-green-800 text-sm"
                >
                  View Course Recommendations →
                </button>
              </div>
            )}
          </div>
        )}

        {/* COURSES TAB */}
        {tab === "courses" && (
          <div>
            {!locked ? (
              <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
                <div className="text-5xl mb-4">🔒</div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Course recommendations unlock after lock-in</h2>
                <p className="text-gray-500 text-sm mb-4">
                  Once the organizer locks in the dates and budget, we&apos;ll recommend the best courses for your trip.
                </p>
                {isOwner && (
                  <button onClick={() => setTab("responses")} className="bg-green-700 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-green-800 text-sm">
                    Go to Responses & Lock In →
                  </button>
                )}
              </div>
            ) : (
              <div>
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Recommended Courses</h2>
                  <p className="text-gray-500 text-sm mt-1">
                    Based on {trip.destination}, {trip.skillLevel} skill level, and ${trip.budgetPerPerson?.toLocaleString()}/person budget.
                  </p>
                </div>
                {recommendations.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
                    <p className="text-gray-500">No courses found for this destination yet.</p>
                  </div>
                ) : (
                  <div className="space-y-5">
                    {recommendations.map(({ course, matchReasons }, idx) => (
                      <CourseCard key={course.id} course={course} matchReasons={matchReasons} rank={idx + 1} />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* OVERVIEW TAB */}
        {tab === "overview" && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="font-bold text-gray-900 text-lg mb-5">Trip Summary</h2>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Destination", value: trip.destination },
                { label: "Golfers", value: `${trip.numberOfGolfers} people` },
                { label: "Skill Level", value: trip.skillLevel },
                { label: "Lodging", value: trip.lodgingType },
                { label: "Response Deadline", value: deadline.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) },
                { label: "Status", value: locked ? "Locked In" : "Collecting Responses" },
                ...(locked && trip.startDate && trip.endDate ? [
                  { label: "Dates", value: `${new Date(trip.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })} – ${new Date(trip.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}` },
                  { label: "Budget / Person", value: `$${trip.budgetPerPerson?.toLocaleString()}` },
                ] : []),
              ].map((item) => (
                <div key={item.label}>
                  <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">{item.label}</p>
                  <p className="text-gray-900 font-semibold mt-0.5 capitalize">{item.value}</p>
                </div>
              ))}
            </div>
            {trip.notes && (
              <div className="mt-5 pt-5 border-t border-gray-100">
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">Notes</p>
                <p className="text-gray-600 text-sm leading-relaxed">{trip.notes}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function CourseCard({ course, matchReasons, rank }: { course: GolfCourse; matchReasons: string[]; rank: number }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4 flex-1">
            <div className="bg-green-100 text-green-800 text-lg font-bold w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0">{rank}</div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h3 className="font-bold text-gray-900 text-lg">{course.name}</h3>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${getCourseLevelColor(course.courseLevel)}`}>{course.courseLevel}</span>
                {course.playAndStayAvailable && <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-purple-100 text-purple-800">Play & Stay</span>}
              </div>
              <p className="text-gray-500 text-sm">📍 {course.location}, {course.country}</p>
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-2xl font-bold text-gray-900">${course.avgGreenFee}</p>
            <p className="text-xs text-gray-400">avg green fee</p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-3">
          {[
            { label: "Course Rating", value: course.courseRating },
            { label: "Slope Rating", value: `${course.slopeRating}`, sub: getSlopeDescription(course.slopeRating) },
            { label: "Par", value: course.par },
          ].map((s) => (
            <div key={s.label} className="bg-gray-50 rounded-xl p-3 text-center">
              <p className="text-xs text-gray-400 uppercase tracking-wider">{s.label}</p>
              <p className="text-xl font-bold text-gray-900 mt-0.5">{s.value}</p>
              {"sub" in s && s.sub && <p className="text-xs text-gray-400 mt-0.5">{s.sub}</p>}
            </div>
          ))}
        </div>
        {matchReasons.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {matchReasons.map((r) => (
              <span key={r} className="text-xs bg-green-50 text-green-700 border border-green-200 px-3 py-1 rounded-full">✓ {r}</span>
            ))}
          </div>
        )}
        <button onClick={() => setExpanded(!expanded)} className="mt-4 text-sm text-green-700 font-medium hover:underline">
          {expanded ? "Show less" : "Show more →"}
        </button>
      </div>
      {expanded && (
        <div className="border-t border-gray-100 px-6 py-5 bg-gray-50">
          <p className="text-gray-600 text-sm leading-relaxed mb-4">{course.description}</p>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Highlights</p>
              <ul className="space-y-1">{course.highlights.map((h) => <li key={h} className="text-sm text-gray-600 flex gap-2"><span className="text-green-500">•</span>{h}</li>)}</ul>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Best For</p>
              <div className="flex flex-wrap gap-2">{course.bestFor.map((t) => <span key={t} className="text-xs bg-white border border-gray-200 text-gray-600 px-2.5 py-1 rounded-full capitalize">{t}</span>)}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
