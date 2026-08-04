<script setup lang="ts">
import { ref } from "vue"

const openIndex = ref<number | null>(null)

const toggle = (index: number) => {
  openIndex.value = openIndex.value === index ? null : index
}

const faqs = [
  {
    q: "How do I find businesses near me?",
    a: "You can use the search bar on the home page to search by business name, city, or category. You can also browse businesses by category or explore our interactive map to find services near your location."
  },
  {
    q: "Is Yellow-Mart free to use?",
    a: "Yes! Yellow-Mart is completely free for customers. You can browse, search, and discover businesses without any cost. Business listing is also free with optional premium features available."
  },
  {
    q: "How do I save my favorite businesses?",
    a: "First, create a free account by registering on our site. Once logged in, click the heart icon on any business listing to add it to your favorites. You can view all your saved businesses from the Favorites page."
  },
  {
    q: "How can I contact a business?",
    a: "Each business listing includes contact information such as phone number and address. Simply visit the business page to find their details and reach out directly."
  },
  {
    q: "How do I add my business?",
    a: "Navigate to the 'Add Business' page and fill in the required details including business name, description, category, phone, address, and images. Once submitted, our admin team will review and approve your listing."
  },
  {
    q: "How long does approval take?",
    a: "Business listings are typically reviewed and approved within 24 to 48 hours. You will be able to see your listing on the site once it has been approved by our admin team."
  },
  {
    q: "Can I edit my business listing?",
    a: "Yes! Once your business is approved, you can edit your listing from the 'My Businesses' dashboard. You can update your description, images, contact information, and more."
  },
  {
    q: "Is listing my business free?",
    a: "Yes, listing your business on Yellow-Mart is completely free. We also offer premium features such as featured placements and enhanced visibility to help your business stand out."
  }
]
</script>

<template>
  <div class="faq-page">
    <!-- Hero -->
    <section class="page-hero">
      <div class="container">
        <h1>Frequently Asked Questions</h1>
        <p>Everything you need to know about Yellow-Mart</p>
      </div>
    </section>

    <!-- FAQ List -->
    <section class="faq-section">
      <div class="faq-container">
        <div
          v-for="(faq, index) in faqs"
          :key="index"
          :class="['faq-item', { 'is-open': openIndex === index }]"
        >
          <button class="faq-question" @click="toggle(index)">
            <span>{{ faq.q }}</span>
            <span class="faq-icon">{{ openIndex === index ? "−" : "+" }}</span>
          </button>
          <div class="faq-answer" :style="{ maxHeight: openIndex === index ? '300px' : '0' }">
            <p>{{ faq.a }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Still have questions -->
    <section class="faq-cta">
      <div class="container" style="text-align: center;">
        <h2>Still have questions?</h2>
        <p>Reach out to us and we'll be happy to help.</p>
        <NuxtLink to="/about" class="btn btn-primary">Learn More</NuxtLink>
      </div>
    </section>
  </div>
</template>

<style scoped>
.faq-page {
  min-height: 100vh;
  background: var(--color-bg-secondary);
}

/* Hero uses global .page-hero from main.css */

/* FAQ Section */
.faq-section {
  padding: 60px 20px 80px;
}

.faq-container {
  max-width: 740px;
  margin: 0 auto;
}

.faq-item {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-2xl);
  margin-bottom: 14px;
  overflow: hidden;
  transition: box-shadow var(--transition-base);
}

.faq-item:hover {
  box-shadow: var(--shadow-md);
}

.faq-item.is-open {
  border-color: var(--color-primary);
  box-shadow: var(--shadow-md), 0 0 0 1px var(--color-primary-light);
}

.faq-question {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 20px 28px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 17px;
  font-weight: 700;
  color: var(--color-text-primary);
  text-align: left;
  font-family: var(--font-heading);
  transition: color var(--transition-fast);
  line-height: 1.4;
}

.faq-item.is-open .faq-question {
  color: var(--color-primary);
}

.faq-icon {
  font-size: 24px;
  font-weight: 300;
  color: var(--color-text-tertiary);
  flex-shrink: 0;
  transition: color var(--transition-fast);
  line-height: 1;
}

.faq-item.is-open .faq-icon {
  color: var(--color-primary);
}

.faq-answer {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

.faq-answer p {
  padding: 0 28px 22px;
  font-size: 16px;
  line-height: 1.75;
  color: var(--color-text-secondary);
}

/* CTA */
.faq-cta {
  padding: 80px 20px;
  background: var(--color-bg);
  text-align: center;
}

.faq-cta h2 {
  font-size: 32px;
  font-weight: 800;
  margin-bottom: 10px;
}

.faq-cta p {
  font-size: 17px;
  color: var(--color-text-secondary);
  margin-bottom: 28px;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 14px 36px;
  font-weight: 700;
  font-size: 15px;
  border-radius: var(--radius-xl);
  transition: all var(--transition-base);
  cursor: pointer;
  border: none;
  text-decoration: none;
}

.btn-primary {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-hover) 100%);
  color: var(--color-text-primary);
  box-shadow: var(--shadow-md);
}

.btn-primary:hover {
  box-shadow: var(--shadow-glow), var(--shadow-lg);
  transform: translateY(-2px);
}

/* Responsive */
@media (max-width: 768px) {
  .faq-question {
    padding: 16px 20px;
    font-size: 15px;
  }
  .faq-answer p {
    padding: 0 20px 18px;
    font-size: 15px;
  }
  .faq-cta h2 {
    font-size: 26px;
  }
}
</style>

<style>
:root.dark .faq-page {
  background: var(--color-dark-bg);
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
  box-shadow: 0 4px 20px rgba(245, 158, 11, 0.1);
}
:root.dark .faq-question {
  color: var(--color-text-primary);
}
:root.dark .faq-answer p {
  color: var(--color-text-secondary);
}
:root.dark .faq-icon {
  color: var(--color-text-tertiary);
}
:root.dark .faq-cta {
  background: var(--color-dark-bg-secondary);
}
:root.dark .faq-cta h2 {
  color: var(--color-text-primary);
}
:root.dark .faq-cta p {
  color: var(--color-text-secondary);
}
</style>
