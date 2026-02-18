import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* NAV */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <span className="text-2xl">⛳</span>
          <span className="text-xl font-bold text-green-900">Fairway Planner</span>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/join"
            className="text-sm text-gray-600 hover:text-green-700 font-medium"
          >
            Join a Trip
          </Link>
          <Link
            href="/login"
            className="text-sm text-gray-600 hover:text-green-700 font-medium"
          >
            Log In
          </Link>
          <Link
            href="/register"
            className="bg-green-700 text-white text-sm px-4 py-2 rounded-lg hover:bg-green-800 font-medium"
          >
            Plan a Trip
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="gradient-green text-white py-24 px-8 text-center">
        <div className="max-w-3xl mx-auto">
          <p className="text-green-300 text-sm font-semibold tracking-widest uppercase mb-4">
            Golf Trip Planning, Simplified
          </p>
          <h1 className="text-5xl font-extrabold leading-tight mb-6">
            Stop juggling group chats.<br />
            Start playing great golf.
          </h1>
          <p className="text-green-100 text-xl mb-10 leading-relaxed">
            Planning a golf trip with friends is a nightmare — dates, budget,
            who&apos;s flying in, which course, where to stay, who books what.
            Fairway Planner handles all of it.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="bg-white text-green-800 font-bold px-8 py-4 rounded-xl hover:bg-green-50 text-lg"
            >
              Plan Your Golf Trip →
            </Link>
            <Link
              href="/join"
              className="border border-white text-white font-semibold px-8 py-4 rounded-xl hover:bg-green-800 text-lg"
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
                desc: "Set your destination, dates, headcount, budget, skill level, and lodging preference in a simple step-by-step wizard.",
              },
              {
                icon: "⛳",
                title: "Get Course Recommendations",
                desc: "We recommend the best courses for your group based on location, budget, and skill level — with full difficulty ratings and green fee info.",
              },
              {
                icon: "🔗",
                title: "Share With Your Group",
                desc: "Get a trip code and password. Share it with your foursome — they can view the full trip plan, itinerary, and booking checklist.",
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
                title: "Handles every lodging type",
                desc: "Play & stay resorts, hotels, Airbnbs — or flexible. We surface the right courses based on what your group wants.",
              },
              {
                icon: "🏌️",
                title: "Course difficulty ratings",
                desc: "Every course recommendation shows slope rating, course rating, and a plain-English difficulty label — so you know what you're getting into.",
              },
              {
                icon: "💰",
                title: "Budget-aware planning",
                desc: "Enter your per-person budget and we'll recommend courses and stays that actually fit, not aspirational options you can't afford.",
              },
              {
                icon: "📅",
                title: "Full itinerary & booking checklist",
                desc: "Track what's booked, what's outstanding, and who's responsible. No more 'wait, did anyone book the tee times?'",
              },
              {
                icon: "👥",
                title: "Group access with shared password",
                desc: "The trip organizer creates the plan. Everyone else joins with a trip code + shared password — no account required.",
              },
              {
                icon: "📍",
                title: "Location-smart recommendations",
                desc: "Planning a Scottsdale trip or a Scotland pilgrimage? We tailor course picks to your destination.",
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
            Create your trip plan in minutes. Share with your group. Play great golf.
          </p>
          <Link
            href="/register"
            className="bg-white text-green-800 font-bold px-10 py-4 rounded-xl hover:bg-green-50 text-lg inline-block"
          >
            Start Planning for Free →
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-10 px-8 border-t border-gray-100 text-center text-gray-400 text-sm">
        <div className="flex items-center justify-center gap-2 mb-3">
          <span>⛳</span>
          <span className="font-semibold text-gray-600">Fairway Planner</span>
        </div>
        <p>© {new Date().getFullYear()} Fairway Planner. Built for golfers, by golfers.</p>
      </footer>
    </div>
  );
}
