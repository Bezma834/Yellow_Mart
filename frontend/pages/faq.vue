<script setup lang="ts">
import { ref, computed } from "vue"

const openIndex = ref<number | null>(null)
const query = ref("")

const toggle = (index: number) => {
  openIndex.value = openIndex.value === index ? null : index
}

const faqs = [
  {
    q: "How do I find businesses near me?",
    a: "Use the search bar on the home page to look up a business by name, city, or category. You can also browse businesses by category or explore our interactive map to discover services near your location."
  },
  {
    q: "Is Yellow-Mart free to use?",
    a: "Yes. Yellow-Mart is completely free for customers — you can browse, search, and discover businesses without any cost. Listing a business is also free, with optional premium features available if you want extra visibility."
  },
  {
    q: "How do I create an account?",
    a: "Click the Login button in the navigation bar, then choose Create Account. You can register with your email address and a password, or sign in instantly with your Google account."
  },
  {
    q: "How do I save my favorite businesses?",
    a: "Once you are logged in, click the heart icon on any business listing to add it to your favorites. You can review all your saved businesses at any time from the Favorites page."
  },
  {
    q: "How can I contact a business?",
    a: "Every business listing includes contact information such as a phone number and address. Open the business page to find their details and reach out directly."
  },
  {
    q: "How do I add my business?",
    a: "Go to the Add Business page and fill in the required details — business name, description, category, phone, address, and images. Once submitted, our admin team reviews and approves your listing before it goes live."
  },
  {
    q: "How long does approval take?",
    a: "Business listings are typically reviewed within 24 to 48 hours. You will see your listing on the site once it has been approved by our admin team."
  },
  {
    q: "Can I edit my business listing?",
    a: "Yes. Once your business is approved, you can edit your listing from the My Businesses dashboard — updating your description, images, contact information, and more."
  },
  {
    q: "Is listing my business free? What are premium features?",
    a: "Listing your business on Yellow-Mart is completely free. We also offer premium features such as featured placements and enhanced visibility to help your business stand out from the crowd."
  },
  {
    q: "I forgot my password. How do I reset it?",
    a: "On the login page, click Forgot Password, enter the email address linked to your account, and follow the instructions we send you. You will be able to choose a new password right away."
  },
  {
    q: "How do I delete my account?",
    a: "Go to Settings, scroll to the Danger Zone, and choose Delete Account. You will be asked to confirm your password. This permanently removes your account, your businesses, and your favorites — this action cannot be undone."
  },
  {
    q: "I have another question. How do I reach support?",
    a: "We would love to help. Email us at support@yellowmart.com and our team will get back to you as soon as possible."
  }
]

const filteredFaqs = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return faqs
  return faqs.filter(
    (faq) =>
      faq.q.toLowerCase().includes(q) || faq.a.toLowerCase().includes(q)
  )
})
</script>

<template>
  <div class="faq-page">
    <!-- Hero -->
    <section class="page-hero">
      <div class="container">
        <span class="eyebrow">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
          Help Center
        </span>
        <h1>Frequently Asked Questions</h1>
        <p>Everything you need to know about Yellow-Mart — find quick answers to common questions.</p>
      </div>
    </section>

    <!-- FAQ List -->
    <section class="faq-section">
      <div class="faq-container">
        <!-- Search -->
        <div class="faq-search">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            v-model="query"
            type="text"
            placeholder="Search questions..."
            aria-label="Search questions"
          />
        </div>

        <p class="faq-count">
          {{ filteredFaqs.length }} {{ filteredFaqs.length === 1 ? "question" : "questions" }}
        </p>

        <!-- No results -->
        <div v-if="filteredFaqs.length === 0" class="faq-empty">
          <div class="faq-empty-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
              <line x1="8" y1="11" x2="14" y2="11"/>
            </svg>
          </div>
          <h3>No results for “{{ query }}”</h3>
          <p>Try a different keyword, or contact us and we will answer your question directly.</p>
        </div>

        <!-- Accordion -->
        <div
          v-for="(faq, index) in filteredFaqs"
          :key="index"
          :class="['faq-item', { 'is-open': openIndex === index }]"
        >
          <button
            class="faq-question"
            @click="toggle(index)"
            :aria-expanded="openIndex === index"
          >
            <span class="faq-q-text">{{ faq.q }}</span>
            <span class="faq-icon" aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </span>
          </button>
          <div class="faq-answer" :class="{ open: openIndex === index }">
            <div class="faq-answer-inner">
              <p>{{ faq.a }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Still have questions -->
    <section class="faq-cta">
      <div class="container faq-cta-inner">
        <div class="faq-cta-icon">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
          </svg>
        </div>
        <h2>Still have questions?</h2>
        <p>Reach out to our team and we will be happy to help you.</p>
        <a href="mailto:support@yellowmart.com" class="btn btn-primary">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
            <polyline points="22,6 12,13 2,6"/>
          </svg>
          Contact Support
        </a>
      </div>
    </section>
  </div>
</template>

<style scoped>
.faq-page {
  min-height: 100vh;
  background: var(--color-bg-secondary);
}

/* FAQ Section */
.faq-section {
  padding: 48px 20px 80px;
}

.faq-container {
  max-width: 740px;
  margin: 0 auto;
}

/* Search */
.faq-search {
  display: flex;
  align-items: center;
  gap: 12px;
  background: var(--color-surface);
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-2xl);
  padding: 0 20px;
  margin-bottom: 12px;
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
}

.faq-search:focus-within {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 4px var(--color-primary-light);
}

.faq-search svg {
  color: var(--color-text-tertiary);
  flex-shrink: 0;
}

