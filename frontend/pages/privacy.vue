<script setup lang="ts">
const privacySections = [
  { id: "collect", label: "1. Information We Collect" },
  { id: "use", label: "2. How We Use Your Information" },
  { id: "share", label: "3. Sharing Your Information" },
  { id: "storage", label: "4. Data Storage & Security" },
  { id: "cookies", label: "5. Cookies & Local Storage" },
  { id: "rights", label: "6. Your Rights" },
  { id: "children", label: "7. Children's Privacy" },
  { id: "contact", label: "8. Contact Us" }
]
</script>

<template>
  <div class="privacy-page">
    <!-- Hero -->
    <section class="page-hero">
      <div class="container">
        <span class="eyebrow">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
          Legal
        </span>
        <h1>Privacy Policy</h1>
        <p>How Yellow-Mart collects, uses, and protects your information.</p>
        <span class="updated-badge">Last updated: July 2026</span>
      </div>
    </section>

    <!-- Body -->
    <section class="privacy-body">
      <div class="container privacy-layout">
        <!-- Table of Contents -->
        <aside class="privacy-toc">
          <div class="toc-sticky">
            <h3>On this page</h3>
            <nav>
              <NuxtLink
                v-for="section in privacySections"
                :key="section.id"
                :to="`#${section.id}`"
                class="toc-link"
              >
                {{ section.label }}
              </NuxtLink>
            </nav>
            <NuxtLink to="/terms" class="toc-related">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
              </svg>
              Read our Terms &amp; Conditions
            </NuxtLink>
          </div>
        </aside>

        <!-- Content -->
        <article class="privacy-content">

          <section id="collect" class="privacy-section">
            <h2>1. Information We Collect</h2>
            <p>
              We collect only the information needed to operate the Service. When you
              create an account, we collect your name, email address, and a securely
              hashed password. If you choose to sign in with Google, we receive the
              profile information your Google account shares with us (name, email, and
              avatar).
            </p>
            <p>When you use the Service, we may also collect:</p>
            <ul>
              <li>Business listings and content you submit, including contact details and images.</li>
              <li>Your favorites and preferences (stored on your account).</li>
              <li>Basic usage data such as pages visited, to understand how the platform is used.</li>
            </ul>
          </section>

          <section id="use" class="privacy-section">
            <h2>2. How We Use Your Information</h2>
            <p>We use your information for the following purposes:</p>
            <ul>
              <li>Creating and managing your account, and authenticating your logins.</li>
              <li>Displaying your business listings and favorites to you and to other users.</li>
              <li>Sending service-related communications, such as password-reset emails.</li>
              <li>Improving the Service, fixing issues, and preventing abuse or fraud.</li>
            </ul>
            <p>
              We do not sell your personal information to third parties, and we never
              display your email address publicly unless you choose to list it as part
              of a business's contact details.
            </p>
          </section>

          <section id="share" class="privacy-section">
            <h2>3. Sharing Your Information</h2>
            <p>
              We share your information only in the limited circumstances described here:
            </p>
            <ul>
              <li>
                <strong>Service providers:</strong> hosted infrastructure and email
                services that help us run the platform. They process data only on our
                behalf.
              </li>
              <li>
                <strong>Legal requirements:</strong> when we are required to do so by
                law, regulation, or a valid legal request.
              </li>
            </ul>
          </section>

          <section id="storage" class="privacy-section">
            <h2>4. Data Storage &amp; Security</h2>
            <p>
              Your data is stored on secure, encrypted infrastructure. Passwords are
              never stored in plain text — they are protected using industry-standard
              hashing. We apply access controls so that only authorized systems can
              reach personal data, and we review our security practices regularly.
            </p>
            <p>
              No method of transmission or storage is 100% secure. While we work hard
              to protect your information, we cannot guarantee absolute security.
            </p>
          </section>

          <section id="cookies" class="privacy-section">
            <h2>5. Cookies &amp; Local Storage</h2>
            <p>
              Our platform uses browser local storage to keep you signed in and to
              remember preferences such as your notification setting and theme choice.
              We do not use third-party advertising cookies.
            </p>
            <p>
              You can clear local storage at any time through your browser settings.
              Doing so will sign you out and reset your preferences.
            </p>
          </section>

          <section id="rights" class="privacy-section">
            <h2>6. Your Rights</h2>
            <p>Depending on where you live, you may have the following rights:</p>
            <ul>
              <li><strong>Access:</strong> request a copy of the personal data we hold about you.</li>
              <li><strong>Correction:</strong> update or correct inaccurate information through your profile settings.</li>
              <li><strong>Deletion:</strong> delete your account and associated data at any time from Settings.</li>
              <li><strong>Objection:</strong> object to processing you consider unnecessary.</li>
            </ul>
            <p>
              To exercise any of these rights, contact us at the address below. We will
              respond within a reasonable time.
            </p>
          </section>

          <section id="children" class="privacy-section">
            <h2>7. Children's Privacy</h2>
            <p>
              The Service is intended for users who are at least 13 years old (or the
              applicable age of digital consent in their country). We do not knowingly
              collect personal information from children. If you believe a child has
              provided us with personal information, please contact us and we will
              delete it.
            </p>
          </section>

          <section id="contact" class="privacy-section">
            <h2>8. Contact Us</h2>
            <p>
              If you have questions about this Privacy Policy or how your data is
              handled, reach out to us:
            </p>
            <a href="mailto:support@yellowmart.com" class="contact-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
              support@yellowmart.com
            </a>
          </section>

        </article>
      </div>
    </section>
  </div>
