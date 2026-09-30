"use client";

import ZiaAvatar from "@/components/chatbot/ZiaAvatar";

import ChatWidget from "@/components/chatbot/ChatWidget";
import Header from "@/components/home/Header";
import Hero from "@/components/home/Hero";
import Footer from "@/components/home/Footer";

const MARQUEE_ITEMS = [
  "📢 Admissions close on 31 August 2026",
  "MCA Admissions 2026 open",
  "M.S.W. 2026–2027 Admissions Open",
  "M.Sc Mathematics with Data Science — Admission Open",
  "November 2026 End Semester Examination fee payment now live",
];

const RANKINGS = [
  { icon: "🏅", title: "India Today", content: "Ranked Best College 2025" },
  { icon: "🏅", title: "The Week", content: "Ranked Best College 2025" },
  { icon: "🎓", title: "NAAC", content: "A+ Grade, Cycle IV (CGPA 3.39)" },
  { icon: "📊", title: "NIRF", content: "#64 Rank Nationally" },
];

const STATS = [
  { count: "8,000+", label: "Students Enrolled (2024)" },
  { count: "60+", label: "Programs Offered" },
  { count: "370+", label: "Faculty Members" },
];

const ACADEMIC_DIVISIONS = [
  {
    icon: "💼",
    name: "Business Studies",
    departments: [
      "Commerce",
      "BBA & MA HRM",
      "Commerce (Hons.)",
      "Accounting and Finance",
      "Bank Management",
      "Corporate Secretaryship",
    ],
  },
  {
    icon: "🔬",
    name: "Science",
    departments: [
      "Nutrition",
      "Biochemistry",
      "Microbiology",
      "Plant Biology and Plant Biotechnology",
      "Psychology",
      "Zoology",
      "Chemistry",
      "Physics",
      "Mathematics",
    ],
  },
  {
    icon: "💻",
    name: "Information Technology",
    departments: [
      "Mathematics with Computer Applications",
      "Cybersecurity",
      "MCA",
      "Mathematics with Data Science",
      "BCA",
      "Computer Science",
    ],
  },
  {
    icon: "🎭",
    name: "Arts & Humanities",
    departments: [
      "Economics",
      "Social Work",
      "Geography",
      "History & TTM",
      "Tamil",
      "English",
    ],
  },
  {
    icon: "📷",
    name: "Media Studies",
    departments: ["Media Studies"],
  },
  {
    icon: "📖",
    name: "Foundation Courses",
    departments: ["Hindi", "French", "Tamil", "Sanskrit", "English"],
  },
  {
    icon: "📈",
    name: "Management Studies",
    departments: ["MBA"],
  },
];

