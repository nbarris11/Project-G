import Link from "next/link";
import { Logo } from "@/components/Logo";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* NAV */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-gray-100">
        <Logo size={30} />
        <div className="flex items-center gap-4">
          <Link
            href="/join"
            className="text-sm text-gray-500 hover:text-gray-800 font-medium"
          >
            Join a Trip
          </Link>
          <Link
            href="/login"
            className="text-sm text-gray-500 hover:text-gray-800 font-medium"
          >
            Log In
          </Link>
          <Link
            href="/register"
            style={{ backgroundColor: "#1C5C3A" }}
            className="text-white text-sm px-4 py-2 rounded-lg hover:opacity-90 font-medium"
          >
            Plan a Trip
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="gradient-green text-white py-24 px-8 text-center">
        <div className="max-w-3xl mx-auto">
          <p className="text-green-200 text-sm font-semibold tracking-widest uppercase mb-4">
            Golf Trip Planning, Simplified
          </p>
          <h1 className="text-5xl font-extrabold leading-tight mb-6">
            Stop juggling group chats.<br />
            Start playing great golf.
          </h1>
          <p className="text-green-100 text-xl mb-10 leading-relaxed">
            Planning a golf trip with friends is a nightmare — dates, budget,
            who&apos;s flying in, which course, where to stay. Outing.Golf handles all of it.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="bg-white font-bold px-8 py-4 rounded-xl hover:bg-green-50 text-lg"
              style={{ color: "#1C5C3A" }}
            >
              Plan Your Golf Trip →
            </Link>
            <Link
              href="/join"
              className="border border-white text-white font-semibold px-8 py-4 rounded-xl hover:bg-white/10 text-lg"
            >
              Join a Trip
            </Link>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20 px-8 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
            Everything you need in one place
          </h2>
          <p className="text-center text-gray-500 mb-14 text-lg">
            From &quot;who&apos;s in?&quot; to first tee — we handle the chaos.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: "📋",
                title: "Build Your Trip",
                desc: "Set your destination idea, headcount, skill level, and lodging preference. Then collect availability and budgets from your group.",
              },
              {
                icon: "📍",
                title: "Collect Group Input",
                desc: "Share a trip code. Members enter their home location, max budget, and available weekends — no account needed.",
              },
              {
                icon: "⛳",
                title: "Get Course Recommendations",
                desc: "After the group responds, lock in dates and budget. We surface the best courses based on your group's data.",
              },
            ].map((step) => (
              <div
                key={step.title}
                className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center"
              >
                <div className="text-5xl mb-5">{step.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-500 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-20 px-8">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-14">
            Built for the way golf trips actually work
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                icon: "✈️",
                title: "Location-aware recommendations",
                desc: "Members enter their home city. We factor everyone's travel distance into course and destination recommendations.",
              },
              {
                icon: "🏌️",
                title: "Course difficulty ratings",
                desc: "Every recommendation shows slope rating, course rating, and a plain-English difficulty label — so you know what you're in for.",
              },
              {
                icon: "💰",
                title: "Budget-aware planning",
                desc: "The group votes with their wallets. We use real member budgets to surface courses and stays that actually fit.",
              },
              {
                icon: "📅",
                title: "Weekend overlap finder",
                desc: "Members pick their available weekends. We find where everyone overlaps so date decisions are easy.",
              },
              {
                icon: "👥",
                title: "No account needed for members",
                desc: "The organizer creates the trip. Everyone else joins with a code + password — no sign-up required.",
              },
              {
                icon: "🔒",
                title: "Organizer lock-in",
                desc: "Once responses are in, the organizer reviews and locks the final dates and budget — then course picks unlock.",
              },
            ].map((feature) => (
              <div key={feature.title} className="flex gap-5 items-start">
                <span className="text-3xl mt-1">{feature.icon}</span>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-gray-500 leading-relaxed">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="gradient-green text-white py-20 px-8 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-4xl font-extrabold mb-5">
            Ready to stop texting your group chat?
          </h2>
          <p className="text-green-100 text-lg mb-10">
            Create your trip in minutes. Share with your group. Play great golf.
          </p>
          <Link
            href="/register"
            className="bg-white font-bold px-10 py-4 rounded-xl hover:bg-green-50 text-lg inline-block"
            style={{ color: "#1C5C3A" }}
          >
            Start Planning for Free →
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-10 px-8 border-t border-gray-100 text-center text-gray-400 text-sm">
        <div className="flex items-center justify-center mb-3">
          <Logo size={22} />
        </div>
        <p>© {new Date().getFullYear()} Outing.Golf. Built for golfers, by golfers.</p>
      </footer>
    </div>
  );
}