</template>

<style scoped>
.privacy-page {
  min-height: 100vh;
  background: var(--color-bg-secondary);
}

.updated-badge {
  display: inline-block;
  margin-top: 20px;
  padding: 8px 16px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-full);
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text-secondary);
}

/* Body */
.privacy-body {
  padding: 48px 20px 96px;
}

.privacy-layout {
  display: grid;
  grid-template-columns: 240px minmax(0, 1fr);
  gap: 48px;
  align-items: start;
  max-width: 1060px;
}

/* TOC */
.toc-sticky {
  position: sticky;
  top: 100px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.toc-sticky h3 {
  font-size: 12px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-text-tertiary);
  margin: 0 0 10px;
}

.toc-link {
  display: block;
  padding: 8px 12px;
  border-radius: var(--radius-lg);
  font-size: 13.5px;
  font-weight: 600;
  color: var(--color-text-secondary);
  text-decoration: none;
  transition: all var(--transition-fast);
}

.toc-link:hover {
  background: var(--color-bg-tertiary);
  color: var(--color-text-primary);
}

.toc-link.active {
  background: var(--color-primary-light);
  color: var(--color-primary-hover);
}

.toc-related {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 16px;
  padding: 10px 12px;
  font-size: 13px;
  font-weight: 700;
  color: var(--color-primary-hover);
  text-decoration: none;
  border: 1.5px dashed var(--color-border);
  border-radius: var(--radius-lg);
  transition: all var(--transition-fast);
}

.toc-related:hover {
  border-color: var(--color-primary);
  background: var(--color-primary-light);
}

/* Content */
.privacy-content {
  background: var(--color-surface);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-3xl);
  padding: 48px 52px;
  box-shadow: var(--shadow-md);
}

.privacy-section {
  margin-bottom: 44px;
}

.privacy-section:last-child {
  margin-bottom: 0;
}

.privacy-section h2 {
  font-size: 19px;
  font-weight: 800;
  color: var(--color-primary-hover);
  margin: 0 0 14px;
  padding-bottom: 12px;
  border-bottom: 2px solid var(--color-border-light);
  scroll-margin-top: 40px;
}

.privacy-section p {
  font-size: 15px;
  line-height: 1.8;
  color: var(--color-text-secondary);
  margin: 0 0 14px;
}

.privacy-section p:last-child {
  margin-bottom: 0;
}

.privacy-section ul {
  margin: 0 0 14px;
  padding-left: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.privacy-section li {
  font-size: 15px;
  line-height: 1.7;
  color: var(--color-text-secondary);
}

.privacy-section li::marker {
  color: var(--color-primary);
}

.privacy-section strong {
  color: var(--color-text-primary);
  font-weight: 700;
}

.contact-btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  margin-top: 8px;
  padding: 13px 24px;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-hover) 100%);
  color: var(--color-text-primary);
  font-weight: 700;
  font-size: 14.5px;
  text-decoration: none;
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-md);
  transition: all var(--transition-base);
}

.contact-btn:hover {
  box-shadow: var(--shadow-glow), var(--shadow-lg);
  transform: translateY(-2px);
}

/* Responsive */
@media (max-width: 900px) {
  .privacy-layout {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .toc-sticky {
    position: static;
  }

  .toc-sticky h3 {
    margin-bottom: 8px;
  }

  .toc-sticky nav {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }

  .toc-link {
    width: auto;
    padding: 6px 12px;
    font-size: 12.5px;
    border: 1px solid var(--color-border);
  }

  .toc-related {
    width: fit-content;
  }

  .privacy-content {
    padding: 32px 24px;
  }
}

@media (max-width: 480px) {
  .privacy-content {
    padding: 26px 18px;
  }

  .privacy-section h2 {
    font-size: 17px;
  }
}
</style>

<style>
:root.dark .privacy-page {
  background: var(--color-dark-bg);
}
:root.dark .updated-badge {
  background: var(--color-dark-surface);
  border-color: var(--color-dark-border);
  color: var(--color-text-secondary);
}
:root.dark .toc-link {
  color: var(--color-text-secondary);
}
:root.dark .toc-link:hover {
  background: var(--color-dark-bg-tertiary);
  color: var(--color-text-primary);
}
:root.dark .toc-link.active {
  background: rgba(245, 158, 11, 0.12);
  color: var(--color-primary-hover);
}
:root.dark .toc-related {
  border-color: var(--color-dark-border);
  color: var(--color-primary-hover);
}
:root.dark .toc-related:hover {
  background: rgba(245, 158, 11, 0.08);
}
:root.dark .privacy-content {
  background: var(--color-dark-surface);
  border-color: var(--color-dark-border);
}
:root.dark .privacy-section h2 {
  color: var(--color-primary-hover);
  border-bottom-color: var(--color-dark-border);
}
:root.dark .privacy-section p,
:root.dark .privacy-section li {
  color: var(--color-text-secondary);
}
:root.dark .privacy-section li::marker {
  color: var(--color-primary);
}
:root.dark .privacy-section strong {
  color: var(--color-text-primary);
}
:root.dark .contact-btn {
  color: var(--color-dark-bg);
}
</style>