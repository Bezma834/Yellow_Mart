<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue"

const activeSection = ref("")

const sections = [
  { id: "introduction", label: "1. Introduction" },
  { id: "accounts", label: "2. User Accounts" },
  { id: "listings", label: "3. Business Listings" },
  { id: "conduct", label: "4. Acceptable Use" },
  { id: "ip", label: "5. Intellectual Property" },
  { id: "privacy", label: "6. Privacy & Data" },
  { id: "disclaimer", label: "7. Disclaimer of Warranties" },
  { id: "liability", label: "8. Limitation of Liability" },
  { id: "termination", label: "9. Account Termination" },
  { id: "changes", label: "10. Changes to These Terms" },
  { id: "contact", label: "11. Contact Us" }
]

const onScroll = () => {
  let current = sections[0].id
  for (const section of sections) {
    const el = document.getElementById(section.id)
    if (el && el.getBoundingClientRect().top <= 140) {
      current = section.id
    }
  }
  activeSection.value = current
}

const scrollTo = (id: string) => {
  const el = document.getElementById(id)
  if (!el) return
  const top = el.getBoundingClientRect().top + window.scrollY - 100
  window.scrollTo({ top, behavior: "smooth" })
}

onMounted(() => {
  onScroll()
  window.addEventListener("scroll", onScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener("scroll", onScroll)
})
</script>

<template>
  <div class="terms-page">
    <!-- Hero -->
    <section class="page-hero">
      <div class="container">
        <span class="eyebrow">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
          </svg>
          Legal
        </span>
        <h1>Terms &amp; Conditions</h1>
        <p>Please read these terms carefully before using Yellow-Mart.</p>
        <span class="updated-badge">Last updated: July 2026</span>
      </div>
    </section>

    <!-- Body -->
    <section class="terms-body">
      <div class="container terms-layout">
        <!-- Table of Contents -->
        <aside class="terms-toc">
          <div class="toc-sticky">
            <h3>On this page</h3>
            <nav>
              <button
                v-for="section in sections"
                :key="section.id"
                :class="['toc-link', { active: activeSection === section.id }]"
                @click="scrollTo(section.id)"
              >
                {{ section.label }}
              </button>
            </nav>
            <NuxtLink to="/privacy" class="toc-related">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              Read our Privacy Policy
            </NuxtLink>
          </div>
        </aside>

        <!-- Content -->
        <article class="terms-content">

          <section id="introduction" class="terms-section">
            <h2>1. Introduction</h2>
            <p>
              Welcome to Yellow-Mart. These Terms &amp; Conditions ("Terms") govern your
              use of the Yellow-Mart platform, including our website, mobile experience,
              and all services we provide (collectively, the "Service"). By creating an
              account, accessing, or using the Service in any way, you agree to be bound
              by these Terms. If you do not agree with any part of these Terms, you must
              not use the Service.
            </p>
            <p>
              We may update these Terms from time to time. When we do, we will revise the
              "Last updated" date at the top of this page. Continued use of the Service
              after changes take effect constitutes acceptance of the revised Terms.
            </p>
          </section>

          <section id="accounts" class="terms-section">
            <h2>2. User Accounts</h2>
            <p>
              To access certain features, you must create an account. You are responsible
              for maintaining the confidentiality of your login credentials and for all
              activity that occurs under your account. You agree to notify us immediately
              if you suspect any unauthorized use of your account.
            </p>
            <p>When creating an account, you agree to:</p>
            <ul>
              <li>Provide accurate, current, and complete information.</li>
              <li>Keep your account information up to date.</li>
              <li>Choose a strong password and not share it with others.</li>
              <li>Not create accounts under false pretenses or on behalf of others without authorization.</li>
            </ul>
          </section>

          <section id="listings" class="terms-section">
            <h2>3. Business Listings</h2>
            <p>
              Businesses listed on Yellow-Mart must provide accurate information about
              their products, services, location, and contact details. You are solely
              responsible for the content of your listings, including all descriptions,
              images, and claims.
            </p>
            <ul>
              <li>Listings must describe genuine businesses or services you are authorized to represent.</li>
              <li>Information must not be misleading, outdated, or fraudulent.</li>
              <li>Images and media must be yours or properly licensed — do not use copyrighted material without permission.</li>
              <li>We reserve the right to review, approve, suspend, or remove any listing that violates these Terms.</li>
            </ul>
          </section>

          <section id="conduct" class="terms-section">
            <h2>4. Acceptable Use</h2>
            <p>
              When using Yellow-Mart, you agree not to engage in conduct that could
              disrupt the Service or harm other users. Prohibited behavior includes,
              but is not limited to:
            </p>
            <ul>
              <li>Uploading harmful, malicious, or unlawful content.</li>
              <li>Attempting to access, modify, or interfere with accounts, systems, or data without authorization.</li>
              <li>Harassing, threatening, or discriminating against other users.</li>
              <li>Submitting false reports, fake reviews, or otherwise misleading information.</li>
              <li>Using automated tools to scrape, spam, or manipulate the platform.</li>
            </ul>
          </section>

          <section id="ip" class="terms-section">
            <h2>5. Intellectual Property</h2>
            <p>
              The Yellow-Mart name, logo, design, and all original content, software, and
              features of the Service are the property of Yellow-Mart or its licensors
              and are protected by applicable intellectual property laws.
            </p>
            <p>
              You retain ownership of the content you submit. By submitting content, you
              grant Yellow-Mart a non-exclusive, royalty-free license to host, display,
              and use that content solely to operate and improve the Service.
            </p>
          </section>

          <section id="privacy" class="terms-section">
            <h2>6. Privacy &amp; Data</h2>
            <p>
              Your privacy matters to us. We collect and process your personal information
              only as needed to provide the Service — for example, to create your account,
              authenticate logins, and display the businesses you add or favorite.
            </p>
            <p>
              For full details on what we collect, how we use it, and your rights, please
              read our <NuxtLink to="/privacy" class="inline-link">Privacy Policy</NuxtLink>.
            </p>
          </section>

          <section id="disclaimer" class="terms-section">
            <h2>7. Disclaimer of Warranties</h2>
            <p>
              The Service is provided on an "as is" and "as available" basis, without
              warranties of any kind, either express or implied, including but not limited
              to implied warranties of merchantability, fitness for a particular purpose,
              and non-infringement.
            </p>
            <p>
              We do not warrant that the Service will be uninterrupted, error-free, or
              completely secure, and we do not verify, endorse, or guarantee the accuracy
              of any business information listed on the platform.
            </p>
          </section>

          <section id="liability" class="terms-section">
            <h2>8. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, Yellow-Mart shall not be liable for
              any indirect, incidental, special, consequential, or punitive damages, or
              any loss of profits or data, arising out of or related to your use of the
              Service or your dealings with businesses found through the platform.
            </p>
            <p>
              Your sole and exclusive remedy for any dissatisfaction with the Service is
              to stop using it and, where applicable, close your account.
            </p>
          </section>

          <section id="termination" class="terms-section">
            <h2>9. Account Termination</h2>
            <p>
              You may delete your account at any time from Settings. Deleting your account
              permanently removes your profile, businesses, and favorites from the platform.
            </p>
            <p>
              We may suspend or terminate your account, or remove your content, if we
              reasonably believe you have violated these Terms, engaged in fraudulent or
              abusive conduct, or if doing so is required by law.
            </p>
          </section>

          <section id="changes" class="terms-section">
            <h2>10. Changes to These Terms</h2>
            <p>
              We reserve the right to modify these Terms at any time. Updated Terms will
              be posted on this page with a revised "Last updated" date. Your continued
              use of the Service after any changes constitutes acceptance of the new Terms.
              If you do not agree with the changes, you should stop using the Service.
            </p>
          </section>

          <section id="contact" class="terms-section">
            <h2>11. Contact Us</h2>
            <p>
              If you have any questions about these Terms, or would like to report a
              violation, please contact our support team:
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
.terms-page {
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
.terms-body {
  padding: 48px 20px 96px;
}

.terms-layout {
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
  width: 100%;
  text-align: left;
  background: none;
  border: none;
  padding: 8px 12px;
  border-radius: var(--radius-lg);
  font-size: 13.5px;
  font-weight: 600;
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all var(--transition-fast);
  font-family: inherit;
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
.terms-content {
  background: var(--color-surface);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-3xl);
  padding: 48px 52px;
  box-shadow: var(--shadow-md);
}

.terms-section {
  margin-bottom: 44px;
}

.terms-section:last-child {
  margin-bottom: 0;
}

.terms-section h2 {
  font-size: 19px;
  font-weight: 800;
  color: var(--color-primary-hover);
  margin: 0 0 14px;
  padding-bottom: 12px;
  border-bottom: 2px solid var(--color-border-light);
  scroll-margin-top: 110px;
}

.terms-section p {
  font-size: 15px;
  line-height: 1.8;
  color: var(--color-text-secondary);
  margin: 0 0 14px;
}

.terms-section p:last-child {
  margin-bottom: 0;
}

.terms-section ul {
  margin: 0 0 14px;
  padding-left: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.terms-section li {
  font-size: 15px;
  line-height: 1.7;
  color: var(--color-text-secondary);
}

.terms-section li::marker {
  color: var(--color-primary);
}

.inline-link {
  color: var(--color-primary-hover);
  font-weight: 700;
  text-decoration: none;
  border-bottom: 1.5px solid var(--color-primary);
  transition: opacity var(--transition-fast);
}

.inline-link:hover {
  opacity: 0.75;
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
  .terms-layout {
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

  .terms-content {
    padding: 32px 24px;
  }
}

@media (max-width: 480px) {
  .terms-content {
    padding: 26px 18px;
  }

  .terms-section h2 {
    font-size: 17px;
  }
}
</style>

<style>
:root.dark .terms-page {
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
:root.dark .terms-content {
  background: var(--color-dark-surface);
  border-color: var(--color-dark-border);
}
:root.dark .terms-section h2 {
  color: var(--color-primary-hover);
  border-bottom-color: var(--color-dark-border);
}
:root.dark .terms-section p,
:root.dark .terms-section li {
  color: var(--color-text-secondary);
}
:root.dark .terms-section li::marker {
  color: var(--color-primary);
}
:root.dark .inline-link {
  color: var(--color-primary-hover);
}
:root.dark .contact-btn {
  color: var(--color-dark-bg);
}
</style>