/* ==========================================================================
   LUXORA STUDIO - INTERACTIVE JAVASCRIPT LOGIC
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  
  // --------------------------------------------------------------------------
  // 1. NAVBAR SCROLL & MOBILE MENU TOGGLE
  // --------------------------------------------------------------------------
  const navbar = document.getElementById('navbar');
  const mobileToggle = document.getElementById('mobile-toggle');
  const navLinksContainer = document.getElementById('nav-links');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  mobileToggle.addEventListener('click', () => {
    mobileToggle.classList.toggle('active');
    navLinksContainer.classList.toggle('active');
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileToggle.classList.remove('active');
      navLinksContainer.classList.remove('active');
    });
  });

  // Active Link Highlight on Scroll using IntersectionObserver
  const sections = document.querySelectorAll('section[id]');
  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -70% 0px',
    threshold: 0
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => sectionObserver.observe(section));

  // --------------------------------------------------------------------------
  // 2. STATISTICS COUNTER ANIMATION
  // --------------------------------------------------------------------------
  const statNumbers = document.querySelectorAll('.stat-number');
  let animated = false;

  const statsSection = document.querySelector('.stats-section');
  const statsObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !animated) {
      animated = true;
      statNumbers.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-target'));
        let count = 0;
        const duration = 2000;
        const step = target / (duration / 20);

        const timer = setInterval(() => {
          count += step;
          if (count >= target) {
            stat.innerText = target + '+';
            clearInterval(timer);
          } else {
            stat.innerText = Math.floor(count) + '+';
          }
        }, 20);
      });
    }
  }, { threshold: 0.3 });

  if (statsSection) statsObserver.observe(statsSection);

  // --------------------------------------------------------------------------
  // 3. PORTFOLIO FILTER & LIGHTBOX SYSTEM
  // --------------------------------------------------------------------------
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-modal-close');
  const lightboxPrev = document.getElementById('lightbox-prev-btn');
  const lightboxNext = document.getElementById('lightbox-next-btn');

  let currentImageIndex = 0;
  let visibleItems = Array.from(portfolioItems);

  // Category Filtering
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');

      portfolioItems.forEach(item => {
        const category = item.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          item.style.display = 'block';
          item.style.opacity = '1';
        } else {
          item.style.opacity = '0';
          setTimeout(() => { item.style.display = 'none'; }, 200);
        }
      });

      visibleItems = Array.from(portfolioItems).filter(item => {
        const cat = item.getAttribute('data-category');
        return filter === 'all' || cat === filter;
      });
    });
  });

  // Lightbox Trigger
  portfolioItems.forEach((item, index) => {
    item.addEventListener('click', () => {
      const src = item.getAttribute('data-src') || item.querySelector('img').src;
      const title = item.getAttribute('data-title') || 'Luxora Portfolio';
      currentImageIndex = visibleItems.indexOf(item);
      openLightbox(src, title);
    });
  });

  function openLightbox(src, title) {
    lightboxImg.src = src;
    lightboxCaption.innerText = title;
    lightboxModal.classList.add('active');
  }

  function closeLightbox() {
    lightboxModal.classList.remove('active');
  }

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  lightboxModal.addEventListener('click', (e) => {
    if (e.target === lightboxModal) closeLightbox();
  });

  lightboxNext.addEventListener('click', () => {
    if (visibleItems.length === 0) return;
    currentImageIndex = (currentImageIndex + 1) % visibleItems.length;
    const item = visibleItems[currentImageIndex];
    const src = item.getAttribute('data-src') || item.querySelector('img').src;
    const title = item.getAttribute('data-title') || 'Luxora Portfolio';
    openLightbox(src, title);
  });

  lightboxPrev.addEventListener('click', () => {
    if (visibleItems.length === 0) return;
    currentImageIndex = (currentImageIndex - 1 + visibleItems.length) % visibleItems.length;
    const item = visibleItems[currentImageIndex];
    const src = item.getAttribute('data-src') || item.querySelector('img').src;
    const title = item.getAttribute('data-title') || 'Luxora Portfolio';
    openLightbox(src, title);
  });

  // Keyboard controls for lightbox
  document.addEventListener('keydown', (e) => {
    if (!lightboxModal.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') lightboxNext.click();
    if (e.key === 'ArrowLeft') lightboxPrev.click();
  });

  // --------------------------------------------------------------------------
  // 4. FULL GALLERY MODAL
  // --------------------------------------------------------------------------
  const fullGalleryBtn = document.getElementById('view-full-gallery-btn');
  const galleryModal = document.getElementById('gallery-modal');
  const galleryModalClose = document.getElementById('gallery-modal-close');
  const fullGalleryGrid = document.getElementById('full-gallery-grid');

  const extraGalleryImages = [
    { src: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=600', category: 'WEDDING', title: 'Royal Heritage Ceremony' },
    { src: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=600', category: 'PRE-WEDDING', title: 'Udaipur Sunset Walk' },
    { src: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&q=80&w=600', category: 'CINEMATIC', title: 'Candid Promises' },
    { src: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=600', category: 'WEDDING', title: 'Night Phere Glow' },
    { src: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&q=80&w=600', category: 'EVENTS', title: 'Grand Sangeet Night' },
    { src: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80&w=600', category: 'WEDDING', title: 'Royal Bridal Portrait' },
    { src: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&q=80&w=600', category: 'PRE-WEDDING', title: 'Beachside Moments' },
    { src: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&q=80&w=600', category: 'CINEMATIC', title: 'Fort Romance' },
    { src: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=600', category: 'EVENTS', title: 'Celebration Toast' }
  ];

  if (fullGalleryBtn) {
    fullGalleryBtn.addEventListener('click', () => {
      fullGalleryGrid.innerHTML = '';
      extraGalleryImages.forEach(imgData => {
        const div = document.createElement('div');
        div.className = 'portfolio-item';
        div.setAttribute('data-src', imgData.src.replace('w=600', 'w=1200'));
        div.setAttribute('data-title', imgData.title);
        div.innerHTML = `
          <img src="${imgData.src}" alt="${imgData.title}">
          <div class="portfolio-overlay">
            <span class="portfolio-category">${imgData.category}</span>
            <h3 class="portfolio-title">${imgData.title}</h3>
          </div>
        `;
        div.addEventListener('click', () => {
          openLightbox(imgData.src.replace('w=600', 'w=1200'), imgData.title);
        });
        fullGalleryGrid.appendChild(div);
      });
      galleryModal.classList.add('active');
    });
  }

  if (galleryModalClose) {
    galleryModalClose.addEventListener('click', () => {
      galleryModal.classList.remove('active');
    });
  }

  // --------------------------------------------------------------------------
  // 5. SHOWREEL VIDEO MODAL
  // --------------------------------------------------------------------------
  const showreelBtn = document.getElementById('hero-showreel-btn');
  const showreelModal = document.getElementById('showreel-modal');
  const showreelClose = document.getElementById('showreel-modal-close');
  const showreelIframe = document.getElementById('showreel-iframe');

  if (showreelBtn) {
    showreelBtn.addEventListener('click', () => {
      // Cinematic royalty free wedding trailer video embed
      showreelIframe.src = 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1';
      showreelModal.classList.add('active');
    });
  }

  function closeShowreel() {
    showreelModal.classList.remove('active');
    showreelIframe.src = '';
  }

  if (showreelClose) showreelClose.addEventListener('click', closeShowreel);
  if (showreelModal) {
    showreelModal.addEventListener('click', (e) => {
      if (e.target === showreelModal) closeShowreel();
    });
  }

  // --------------------------------------------------------------------------
  // 6. BOOKING & PACKAGE MODAL SYSTEM
  // --------------------------------------------------------------------------
  const bookingModal = document.getElementById('booking-modal');
  const bookingModalClose = document.getElementById('booking-modal-close');
  const modalPackageLabel = document.getElementById('modal-package-selected');
  const bookingForm = document.getElementById('modal-booking-form');
  const packageSelect = document.getElementById('mb-package');

  const openBookingBtns = [
    document.getElementById('nav-book-btn'),
    document.getElementById('hero-book-btn'),
    document.getElementById('about-work-btn'),
    document.getElementById('cta-appoint-btn')
  ];

  openBookingBtns.forEach(btn => {
    if (btn) {
      btn.addEventListener('click', () => {
        openBookingModal('Custom Inquiry');
      });
    }
  });

  // Package "CHOOSE PLAN" buttons
  const planChooseBtns = document.querySelectorAll('.plan-choose-btn');
  planChooseBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const pkg = btn.getAttribute('data-package');
      const price = btn.getAttribute('data-price');
      openBookingModal(`${pkg} (${price})`);
    });
  });

  function openBookingModal(packageInfo = 'Custom Inquiry') {
    modalPackageLabel.innerText = `Selected Package: ${packageInfo}`;
    if (packageSelect) {
      for (let i = 0; i < packageSelect.options.length; i++) {
        if (packageSelect.options[i].value.toLowerCase().includes(packageInfo.split(' ')[0].toLowerCase())) {
          packageSelect.selectedIndex = i;
          break;
        }
      }
    }
    bookingModal.classList.add('active');
  }

  if (bookingModalClose) {
    bookingModalClose.addEventListener('click', () => {
      bookingModal.classList.remove('active');
    });
  }

  bookingModal.addEventListener('click', (e) => {
    if (e.target === bookingModal) bookingModal.classList.remove('active');
  });

  // Handle Booking Form Submit
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const bookingData = {
        id: 'BK-' + Date.now(),
        name: document.getElementById('mb-name').value.trim(),
        phone: document.getElementById('mb-phone').value.trim(),
        email: document.getElementById('mb-email').value.trim(),
        package: document.getElementById('mb-package').value,
        eventType: document.getElementById('mb-event').value,
        eventDate: document.getElementById('mb-date').value,
        venue: document.getElementById('mb-venue').value.trim(),
        days: document.getElementById('mb-days').value,
        message: document.getElementById('mb-message').value.trim(),
        submittedAt: new Date().toLocaleString()
      };

      // Save to localStorage
      const existingBookings = JSON.parse(localStorage.getItem('luxora_bookings') || '[]');
      existingBookings.push(bookingData);
      localStorage.setItem('luxora_bookings', JSON.stringify(existingBookings));

      // Show Toast Notification
      showToast(`Thank you ${bookingData.name}! Your booking request for ${bookingData.package} has been saved.`);
      
      bookingForm.reset();
      bookingModal.classList.remove('active');
    });
  }

  // --------------------------------------------------------------------------
  // 7. CONTACT FORM SUBMISSION
  // --------------------------------------------------------------------------
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const inquiryData = {
        id: 'INQ-' + Date.now(),
        name: document.getElementById('contact-name').value.trim(),
        phone: document.getElementById('contact-phone').value.trim(),
        email: document.getElementById('contact-email').value.trim(),
        eventType: document.getElementById('contact-event').value,
        eventDate: document.getElementById('contact-date').value,
        venue: document.getElementById('contact-venue').value.trim(),
        message: document.getElementById('contact-message').value.trim(),
        submittedAt: new Date().toLocaleString()
      };

      const existingInquiries = JSON.parse(localStorage.getItem('luxora_inquiries') || '[]');
      existingInquiries.push(inquiryData);
      localStorage.setItem('luxora_inquiries', JSON.stringify(existingInquiries));

      showToast(`Thank you ${inquiryData.name}! Your inquiry has been received. Luxora Studio will contact you shortly.`);
      contactForm.reset();
    });
  }

  // --------------------------------------------------------------------------
  // 8. REVIEWS SLIDER / CAROUSEL
  // --------------------------------------------------------------------------
  const reviewsTrack = document.getElementById('reviews-track');
  const reviewCards = document.querySelectorAll('.review-card');
  const prevBtn = document.getElementById('review-prev-btn');
  const nextBtn = document.getElementById('review-next-btn');

  let reviewIndex = 0;
  let autoSlideTimer = null;

  function updateReviewsSlider() {
    if (!reviewsTrack || reviewCards.length === 0) return;
    const cardWidth = reviewCards[0].offsetWidth + 30; // 30px gap
    reviewsTrack.style.transform = `translateX(-${reviewIndex * cardWidth}px)`;
  }

  function nextReview() {
    const visibleCards = window.innerWidth <= 768 ? 1 : (window.innerWidth <= 992 ? 2 : 3);
    const maxIndex = reviewCards.length - visibleCards;
    reviewIndex = reviewIndex >= maxIndex ? 0 : reviewIndex + 1;
    updateReviewsSlider();
  }

  function prevReview() {
    const visibleCards = window.innerWidth <= 768 ? 1 : (window.innerWidth <= 992 ? 2 : 3);
    const maxIndex = reviewCards.length - visibleCards;
    reviewIndex = reviewIndex <= 0 ? maxIndex : reviewIndex - 1;
    updateReviewsSlider();
  }

  if (nextBtn) nextBtn.addEventListener('click', nextReview);
  if (prevBtn) prevBtn.addEventListener('click', prevReview);

  // Auto slide every 5 seconds
  function startAutoSlide() {
    autoSlideTimer = setInterval(nextReview, 5000);
  }
  function stopAutoSlide() {
    clearInterval(autoSlideTimer);
  }

  startAutoSlide();
  if (reviewsTrack) {
    reviewsTrack.addEventListener('mouseenter', stopAutoSlide);
    reviewsTrack.addEventListener('mouseleave', startAutoSlide);
  }
  window.addEventListener('resize', updateReviewsSlider);

  // --------------------------------------------------------------------------
  // 9. DEMO ADMIN MODAL
  // --------------------------------------------------------------------------
  const openAdminBtn = document.getElementById('open-admin-btn');
  const adminModal = document.getElementById('admin-modal');
  const adminModalClose = document.getElementById('admin-modal-close');
  const adminTableContainer = document.getElementById('admin-table-container');
  const clearAdminBtn = document.getElementById('clear-admin-data-btn');

  if (openAdminBtn) {
    openAdminBtn.addEventListener('click', () => {
      renderAdminData();
      adminModal.classList.add('active');
    });
  }

  if (adminModalClose) {
    adminModalClose.addEventListener('click', () => {
      adminModal.classList.remove('active');
    });
  }

  if (clearAdminBtn) {
    clearAdminBtn.addEventListener('click', () => {
      localStorage.removeItem('luxora_bookings');
      localStorage.removeItem('luxora_inquiries');
      showToast('All local demo bookings and inquiries cleared.');
      renderAdminData();
    });
  }

  function renderAdminData() {
    const bookings = JSON.parse(localStorage.getItem('luxora_bookings') || '[]');
    const inquiries = JSON.parse(localStorage.getItem('luxora_inquiries') || '[]');

    if (bookings.length === 0 && inquiries.length === 0) {
      adminTableContainer.innerHTML = '<p style="color: var(--text-muted); text-align: center; padding: 20px;">No bookings or inquiries submitted yet. Submit a form to see data here!</p>';
      return;
    }

    let html = `
      <table class="admin-table">
        <thead>
          <tr>
            <th>Type</th>
            <th>Name</th>
            <th>Contact</th>
            <th>Package / Event</th>
            <th>Date & Venue</th>
            <th>Submitted</th>
          </tr>
        </thead>
        <tbody>
    `;

    bookings.forEach(b => {
      html += `
        <tr>
          <td><span style="color: var(--gold-primary); font-weight: bold;">Booking</span></td>
          <td>${b.name}</td>
          <td>${b.phone}<br><small style="color:var(--text-dim);">${b.email}</small></td>
          <td>${b.package}<br><small style="color:var(--text-muted);">${b.eventType}</small></td>
          <td>${b.eventDate}<br><small style="color:var(--text-muted);">${b.venue}</small></td>
          <td><small>${b.submittedAt}</small></td>
        </tr>
      `;
    });

    inquiries.forEach(i => {
      html += `
        <tr>
          <td><span style="color: #64b5f6; font-weight: bold;">Inquiry</span></td>
          <td>${i.name}</td>
          <td>${i.phone}<br><small style="color:var(--text-dim);">${i.email}</small></td>
          <td>${i.eventType}</td>
          <td>${i.eventDate}<br><small style="color:var(--text-muted);">${i.venue || 'N/A'}</small></td>
          <td><small>${i.submittedAt}</small></td>
        </tr>
      `;
    });

    html += '</tbody></table>';
    adminTableContainer.innerHTML = html;
  }

  // --------------------------------------------------------------------------
  // 10. TOAST NOTIFICATION ENGINE
  // --------------------------------------------------------------------------
  function showToast(message) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="#d4af37">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
      </svg>
      <span>${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(-100%)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

});
