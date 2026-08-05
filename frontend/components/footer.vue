<template>
  <footer class="footer">
    <div class="footer-glow"></div>
    <div class="container">
      <div class="footer-grid">
        <!-- BRAND -->
        <div class="footer-brand">
          <NuxtLink to="/" class="logo">
            <span class="logo-icon">Y</span>
            <span class="logo-text">Yellow Mart</span>
          </NuxtLink>
          <p class="desc">
            Ethiopia's premier business directory, connecting customers with local businesses across the nation.
          </p>
          <div class="social-links">
            <a href="https://www.facebook.com/yellowmart" target="_blank" aria-label="Facebook">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
              </svg>
            </a>
            <a href="https://www.instagram.com/yellowmart" target="_blank" aria-label="Instagram">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
              </svg>
            </a>
            <a href="https://twitter.com/yellowmart" target="_blank" aria-label="Twitter">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/>
              </svg>
            </a>
            <a href="https://www.linkedin.com/company/yellowmart" target="_blank" aria-label="LinkedIn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                <rect x="2" y="9" width="4" height="12"/>
                <circle cx="4" cy="4" r="2"/>
              </svg>
            </a>
          </div>
        </div>

        <!-- CATEGORIES -->
        <div class="footer-box">
          <h3>Categories</h3>
          <ul>
            <li><NuxtLink to="/category/9a7ee5b4-67d5-47b4-9ca7-55eaee4204fe">Restaurants</NuxtLink></li>
            <li><NuxtLink to="/category/ffd0685b-675f-4d6c-bde0-dae27adc2f62">Hotels</NuxtLink></li>
            <li><NuxtLink to="/category/9aabd455-35f1-46f1-9030-3dd224187cac">Healthcare</NuxtLink></li>
            <li><NuxtLink to="/category/d3fd8d3a-6a55-47c8-af48-ccdbf0f121b2">Automotive</NuxtLink></li>
            <li><NuxtLink to="/category/863cac5d-1fb0-42ea-bba1-23e38eaa46bc">Education</NuxtLink></li>
            <li><NuxtLink to="/category/8472770e-653d-40a0-a502-8ce8c9676b10">Finance</NuxtLink></li>
          </ul>
        </div>

        <!-- QUICK LINKS -->
        <div class="footer-box">
          <h3>Quick Links</h3>
          <ul>
            <li><NuxtLink to="/">Home</NuxtLink></li>
            <li><NuxtLink to="/about">About Us</NuxtLink></li>
            <li><NuxtLink to="/faq">FAQ</NuxtLink></li>
            <li><NuxtLink to="/add-business">Add Business</NuxtLink></li>
            <li><NuxtLink to="/map">Business Map</NuxtLink></li>
            <li><NuxtLink to="/terms">Terms</NuxtLink></li>
          </ul>
        </div>

        <!-- CONTACT -->
        <div class="footer-box">
          <h3>Contact Us</h3>
          <ul class="contact">
            <li>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              <span>Bole Road, Addis Ababa, Ethiopia</span>
            </li>
            <li>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
              <a href="tel:+251911000000">+251 911 000 000</a>
            </li>
            <li>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
              <a href="mailto:info@yellowmart.et">info@yellowmart.et</a>
            </li>
          </ul>
        </div>
      </div>

      <div class="copyright">
        <p>&copy; 2026 Yellow Mart. All rights reserved.</p>
        <div class="legal">
          <NuxtLink to="/terms">Terms</NuxtLink>
          <NuxtLink to="/privacy">Privacy</NuxtLink>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  position: relative;
  background: #0b1121;
  color: white;
  padding: 0 0 0;
  overflow: hidden;
}

.footer-glow {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 70%;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--color-primary), transparent);
}

.footer-glow::after {
  content: '';
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 240px;
  height: 4px;
  border-radius: 0 0 var(--radius-full) var(--radius-full);
  background: linear-gradient(90deg, var(--color-primary-hover), var(--color-primary), var(--color-primary-hover));
  filter: blur(1px);
}

.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.footer-grid {
  display: grid;
  grid-template-columns: 1.6fr 1fr 1fr 1.2fr;
  gap: 3rem;
  padding: 2.5rem 0 3rem;
  border-top: 1px solid rgba(255, 255, 255, 0.07);
}

/* Brand */
.footer-brand .logo {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  text-decoration: none;
  font-weight: 700;
  font-size: 1.25rem;
  color: white;
  margin-bottom: 1rem;
}

.logo-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-hover) 100%);
  color: var(--color-text-primary);
  border-radius: var(--radius-lg);
  font-weight: 800;
  font-size: 1rem;
  box-shadow: 0 2px 8px rgba(245, 158, 11, 0.3);
}

.desc {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.5);
  line-height: 1.7;
  margin: 0 0 1.5rem 0;
  max-width: 320px;
}

.social-links {
  display: flex;
  gap: 0.75rem;
}

.social-links a {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: var(--radius-lg);
  color: rgba(255, 255, 255, 0.7);
  transition: all 200ms ease;
}

.social-links a:hover {
  background: var(--color-primary);
  color: var(--color-text-primary);
  transform: translateY(-2px);
}

/* Footer boxes */
.footer-box h3 {
  font-size: 0.75rem;
  font-weight: 600;
  color: white;
  margin: 0 0 1.25rem 0;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.footer-box ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-box li {
  margin: 0 0 0.75rem 0;
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.55);
}

.footer-box li:hover {
  color: var(--color-primary);
}

.footer-box a {
  color: rgba(255, 255, 255, 0.55);
  text-decoration: none;
  transition: color 200ms ease;
}

.footer-box a:hover {
  color: var(--color-primary);
}

.contact li {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
}

.contact svg {
  flex-shrink: 0;
  margin-top: 2px;
  color: rgba(255, 255, 255, 0.35);
}

/* Copyright */
.copyright {
  border-top: 1px solid rgba(255, 255, 255, 0.07);
  padding: 1.5rem 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.copyright p {
  font-size: 0.8125rem;
  color: rgba(255, 255, 255, 0.35);
  margin: 0;
}

.legal {
  display: flex;
  gap: 1.25rem;
}

.legal a {
  font-size: 0.8125rem;
  color: rgba(255, 255, 255, 0.35);
  text-decoration: none;
  transition: color 200ms ease;
}

.legal a:hover {
  color: var(--color-primary);
}

@media (max-width: 1024px) {
  .footer-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .footer-grid {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .copyright {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
}
</style>
