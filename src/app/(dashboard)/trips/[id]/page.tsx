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

interface Trip {
  id: string;
  name: string;
  destination: string;
  startDate: string;
  endDate: string;
  numberOfGolfers: number;
  budgetPerPerson: number;
  skillLevel: string;
  lodgingType: string;
  notes: string | null;
  joinCode: string;
  ownerId: string;
  itinerary: ItineraryItem[];
}

interface ItineraryItem {
  id: string;
  day: number;
  title: string;
  description: string | null;
  type: string;
  booked: boolean;
  cost: number | null;
  link: string | null;
}

type Tab = "overview" | "courses" | "itinerary";

export default function TripPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tab, setTab] = useState<Tab>("overview");
  const [copied, setCopied] = useState(false);

  const tripId = params.id as string;

  useEffect(() => {
    if (status === "loading") return;

    const fetchTrip = async () => {
      try {
        const userId = session?.user
          ? (session.user as { id?: string }).id
          : undefined;

        let url = `/api/trips/${tripId}`;

        // If not the owner, use the stored join password
        const storedPw = sessionStorage.getItem(`trip_${tripId}_pw`);
        if (!userId && storedPw) {
          url += `?joinPassword=${encodeURIComponent(storedPw)}`;
        } else if (storedPw && session?.user) {
          // Owner is logged in, no need for password
        }

        const res = await fetch(url);
        if (res.status === 401 || res.status === 403) {
          router.push(`/join?redirect=${tripId}`);
          return;
        }
        if (!res.ok) {
          setError("Trip not found.");
          return;
        }
        const data = await res.json();
        setTrip(data);
      } catch {
        setError("Failed to load trip.");
      } finally {
        setLoading(false);
      }
    };

    fetchTrip();
  }, [tripId, session, status, router]);

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen gradient-green flex items-center justify-center">
        <div className="text-white text-lg">Loading trip...</div>
      </div>
    );
  }

  if (error || !trip) {
    return (
      <div className="min-h-screen gradient-green flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl p-8 text-center max-w-md w-full">
          <div className="text-5xl mb-4">⛳</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Trip not found</h2>
          <p className="text-gray-500 mb-6">{error || "This trip doesn't exist."}</p>
          <Link
            href="/dashboard"
            className="bg-green-700 text-white px-6 py-2.5 rounded-lg text-sm font-semibold"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const recommendations = getRecommendedCourses({
    destination: trip.destination,
    skillLevel: trip.skillLevel as "beginner" | "intermediate" | "advanced" | "mixed",
    budgetPerPerson: trip.budgetPerPerson,
    numberOfGolfers: trip.numberOfGolfers,
    lodgingType: trip.lodgingType,
  });

  const startDate = new Date(trip.startDate);
  const endDate = new Date(trip.endDate);
  const nights = Math.round(
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  const formatDate = (d: Date) =>
    d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  const copyShareInfo = () => {
    const text = `Join our golf trip: "${trip.name}"\nTrip Code: ${trip.joinCode}\nLink: ${window.location.origin}/join`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const skillLabels: Record<string, string> = {
    beginner: "Beginner (28+ HCP)",
    intermediate: "Intermediate (15–27 HCP)",
    advanced: "Advanced (0–14 HCP)",
    mixed: "Mixed Skill Levels",
  };

  const lodgingLabels: Record<string, string> = {
    "play-and-stay": "Play & Stay Resort",
    hotel: "Hotel",
    airbnb: "Airbnb / VRBO",
    flexible: "Flexible",
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="gradient-green text-white">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <Link
            href="/dashboard"
            className="text-green-300 text-sm hover:text-white mb-4 inline-block"
          >
            ← Dashboard
          </Link>
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-extrabold">{trip.name}</h1>
              <p className="text-green-200 mt-1 text-lg">
                📍 {trip.destination}
              </p>
              <p className="text-green-300 text-sm mt-1">
                {formatDate(startDate)} – {formatDate(endDate)} · {nights} nights ·{" "}
                {trip.numberOfGolfers} golfers
              </p>
            </div>
            <div className="bg-green-800 rounded-xl px-5 py-4 text-center">
              <p className="text-green-300 text-xs font-semibold uppercase tracking-wider mb-1">
                Trip Code
              </p>
              <p className="text-white text-2xl font-mono font-bold tracking-widest">
                {trip.joinCode}
              </p>
              <button
                onClick={copyShareInfo}
                className="mt-2 text-green-300 text-xs hover:text-white"
              >
                {copied ? "✓ Copied!" : "Copy share info"}
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex gap-1">
            {(["overview", "courses", "itinerary"] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-5 py-3 text-sm font-semibold capitalize rounded-t-lg transition-all ${
                  tab === t
                    ? "bg-gray-50 text-green-800"
                    : "text-green-200 hover:text-white"
                }`}
              >
                {t === "courses" ? "⛳ Recommended Courses" : t === "itinerary" ? "📅 Itinerary" : "📋 Overview"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* OVERVIEW TAB */}
        {tab === "overview" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              {/* Trip Stats */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h2 className="font-bold text-gray-900 text-lg mb-5">Trip Summary</h2>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "Destination", value: trip.destination },
                    { label: "Dates", value: `${formatDate(startDate)} – ${formatDate(endDate)}` },
                    { label: "Duration", value: `${nights} nights` },
                    { label: "Golfers", value: `${trip.numberOfGolfers} people` },
                    { label: "Skill Level", value: skillLabels[trip.skillLevel] || trip.skillLevel },
                    { label: "Budget Per Person", value: `$${trip.budgetPerPerson.toLocaleString()}` },
                    { label: "Lodging", value: lodgingLabels[trip.lodgingType] || trip.lodgingType },
                  ].map((item) => (
                    <div key={item.label}>
                      <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">
                        {item.label}
                      </p>
                      <p className="text-gray-900 font-semibold mt-0.5">{item.value}</p>
                    </div>
                  ))}
                </div>
                {trip.notes && (
                  <div className="mt-5 pt-5 border-t border-gray-100">
                    <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">
                      Notes
                    </p>
                    <p className="text-gray-600 text-sm leading-relaxed">{trip.notes}</p>
                  </div>
                )}
              </div>

              {/* Quick action */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h2 className="font-bold text-gray-900 text-lg mb-4">
                  Course Recommendations
                </h2>
                <p className="text-gray-500 text-sm mb-4">
                  We found {recommendations.length} courses that match your group&apos;s
                  destination, skill level, and budget.
                </p>
                <button
                  onClick={() => setTab("courses")}
                  className="bg-green-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-green-800"
                >
                  View Recommended Courses →
                </button>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-5">
              {/* Share card */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h3 className="font-bold text-gray-900 mb-3">Share with Group</h3>
                <p className="text-gray-500 text-sm mb-4">
                  Give your group the trip code and the password you set.
                </p>
                <div className="bg-gray-50 rounded-xl p-4 text-center mb-4">
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">
                    Trip Code
                  </p>
                  <p className="text-3xl font-mono font-bold text-green-800 tracking-widest">
                    {trip.joinCode}
                  </p>
                </div>
                <button
                  onClick={copyShareInfo}
                  className="w-full border border-green-600 text-green-700 py-2.5 rounded-lg text-sm font-semibold hover:bg-green-50"
                >
                  {copied ? "✓ Copied!" : "Copy share info"}
                </button>
              </div>

              {/* Budget breakdown */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h3 className="font-bold text-gray-900 mb-3">Budget</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Per person</span>
                    <span className="font-semibold">${trip.budgetPerPerson.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Total group</span>
                    <span className="font-semibold">
                      ${(trip.budgetPerPerson * trip.numberOfGolfers).toLocaleString()}
                    </span>
                  </div>
                  <div className="border-t border-gray-100 pt-2 mt-2">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Est. golf budget</span>
                      <span className="font-semibold text-green-700">
                        ~${Math.round(trip.budgetPerPerson * 0.3).toLocaleString()}/round
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* COURSES TAB */}
        {tab === "courses" && (
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                Recommended Courses for Your Trip
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                Based on destination ({trip.destination}), skill level ({skillLabels[trip.skillLevel]}),
                and budget (~${Math.round(trip.budgetPerPerson * 0.3)}/round for golf).
              </p>
            </div>

            {recommendations.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
                <div className="text-5xl mb-4">🏌️</div>
                <p className="text-gray-500">
                  No courses found for this destination yet. We&apos;re always adding more!
                </p>
              </div>
            ) : (
              <div className="space-y-5">
                {recommendations.map(({ course, matchReasons }, idx) => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    matchReasons={matchReasons}
                    rank={idx + 1}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ITINERARY TAB */}
        {tab === "itinerary" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Trip Itinerary</h2>
                <p className="text-gray-500 text-sm mt-1">
                  Track bookings and build out your day-by-day plan.
                </p>
              </div>
            </div>

            {trip.itinerary.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
                <div className="text-5xl mb-4">📅</div>
                <p className="text-gray-900 font-semibold mb-2">
                  No itinerary items yet
                </p>
                <p className="text-gray-500 text-sm">
                  Itinerary building with booking tracking is coming soon!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {trip.itinerary.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-xl border border-gray-200 p-5 flex items-start gap-4"
                  >
                    <div className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded-lg whitespace-nowrap">
                      Day {item.day}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-gray-900">{item.title}</p>
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full capitalize">
                          {item.type}
                        </span>
                        {item.booked && (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                            ✓ Booked
                          </span>
                        )}
                      </div>
                      {item.description && (
                        <p className="text-gray-500 text-sm mt-1">{item.description}</p>
                      )}
                    </div>
                    {item.cost && (
                      <p className="text-gray-900 font-semibold text-sm whitespace-nowrap">
                        ${item.cost}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function CourseCard({
  course,
  matchReasons,
  rank,
}: {
  course: GolfCourse;
  matchReasons: string[];
  rank: number;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4 flex-1">
            <div className="bg-green-100 text-green-800 text-lg font-bold w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0">
              {rank}
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h3 className="font-bold text-gray-900 text-lg">{course.name}</h3>
                <span
                  className={`text-xs font-semibold px-2.5 py-1 rounded-full ${getCourseLevelColor(
                    course.courseLevel
                  )}`}
                >
                  {course.courseLevel}
                </span>
                {course.playAndStayAvailable && (
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-purple-100 text-purple-800">
                    Play & Stay
                  </span>
                )}
              </div>
              <p className="text-gray-500 text-sm">
                📍 {course.location}, {course.country}
              </p>
            </div>
          </div>

          <div className="text-right flex-shrink-0">
            <p className="text-2xl font-bold text-gray-900">
              ${course.avgGreenFee}
            </p>
            <p className="text-xs text-gray-400">avg green fee</p>
          </div>
        </div>

        {/* Difficulty Stats */}
        <div className="mt-4 grid grid-cols-3 gap-3">
          <div className="bg-gray-50 rounded-xl p-3 text-center">
            <p className="text-xs text-gray-400 uppercase tracking-wider">
              Course Rating
            </p>
            <p className="text-xl font-bold text-gray-900 mt-0.5">
              {course.courseRating}
            </p>
          </div>
          <div className="bg-gray-50 rounded-xl p-3 text-center">
            <p className="text-xs text-gray-400 uppercase tracking-wider">
              Slope Rating
            </p>
            <p className="text-xl font-bold text-gray-900 mt-0.5">
              {course.slopeRating}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">
              {getSlopeDescription(course.slopeRating)}
            </p>
          </div>
          <div className="bg-gray-50 rounded-xl p-3 text-center">
            <p className="text-xs text-gray-400 uppercase tracking-wider">Par</p>
            <p className="text-xl font-bold text-gray-900 mt-0.5">{course.par}</p>
          </div>
        </div>

        {/* Match reasons */}
        {matchReasons.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {matchReasons.map((reason) => (
              <span
                key={reason}
                className="text-xs bg-green-50 text-green-700 border border-green-200 px-3 py-1 rounded-full"
              >
                ✓ {reason}
              </span>
            ))}
          </div>
        )}

        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-4 text-sm text-green-700 font-medium hover:underline"
        >
          {expanded ? "Show less" : "Show more →"}
        </button>
      </div>

      {expanded && (
        <div className="border-t border-gray-100 px-6 py-5 bg-gray-50">
          <p className="text-gray-600 text-sm leading-relaxed mb-4">
            {course.description}
          </p>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Highlights
              </p>
              <ul className="space-y-1">
                {course.highlights.map((h) => (
                  <li key={h} className="text-sm text-gray-600 flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">•</span> {h}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Best For
              </p>
              <div className="flex flex-wrap gap-2">
                {course.bestFor.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs bg-white border border-gray-200 text-gray-600 px-2.5 py-1 rounded-full capitalize"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
