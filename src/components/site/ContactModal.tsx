import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { MessageCircle, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { enquirySchema, submitEnquiry } from "@/lib/forms.functions";
import { settingsQuery, whatsappLink } from "@/lib/queries";

type Errors = Partial<Record<"name" | "email" | "message" | "form", string>>;

export function ContactModal({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const { data: settings } = useQuery(settingsQuery);
  const wa = whatsappLink(settings?.whatsapp);
  const [form, setForm] = useState({ name: "", email: "", message: "", wantsUpdates: false, website: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [sending, setSending] = useState(false);
  const [sentName, setSentName] = useState<string | null>(null);

  function handleOpenChange(o: boolean) {
    onOpenChange(o);
    if (!o && sentName) {
      setSentName(null);
      setForm({ name: "", email: "", message: "", wantsUpdates: false, website: "" });
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (sending) return;
    const parsed = enquirySchema.safeParse(form);
    if (!parsed.success) {
      const errs: Errors = {};
      for (const i of parsed.error.issues) errs[i.path[0] as keyof Errors] ??= i.message;
      setErrors(errs);
      return;
    }
    setErrors({});
    setSending(true);
    try {
      await submitEnquiry({ data: parsed.data });
      setSentName(parsed.data.name);
    } catch (err) {
      setErrors({ form: err instanceof Error ? err.message : "Something went wrong. Please try again." });
    } finally {
      setSending(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[92vh] overflow-y-auto border-blush bg-petal sm:max-w-lg">
        {sentName ? (
          <div className="py-4 text-center" role="status">
            <p className="eyebrow">Message received</p>
            <DialogTitle className="mt-3 font-display text-3xl text-oxblood">Thank you, {sentName}!</DialogTitle>
            <DialogDescription className="mt-4 space-y-3 text-left text-[0.95rem] leading-relaxed text-plum">
              <span className="block">
                Thanks for reaching out to Deborah Ezeadila. Your message has been received successfully. I'll review
                your enquiry and get back to you as soon as possible.
              </span>
              <span className="block">
                Your message is important to me, and I appreciate you taking the time to get in touch.
              </span>
            </DialogDescription>
            <Button className="mt-6" onClick={() => handleOpenChange(false)}>
              Close
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <p className="eyebrow">Contact Me</p>
              <DialogTitle className="font-display text-3xl text-oxblood">Let's talk about your store</DialogTitle>
              <DialogDescription>Tell me a little about what you need and I'll get back to you.</DialogDescription>
            </DialogHeader>
            <form onSubmit={submit} noValidate className="mt-2 space-y-4">
              <Field id="c-name" label="Name" error={errors.name}>
                <Input id="c-name" autoComplete="name" value={form.name} aria-invalid={!!errors.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </Field>
              <Field id="c-email" label="Email Address" error={errors.email}>
                <Input id="c-email" type="email" autoComplete="email" value={form.email} aria-invalid={!!errors.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </Field>
              <Field id="c-msg" label="Message" error={errors.message}>
                <Textarea id="c-msg" rows={5} value={form.message} aria-invalid={!!errors.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })} />
              </Field>
              <input type="text" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden"
                value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} />
              <div className="flex items-start gap-3">
                <Checkbox id="c-updates" checked={form.wantsUpdates}
                  onCheckedChange={(v) => setForm({ ...form, wantsUpdates: v === true })} />
                <Label htmlFor="c-updates" className="text-sm font-normal leading-snug text-muted-foreground">
                  Optional: send me occasional Shopify tips and updates by email. I can unsubscribe any time.
                </Label>
              </div>
              {errors.form && <p role="alert" className="text-sm text-destructive">{errors.form}</p>}
              <div className="flex flex-col gap-3 pt-1 sm:flex-row">
                <Button type="submit" variant="cta" size="lg" disabled={sending} className="flex-1">
                  {sending && <Loader2 className="animate-spin" />} Send message
                </Button>
                {wa && (
                  <Button asChild variant="outline" size="lg">
                    <a href={wa} target="_blank" rel="noopener noreferrer"><MessageCircle /> WhatsApp</a>
                  </Button>
                )}
              </div>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

function Field({ id, label, error, children }: { id: string; label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-sm font-semibold text-plum">{label} <span className="text-berry">*</span></Label>
      {children}
      {error && <p className="text-sm text-destructive" id={`${id}-err`}>{error}</p>}
    </div>
  );
}
