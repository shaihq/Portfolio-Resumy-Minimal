import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import { useTheme } from "next-themes";

export default function PrivacyPolicy() {
  const { theme } = useTheme();

  return (
    <div
      className="min-h-screen bg-[#FFFEF2] dark:bg-background text-[#1D1B1A] dark:text-foreground antialiased flex justify-center"
      style={{ fontFamily: '"Manrope", sans-serif' }}
    >
      <div className="w-full max-w-[640px] bg-[#FFFEF2] dark:bg-background min-h-screen border-x border-[#EAE9E4] dark:border-border relative z-10">

        {/* Header */}
        <header className="sticky top-0 z-50 w-full bg-[#FFFEF2]/95 dark:bg-background/95 backdrop-blur before:absolute before:content-[''] before:inset-x-[-100vw] before:bottom-0 before:h-px before:bg-[#EAE9E4] dark:before:bg-border">
          <div className="px-6 h-16 flex items-center gap-3">
            <Link href="/landing">
              <button className="flex items-center gap-2 text-[13px] font-medium text-[#1D1B1A]/50 dark:text-foreground/50 hover:text-[#1D1B1A] dark:hover:text-foreground transition-colors">
                <ArrowLeft className="size-4" />
                Back
              </button>
            </Link>
          </div>
        </header>

        <main className="px-6 py-12 max-w-[500px] mx-auto">

          <h1 className="text-[28px] font-bold tracking-tight text-[#1D1B1A] dark:text-foreground mb-2">
            Privacy Policy
          </h1>
          <p className="text-[13px] text-[#1D1B1A]/40 dark:text-foreground/40 font-medium mb-10">
            Last updated: April 3, 2025
          </p>

          <div className="flex flex-col gap-8 text-[15px] leading-[1.7] text-[#1D1B1A]/80 dark:text-foreground/80 font-medium">

            <section className="flex flex-col gap-3">
              <h2 className="text-[17px] font-bold text-[#1D1B1A] dark:text-foreground">Overview</h2>
              <p>
                Designfolio Labs LLP ("Designfolio", "we", "us", or "our") operates designfolio.me. This Privacy Policy explains how we collect, use, disclose, and protect your information when you use our service.
              </p>
              <p>
                By using Designfolio, you agree to the collection and use of information in accordance with this policy.
              </p>
            </section>

            <section className="flex flex-col gap-3">
              <h2 className="text-[17px] font-bold text-[#1D1B1A] dark:text-foreground">Information We Collect</h2>
              <p>
                We collect information you provide directly to us, such as when you create an account, build your portfolio, or contact us for support. This may include:
              </p>
              <ul className="flex flex-col gap-2 pl-4">
                {[
                  "Name and email address",
                  "Profile information and portfolio content",
                  "Payment information (processed securely via our payment provider)",
                  "Communications with us",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="mt-[0.45em] w-1 h-1 rounded-full bg-[#1D1B1A]/30 dark:bg-foreground/30 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <p>
                We also automatically collect certain information when you use our service, including log data, device information, and usage data through cookies and similar tracking technologies.
              </p>
            </section>

            <section className="flex flex-col gap-3">
              <h2 className="text-[17px] font-bold text-[#1D1B1A] dark:text-foreground">How We Use Your Information</h2>
              <p>We use the information we collect to:</p>
              <ul className="flex flex-col gap-2 pl-4">
                {[
                  "Provide, maintain, and improve our services",
                  "Process transactions and send related information",
                  "Send technical notices and support messages",
                  "Respond to your comments and questions",
                  "Monitor and analyse usage and trends",
                  "Detect and prevent fraudulent transactions and abuse",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="mt-[0.45em] w-1 h-1 rounded-full bg-[#1D1B1A]/30 dark:bg-foreground/30 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            <section className="flex flex-col gap-3">
              <h2 className="text-[17px] font-bold text-[#1D1B1A] dark:text-foreground">Sharing of Information</h2>
              <p>
                We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:
              </p>
              <ul className="flex flex-col gap-2 pl-4">
                {[
                  "With service providers who assist us in operating our platform (e.g. payment processors, hosting providers)",
                  "If required by law, regulation, or legal process",
                  "To protect the rights, property, or safety of Designfolio, our users, or the public",
                  "With your consent or at your direction",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="mt-[0.45em] w-1 h-1 rounded-full bg-[#1D1B1A]/30 dark:bg-foreground/30 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            <section className="flex flex-col gap-3">
              <h2 className="text-[17px] font-bold text-[#1D1B1A] dark:text-foreground">Data Retention</h2>
              <p>
                We retain your personal information for as long as your account is active or as needed to provide you our services. You may request deletion of your data at any time by contacting us at shai@designfolio.me.
              </p>
            </section>

            <section className="flex flex-col gap-3">
              <h2 className="text-[17px] font-bold text-[#1D1B1A] dark:text-foreground">Security</h2>
              <p>
                We take reasonable measures to protect your information from unauthorised access, use, or disclosure. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
              </p>
            </section>

            <section className="flex flex-col gap-3">
              <h2 className="text-[17px] font-bold text-[#1D1B1A] dark:text-foreground">Cookies</h2>
              <p>
                We use cookies and similar tracking technologies to track activity on our service and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
              </p>
            </section>

            <section className="flex flex-col gap-3">
              <h2 className="text-[17px] font-bold text-[#1D1B1A] dark:text-foreground">Your Rights</h2>
              <p>
                Depending on your location, you may have certain rights regarding your personal data, including the right to access, correct, or delete your information. To exercise any of these rights, contact us at shai@designfolio.me.
              </p>
            </section>

            <section className="flex flex-col gap-3">
              <h2 className="text-[17px] font-bold text-[#1D1B1A] dark:text-foreground">Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. We will notify you of any significant changes by posting the new policy on this page and updating the "Last updated" date above.
              </p>
            </section>

            <section className="flex flex-col gap-3">
              <h2 className="text-[17px] font-bold text-[#1D1B1A] dark:text-foreground">Contact</h2>
              <p>
                If you have any questions about this Privacy Policy, please reach out at{" "}
                <a href="mailto:shai@designfolio.me" className="text-[#FF553E] hover:underline">
                  shai@designfolio.me
                </a>
                .
              </p>
            </section>

          </div>
        </main>

        {/* Footer */}
        <footer className="w-full border-t border-[#EAE9E4] dark:border-border mt-16">
          <div className="px-6 py-4 text-center text-[12px] font-medium text-[#1D1B1A]/40 dark:text-foreground/40 bg-[#F4F3E5] dark:bg-card">
            © 2025 Designfolio Labs LLP. All rights reserved.
          </div>
        </footer>

      </div>
    </div>
  );
}
