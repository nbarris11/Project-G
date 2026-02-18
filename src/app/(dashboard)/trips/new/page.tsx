"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";

type Step = 1 | 2 | 3 | 4 | 5;

interface TripForm {
  name: string;
  destination: string;
  startDate: string;
  endDate: string;
  numberOfGolfers: string;
  skillLevel: string;
  budgetPerPerson: string;
  lodgingType: string;
  notes: string;
  joinPassword: string;
  joinPasswordConfirm: string;
}

const STEPS = [
  { num: 1, label: "Basics" },
  { num: 2, label: "Golfers" },
  { num: 3, label: "Budget & Stay" },
  { num: 4, label: "Notes" },
  { num: 5, label: "Group Access" },
];

export default function NewTripPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [step, setStep] = useState<Step>(1);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState<TripForm>({
    name: "",
    destination: "",
    startDate: "",
    endDate: "",
    numberOfGolfers: "",
    skillLevel: "",
    budgetPerPerson: "",
    lodgingType: "",
    notes: "",
    joinPassword: "",
    joinPasswordConfirm: "",
  });

  if (status === "loading") {
    return (
      <div className="min-h-screen gradient-green flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  if (!session) {
    router.push("/login");
    return null;
  }

  const update = (field: keyof TripForm, value: string) =>
    setForm((f) => ({ ...f, [field]: value }));

  const nextStep = () => {
    setError("");
    if (step === 1) {
      if (!form.name || !form.destination || !form.startDate || !form.endDate) {
        setError("Please fill in all fields.");
        return;
      }
      if (new Date(form.endDate) <= new Date(form.startDate)) {
        setError("End date must be after start date.");
        return;
      }
    }
    if (step === 2) {
      if (!form.numberOfGolfers || !form.skillLevel) {
        setError("Please fill in all fields.");
        return;
      }
    }
    if (step === 3) {
      if (!form.budgetPerPerson || !form.lodgingType) {
        setError("Please fill in all fields.");
        return;
      }
    }
    setStep((s) => (s + 1) as Step);
  };

  const handleSubmit = async () => {
    setError("");
    if (!form.joinPassword) {
      setError("Please set a group password.");
      return;
    }
    if (form.joinPassword !== form.joinPasswordConfirm) {
      setError("Passwords don't match.");
      return;
    }
    if (form.joinPassword.length < 4) {
      setError("Group password must be at least 4 characters.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/trips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          destination: form.destination,
          startDate: form.startDate,
          endDate: form.endDate,
          numberOfGolfers: parseInt(form.numberOfGolfers),
          budgetPerPerson: parseFloat(form.budgetPerPerson),
          skillLevel: form.skillLevel,
          lodgingType: form.lodgingType,
          notes: form.notes,
          joinPassword: form.joinPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to create trip.");
        return;
      }

      router.push(`/trips/${data.id}`);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-green flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center text-white mb-8">
          <Link href="/dashboard" className="text-green-200 text-sm hover:text-white">
            ← Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold mt-4">Plan Your Golf Trip</h1>
          <p className="text-green-200 mt-1">Step {step} of 5</p>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-8">
          {STEPS.map((s, i) => (
            <div key={s.num} className="flex-1 flex items-center gap-2">
              <div
                className={`flex-1 h-1 rounded-full ${
                  step > s.num
                    ? "bg-white"
                    : step === s.num
                    ? "bg-green-300"
                    : "bg-green-800"
                }`}
              />
              {i < STEPS.length - 1 && null}
            </div>
          ))}
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 mb-6 text-sm">
              {error}
            </div>
          )}

          {/* STEP 1: Trip basics */}
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-1">
                  Trip Details
                </h2>
                <p className="text-gray-500 text-sm">Name the trip and set your dates.</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Trip Name
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder='e.g. "Scottsdale Boys Trip 2025"'
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Destination
                </label>
                <input
                  type="text"
                  value={form.destination}
                  onChange={(e) => update("destination", e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="e.g. Scottsdale, AZ or St Andrews, Scotland"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={form.startDate}
                    onChange={(e) => update("startDate", e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={form.endDate}
                    onChange={(e) => update("endDate", e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Golfers & Skill */}
          {step === 2 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-1">
                  Your Group
                </h2>
                <p className="text-gray-500 text-sm">
                  Tell us about the golfers so we can match the right courses.
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Number of Golfers
                </label>
                <input
                  type="number"
                  min={1}
                  max={100}
                  value={form.numberOfGolfers}
                  onChange={(e) => update("numberOfGolfers", e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="e.g. 8"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Group Skill Level
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    {
                      value: "beginner",
                      label: "Beginner",
                      desc: "Handicap 28+",
                      icon: "🌱",
                    },
                    {
                      value: "intermediate",
                      label: "Intermediate",
                      desc: "Handicap 15–27",
                      icon: "⛳",
                    },
                    {
                      value: "advanced",
                      label: "Advanced",
                      desc: "Handicap 0–14",
                      icon: "🏆",
                    },
                    {
                      value: "mixed",
                      label: "Mixed Levels",
                      desc: "All abilities",
                      icon: "👥",
                    },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => update("skillLevel", opt.value)}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        form.skillLevel === opt.value
                          ? "border-green-600 bg-green-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="text-2xl mb-1">{opt.icon}</div>
                      <div className="font-semibold text-gray-900 text-sm">
                        {opt.label}
                      </div>
                      <div className="text-xs text-gray-500">{opt.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Budget & Lodging */}
          {step === 3 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-1">
                  Budget & Lodging
                </h2>
                <p className="text-gray-500 text-sm">
                  Set your budget and lodging preference to get the best course matches.
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Budget Per Person (USD)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-gray-400 text-sm">$</span>
                  <input
                    type="number"
                    min={0}
                    value={form.budgetPerPerson}
                    onChange={(e) => update("budgetPerPerson", e.target.value)}
                    className="w-full border border-gray-300 rounded-lg pl-7 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="e.g. 1500"
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  Total trip cost per person including golf, lodging, and travel.
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lodging Preference
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    {
                      value: "play-and-stay",
                      label: "Play & Stay",
                      desc: "Resort with on-site golf",
                      icon: "🏨",
                    },
                    {
                      value: "hotel",
                      label: "Hotel",
                      desc: "Separate from the course",
                      icon: "🛎️",
                    },
                    {
                      value: "airbnb",
                      label: "Airbnb / VRBO",
                      desc: "Rental house or condo",
                      icon: "🏠",
                    },
                    {
                      value: "flexible",
                      label: "Flexible",
                      desc: "Open to any option",
                      icon: "🤷",
                    },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => update("lodgingType", opt.value)}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        form.lodgingType === opt.value
                          ? "border-green-600 bg-green-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="text-2xl mb-1">{opt.icon}</div>
                      <div className="font-semibold text-gray-900 text-sm">
                        {opt.label}
                      </div>
                      <div className="text-xs text-gray-500">{opt.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Notes */}
          {step === 4 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-1">
                  Anything else?
                </h2>
                <p className="text-gray-500 text-sm">
                  Add any notes, requests, or context for the group.
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes (optional)
                </label>
                <textarea
                  rows={5}
                  value={form.notes}
                  onChange={(e) => update("notes", e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                  placeholder="e.g. Looking for a bucket-list course, prefer early tee times, celebrating a birthday..."
                />
              </div>
            </div>
          )}

          {/* STEP 5: Group Password */}
          {step === 5 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-1">
                  Set Group Password
                </h2>
                <p className="text-gray-500 text-sm">
                  Your group will use this password to access the trip plan. Share
                  it with your crew along with the trip code.
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Group Password
                </label>
                <input
                  type="password"
                  value={form.joinPassword}
                  onChange={(e) => update("joinPassword", e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Min. 4 characters"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={form.joinPasswordConfirm}
                  onChange={(e) => update("joinPasswordConfirm", e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Repeat password"
                />
              </div>
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-sm text-green-800">
                <strong>How sharing works:</strong> After creating the trip you&apos;ll
                get a unique 8-character trip code. Share that code + this password
                with your group so they can view the full trip plan — no account
                needed.
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep((s) => (s - 1) as Step)}
                className="px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50"
              >
                ← Back
              </button>
            ) : (
              <Link
                href="/dashboard"
                className="px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </Link>
            )}

            {step < 5 ? (
              <button
                type="button"
                onClick={nextStep}
                className="bg-green-700 text-white px-8 py-2.5 rounded-lg text-sm font-semibold hover:bg-green-800"
              >
                Next →
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="bg-green-700 text-white px-8 py-2.5 rounded-lg text-sm font-semibold hover:bg-green-800 disabled:opacity-50"
              >
                {loading ? "Creating trip..." : "Create Trip ⛳"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
