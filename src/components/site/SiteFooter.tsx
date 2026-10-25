import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Logo } from "./Logo";
import { useContact } from "./contact-context";
import { settingsQuery, SOCIAL_KEYS, whatsappLink } from "@/lib/queries";

const LABELS: Record<string, string> = {
  linkedin: "LinkedIn", instagram: "Instagram", tiktok: "TikTok", x: "X", facebook: "Facebook", youtube: "YouTube", pinterest: "Pinterest",
};

export function SiteFooter() {
  const { data: s } = useQuery(settingsQuery);
  const { open } = useContact();
  const socials = SOCIAL_KEYS.filter((k) => /^https:\/\//.test(s?.[k] ?? ""));
  const wa = whatsappLink(s?.['whatsapp']);
  return (
    <footer className="bg-plum text-petal">
      <div className="container-site grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Logo light />
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-petal/70">
            Shopify specialist helping businesses build, improve and optimise their stores for a better shopping experience.
          </p>
          {(socials.length > 0 || wa) && (
            <ul className="mt-6 flex flex-wrap gap-2">
              {wa && <li><a className="rounded-full border border-petal/25 px-3 py-1.5 text-xs hover:bg-petal hover:text-plum" href={wa} target="_blank" rel="noopener noreferrer">WhatsApp</a></li>}
              {socials.map((k) => (
                <li key={k}><a className="rounded-full border border-petal/25 px-3 py-1.5 text-xs hover:bg-petal hover:text-plum" href={s![k]} target="_blank" rel="noopener noreferrer">{LABELS[k]}</a></li>
              ))}
            </ul>
          )}
        </div>
        <div>
          <p className="eyebrow !text-blush">Explore</p>
          <ul className="mt-4 space-y-2 text-sm text-petal/80">
            <li><Link to="/shopify-services" className="hover:text-blush">Shopify Services</Link></li>
            <li><Link to="/other-services" className="hover:text-blush">Other Services</Link></li>
            <li><Link to="/portfolio" className="hover:text-blush">Portfolio</Link></li>
            <li><Link to="/about" className="hover:text-blush">About Me</Link></li>
            <li><Link to="/blog" className="hover:text-blush">Blog</Link></li>
            <li><button onClick={open} className="cursor-pointer hover:text-blush">Contact Me</button></li>
          </ul>
        </div>
        <div>
          <p className="eyebrow !text-blush">Information</p>
          <ul className="mt-4 space-y-2 text-sm text-petal/80">
            <li><Link to="/process" className="hover:text-blush">My Process</Link></li>
            <li><Link to="/faqs" className="hover:text-blush">FAQs</Link></li>
            <li><Link to="/email-updates" className="hover:text-blush">Email Updates</Link></li>
            <li><Link to="/privacy" className="hover:text-blush">Privacy Policy</Link></li>
            <li><Link to="/terms" className="hover:text-blush">Terms of Service</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-petal/10">
        <p className="container-site py-5 text-xs text-petal/55">© {new Date().getFullYear()} Deborah Ezeadila. This site uses only essential storage; no tracking cookies are set.</p>
      </div>
    </footer>
  );
}
