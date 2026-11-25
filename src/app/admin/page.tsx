"use client";
import { useEffect, useState } from "react";
import {
  LockKeyhole,
  LayoutDashboard,
  Images,
  Film,
  Armchair,
  Inbox,
  Settings,
  LogOut,
  RefreshCw,
  UploadCloud,
  Trash2,
  CheckCircle2,
  Menu,
  X,
  ExternalLink,
} from "lucide-react";

type MediaItem = {
  _id: string;
  publicId: string;
  url: string;
  type: string;
  title: string;
  description?: string;
  category?: string;
  price?: number | null;
  format?: string;
  createdAt?: string;
};
type EnquiryItem = {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  projectType?: string;
  message?: string;
  status: string;
  createdAt: string;
};
type Product = {
  _id: string;
  title: string;
  description: string;
  category: string;
  price?: number | null;
  imageUrl: string;
  active: boolean;
};
const nav = [
  ["overview", "Overview", LayoutDashboard],
  ["portfolio", "Portfolio", Images],
  ["films", "Films & videos", Film],
  ["furniture", "Furniture", Armchair],
  ["enquiries", "Enquiries", Inbox],
  ["settings", "Website settings", Settings],
] as const;
const blankSettings = {
  companyName: "M Square Interiors",
  email: "hello@msquareinteriors.com",
  phone: "",
  address: "#203, V V Centre, Palarivattom, Cochin - 682025",
  instagram: "",
  whatsapp: "",
  homepageIntro: "",
};

