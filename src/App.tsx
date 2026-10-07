import { FormEvent, ReactNode, useEffect, useState } from "react";

const durgaImage =
  "https://images.unsplash.com/photo-1600867161364-67e000733952?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=85&w=1400";

const venueAddress =
  "Sri Datta Sai Enclave, Road Number 4, Gangaram, Chanda Nagar, Hyderabad, Telangana 500050";
const venueMapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(venueAddress)}`;

function Icon({
  children,
  className = "h-5 w-5",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      {children}
    </svg>
  );
}

function LotusMark() {
  return (
    <svg
      aria-hidden="true"
      className="h-9 w-9 text-[#f3b32b]"
      viewBox="0 0 48 48"
      fill="none"
    >
      <path
        d="M24 7c5.2 6.5 6.5 12.2 0 20-6.5-7.8-5.2-13.5 0-20Z"
        fill="currentColor"
      />
      <path
        d="M9.3 17.2c8.1 1 12.8 4.2 13.6 14.2-9.7-.8-13.2-5.6-13.6-14.2ZM38.7 17.2c-8.1 1-12.8 4.2-13.6 14.2 9.7-.8 13.2-5.6 13.6-14.2Z"
        fill="currentColor"
        opacity=".85"
      />
      <path
        d="M5 29.3c8.4-1.7 14.1.4 18.6 10.1C13.9 41.2 8 37.5 5 29.3ZM43 29.3c-8.4-1.7-14.1.4-18.6 10.1 9.7 1.8 15.6-1.9 18.6-10.1Z"
        fill="currentColor"
        opacity=".65"
      />
      <path d="M13 41h22" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

const services = [
  {
    title: "Daily Archana",
    description: "Offer flowers and receive blessings in your family’s name.",
  },
  {
    title: "Kumkum Archana",
    description: "A sacred offering to Devi for strength, prosperity and grace.",
  },
  {
    title: "Children’s Special Pooja",
    description:
      "Day 5 · Skandamata · Sri Saraswati Devi (Moola Nakshatram). Special blessings for children.",
  },
];

const festivalDays = [
  {
    day: "Day 1",
    decoration: "Sri Swarna Kavachalankruta Durga Devi",
    avatar: "Shailaputri",
    prasadam: "Katte Pongali (Savoury Pongal), Pulihora (Tamarind Rice)",
  },
  {
    day: "Day 2",
    decoration: "Sri Bala Tripura Sundari Devi",
    avatar: "Brahmacharini",
    prasadam: "Rava Kesari, Boondi Laddu",
  },
  {
    day: "Day 3",
    decoration: "Sri Gayatri Devi",
    avatar: "Chandraghanta",
    prasadam: "Kobbari Annam (Coconut Rice), Allam Garelu (Ginger Medu Vada)",
  },
  {
    day: "Day 4",
    decoration: "Sri Lalitha Tripura Sundari Devi",
    avatar: "Kushmanda",
    prasadam: "Minapa Garelu (Urad Dal Vada), Daddojanam (Curd Rice)",
  },
  {
    day: "Day 5",
    decoration: "Sri Saraswati Devi (Moola Nakshatram)",
    avatar: "Skandamata",
    prasadam: "Daddojanam (Curd Rice), Paramannam (Rice Kheer)",
    special: "Children’s Special Day",
    specialItems: "A notebook, pencils or study books for Saraswati blessings",
  },
  {
    day: "Day 6",
    decoration: "Sri Mahalakshmi Devi",
    avatar: "Katyayani",
    prasadam: "Ksheerannam (Milk Payasam), Mysore Pak",
  },
  {
    day: "Day 7",
    decoration: "Sri Mahachandi Devi",
    avatar: "Kalaratri",
    prasadam: "Kadambam (Mixed Vegetable Rice), Pulihora (Tamarind Rice)",
  },
  {
    day: "Day 8",
    decoration: "Sri Durga Devi",
    avatar: "Mahagauri",
    prasadam: "Chakkera Pongali (Sweet Pongal)",
  },
  {
    day: "Day 9",
    decoration: "Sri Mahishasura Mardhini Devi",
    avatar: "Siddhidhatri",
    prasadam: "Semiya Payasam (Vermicelli Kheer), Poornalu",
  },
];

type Registration = {
  id: string;
  name: string;
  phone: string;
  email: string;
  devotees: string;
  seva: string;
  festivalDay: string;
  sankalpa: string;
  createdAt: string;
};

const inputClass =
  "mt-2 w-full rounded-xl border border-[#e8d9c8] bg-[#fffdf8] px-4 py-3 text-sm text-[#401d22] outline-none transition placeholder:text-[#9b8682] focus:border-[#a7282f] focus:ring-2 focus:ring-[#a7282f]/10";

const STORAGE_KEY = "pooja-registrations";
const adminPassword = ["Keerthan", "@", "7956"].join("");

function readStoredRegistrations(): Registration[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    const parsed = saved ? JSON.parse(saved) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function fetchRegistrations(): Promise<Registration[]> {
  const response = await fetch("/api/registrations");
  if (!response.ok) throw new Error("Registrations unavailable");
  const data = await response.json();
  return Array.isArray(data.registrations) ? data.registrations : [];
}

function AdminDashboard({
  registrations,
  storageMode,
  isLoading,
  onRefresh,
  onClear,
  onLogout,
}: {
  registrations: Registration[];
  storageMode: "server" | "browser" | "loading";
  isLoading: boolean;
  onRefresh: () => void;
  onClear: () => void;
  onLogout: () => void;
}) {
  const storageNote =
    storageMode === "server"
      ? "Shared server storage · every device sees the same list"
      : storageMode === "browser"
        ? "This browser only · server unreachable, entries stay on this device"
        : "Loading registrations…";
  return (
    <div className="min-h-screen bg-[#f6ead7] text-[#37191d]">
      <header className="border-b border-[#e3ccb0] bg-[#fffaf1]">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-5 py-5 lg:px-10">
          <div className="flex items-center gap-3 text-[#681c24]">
            <LotusMark />
            <div>
              <strong className="block font-display text-xl">Association Admin</strong>
              <span className="block text-xs text-[#8a706b]">
                Navaratri registration management
              </span>
            </div>
          </div>
          <div className="flex flex-wrap justify-end gap-3">
            <button
              className="rounded-full border border-[#d4b99b] px-5 py-2.5 text-sm font-semibold text-[#71514d] transition hover:bg-[#f2e3cf] disabled:opacity-60"
              disabled={isLoading}
              onClick={onRefresh}
              type="button"
            >
              {isLoading ? "Refreshing…" : "Refresh"}
            </button>
            <button
              className="rounded-full border border-[#d4b99b] px-5 py-2.5 text-sm font-semibold text-[#71514d] transition hover:bg-[#f2e3cf]"
              onClick={onLogout}
              type="button"
            >
              Log out
            </button>
            <a
              className="inline-flex items-center gap-2 rounded-full border border-[#9b2b32] px-5 py-2.5 text-sm font-semibold text-[#8c252c] transition hover:bg-[#8c252c] hover:text-white"
              href="#home"
            >
              <Icon className="h-4 w-4">
                <path d="M19 12H5" />
                <path d="m10 7-5 5 5 5" />
              </Icon>
              Back to website
            </a>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 py-14 lg:px-10">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#a22a31]">
              Registration overview
            </p>
            <h1 className="mt-3 font-display text-5xl font-semibold text-[#531920]">
              All registrations
            </h1>
            <p className="mt-3 text-sm text-[#755b57]">
              {storageNote} · {registrations.length} total registrations
            </p>
          </div>
          {registrations.length > 0 && (
            <button
              className="self-start rounded-full border border-[#a84a44] px-5 py-2.5 text-sm font-semibold text-[#8d292f] transition hover:bg-[#8d292f] hover:text-white"
              onClick={onClear}
              type="button"
            >
              Clear all registrations
            </button>
          )}
        </div>

        <div className="mt-10 overflow-hidden rounded-3xl border border-[#e3ccb0] bg-[#fffaf1] shadow-xl shadow-[#6d2420]/5">
          {registrations.length === 0 ? (
            <div className="px-6 py-20 text-center">
              <h2 className="font-display text-3xl font-semibold text-[#5e2228]">
                No registrations yet
              </h2>
              <p className="mt-2 text-sm text-[#806965]">
                New pooja registrations will appear here automatically.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1050px] text-left text-sm">
                <thead className="bg-[#7d222b] text-white">
                  <tr>
                    {[
                      "Registration",
                      "Devotee",
                      "Contact",
                      "Seva",
                      "Festival Day",
                      "Devotees",
                      "Sankalpa",
                      "Registered",
                    ].map((heading) => (
                      <th className="px-5 py-4 font-semibold" key={heading}>
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#ead8bd]">
                  {registrations.map((registration) => (
                    <tr className="align-top text-[#674e4b]" key={registration.id}>
                      <td className="px-5 py-4 font-bold text-[#8a2029]">
                        {registration.id}
                      </td>
                      <td className="px-5 py-4 font-semibold text-[#54282a]">
                        {registration.name}
                      </td>
                      <td className="px-5 py-4">
                        <span className="block">{registration.phone}</span>
                        <span className="text-xs text-[#927b75]">
                          {registration.email}
                        </span>
                      </td>
                      <td className="max-w-56 px-5 py-4">{registration.seva}</td>
                      <td className="max-w-56 px-5 py-4">{registration.festivalDay}</td>
                      <td className="px-5 py-4">{registration.devotees}</td>
                      <td className="max-w-56 px-5 py-4">
                        {registration.sankalpa || "—"}
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 text-xs">
                        {registration.createdAt}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        <p className="mt-5 text-xs leading-5 text-[#8d746e]">
          {storageMode === "server"
            ? "Registrations are saved on the server, so devotees registering from any phone or computer appear here."
            : "The server could not be reached, so registrations are saved only in this browser on this device."}
        </p>
      </main>
    </div>
  );
}

function AdminLogin({ onSuccess }: { onSuccess: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (password === adminPassword) {
      setError(false);
      onSuccess();
      return;
    }
    setError(true);
    setPassword("");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#6e1720] px-5 py-12">
      <div className="w-full max-w-md overflow-hidden rounded-3xl border border-[#e7b840] bg-[#fffaf1] shadow-2xl shadow-black/25">
        <div className="bg-gradient-to-br from-[#761c25] to-[#a72b32] px-8 py-9 text-center text-white">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-2 border-[#f3ca60]">
            <LotusMark />
          </div>
          <h1 className="mt-4 font-display text-3xl font-semibold">
            Admin Access
          </h1>
          <p className="mt-2 text-sm text-white/70">
            Enter the temple administrator password
          </p>
        </div>
        <form className="p-8" onSubmit={handleLogin}>
          <label className="text-sm font-semibold text-[#54282a]">
            Admin password
            <input
              autoComplete="current-password"
              autoFocus
              className={inputClass}
              onChange={(event) => {
                setPassword(event.target.value);
                setError(false);
              }}
              placeholder="Enter password"
              required
              type="password"
              value={password}
            />
          </label>
          {error && (
            <p className="mt-3 rounded-xl bg-[#f9ded7] px-4 py-3 text-sm font-semibold text-[#92272e]">
              Incorrect password. Please try again.
            </p>
          )}
          <button
            className="mt-6 w-full rounded-full bg-[#8d242c] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-[#721a22]"
            type="submit"
          >
            Open Admin Dashboard
          </button>
          <a
            className="mt-4 block text-center text-sm font-semibold text-[#8c4b47] hover:text-[#7a2028]"
            href="#home"
          >
            Return to website
          </a>
        </form>
      </div>
    </div>
  );
}

export default function App() {
  const [submitted, setSubmitted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isAdminPage, setIsAdminPage] = useState(
    window.location.hash === "#admin",
  );
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(
    sessionStorage.getItem("admin-authenticated") === "true",
  );
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [storageMode, setStorageMode] = useState<
    "server" | "browser" | "loading"
  >("loading");
  const [isLoading, setIsLoading] = useState(true);
  const [latestRegistration, setLatestRegistration] =
    useState<Registration | null>(null);
  const [selectedFestivalDay, setSelectedFestivalDay] = useState("");

  async function loadRegistrations() {
    setIsLoading(true);
    try {
      const serverRegistrations = await fetchRegistrations();
      setRegistrations(serverRegistrations);
      setStorageMode("server");
    } catch {
      setRegistrations(readStoredRegistrations());
      setStorageMode("browser");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadRegistrations();
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      setIsAdminPage(window.location.hash === "#admin");
      window.scrollTo(0, 0);
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const registration: Registration = {
      id: `SDD-${Date.now().toString().slice(-6)}`,
      name: String(data.get("name")),
      phone: String(data.get("phone")),
      email: String(data.get("email")),
      devotees: String(data.get("devotees")),
      seva: String(data.get("seva")),
      festivalDay: String(data.get("festivalDay")),
      sankalpa: String(data.get("sankalpa") || ""),
      createdAt: new Date().toLocaleString(),
    };

    try {
      const response = await fetch("/api/registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registration),
      });
      if (!response.ok) throw new Error("Registration failed");
      const saved = (await response.json()).registration as Registration;
      setRegistrations([saved, ...registrations]);
      setLatestRegistration(saved);
      setStorageMode("server");
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      const updated = [registration, ...registrations];
      setRegistrations(updated);
      setLatestRegistration(registration);
      setStorageMode("browser");
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }

    setSubmitted(true);
  }

  function downloadReceipt() {
    if (!latestRegistration) return;
    const escapeHtml = (value: string) =>
      value
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
    const details = {
      id: escapeHtml(latestRegistration.id),
      name: escapeHtml(latestRegistration.name),
      seva: escapeHtml(latestRegistration.seva),
      day: escapeHtml(latestRegistration.festivalDay),
      devotees: escapeHtml(latestRegistration.devotees),
      date: escapeHtml(latestRegistration.createdAt),
    };
    const receipt = `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${details.id} · Pooja Receipt</title>
  <style>
    * { box-sizing: border-box; }
    body { margin: 0; padding: 40px 20px; background: #fff5df; color: #48171d; font-family: Georgia, serif; }
    .receipt { position: relative; max-width: 760px; margin: auto; overflow: hidden; border: 3px solid #e7b840; border-radius: 28px; background: #fffdf8; box-shadow: 0 24px 70px rgba(91, 23, 29, .18); }
    .header { padding: 42px 40px 34px; text-align: center; color: white; background: linear-gradient(135deg, #6e1720, #a72b32); }
    .lotus { display: inline-grid; width: 58px; height: 58px; margin-bottom: 12px; place-items: center; border: 2px solid #f3ca60; border-radius: 50%; color: #f3ca60; font: 700 30px Georgia, serif; }
    h1 { margin: 0; font-size: 34px; }
    .subtitle { margin: 9px 0 0; color: #f8dc92; font: 700 13px Arial, sans-serif; letter-spacing: 3px; text-transform: uppercase; }
    .status { display: table; margin: -16px auto 0; padding: 9px 22px; border: 2px solid #fffdf8; border-radius: 999px; background: #efbd49; color: #591820; font: 700 13px Arial, sans-serif; letter-spacing: 1px; text-transform: uppercase; }
    .content { padding: 38px 42px 42px; }
    .registration { margin-bottom: 28px; text-align: center; }
    .registration span { color: #9b7062; font: 700 11px Arial, sans-serif; letter-spacing: 2px; text-transform: uppercase; }
    .registration strong { display: block; margin-top: 6px; color: #8b2029; font: 700 25px Arial, sans-serif; letter-spacing: 2px; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; overflow: hidden; border: 1px solid #edd8b4; border-radius: 18px; }
    .item { min-height: 98px; padding: 20px; border-right: 1px solid #edd8b4; border-bottom: 1px solid #edd8b4; }
    .item:nth-child(even) { border-right: 0; }
    .item:nth-last-child(-n+2) { border-bottom: 0; }
    .item span { display: block; margin-bottom: 8px; color: #a15147; font: 700 10px Arial, sans-serif; letter-spacing: 1.6px; text-transform: uppercase; }
    .item strong { font-size: 16px; line-height: 1.5; }
    .blessing { margin-top: 30px; padding: 23px; border-radius: 16px; background: #fff1ca; text-align: center; color: #7d2529; font-size: 18px; font-style: italic; }
    .footer { padding: 18px; background: #6e1720; color: #f6d77d; text-align: center; font: 12px Arial, sans-serif; letter-spacing: 1px; }
    @media (max-width: 560px) { .grid { grid-template-columns: 1fr; } .item { border-right: 0; } .item:nth-last-child(2) { border-bottom: 1px solid #edd8b4; } .content { padding: 32px 22px; } }
    @media print { body { padding: 0; background: white; } .receipt { box-shadow: none; } }
  </style>
</head>
<body>
  <main class="receipt">
    <header class="header">
      <div class="lotus">ॐ</div>
      <h1>Jai Bhavani Youth Association</h1>
      <p class="subtitle">Navaratri Durga Pooja</p>
    </header>
    <div class="status">Registration Confirmed</div>
    <section class="content">
      <div class="registration"><span>Registration Number</span><strong>${details.id}</strong></div>
      <div class="grid">
        <div class="item"><span>Devotee</span><strong>${details.name}</strong></div>
        <div class="item"><span>Number of Devotees</span><strong>${details.devotees}</strong></div>
        <div class="item"><span>Pooja Seva</span><strong>${details.seva}</strong></div>
        <div class="item"><span>Festival Day</span><strong>${details.day}</strong></div>
        <div class="item"><span>Registered On</span><strong>${details.date}</strong></div>
        <div class="item"><span>Receipt Status</span><strong>Confirmed</strong></div>
      </div>
      <div class="blessing">May Maa Durga bless your family with strength, peace and abundance.</div>
    </section>
    <footer class="footer">Sri Datta Sai Enclave · Road No. 4 · Chanda Nagar · Hyderabad 500050</footer>
  </main>
</body>
</html>`;
    const file = new Blob([receipt], { type: "text/html" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(file);
    link.download = `${latestRegistration.id}-color-receipt.html`;
    link.click();
    URL.revokeObjectURL(link.href);
  }

  async function clearRegistrations() {
    let clearedOnServer = false;
    try {
      const response = await fetch("/api/registrations", {
        method: "DELETE",
        headers: { "x-admin-password": adminPassword },
      });
      clearedOnServer = response.ok;
    } catch {
      clearedOnServer = false;
    }
    if (!clearedOnServer && !window.confirm("The server could not be reached. Clear the registrations saved in this browser instead?")) {
      return;
    }
    setRegistrations([]);
    localStorage.removeItem(STORAGE_KEY);
    setStorageMode(clearedOnServer ? "server" : "browser");
  }

  if (isAdminPage) {
    if (!isAdminAuthenticated) {
      return (
        <AdminLogin
          onSuccess={() => {
            sessionStorage.setItem("admin-authenticated", "true");
            setIsAdminAuthenticated(true);
          }}
        />
      );
    }
    return (
      <AdminDashboard
        onClear={clearRegistrations}
        onRefresh={loadRegistrations}
        isLoading={isLoading}
        storageMode={storageMode}
        onLogout={() => {
          sessionStorage.removeItem("admin-authenticated");
          setIsAdminAuthenticated(false);
        }}
        registrations={registrations}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#fffaf0] text-[#37191d]">
      <header className="absolute inset-x-0 top-0 z-30">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 lg:px-10">
          <a href="#" className="flex items-center gap-3 text-white">
            <LotusMark />
            <span className="font-display text-xl font-semibold tracking-wide">
              Jai Bhavani Youth Association
            </span>
          </a>
          <nav className="hidden items-center gap-8 text-sm font-medium text-white/90 md:flex">
            <a className="transition hover:text-[#f6c95c]" href="#about">
              About
            </a>
            <a className="transition hover:text-[#f6c95c]" href="#sevas">
              Pooja Sevas
            </a>
            <a className="transition hover:text-[#f6c95c]" href="#schedule">
              Schedule
            </a>
            <a className="transition hover:text-[#f6c95c]" href="#admin">
              Admin
            </a>
            <a
              className="rounded-full border border-white/40 px-5 py-2.5 transition hover:bg-white hover:text-[#7d1922]"
              href="#register"
            >
              Register Now
            </a>
          </nav>
          <button
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            className="rounded-full border border-white/30 p-2 text-white md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
            type="button"
          >
            <Icon>
              {menuOpen ? (
                <>
                  <path d="m6 6 12 12" />
                  <path d="M18 6 6 18" />
                </>
              ) : (
                <>
                  <path d="M4 7h16" />
                  <path d="M4 12h16" />
                  <path d="M4 17h16" />
                </>
              )}
            </Icon>
          </button>
        </div>
        {menuOpen && (
          <nav className="mx-5 flex flex-col gap-4 rounded-2xl bg-[#fffaf0] p-5 text-sm font-semibold text-[#661f27] shadow-xl md:hidden">
            <a href="#about" onClick={() => setMenuOpen(false)}>About</a>
            <a href="#sevas" onClick={() => setMenuOpen(false)}>Pooja Sevas</a>
            <a href="#schedule" onClick={() => setMenuOpen(false)}>Schedule</a>
            <a href="#admin" onClick={() => setMenuOpen(false)}>Admin</a>
            <a href="#register" onClick={() => setMenuOpen(false)}>Register Now</a>
          </nav>
        )}
      </header>

      <main>
        <section className="relative min-h-[760px] overflow-hidden bg-[#6f1720]">
          <img
            alt="Beautifully adorned Durga idol during the festival"
            className="absolute inset-0 h-full w-full object-cover object-[58%_35%] md:left-[45%] md:w-[55%]"
            src={durgaImage}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#59151d] via-[#691820]/95 to-[#681820]/20 md:to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#471117]/70 via-transparent to-[#3b0b10]/25" />
          <div className="relative mx-auto flex min-h-[760px] max-w-7xl items-center px-5 pb-20 pt-32 lg:px-10">
            <div className="max-w-2xl text-white">
              <div className="mb-7 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.24em] text-[#f4c65b]">
                <span className="h-px w-10 bg-[#f4c65b]" />
                Nine nights of divine grace
              </div>
              <h1 className="font-display text-6xl leading-[0.92] font-semibold sm:text-7xl lg:text-[5.7rem]">
                Navaratri
                <span className="mt-2 block italic text-[#f6c75d]">
                  Durga Pooja
                </span>
              </h1>
              <p className="mt-7 max-w-xl text-base leading-7 text-white/78 sm:text-lg">
                Join our temple family for nine sacred nights of devotion,
                music and celebration. Register your family for pooja and
                receive the blessings of Maa Durga.
              </p>
              <div className="mt-9 flex flex-wrap gap-4">
                <a
                  className="inline-flex items-center gap-2 rounded-full bg-[#efb93f] px-7 py-3.5 text-sm font-bold text-[#55141c] shadow-lg shadow-black/15 transition hover:bg-[#f8cf6c]"
                  href="#register"
                >
                  Register for Pooja
                  <Icon className="h-4 w-4">
                    <path d="M5 12h14" />
                    <path d="m14 7 5 5-5 5" />
                  </Icon>
                </a>
                <a
                  className="inline-flex items-center gap-2 rounded-full border border-white/40 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10"
                  href="#schedule"
                >
                  View Schedule
                </a>
              </div>
              <div className="mt-12 flex flex-wrap gap-x-8 gap-y-3 text-sm text-white/75">
                <span className="flex items-center gap-2">
                  <Icon className="h-4 w-4 text-[#f4c65b]">
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 7v5l3 2" />
                  </Icon>
                  One pooja daily at 7:00 PM
                </span>
                <a
                  className="flex max-w-md items-start gap-2 transition hover:text-white"
                  href={venueMapUrl}
                  rel="noreferrer"
                  target="_blank"
                >
                  <Icon className="h-4 w-4 text-[#f4c65b]">
                    <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
                    <circle cx="12" cy="10" r="2.5" />
                  </Icon>
                  <span>{venueAddress}</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="relative py-24 sm:py-28">
          <div className="pointer-events-none absolute right-0 top-8 h-72 w-72 rounded-full bg-[#f7df9f]/30 blur-3xl" />
          <div className="mx-auto grid max-w-7xl gap-14 px-5 lg:grid-cols-[0.9fr_1.1fr] lg:px-10">
            <div>
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.25em] text-[#a22a31]">
                A celebration of Shakti
              </p>
              <h2 className="font-display text-5xl leading-[1.05] font-semibold text-[#531920] sm:text-6xl">
                Come home to the
                <span className="block italic text-[#b74932]">Divine Mother</span>
              </h2>
            </div>
            <div className="max-w-2xl">
              <p className="text-lg leading-8 text-[#694f4c]">
                Navaratri is a sacred journey through devotion, courage and
                inner renewal. Each night honours a different form of Maa
                Durga, inviting peace, wisdom and abundance into our lives.
              </p>
              <div className="mt-9 grid gap-5 sm:grid-cols-3">
                {[
                  ["9", "Sacred nights"],
                  ["7 PM", "Pooja every evening"],
                  ["All", "Families welcome"],
                ].map(([number, label]) => (
                  <div
                    className="border-l border-[#e4cda9] pl-5"
                    key={label}
                  >
                    <strong className="font-display text-3xl text-[#8a2029]">
                      {number}
                    </strong>
                    <span className="mt-1 block text-sm text-[#806965]">
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-[#ead8bd] bg-[#fff7e9] py-20">
          <div className="mx-auto max-w-7xl px-5 lg:px-10">
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#a22a31]">
                  Nine forms of Devi
                </p>
                <h2 className="mt-3 font-display text-4xl font-semibold text-[#531920] sm:text-5xl">
                  The Navaratri journey
                </h2>
              </div>
              <p className="max-w-md text-sm leading-6 text-[#755b57]">
                Each sacred day honours a unique expression of the Divine
                Mother and the blessing she awakens within us.
              </p>
            </div>
            <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {festivalDays.map((festivalDay, index) => (
                <article
                  className="rounded-2xl border border-[#ead8bd] bg-white/70 p-5"
                  key={festivalDay.day}
                >
                  <div className="flex items-start gap-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#8a2029] font-display text-lg text-[#f4ca62]">
                      {index + 1}
                    </span>
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-[#a64a42]">
                        {festivalDay.day} · {festivalDay.avatar}
                      </span>
                      <h3 className="mt-1 font-display text-xl leading-snug font-semibold text-[#531920]">
                        {festivalDay.decoration}
                      </h3>
                    </div>
                  </div>
                  <div className="mt-5 border-t border-[#ead8bd] pt-4">
                    {festivalDay.special && (
                      <div className="mb-4 rounded-xl bg-[#f7e6b6] px-4 py-3 text-sm font-bold text-[#7b2427]">
                        {festivalDay.special} · Special pooja and blessings for
                        children
                      </div>
                    )}
                    <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#9a302f]">
                      Main Prasadam
                    </span>
                    <p className="mt-2 text-sm leading-6 text-[#755b57]">
                      {festivalDay.prasadam}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="sevas" className="bg-[#f6ead7] py-24 sm:py-28">
          <div className="mx-auto max-w-7xl px-5 lg:px-10">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#a22a31]">
                Offer with devotion
              </p>
              <h2 className="mt-4 font-display text-5xl font-semibold text-[#531920]">
                Choose your Pooja Seva
              </h2>
              <p className="mt-4 leading-7 text-[#755b57]">
                Every offering is performed with your family&apos;s sankalpa
                and shared with you as divine prasadam.
              </p>
            </div>
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {services.map((service, index) => (
                <article
                  className="group relative overflow-hidden rounded-[2rem] border border-[#e6d0b2] bg-[#fffaf1] p-8 transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#6b2520]/10"
                  key={service.title}
                >
                  <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-full bg-[#8a2029] text-[#f3c75c]">
                    <span className="font-display text-xl">0{index + 1}</span>
                  </div>
                  <h3 className="font-display text-3xl font-semibold text-[#561a22]">
                    {service.title}
                  </h3>
                  <p className="mt-3 min-h-14 text-sm leading-6 text-[#79615d]">
                    {service.description}
                  </p>
                  <div className="mt-8 flex items-end justify-between border-t border-[#eadbc7] pt-6">
                    <span className="text-sm font-semibold text-[#8a2029]">
                      Select this seva
                    </span>
                    <a
                      aria-label={`Select ${service.title}`}
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-[#b94b3c] text-[#9b292f] transition group-hover:bg-[#8a2029] group-hover:text-white"
                      href="#register"
                    >
                      <Icon className="h-4 w-4">
                        <path d="M5 12h14" />
                        <path d="m14 7 5 5-5 5" />
                      </Icon>
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="schedule" className="bg-[#721c25] py-20 text-white">
          <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 lg:grid-cols-[0.8fr_1.2fr] lg:px-10">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#efbe4c]">
                Daily programme
              </p>
              <h2 className="mt-4 font-display text-5xl font-semibold">
                Worship together,
                <span className="block italic text-[#f2c85e]">every day</span>
              </h2>
              <p className="mt-5 max-w-md leading-7 text-white/70">
                Join us each evening for the day&apos;s special alankaram,
                Durga pooja and arati. Please arrive a little early for seating.
              </p>
            </div>
            <div className="overflow-hidden rounded-3xl border border-white/15 bg-[#7d222b] p-8 sm:p-10">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#eabf61]">
                Every evening
              </span>
              <strong className="mt-4 block font-display text-5xl text-white sm:text-6xl">
                7:00 PM
              </strong>
              <span className="mt-3 block text-base text-white/75">
                Navaratri Durga Pooja &amp; Deepa Arati
              </span>
            </div>
          </div>
        </section>

        <section id="register" className="relative overflow-hidden py-24 sm:py-28">
          <div className="absolute -left-32 top-1/3 h-96 w-96 rounded-full bg-[#f1c965]/20 blur-3xl" />
          <div className="relative mx-auto grid max-w-6xl gap-12 px-5 lg:grid-cols-[0.75fr_1.25fr] lg:px-10">
            <div className="pt-4">
              <div className="mb-6"><LotusMark /></div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#a22a31]">
                Reserve your pooja
              </p>
              <h2 className="mt-4 font-display text-5xl leading-[1.05] font-semibold text-[#531920]">
                Register your
                <span className="block italic text-[#b74932]">family sankalpa</span>
              </h2>
              <p className="mt-6 max-w-md leading-7 text-[#735b57]">
                Complete the form and our temple coordinator will contact you
                to confirm your seva and offering.
              </p>
              <div className="mt-9 space-y-4 text-sm text-[#674e4b]">
                <p className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f4e3c4] text-[#92272e]">
                    <Icon className="h-4 w-4"><path d="m5 12 4 4L19 6" /></Icon>
                  </span>
                  Prasadam available after the pooja
                </p>
                <p className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f4e3c4] text-[#92272e]">
                    <Icon className="h-4 w-4"><path d="m5 12 4 4L19 6" /></Icon>
                  </span>
                  Confirmation by phone or email
                </p>
              </div>
            </div>

            <div className="rounded-[2rem] border border-[#ead8bd] bg-white p-6 shadow-2xl shadow-[#6d2420]/10 sm:p-10">
              {submitted ? (
                <div className="flex min-h-[520px] flex-col items-center justify-center text-center">
                  <div className="w-full max-w-lg overflow-hidden rounded-3xl border-2 border-[#e7b840] bg-[#fffdf8] shadow-xl shadow-[#6d2420]/10">
                    <div className="bg-gradient-to-br from-[#6e1720] to-[#a72b32] px-6 py-7 text-white">
                      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border-2 border-[#f3ca60] text-[#f3ca60]">
                        <LotusMark />
                      </div>
                      <p className="mt-3 font-display text-2xl font-semibold">
                        Jai Bhavani Youth Association
                      </p>
                      <p className="mt-1 text-xs font-bold uppercase tracking-[0.2em] text-[#f8dc92]">
                        Navaratri Durga Pooja
                      </p>
                    </div>
                    <div className="px-6 py-6">
                      <span className="rounded-full bg-[#efbd49] px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#591820]">
                        Registration Confirmed
                      </span>
                      <p className="mt-6 text-xs font-bold uppercase tracking-widest text-[#9b7062]">
                        Registration Number
                      </p>
                      <p className="mt-1 text-xl font-bold tracking-wider text-[#8b2029]">
                        {latestRegistration?.id}
                      </p>
                      <div className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-[#edd8b4] bg-[#edd8b4] text-left">
                        <div className="bg-[#fffaf1] p-4">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#a15147]">
                            Devotee
                          </span>
                          <strong className="mt-1 block text-sm text-[#531920]">
                            {latestRegistration?.name}
                          </strong>
                        </div>
                        <div className="bg-[#fffaf1] p-4">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#a15147]">
                            Devotees
                          </span>
                          <strong className="mt-1 block text-sm text-[#531920]">
                            {latestRegistration?.devotees}
                          </strong>
                        </div>
                        <div className="col-span-2 bg-[#fffaf1] p-4">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#a15147]">
                            Pooja Seva
                          </span>
                          <strong className="mt-1 block text-sm text-[#531920]">
                            {latestRegistration?.seva}
                          </strong>
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="mt-4 max-w-md leading-7 text-[#78615d]">
                    Your colorful receipt is ready. Download it to save, open
                    or print for your temple visit.
                  </p>
                  <div className="mt-8 flex flex-wrap justify-center gap-3">
                    <button
                      className="rounded-full bg-[#8c252c] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#721a22]"
                      onClick={downloadReceipt}
                      type="button"
                    >
                      Download colorful receipt
                    </button>
                    <button
                      className="rounded-full border border-[#9b2b32] px-6 py-3 text-sm font-semibold text-[#8c252c] transition hover:bg-[#8c252c] hover:text-white"
                      onClick={() => setSubmitted(false)}
                      type="button"
                    >
                      Add another registration
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <label className="text-sm font-semibold text-[#54282a]">
                      Full name
                      <input className={inputClass} name="name" placeholder="Enter your full name" required />
                    </label>
                    <label className="text-sm font-semibold text-[#54282a]">
                      Phone number
                      <input className={inputClass} name="phone" placeholder="+91 98765 43210" required type="tel" />
                    </label>
                    <label className="text-sm font-semibold text-[#54282a]">
                      Email address
                      <input className={inputClass} name="email" placeholder="you@example.com" required type="email" />
                    </label>
                    <label className="text-sm font-semibold text-[#54282a]">
                      Number of devotees
                      <select className={inputClass} defaultValue="1" name="devotees">
                        <option value="1">1 devotee</option>
                        <option value="2">2 devotees</option>
                        <option value="3">3 devotees</option>
                        <option value="4+">4 or more devotees</option>
                      </select>
                    </label>
                    <label className="text-sm font-semibold text-[#54282a] sm:col-span-2">
                      Select pooja seva
                      <select className={inputClass} defaultValue="" name="seva" required>
                        <option disabled value="">Choose a seva</option>
                        <option>Daily Archana</option>
                        <option>Kumkum Archana</option>
                        <option>
                          Children’s Special Pooja — Day 5 · Sri Saraswati Devi
                        </option>
                      </select>
                    </label>
                    <label className="text-sm font-semibold text-[#54282a] sm:col-span-2">
                      Preferred festival day
                      <select
                        className={inputClass}
                        name="festivalDay"
                        onChange={(event) =>
                          setSelectedFestivalDay(event.target.value)
                        }
                        required
                        value={selectedFestivalDay}
                      >
                        <option disabled value="">Choose a festival day</option>
                        {festivalDays.map((festivalDay) => (
                          <option key={festivalDay.day} value={festivalDay.day}>
                            {festivalDay.day} — {festivalDay.decoration} / {festivalDay.avatar}
                            {festivalDay.special ? " — Children’s Special Day" : ""}
                          </option>
                        ))}
                      </select>
                    </label>
                    {selectedFestivalDay && (() => {
                      const selectedDay = festivalDays.find(
                        (festivalDay) =>
                          festivalDay.day === selectedFestivalDay,
                      );
                      if (!selectedDay) return null;
                      const items = [
                        `Prepared prasadam: ${selectedDay.prasadam}`,
                        "Fresh flowers or one flower garland",
                        "One bottle of sesame oil or ghee for the deepam",
                        "Sambrani, incense sticks and camphor",
                        "Two coconuts and seasonal fruits",
                        "Turmeric, kumkum, betel leaves and betel nuts",
                        "A clean reusable bag or container for prasadam",
                        ...(selectedDay.specialItems
                          ? [selectedDay.specialItems]
                          : []),
                      ];
                      return (
                        <div className="sm:col-span-2 rounded-2xl border border-[#e4c58b] bg-[#fff4d8] p-5">
                          <div className="flex items-start gap-3">
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#8d242c] text-[#f4ca62]">
                              <LotusMark />
                            </span>
                            <div>
                              <p className="font-display text-xl font-semibold text-[#641d24]">
                                What to bring for {selectedDay.day}
                              </p>
                              <p className="mt-1 text-xs leading-5 text-[#82645b]">
                                {selectedDay.decoration} · {selectedDay.avatar}
                              </p>
                            </div>
                          </div>
                          <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                            {items.map((item) => (
                              <li
                                className="flex items-start gap-2.5 text-sm leading-5 text-[#624b47]"
                                key={item}
                              >
                                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#edd493] text-[#7d2429]">
                                  <Icon className="h-3 w-3">
                                    <path d="m5 12 4 4L19 6" />
                                  </Icon>
                                </span>
                                {item}
                              </li>
                            ))}
                          </ul>
                          <p className="mt-4 border-t border-[#e6ce9c] pt-4 text-xs leading-5 text-[#8b6d63]">
                            Please bring only what is convenient. The temple
                            team will confirm final quantities and any
                            day-specific requirements before the pooja.
                          </p>
                        </div>
                      );
                    })()}
                    <label className="text-sm font-semibold text-[#54282a] sm:col-span-2">
                      Family gotra / sankalpa names
                      <textarea
                        className={`${inputClass} min-h-28 resize-none`}
                        name="sankalpa"
                        placeholder="Add gotra and family names for the pooja"
                      />
                    </label>
                  </div>
                  <label className="mt-5 flex cursor-pointer items-start gap-3 text-sm leading-6 text-[#735c58]">
                    <input className="mt-1 h-4 w-4 accent-[#8d242c]" required type="checkbox" />
                    I confirm these details are correct and agree to be
                    contacted by the temple team.
                  </label>
                  <button
                    className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#8d242c] px-7 py-4 text-sm font-bold text-white transition hover:bg-[#721a22] focus:ring-4 focus:ring-[#8d242c]/20"
                    type="submit"
                  >
                    Complete Registration
                    <Icon className="h-4 w-4">
                      <path d="M5 12h14" />
                      <path d="m14 7 5 5-5 5" />
                    </Icon>
                  </button>
                  <p className="mt-4 text-center text-xs text-[#9a8580]">
                    Your details are kept private and used only for pooja coordination.
                  </p>
                </form>
              )}
            </div>
          </div>
        </section>

      </main>

      <footer className="border-t border-[#ead8bd] bg-[#fff7e9]">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 px-5 py-8 text-center sm:flex-row sm:text-left lg:px-10">
          <div className="flex items-center gap-3 text-[#681c24]">
            <LotusMark />
            <div>
              <strong className="font-display text-lg">
                Jai Bhavani Youth Association
              </strong>
              <a
                className="mt-1 block max-w-md text-xs leading-5 text-[#8a706b] transition hover:text-[#681c24]"
                href={venueMapUrl}
                rel="noreferrer"
                target="_blank"
              >
                {venueAddress}
              </a>
            </div>
          </div>
          <p className="text-xs text-[#8d746e]">
            May Maa Durga bless every home with strength, peace and abundance.
          </p>
        </div>
      </footer>
    </div>
  );
}
