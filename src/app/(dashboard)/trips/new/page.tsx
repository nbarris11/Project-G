"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";

type Step = 1 | 2 | 3;

interface TripForm {
  name: string;
  destination: string;
  numberOfGolfers: string;
  skillLevel: string;
  lodgingType: string;
  notes: string;
  responseDeadline: string;
  joinPassword: string;
  joinPasswordConfirm: string;
}

export default function NewTripPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [step, setStep] = useState<Step>(1);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState<TripForm>({
    name: "",
    destination: "",
    numberOfGolfers: "",
    skillLevel: "",
    lodgingType: "",
    notes: "",
    responseDeadline: "",
    joinPassword: "",
    joinPasswordConfirm: "",
  });

  if (status === "loading") return null;
  if (!session) { router.push("/login"); return null; }

  const update = (field: keyof TripForm, value: string) =>
    setForm((f) => ({ ...f, [field]: value }));

  const nextStep = () => {
    setError("");
    if (step === 1) {
      if (!form.name || !form.destination || !form.numberOfGolfers || !form.skillLevel || !form.lodgingType) {
        setError("Please fill in all fields.");
        return;
      }
    }
    if (step === 2) {
      if (!form.responseDeadline) {
        setError("Please set a response deadline.");
        return;
      }
      const deadline = new Date(form.responseDeadline);
      if (deadline <= new Date()) {
        setError("Deadline must be in the future.");
        return;
      }
    }
    setStep((s) => (s + 1) as Step);
  };

  const handleSubmit = async () => {
    setError("");
    if (!form.joinPassword) { setError("Please set a group password."); return; }
    if (form.joinPassword !== form.joinPasswordConfirm) { setError("Passwords don't match."); return; }
    if (form.joinPassword.length < 4) { setError("Password must be at least 4 characters."); return; }

    setLoading(true);
    try {
      const res = await fetch("/api/trips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          destination: form.destination,
          numberOfGolfers: parseInt(form.numberOfGolfers),
          skillLevel: form.skillLevel,
          lodgingType: form.lodgingType,
          notes: form.notes,
          responseDeadline: form.responseDeadline,
          joinPassword: form.joinPassword,
        }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Failed to create trip."); return; }
      router.push(`/trips/${data.id}`);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const progress = (step / 3) * 100;

  return (
    <div className="min-h-screen gradient-green flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-xl">
        <div className="text-center text-white mb-8">
          <Link href="/dashboard" className="text-green-200 text-sm hover:text-white">← Back to Dashboard</Link>
          <h1 className="text-3xl font-bold mt-4">Plan Your Golf Trip</h1>
          <p className="text-green-200 mt-1 text-sm">Step {step} of 3</p>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-green-800 rounded-full h-1.5 mb-8">
          <div
            className="bg-white rounded-full h-1.5 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 mb-6 text-sm">
              {error}
            </div>
          )}

          {/* STEP 1 — Trip basics */}
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-1">Trip Details</h2>
                <p className="text-gray-500 text-sm">Start with the basics — your group will fill in the dates and budget.</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Trip Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder='e.g. "Scottsdale Boys Trip 2025"'
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Destination Idea</label>
                <input
                  type="text"
                  value={form.destination}
                  onChange={(e) => update("destination", e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="e.g. Scottsdale, AZ or Scotland"
                />
                <p className="text-xs text-gray-400 mt-1">Can be a rough idea — exact location can be decided by the group.</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Number of Golfers</label>
                <input
                  type="number"
                  min={2}
                  max={100}
                  value={form.numberOfGolfers}
                  onChange={(e) => update("numberOfGolfers", e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="e.g. 8"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Group Skill Level</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: "beginner", label: "Beginner", desc: "Handicap 28+", icon: "🌱" },
                    { value: "intermediate", label: "Intermediate", desc: "Handicap 15–27", icon: "⛳" },
                    { value: "advanced", label: "Advanced", desc: "Handicap 0–14", icon: "🏆" },
                    { value: "mixed", label: "Mixed Levels", desc: "All abilities", icon: "👥" },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => update("skillLevel", opt.value)}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        form.skillLevel === opt.value ? "border-green-600 bg-green-50" : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="text-2xl mb-1">{opt.icon}</div>
                      <div className="font-semibold text-gray-900 text-sm">{opt.label}</div>
                      <div className="text-xs text-gray-500">{opt.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Lodging Preference</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: "play-and-stay", label: "Play & Stay", desc: "Resort with on-site golf", icon: "🏨" },
                    { value: "hotel", label: "Hotel", desc: "Separate from the course", icon: "🛎️" },
                    { value: "airbnb", label: "Airbnb / VRBO", desc: "Rental house or condo", icon: "🏠" },
                    { value: "flexible", label: "Flexible", desc: "Open to any option", icon: "🤷" },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => update("lodgingType", opt.value)}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        form.lodgingType === opt.value ? "border-green-600 bg-green-50" : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="text-2xl mb-1">{opt.icon}</div>
                      <div className="font-semibold text-gray-900 text-sm">{opt.label}</div>
                      <div className="text-xs text-gray-500">{opt.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes (optional)</label>
                <textarea
                  rows={3}
                  value={form.notes}
                  onChange={(e) => update("notes", e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                  placeholder="Anything the group should know — celebrating a birthday, bucket-list course, etc."
                />
              </div>
            </div>
          )}

          {/* STEP 2 — Response deadline */}
          {step === 2 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-1">Set a Response Deadline</h2>
                <p className="text-gray-500 text-sm">
                  Give your group a date to submit their available weekends and budget.
                  After this date, you can review everyone&apos;s responses and lock in the trip details.
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Respond by</label>
                <input
                  type="date"
                  value={form.responseDeadline}
                  onChange={(e) => update("responseDeadline", e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Tip: give people at least 1–2 weeks to respond.
                </p>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-sm text-green-800">
                <p className="font-semibold mb-1">Here&apos;s how it works:</p>
                <ol className="list-decimal list-inside space-y-1 text-green-700">
                  <li>You share the trip code + password with your group</li>
                  <li>Each person enters their name, picks available weekends, and sets their budget</li>
                  <li>You see who responded and which weekends have the most overlap</li>
                  <li>You lock in the final dates and budget — course recommendations appear</li>
                </ol>
              </div>
            </div>
          )}

          {/* STEP 3 — Group password */}
          {step === 3 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-1">Set Group Password</h2>
                <p className="text-gray-500 text-sm">
                  Your group will use this password + a trip code to access and respond to the trip.
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Group Password</label>
                <input
                  type="password"
                  value={form.joinPassword}
                  onChange={(e) => update("joinPassword", e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Min. 4 characters"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                <input
                  type="password"
                  value={form.joinPasswordConfirm}
                  onChange={(e) => update("joinPasswordConfirm", e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Repeat password"
                />
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
              <Link href="/dashboard" className="px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50">
                Cancel
              </Link>
            )}
            {step < 3 ? (
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
