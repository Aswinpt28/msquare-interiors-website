"use client";

import { useState } from "react";
import {
  ArrowUpRight,
  MapPin,
  Mail,
  Phone,
  Instagram,
  CheckCircle2,
} from "lucide-react";

export default function Contact() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [type, setType] = useState("Residential interiors");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [failed, setFailed] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setNotice("");
    setFailed(false);
    try {
      const r = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          email,
          projectType: type,
          message,
        }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || "Unable to send enquiry");
      setNotice(
        "Thank you. Your enquiry has reached the M Square Interiors studio. We’ll be in touch soon.",
      );
      setName("");
      setPhone("");
      setEmail("");
      setMessage("");
      setType("Residential interiors");
    } catch (e) {
      setFailed(true);
      setNotice(
        e instanceof Error
          ? e.message
          : "Unable to send enquiry. Please try again.",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="contact-lux-page">
      <section className="contact-lux-hero">
        <div className="contact-lux-heading">
          <p className="eyebrow">M Square INTERIORS / LET’S BEGIN</p>
          <h1>
            Good spaces
            <br />
            begin with
            <br />
            <em>a conversation.</em>
          </h1>
          <p className="contact-lux-lead">
            Whether you’re imagining a new home, rethinking a room or shaping a
            workspace, tell us what you have in mind.
          </p>
          <div className="contact-lux-index">
            <span>01</span>
            <i />
            <span>START A PROJECT</span>
          </div>
        </div>
        <div className="contact-lux-image">
          <img
            src="/images/brand-logo.jpg"
            alt="M Square Interiors residential interior"
          />
          <div className="contact-image-note">
            <span>SPACES WITH PURPOSE</span>
            <span>M Square / INTERIORS</span>
          </div>
        </div>
      </section>

      <section className="contact-lux-main">
        <aside className="contact-lux-aside">
          <p className="eyebrow">TELL US ABOUT YOUR SPACE</p>
          <h2>
            Let’s make
            <br />
            <em>it meaningful.</em>
          </h2>
          <p className="contact-aside-copy">
            A little about your project is all we need to start. Share your
            details and our studio will get back to you.
          </p>
          <div className="contact-info-list">
            <a>
              <span className="contact-info-icon">
                <Mail size={17} />
              </span>
              <span>
                <small>WRITE TO US</small>
                <b>hello@msquareinteriors.com</b>
              </span>
              {/* <ArrowUpRight size={16} /> */}
            </a>
            <div>
              <span className="contact-info-icon">
                <MapPin size={17} />
              </span>
              <span>
                <small>VISIT THE STUDIO</small>
                <b>
                  #203, V V Centre, Palarivattom,
                  <br />
                  Cochin - 682025
                </b>
              </span>
            </div>
          </div>
          {/* <a
            className="contact-map-link"
            href="https://www.google.com/maps/search/?api=1&query=V+V+Centre+Palarivattom+Cochin+682025"
            target="_blank"
            rel="noreferrer"
          >
            GET DIRECTIONS <ArrowUpRight size={15} />
          </a> */}
        </aside>

        <form className="contact-lux-form" onSubmit={submit}>
          <div className="contact-form-heading">
            <span>01 / PROJECT DETAILS</span>
            <p>Fields marked * are required</p>
          </div>
          <div className="contact-form-fields">
            <label>
              <span>YOUR NAME *</span>
              <input
                required
                maxLength={120}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="How should we address you?"
              />
            </label>
            <label>
              <span>PHONE NUMBER *</span>
              <input
                required
                maxLength={40}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91"
              />
            </label>
            <label className="contact-field-full">
              <span>EMAIL ADDRESS</span>
              <input
                type="email"
                maxLength={160}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </label>
            <label className="contact-field-full">
              <span>WHAT ARE YOU PLANNING? *</span>
              <select
                required
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option>Residential interiors</option>
                <option>Modular kitchen</option>
                <option>Living & dining</option>
                <option>Bedroom & wardrobes</option>
                <option>Commercial interiors</option>
                <option>Custom furniture</option>
                <option>Other</option>
              </select>
            </label>
            <label className="contact-field-full">
              <span>TELL US ABOUT YOUR PROJECT</span>
              <textarea
                rows={4}
                maxLength={3000}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Your space, ideas, location or expected timeline…"
              />
            </label>
          </div>
          <div className="contact-form-submit">
            <p>Your details are shared securely with our studio team.</p>
            <button className="contact-send-button" disabled={busy}>
              {busy ? "SENDING…" : "SEND YOUR ENQUIRY"}{" "}
              <ArrowUpRight size={17} />
            </button>
          </div>
          {notice && (
            <p
              className={`contact-form-notice ${failed ? "is-error" : "is-success"}`}
            >
              {!failed && <CheckCircle2 size={17} />}
              {notice}
            </p>
          )}
        </form>
      </section>
      <section className="contact-lux-bottom">
        <span>YOUR SPACE. YOUR STORY.</span>
        <p>
          Let’s create something
          <br />
          <em>worth coming home to.</em>
        </p>
        <a>
          SPEAK WITH OUR STUDIO <ArrowUpRight size={16} />
        </a>
      </section>
    </main>
  );
}
