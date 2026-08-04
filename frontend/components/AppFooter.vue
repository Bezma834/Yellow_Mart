<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <NuxtLink to="/" class="logo">
            <span class="logo-icon">Y</span>
            <span class="logo-text">Yellow Mart</span>
          </NuxtLink>
          <p class="desc">
            Ethiopia's premier business directory, connecting customers with local businesses across the nation.
          </p>
        </div>

        <div class="footer-box">
          <h3>Categories</h3>
          <ul>
            <li>Restaurants</li>
            <li>Hotels</li>
            <li>Healthcare</li>
            <li>Automotive</li>
            <li>Education</li>
            <li>Finance</li>
          </ul>
        </div>

        <div class="footer-box">
          <h3>Quick Links</h3>
          <ul>
            <li><NuxtLink to="/">Home</NuxtLink></li>
            <li><NuxtLink to="/about">About Us</NuxtLink></li>
            <li><NuxtLink to="/advertise">Advertise</NuxtLink></li>
            <li><NuxtLink to="/careers">Careers</NuxtLink></li>
            <li><NuxtLink to="/press">Press</NuxtLink></li>
          </ul>
        </div>

        <div class="footer-box">
          <h3>Contact Us</h3>
          <ul class="contact">
            <li>Bole Road, Addis Ababa, Ethiopia</li>
            <li><a href="tel:+251911000000">+251 11 XXX XXXX</a></li>
            <li><a href="mailto:info@yellowmart.et">info@yellowmart.et</a></li>
          </ul>
        </div>
      </div>

      <div class="copyright">
        <p>&copy; 2026 Yellow Mart. All rights reserved.</p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background: #0b1121;
  color: white;
  padding: 4rem 0 0;
}

.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.footer-grid {
  display: grid;
  grid-template-columns: 1.5fr 1fr 1fr 1fr;
  gap: 3rem;
  padding-bottom: 3rem;
}

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
  width: 36px;
  height: 36px;
  background: var(--color-primary);
  color: #0f172a;
  border-radius: var(--radius-lg);
  font-weight: 800;
  font-size: 1rem;
}

.desc {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.5);
  line-height: 1.7;
  margin: 0;
  max-width: 320px;
}

.footer-box h3 {
  font-size: 0.8125rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  margin: 0 0 1.25rem 0;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.footer-box ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-box li {
  margin: 0 0 0.75rem 0;
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.45);
}

.footer-box a {
  color: rgba(255, 255, 255, 0.45);
  text-decoration: none;
  transition: color var(--transition-fast);
}

.footer-box a:hover {
  color: var(--color-primary);
}

.copyright {
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  padding: 1.5rem 0;
  text-align: center;
}

.copyright p {
  font-size: 0.8125rem;
  color: rgba(255, 255, 255, 0.3);
  margin: 0;
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
}
</style>
