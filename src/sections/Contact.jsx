import { useRef, useState } from "react";
import gsap from "gsap";
import { projectTypes } from "../data/site";
import { useMagnetic } from "../animations/useMagnetic";
import { btnPrimary, display, eyebrow, field, wrap } from "../styles/classes";

export default function Contact() {
  const formRef = useRef(null);
  const btnRef = useRef(null);
  const flashRef = useRef(null);
  useMagnetic(btnRef, { strength: 0.3 });
  const [status, setStatus] = useState("idle");
  const [errors, setErrors] = useState({});

  const validate = (data) => {
    const next = {};
    if (!data.name.trim()) next.name = "Name is required.";
    if (!data.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
      next.email = "A valid email is required.";
    if (!data.message.trim()) next.message = "Tell us a little about the work.";
    return next;
  };

  const onSubmit = (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const data = Object.fromEntries(form.entries());
    const next = validate(data);
    setErrors(next);
    if (Object.keys(next).length) return;

    setStatus("sending");
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (!reduced && flashRef.current) {
      gsap.fromTo(
        flashRef.current,
        { opacity: 0 },
        { opacity: 0.7, duration: 0.08, yoyo: true, repeat: 3 },
      );
    }

    window.setTimeout(
      () => {
        setStatus("sent");
        event.target.reset();
      },
      reduced ? 200 : 900,
    );
  };

  return (
    <section
      className="relative grid min-h-screen items-center bg-bg py-[14vh]"
      id="contact"
    >
      <div
        className={`${wrap} grid items-start gap-16 max-lg:grid-cols-1 max-lg:gap-8 lg:grid-cols-2`}
      >
        <div>
          <p className={eyebrow}>TRANSMISSION</p>
          <h2 className={display}>
            READY TO
            <br />
            MAKE SOME
            <br />
            THUNDER?
          </h2>
          <p className="mt-5 max-w-md text-muted" data-cursor="text">
            Share a message. We will return with a point of view, a plan, and
            the voltage to build it.
          </p>
        </div>

        <form
          className="relative grid grid-cols-1 gap-x-5 gap-y-4 md:grid-cols-2"
          ref={formRef}
          onSubmit={onSubmit}
          noValidate
        >
          <div
            ref={flashRef}
            className="pointer-events-none absolute inset-[-8%] bg-[radial-gradient(circle_at_70%_90%,rgba(110,200,255,0.35),transparent_40%)] opacity-0"
            aria-hidden="true"
          />
          <label className="flex flex-col gap-1.5 text-[0.68rem] tracking-[0.18em] text-muted">
            <span>NAME</span>
            <input
              className={field}
              name="name"
              type="text"
              autoComplete="name"
              aria-invalid={Boolean(errors.name)}
            />
            {errors.name && (
              <em className="text-xs not-italic tracking-normal text-[#f0b4b4]">
                {errors.name}
              </em>
            )}
          </label>
          <label className="flex flex-col gap-1.5 text-[0.68rem] tracking-[0.18em] text-muted">
            <span>EMAIL</span>
            <input
              className={field}
              name="email"
              type="email"
              autoComplete="email"
              aria-invalid={Boolean(errors.email)}
            />
            {errors.email && (
              <em className="text-xs not-italic tracking-normal text-[#f0b4b4]">
                {errors.email}
              </em>
            )}
          </label>
          <label className="flex flex-col gap-1.5 text-[0.68rem] tracking-[0.18em] text-muted">
            <span>COMPANY</span>
            <input
              className={field}
              name="company"
              type="text"
              autoComplete="organization"
            />
          </label>
          <label className="flex flex-col gap-1.5 text-[0.68rem] tracking-[0.18em] text-muted">
            <span>PROJECT TYPE</span>
            <select
              className={field}
              name="type"
              defaultValue={projectTypes[0]}
            >
              {projectTypes.map((type) => (
                <option key={type}>{type}</option>
              ))}
            </select>
          </label>
          <label className="col-span-full flex flex-col gap-1.5 text-[0.68rem] tracking-[0.18em] text-muted">
            <span>MESSAGE</span>
            <textarea
              className={field}
              name="message"
              rows={5}
              aria-invalid={Boolean(errors.message)}
            />
            {errors.message && (
              <em className="text-xs not-italic tracking-normal text-[#f0b4b4]">
                {errors.message}
              </em>
            )}
          </label>
          <button
            ref={btnRef}
            type="submit"
            className={`${btnPrimary} group relative col-span-full mt-2.5 justify-self-start after:absolute after:-inset-2.5 after:border after:border-transparent after:opacity-0 after:transition-opacity hover:after:border-blue/45 hover:after:opacity-100 hover:after:shadow-[0_0_24px_rgba(61,158,255,0.2)] cursor-pointer`}
            data-cursor="button"
            data-cursor-label="SEND"
            disabled={status === "sending"}
          >
            <span className="text-white transition-colors duration-300 group-hover:text-black">
              {status === "sending" ? "MESSAGE ENERGY…" : "SEND MESSAGE"}
            </span>
          </button>
          {status === "sent" && (
            <p className="col-span-full m-0 font-display tracking-[0.18em] text-ice">
              MESSAGE SENT.
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