export default function AdminPage() {
  const [logged, setLogged] = useState(false),
    [checking, setChecking] = useState(true);
  const [username, setUsername] = useState(""),
    [password, setPassword] = useState("");
  const [section, setSection] = useState("overview"),
    [mobileNav, setMobileNav] = useState(false);
  const [stats, setStats] = useState({
    photos: 0,
    videos: 0,
    products: 0,
    enquiries: 0,
    newEnquiries: 0,
  });
  const [recent, setRecent] = useState<EnquiryItem[]>([]),
    [media, setMedia] = useState<MediaItem[]>([]),
    [products, setProducts] = useState<Product[]>([]),
    [enquiries, setEnquiries] = useState<EnquiryItem[]>([]);
  const [settings, setSettings] = useState<any>(blankSettings);
  const [kind, setKind] = useState("photo"),
    [file, setFile] = useState<File | null>(null),
    [title, setTitle] = useState(""),
    [description, setDescription] = useState(""),
    [price, setPrice] = useState(""),
    [category, setCategory] = useState("Living Room");
  const [busy, setBusy] = useState(false),
    [message, setMessage] = useState(""),
    [error, setError] = useState("");
  const [editing, setEditing] = useState<Product | null>(null);
  const api = async (url: string, options?: RequestInit) => {
    const r = await fetch(url, options);
    const d = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(d.error || "Request failed");
    return d;
  };
  async function refreshAll() {
    const [dash, lib, prod, inq, sett] = await Promise.all([
      api("/api/admin/dashboard"),
      api("/api/admin/media"),
      api("/api/admin/furniture"),
      api("/api/admin/enquiries"),
      api("/api/admin/settings"),
    ]);
    setStats(dash.stats);
    setRecent(dash.recent || []);
    setMedia([...lib.photos, ...lib.videos, ...lib.products]);
    setProducts(prod.items || []);
    setEnquiries(inq.items || []);
    setSettings({ ...blankSettings, ...sett.settings });
  }
  useEffect(() => {
    (async () => {
      try {
        await refreshAll();
        setLogged(true);
      } catch (e: any) {
        if (!String(e.message).includes("Unauthorized")) setError(e.message);
      } finally {
        setChecking(false);
      }
    })();
  }, []);
  async function login(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await api("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      await refreshAll();
      setLogged(true);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    setLogged(false);
    setSection("overview");
  }
  async function upload(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("kind", section === "films" ? "video" : "photo");
      fd.append("title", title);
      fd.append("description", description);
      fd.append("price", price);
      fd.append("category", category);
      await api("/api/admin/upload", { method: "POST", body: fd });
      setMessage("Uploaded successfully and saved to MongoDB.");
      setFile(null);
      setTitle("");
      setDescription("");
      setPrice("");
      await refreshAll();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  async function updateStatus(id: string, status: string) {
    try {
      await api("/api/admin/enquiries", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      await refreshAll();
    } catch (e: any) {
      setError(e.message);
    }
  }
  async function deleteMedia(id: string) {
    if (!confirm("Delete this media file from the website and Cloudinary?"))
      return;
    try {
      await api("/api/admin/media", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      await refreshAll();
    } catch (e: any) {
      setError(e.message);
    }
  }
  async function deleteEnquiry(id: string) {
    if (!confirm("Delete this enquiry permanently?")) return;
    try {
      await api("/api/admin/enquiries", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      await refreshAll();
    } catch (e: any) {
      setError(e.message);
    }
  }
  async function saveProduct(e: React.FormEvent) {
    e.preventDefault();
    if (!editing) return;
    setBusy(true);
    try {
      await api("/api/admin/furniture", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...editing, id: editing._id }),
      });
      setEditing(null);
      setMessage("Furniture listing updated.");
      await refreshAll();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  async function deleteProduct(id: string) {
    if (!confirm("Delete this furniture listing?")) return;
    try {
      await api("/api/admin/furniture", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      await refreshAll();
    } catch (e: any) {
      setError(e.message);
    }
  }
  async function saveSettings(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      await api("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      setMessage("Website settings saved to MongoDB.");
    } catch (e: any) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  if (checking)
    return (
      <main className="admin-shell">
        <p>Loading studio dashboard…</p>
      </main>
    );
  if (!logged)
    return (
      <main className="admin-shell admin-login">
        <form className="admin-login-card" onSubmit={login}>
          <p className="admin-eyebrow">M Square INTERIORS / PRIVATE ACCESS</p>
          <LockKeyhole size={30} />
          <h1>
            Studio
            <br />
            <em>control room.</em>
          </h1>
          <p>
            Sign in to manage your website, portfolio, furniture and customer
            enquiries.
          </p>
          <label>
            Username
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              required
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </label>
          {error && <p className="admin-error">{error}</p>}
          <button disabled={busy}>
            {busy ? "Signing in…" : "Enter studio ↗"}
          </button>
          <small>Admin access only · 12-hour secure session</small>
        </form>
      </main>
    );
  const titleText = nav.find((n) => n[0] === section)?.[1] || "Overview";
  return (
    <main className="admin-dashboard">
      <aside className={`admin-sidebar ${mobileNav ? "is-open" : ""}`}>
        <div className="admin-brand">
          <img
            className="admin-brand-logo"
            src="/images/m2-admin-logo.png"
            alt="M Square Interiors — Spaces That Inspire"
          />
          <button
            className="admin-mobile-close"
            onClick={() => setMobileNav(false)}
          >
            <X />
          </button>
        </div>
        <p className="admin-nav-label">WORKSPACE</p>
        <nav>
          {nav.map(([id, label, Icon]) => (
            <button
              key={id}
              className={section === id ? "active" : ""}
              onClick={() => {
                setSection(id);
                setMobileNav(false);
                setError("");
                setMessage("");
              }}
            >
              <Icon size={17} />
              {label}
              {id === "enquiries" && stats.newEnquiries > 0 && (
                <i>{stats.newEnquiries}</i>
              )}
            </button>
          ))}
        </nav>
        <div className="admin-sidebar-bottom">
          <span className="admin-online-dot" /> Studio workspace active
          <button onClick={logout}>
            <LogOut size={16} /> Sign out
          </button>
        </div>
      </aside>
      {mobileNav && (
        <button
          className="admin-mobile-backdrop"
          onClick={() => setMobileNav(false)}
          aria-label="Close menu"
        />
      )}
      <section className="admin-main">
        <header className="admin-dash-top">
          <button
            className="admin-mobile-menu"
            onClick={() => setMobileNav(true)}
          >
            <Menu />
          </button>
          <div>
            <p>M Square INTERIORS / MANAGEMENT</p>
            <h1>{titleText}</h1>
          </div>
          <div className="admin-top-actions">
            <a href="/" target="_blank">
              View website <ExternalLink size={14} />
            </a>
            <button onClick={() => refreshAll()} title="Refresh dashboard">
              <RefreshCw size={16} />
            </button>
            <span className="admin-avatar">M Square</span>
          </div>
        </header>
        {error && (
          <div className="admin-alert error">
            {error}
            <button onClick={() => setError("")}>×</button>
          </div>
        )}
        {message && (
          <div className="admin-alert success">
            <CheckCircle2 size={16} />
            {message}
            <button onClick={() => setMessage("")}>×</button>
          </div>
        )}
        {section === "overview" && (
          <>
            <div className="admin-welcome">
              <div>
                <p className="admin-eyebrow">YOUR STUDIO AT A GLANCE</p>
                <h2>
                  Good to see you <em>back.</em>
                </h2>
                <p>
                  Manage the digital presence of M Square Interiors from one place.
                </p>
              </div>
              <span>CONTENT MANAGEMENT / 2026</span>
            </div>
            <div className="admin-metric-grid">
              {[
                ["Portfolio photos", stats.photos, Images],
                ["Studio films", stats.videos, Film],
                ["Furniture products", stats.products, Armchair],
                ["Total enquiries", stats.enquiries, Inbox],
              ].map(([label, value, Icon]: any) => (
                <article key={label}>
                  <span>{label}</span>
                  <Icon size={19} />
                  <strong>{value}</strong>
                  <small>
                    {label === "Total enquiries"
                      ? `${stats.newEnquiries} new enquiries`
                      : "Published in your website"}
                  </small>
                </article>
              ))}
            </div>
            <div className="admin-overview-grid">
              <section className="admin-card">
                <div className="admin-card-head">
                  <div>
                    <p className="admin-eyebrow">LATEST ACTIVITY</p>
                    <h3>Recent enquiries</h3>
                  </div>
                  <button onClick={() => setSection("enquiries")}>
                    View all ↗
                  </button>
                </div>
                {recent.length ? (
                  recent.map((q) => (
                    <div className="admin-recent-row" key={q._id}>
                      <div>
                        <b>{q.name}</b>
                        <small>
                          {q.projectType || "Project enquiry"} · {q.phone}
                        </small>
                      </div>
                      <span
                        className={`status-${q.status.toLowerCase().replaceAll(" ", "-")}`}
                      >
                        {q.status}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="admin-empty">
                    New website enquiries will appear here.
                  </p>
                )}
              </section>
              <section className="admin-card admin-quick">
                <p className="admin-eyebrow">QUICK ACTIONS</p>
                <h3>Manage your studio</h3>
                {[
                  ["portfolio", "Upload portfolio photos", Images],
                  ["films", "Add a studio film", Film],
                  ["furniture", "Manage furniture catalogue", Armchair],
                  ["settings", "Edit website details", Settings],
                ].map(([id, label, Icon]: any) => (
                  <button key={id} onClick={() => setSection(id)}>
                    <Icon size={17} />
                    {label}
                    <span>↗</span>
                  </button>
                ))}
              </section>
            </div>
          </>
        )}
        {(section === "portfolio" || section === "films") && (
          <>
            <div className="admin-section-intro">
              <div>
                <p className="admin-eyebrow">CONTENT LIBRARY</p>
                <h2>
                  {section === "portfolio" ? "Portfolio" : "Studio films"}{" "}
                  <em>collection.</em>
                </h2>
                <p>
                  Upload and maintain the content displayed on your public
                  website.
                </p>
              </div>
            </div>
            <div className="admin-content-grid">
              <form className="admin-card admin-new-upload" onSubmit={upload}>
                <p className="admin-eyebrow">ADD TO COLLECTION</p>
                <h3>
                  Upload {section === "portfolio" ? "photograph" : "film"}.
                </h3>
                <label>
                  Title
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    placeholder="Content title"
                  />
                </label>
                <label>
                  Description
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Short description"
                  />
                </label>
                {section === "portfolio" && (
                  <label>
                    Category
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    >
                      {[
                        "Living Room",
                        "Kitchen",
                        "Bedroom",
                        "Dining",
                        "Bathroom",
                        "Commercial",
                        "Other",
                      ].map((v) => (
                        <option key={v}>{v}</option>
                      ))}
                    </select>
                  </label>
                )}
                <label className="admin-dropzone">
                  <UploadCloud size={24} />
                  <b>{file ? file.name : "Choose a file"}</b>
                  <small>
                    {section === "portfolio"
                      ? "JPG, PNG, WEBP"
                      : "MP4 and other video formats"}{" "}
                    · Max 100 MB
                  </small>
                  <input
                    type="file"
                    accept={
                      section === "portfolio"
                        ? "image/*"
                        : "video/mp4,video/quicktime,video/webm,video/*"
                    }
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    required
                  />
                </label>
                <button className="admin-primary" disabled={busy || !file}>
                  {busy ? "Uploading…" : "Upload to website ↗"}
                </button>
              </form>
              <section className="admin-card">
                <div className="admin-card-head">
                  <div>
                    <p className="admin-eyebrow">PUBLISHED CONTENT</p>
                    <h3>
                      {section === "portfolio"
                        ? "Portfolio photographs"
                        : "Studio films"}
                    </h3>
                  </div>
                  <span>
                    {
                      media.filter(
                        (m) =>
                          m.type ===
                          (section === "portfolio" ? "photo" : "video"),
                      ).length
                    }{" "}
                    items
                  </span>
                </div>
                <div className="admin-asset-grid">
                  {media
                    .filter(
                      (m) =>
                        m.type ===
                        (section === "portfolio" ? "photo" : "video"),
                    )
                    .map((m) => (
                      <article key={m._id}>
                        <div>
                          {m.type === "video" ? (
                            <video src={m.url} controls />
                          ) : (
                            <img src={m.url} alt={m.title} />
                          )}
                        </div>
                        <b>{m.title}</b>
                        <small>{m.category || m.format}</small>
                        <button
                          className="admin-media-delete"
                          onClick={() => deleteMedia(m._id)}
                        >
                          <Trash2 size={13} /> Delete
                        </button>
                      </article>
                    ))}
                </div>
              </section>
            </div>
          </>
        )}
        {section === "furniture" && (
          <>
            <div className="admin-section-intro">
              <div>
                <p className="admin-eyebrow">M Square OBJECTS</p>
                <h2>
                  Furniture <em>catalogue.</em>
                </h2>
                <p>
                  Products added here are shown on the public Furniture page.
                </p>
              </div>
            </div>
            <div className="admin-card">
              <div className="admin-card-head">
                <div>
                  <p className="admin-eyebrow">PRODUCT INVENTORY</p>
                  <h3>Furniture listings</h3>
                </div>
                <span>{products.length} products</span>
              </div>
              {products.length ? (
                <div className="admin-product-list">
                  {products.map((p) => (
                    <article key={p._id}>
                      <img src={p.imageUrl} alt={p.title} />
                      <div className="admin-product-info">
                        <b>{p.title}</b>
                        <small>
                          {p.category} ·{" "}
                          {p.price != null
                            ? `₹${Number(p.price).toLocaleString("en-IN")}`
                            : "Price on request"}
                        </small>
                        <span>
                          {p.active
                            ? "Visible on website"
                            : "Hidden from website"}
                        </span>
                      </div>
                      <button onClick={() => setEditing({ ...p })}>Edit</button>
                      <button
                        className="danger"
                        onClick={() => deleteProduct(p._id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </article>
                  ))}
                </div>
              ) : (
                <p className="admin-empty">
                  No furniture listings yet. Upload a furniture product to get
                  started.
                </p>
              )}
            </div>
            {editing && (
              <div className="admin-modal-backdrop">
                <form className="admin-modal" onSubmit={saveProduct}>
                  <button
                    type="button"
                    className="admin-modal-close"
                    onClick={() => setEditing(null)}
                  >
                    ×
                  </button>
                  <p className="admin-eyebrow">EDIT PRODUCT</p>
                  <h3>{editing.title}</h3>
                  <label>
                    Product name
                    <input
                      value={editing.title}
                      onChange={(e) =>
                        setEditing({ ...editing, title: e.target.value })
                      }
                    />
                  </label>
                  <label>
                    Description
                    <textarea
                      value={editing.description || ""}
                      onChange={(e) =>
                        setEditing({ ...editing, description: e.target.value })
                      }
                    />
                  </label>
                  <label>
                    Category
                    <input
                      value={editing.category || ""}
                      onChange={(e) =>
                        setEditing({ ...editing, category: e.target.value })
                      }
                    />
                  </label>
                  <label>
                    Price (INR)
                    <input
                      type="number"
                      value={editing.price ?? ""}
                      onChange={(e) =>
                        setEditing({
                          ...editing,
                          price:
                            e.target.value === ""
                              ? null
                              : Number(e.target.value),
                        })
                      }
                    />
                  </label>
                  <label className="admin-check">
                    <input
                      type="checkbox"
                      checked={editing.active}
                      onChange={(e) =>
                        setEditing({ ...editing, active: e.target.checked })
                      }
                    />{" "}
                    Visible on public website
                  </label>
                  <button className="admin-primary" disabled={busy}>
                    Save changes
                  </button>
                </form>
              </div>
            )}
          </>
        )}
        {section === "enquiries" && (
          <>
            <div className="admin-section-intro">
              <div>
                <p className="admin-eyebrow">CLIENT RELATIONSHIPS</p>
                <h2>
                  Customer <em>enquiries.</em>
                </h2>
                <p>
                  Every enquiry submitted through the website is stored in
                  MongoDB.
                </p>
              </div>
            </div>
            <div className="admin-card">
              <div className="admin-card-head">
                <div>
                  <p className="admin-eyebrow">INBOX</p>
                  <h3>All enquiries</h3>
                </div>
                <span>{enquiries.length} total</span>
              </div>
              {enquiries.length ? (
                <div className="admin-enquiry-list">
                  {enquiries.map((q) => (
                    <article key={q._id}>
                      <div className="admin-enquiry-main">
                        <b>{q.name}</b>
                        <small>
                          {q.phone}
                          {q.email ? ` · ${q.email}` : ""} · {q.projectType}
                        </small>
                        <p>{q.message || "No additional project details."}</p>
                        <time>{new Date(q.createdAt).toLocaleString()}</time>
                      </div>
                      <select
                        value={q.status}
                        onChange={(e) => updateStatus(q._id, e.target.value)}
                      >
                        {["New", "Contacted", "In Progress", "Completed"].map(
                          (s) => (
                            <option key={s}>{s}</option>
                          ),
                        )}
                      </select>
                      <button
                        className="danger"
                        onClick={() => deleteEnquiry(q._id)}
                        title="Delete enquiry"
                      >
                        <Trash2 size={16} />
                      </button>
                    </article>
                  ))}
                </div>
              ) : (
                <p className="admin-empty">No enquiries received yet.</p>
              )}
            </div>
          </>
        )}
        {section === "settings" && (
          <>
            <div className="admin-section-intro">
              <div>
                <p className="admin-eyebrow">WEBSITE CONFIGURATION</p>
                <h2>
                  Studio <em>settings.</em>
                </h2>
                <p>Manage the business contact information saved in MongoDB.</p>
              </div>
            </div>
            <form
              className="admin-card admin-settings-form"
              onSubmit={saveSettings}
            >
              <p className="admin-eyebrow">BUSINESS INFORMATION</p>
              <div className="admin-settings-grid">
                {[
                  ["companyName", "Company name"],
                  ["email", "Contact email"],
                  ["phone", "Phone number"],
                  ["address", "Studio address"],
                  ["instagram", "Instagram URL"],
                  ["whatsapp", "WhatsApp number"],
                ].map(([key, label]) => (
                  <label key={key}>
                    {label}
                    <input
                      value={settings[key] || ""}
                      onChange={(e) =>
                        setSettings({ ...settings, [key]: e.target.value })
                      }
                    />
                  </label>
                ))}
              </div>
              <label>
                Homepage introduction
                <textarea
                  value={settings.homepageIntro || ""}
                  onChange={(e) =>
                    setSettings({ ...settings, homepageIntro: e.target.value })
                  }
                  placeholder="Optional studio introduction"
                />
              </label>
              <button className="admin-primary" disabled={busy}>
                Save website settings ↗
              </button>
            </form>
          </>
        )}
        <footer className="admin-footer">
          M Square INTERIORS <span>PRIVATE MANAGEMENT AREA</span>
          <span>SECURE STUDIO SESSION</span>
        </footer>
      </section>
    </main>
  );
}