.faq-search input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  padding: 16px 0;
  font-size: 15px;
  font-weight: 500;
  color: var(--color-text-primary);
  font-family: inherit;
}

.faq-search input::placeholder {
  color: var(--color-text-tertiary);
}

.faq-count {
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text-tertiary);
  margin: 0 0 16px 6px;
}

/* Empty state */
.faq-empty {
  background: var(--color-surface);
  border: 1px dashed var(--color-border);
  border-radius: var(--radius-2xl);
  padding: 56px 24px;
  text-align: center;
}

.faq-empty-icon {
  width: 64px;
  height: 64px;
  margin: 0 auto 16px;
  border-radius: 50%;
  background: var(--color-primary-light);
  color: var(--color-primary-hover);
  display: flex;
  align-items: center;
  justify-content: center;
}

.faq-empty h3 {
  font-size: 17px;
  font-weight: 800;
  color: var(--color-text-primary);
  margin: 0 0 6px;
}

.faq-empty p {
  font-size: 14px;
  color: var(--color-text-secondary);
  margin: 0;
  max-width: 380px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
}

/* Accordion items */
.faq-item {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-2xl);
  margin-bottom: 14px;
  overflow: hidden;
  transition: border-color var(--transition-base), box-shadow var(--transition-base);
}

.faq-item:hover {
  border-color: var(--color-border-hover);
  box-shadow: var(--shadow-md);
}

.faq-item.is-open {
  border-color: var(--color-primary);
  box-shadow: 0 4px 24px -6px var(--color-primary-glow);
}

.faq-question {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 20px 24px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16.5px;
  font-weight: 700;
  color: var(--color-text-primary);
  text-align: left;
  font-family: inherit;
  line-height: 1.45;
  transition: color var(--transition-fast);
}

.faq-q-text {
  flex: 1;
}

.faq-item.is-open .faq-question {
  color: var(--color-primary);
}

.faq-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--color-bg-tertiary);
  color: var(--color-text-tertiary);
  flex-shrink: 0;
  transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1), background var(--transition-fast), color var(--transition-fast);
}

.faq-icon svg {
  transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

.faq-item.is-open .faq-icon {
  background: var(--color-primary);
  color: var(--color-text-primary);
}

.faq-item.is-open .faq-icon svg {
  transform: rotate(180deg);
}

/* Smooth height animation using grid rows */
.faq-answer {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

.faq-answer.open {
  grid-template-rows: 1fr;
}

.faq-answer-inner {
  overflow: hidden;
}

.faq-answer-inner p {
  margin: 0;
  padding: 0 24px 22px;
  font-size: 15.5px;
  line-height: 1.75;
  color: var(--color-text-secondary);
}

/* CTA */
.faq-cta {
  padding: 80px 20px;
  background: var(--color-bg);
  text-align: center;
}

.faq-cta-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.faq-cta-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: var(--color-primary-light);
  color: var(--color-primary-hover);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
}

.faq-cta h2 {
  font-size: clamp(1.6rem, 3.5vw, 2.2rem);
  font-weight: 800;
  margin-bottom: 10px;
  color: var(--color-text-primary);
}

.faq-cta p {
  font-size: 16px;
  color: var(--color-text-secondary);
  margin-bottom: 30px;
}

/* Responsive */
@media (max-width: 768px) {
  .faq-section {
    padding: 36px 16px 60px;
  }

  .faq-question {
    padding: 16px 18px;
    font-size: 15px;
  }

  .faq-answer-inner p {
    padding: 0 18px 18px;
    font-size: 14.5px;
  }

  .faq-icon {
    width: 28px;
    height: 28px;
  }
}
</style>

<style>
:root.dark .faq-page {
  background: var(--color-dark-bg);
}
:root.dark .faq-search {
  background: var(--color-dark-surface);
  border-color: var(--color-dark-border);
}
:root.dark .faq-search:focus-within {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 4px rgba(245, 158, 11, 0.1);
}
:root.dark .faq-search input {
  color: var(--color-text-primary);
}
:root.dark .faq-search input::placeholder {
  color: var(--color-text-tertiary);
}
:root.dark .faq-count {
  color: var(--color-text-tertiary);
}
:root.dark .faq-item {
  background: var(--color-dark-surface);
  border-color: var(--color-dark-border);
}
:root.dark .faq-item:hover {
  border-color: var(--color-dark-border-hover);
}
:root.dark .faq-item.is-open {
  border-color: var(--color-primary);
  box-shadow: 0 4px 24px -6px rgba(245, 158, 11, 0.15);
}
:root.dark .faq-question {
  color: var(--color-text-primary);
}
:root.dark .faq-icon {
  background: var(--color-dark-bg-tertiary);
  color: var(--color-text-tertiary);
}
:root.dark .faq-item.is-open .faq-icon {
  background: var(--color-primary);
  color: var(--color-dark-bg);
}
:root.dark .faq-answer-inner p {
  color: var(--color-text-secondary);
}
:root.dark .faq-empty {
  background: var(--color-dark-surface);
  border-color: var(--color-dark-border);
}
:root.dark .faq-empty h3 {
  color: var(--color-text-primary);
}
:root.dark .faq-empty p {
  color: var(--color-text-secondary);
}
:root.dark .faq-cta {
  background: var(--color-dark-bg-secondary);
}
:root.dark .faq-cta-icon {
  background: rgba(245, 158, 11, 0.12);
  color: var(--color-primary-hover);
}
:root.dark .faq-cta h2 {
  color: var(--color-text-primary);
}
:root.dark .faq-cta p {
  color: var(--color-text-secondary);
}
</style>