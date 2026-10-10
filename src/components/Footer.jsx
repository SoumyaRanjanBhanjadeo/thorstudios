import { LogoMark } from "./LogoMark";
import { navLinks, site } from "../data/site";
import { wrap } from "../styles/classes";
import { openPrivacyPolicy } from "../lib/privacy";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative z-2 border-t border-ink/10 bg-bg pt-20 pb-8">
      <div className={wrap}>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.2fr_1fr] lg:gap-12">
          <div>
            <a href="#top" className="mb-4 inline-block" aria-label={site.name}>
              <LogoMark variant="wordmark" />
            </a>
            <p className="mt-4 max-w-md text-muted">{site.footerBlurb}</p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <p className="font-ui text-[0.68rem] tracking-[0.2em] text-gold uppercase">
                Navigate
              </p>
              {navLinks.map((link) => (
                <a
                  key={link.id}
                  className="mt-1.5 block text-muted hover:text-ink"
                  href={`#${link.id}`}
                  data-cursor="link"
                >
                  {link.label.charAt(0) + link.label.slice(1).toLowerCase()}
                </a>
              ))}
            </div>
            <div>
              <p className="font-ui text-[0.68rem] tracking-[0.2em] text-gold uppercase">
                Connect
              </p>
              <a
                className="mt-1.5 block text-muted hover:text-ink"
                href={site.instagram}
                data-cursor="link"
                target="_blank"
                rel="noreferrer"
              >
                Instagram
              </a>
              <a
                className="mt-1.5 block text-muted hover:text-ink"
                href={site.linkedin}
                data-cursor="link"
                target="_blank"
                rel="noreferrer"
              >
                LinkedIn
              </a>
              <a
                className="mt-1.5 block text-muted hover:text-ink"
                href={`mailto:${site.email}`}
                data-cursor="link"
              >
                {site.email}
              </a>
            </div>
          </div>
        </div>
        <div className="mt-14 flex flex-col justify-between gap-4 border-t border-ink/10 pt-5 text-sm text-muted md:flex-row">
          <small>
            © {year} {site.name}. All rights reserved.{" "}
            <button
              type="button"
              className="border-0 bg-transparent p-0 text-muted underline decoration-ink/20 underline-offset-4 hover:text-ink cursor-pointer"
              data-cursor="link"
              onClick={openPrivacyPolicy}
            >
              Privacy
            </button>
          </small>
          <strong className="font-display text-lg font-normal tracking-tight text-ink">
            Play Without Limits.
          </strong>
        </div>
      </div>
    </footer>
  );
}