const CAMPUS_LIFE = [
  {
    icon: "🏠",
    title: "Hostel",
    desc: "A vibrant, close-knit residential community that serves as a home away from home for students.",
  },
  {
    icon: "📚",
    title: "Library",
    desc: "A well-stocked resource centre supporting research, reading, and quiet study across every discipline.",
  },
  {
    icon: "🏆",
    title: "Sports",
    desc: "A community where passion meets performance, with facilities and coaching across multiple sports.",
  },
  {
    icon: "🎨",
    title: "Clubs",
    desc: "Dozens of student-run clubs spanning arts, literature, environment, entrepreneurship, and more.",
  },
  {
    icon: "💚",
    title: "Health & Wellness",
    desc: "On-campus counselling and wellness support to help students thrive personally and academically.",
  },
  {
    icon: "🎯",
    title: "Placement Cell",
    desc: "Dedicated career development support connecting students with internships and placements.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      <Header />

      <div className="overflow-hidden whitespace-nowrap border-b border-brand-100 bg-brand-50 py-2 text-xs font-medium text-brand-700">
        <span className="inline-block animate-marquee">
          {MARQUEE_ITEMS.join("   •   ")}
          {"   •   "}
          {MARQUEE_ITEMS.join("   •   ")}
        </span>
      </div>

      <Hero />

      {/* Rankings & Stats */}
      <section className="border-b border-gray-100 bg-white py-12">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-4 px-6 md:grid-cols-4">
          {RANKINGS.map((r) => (
            <div
              key={r.title}
              className="rounded-2xl border border-brand-100 bg-brand-50/50 p-5 text-center"
            >
              <p className="text-2xl">{r.icon}</p>
              <p className="mt-2 text-sm font-semibold text-brand-800">
                {r.title}
              </p>
              <p className="mt-1 text-xs text-gray-600">{r.content}</p>
            </div>
          ))}
        </div>

        <div className="mx-auto mt-10 grid max-w-3xl grid-cols-3 gap-6 px-6 text-center">
          {STATS.map((s) => (
            <div key={s.label}>
              <p className="text-3xl font-bold text-brand-700 md:text-4xl">
                {s.count}
              </p>
              <p className="mt-1 text-xs text-gray-500 md:text-sm">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* About */}
      <section id="about" className="border-b border-gray-100 bg-gray-50 py-16">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 md:grid-cols-2 md:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-600">
              About Us
            </p>
            <h2 className="mt-2 text-3xl font-bold text-gray-900">
              A legacy of academic excellence
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-gray-600">
              Ethiraj College for Women is an autonomous women&apos;s
              institution in Chennai, Tamil Nadu, affiliated to the
              University of Madras. Founded in 1948 by Thiru V. L. Ethiraj,
              it offers undergraduate, postgraduate, and research programmes
              across arts, science, commerce, management, and technology.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-gray-600">
              The college was recognised as a &ldquo;College with Potential
              for Excellence&rdquo; — the first among women&apos;s colleges
              in Tamil Nadu to receive this status — and continues to be
              reaccredited with an A+ grade by NAAC.
            </p>
          </div>
          <div className="overflow-hidden rounded-3xl shadow-widget">
            <img
              src="/1786600676905-322198755.jpg"
              alt="Ethiraj College for Women campus event"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Academics */}
      <section id="academics" className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-600">
            Academics
          </p>
          <h2 className="mt-2 text-3xl font-bold text-gray-900">
            Academic Divisions
          </h2>
          <p className="mt-3 max-w-2xl text-sm text-gray-600">
            Seven academic divisions housing undergraduate, postgraduate,
            and doctoral programmes across the sciences, humanities,
            commerce, technology, and management.
          </p>

          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {ACADEMIC_DIVISIONS.map((division) => (
              <div
                key={division.name}
                className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:shadow-md"
              >
                <p className="text-2xl">{division.icon}</p>
                <p className="mt-2 text-sm font-semibold text-gray-900">
                  {division.name}
                </p>
                <p className="mt-1 text-xs font-medium text-brand-600">
                  {division.departments.length} Department
                  {division.departments.length > 1 ? "s" : ""}
                </p>
                <p className="mt-2 text-xs leading-relaxed text-gray-500">
                  {division.departments.join(" · ")}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Campus Life */}
      <section id="campus-life" className="bg-gray-50 py-16">
        <div className="mx-auto max-w-6xl px-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-600">
            Campus Life
          </p>
          <h2 className="mt-2 text-3xl font-bold text-gray-900">
            Life beyond the classroom
          </h2>

          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {CAMPUS_LIFE.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl bg-white p-5 shadow-sm"
              >
                <p className="text-2xl">{item.icon}</p>
                <p className="mt-2 text-sm font-semibold text-gray-900">
                  {item.title}
                </p>
                <p className="mt-2 text-xs leading-relaxed text-gray-500">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Admissions */}
      <section id="admissions" className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="overflow-hidden rounded-3xl bg-gradient-to-r from-brand-700 to-brand-600 px-8 py-12 text-white md:px-14">
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-100">
              Admissions 2026–27
            </p>
            <h2 className="mt-2 max-w-lg text-2xl font-bold md:text-3xl">
              Ready to begin your journey at Ethiraj?
            </h2>
            <p className="mt-3 max-w-xl text-sm text-brand-50/90">
              Admissions are open across undergraduate, postgraduate, and
              research programmes. Ask Zia, our AI assistant, about eligibility,
              fees, and the application process, or apply directly online.
            </p>
            <div className="mt-6 flex flex-wrap gap-4">
              <a
                href="https://ethiraj.ibossems.com/"
                target="_blank"
                rel="noreferrer"
                className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-brand-700 transition hover:bg-brand-50"
              >
                Apply Online ↗
              </a>
              <button
                onClick={() =>
                  window.dispatchEvent(new Event("campusguide:open-chat"))
                }
                className="inline-flex items-center gap-2 rounded-full border border-white/70 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                <ZiaAvatar className="h-5 w-5" animated={false} sparkles={false} />
          Ask About Admissions
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      <ChatWidget />
    </main>
  );
}
