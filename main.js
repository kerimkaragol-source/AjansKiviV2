/* ======= AJANS KİVİ V2 — MAIN.JS ======= */

document.addEventListener('DOMContentLoaded', () => {
  // 1. LOADER
  const loader = document.getElementById('loader');
  const loaderBar = document.getElementById('loader-bar');
  
  if (loaderBar) {
    setTimeout(() => {
      loaderBar.style.transform = 'translateX(0)';
    }, 100);
  }

  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.style.opacity = '0';
      loader.style.visibility = 'hidden';
    }, 800);
  });

  // 2. NAVBAR SCROLL EFFECT
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // 3. REVEAL ON SCROLL (STAGGERED)
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Unobserve after revealing to prevent repeated animations
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.reveal').forEach((el, index) => {
    // Add small delay to staggered elements in grids
    const parent = el.parentElement;
    if (parent.classList.contains('services-grid') || parent.classList.contains('bento-grid') || parent.classList.contains('stats-grid')) {
      el.style.transitionDelay = `${(index % 3) * 0.15}s`;
    }
    revealObserver.observe(el);
  });

  // 4. STATS COUNTER
  const statsObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      document.querySelectorAll('.stat-val').forEach(animateCounter);
      statsObserver.disconnect();
    }
  }, { threshold: 0.5 });

  const statsSection = document.querySelector('.stats-bar');
  if (statsSection) statsObserver.observe(statsSection);

  function animateCounter(el) {
    const target = parseInt(el.dataset.target);
    const duration = 2000;
    const startTime = performance.now();

    function update(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const current = Math.floor(progress * target);
      el.textContent = current.toLocaleString('tr-TR') + (target > 100 ? '+' : '');
      
      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = target.toLocaleString('tr-TR') + (target > 100 ? '+' : '');
      }
    }
    requestAnimationFrame(update);
  }

  // 5. CALCULATOR LOGIC
  const calcType = document.getElementById('calcType');
  const calcQty = document.getElementById('calcQty');
  const calcTotal = document.getElementById('calcTotal');
  const calcBtn = document.getElementById('calcBtn');

  function updateCalculator() {
    if (!calcType || !calcQty || !calcTotal) return;
    const price = parseInt(calcType.value);
    const qty = parseInt(calcQty.value) || 1;
    const total = price * qty;
    
    // Smooth number transition for total
    calcTotal.textContent = total.toLocaleString('tr-TR') + ' ₺';
    
    const selectedText = calcType.options[calcType.selectedIndex].text;
    const message = `Merhaba Ajans Kivi! Web sitenizdeki hesaplayıcıdan tahmini bir teklif aldım.%0A%0A*Çekim Türü:* ${selectedText}%0A*Adet:* ${qty}%0A*Tahmini Tutar:* ${total} ₺%0A%0ADetayları görüşmek istiyorum.`;
    
    if (calcBtn) {
      calcBtn.href = `https://wa.me/905063778101?text=${message}`;
    }
  }

  if (calcType && calcQty) {
    calcType.addEventListener('change', updateCalculator);
    calcQty.addEventListener('input', updateCalculator);
    updateCalculator();
  }

  // 6. CONTACT FORM (AJAX via FormSubmit)
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector('button');
      const originalText = btn.textContent;
      
      btn.textContent = 'Gönderiliyor...';
      btn.disabled = true;

      const formData = new FormData(contactForm);
      const data = Object.fromEntries(formData);

      try {
        const response = await fetch('https://formsubmit.co/ajax/info@ajanskivi.com', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify(data)
        });

        if (response.ok) {
          btn.textContent = '✓ Mesajınız Alındı';
          btn.style.background = '#2ecc71';
          contactForm.reset();
        } else {
          throw new Error();
        }
      } catch {
        btn.textContent = '✕ Hata Oluştu';
        btn.style.background = '#e74c3c';
      }

      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
        btn.disabled = false;
      }, 3000);
    });
  }

  // 7. SMOOTH SCROLL FOR LINKS
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const offset = 80;
        const targetPosition = targetEl.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
      }
    });
  });
});
