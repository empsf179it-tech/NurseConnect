document.addEventListener('DOMContentLoaded', () => {
  // Navigation & Scroll State
  const navbar = document.querySelector('.navbar');
  const hamburger = document.querySelector('.hamburger');
  const navContainer = document.querySelector('.nav-container');
  const navLinks = document.querySelectorAll('.nav-links a');



  // Mobile Menu Toggle
  hamburger.addEventListener('click', () => {
    navContainer.classList.toggle('mobile-menu-active');
  });

  // Close mobile menu when link clicked
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navContainer.classList.remove('mobile-menu-active');
    });
  });

  // Scroll Reveal using IntersectionObserver
  const revealElements = document.querySelectorAll('.reveal');
  
  const revealCallback = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  };

  // Check if user prefers reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  if (!prefersReducedMotion && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(revealCallback, {
      root: null,
      threshold: 0.15,
      rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(el => {
      revealObserver.observe(el);
    });
  } else {
    // If reduced motion or no support, just show everything
    revealElements.forEach(el => el.classList.add('active'));
  }

  // Active Navigation State Update
  const sections = document.querySelectorAll('section[id], header[id]');
  
  const navHighlighter = () => {
    let scrollY = window.pageYOffset;
    
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 100;
      const sectionId = current.getAttribute('id');
      const navLink = document.querySelector(`.nav-links a[href*=${sectionId}]`);
      
      if (navLink) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          navLink.classList.add('active');
        } else {
          navLink.classList.remove('active');
        }
      }
    });
  };
  
  window.addEventListener('scroll', navHighlighter, { passive: true });

  // Services Interactive Explorer
  const explorerItems = document.querySelectorAll('.explorer-item');
  const explorerContent = document.querySelector('.explorer-content');
  const explorerImg = explorerContent ? explorerContent.querySelector('img') : null;
  const explorerTitle = explorerContent ? explorerContent.querySelector('h3') : null;
  const explorerDetails = document.querySelector('.explorer-details');
  
  const servicesData = {
    'home-nursing': { img: 'images/services/home-care.jpg', title: 'Home Nursing' },
    'elderly-care': { img: 'images/services/elderly-care.jpg', title: 'Elderly Care' },
    'post-surgical': { img: 'images/services/recovery-care.jpg', title: 'Post-Surgical Care' },
    'chronic-care': { img: 'images/services/chronic-care.jpg', title: 'Chronic Care' },
    'medication': { img: 'images/healthcare/consultation.jpg', title: 'Medication Support' },
    'recovery': { img: 'images/healthcare/hospital.jpg', title: 'Recovery Care' }
  };

  explorerItems.forEach(item => {
    item.addEventListener('click', () => {
      // Remove active from all
      explorerItems.forEach(el => el.classList.remove('active'));
      // Add active to clicked
      item.classList.add('active');
      
      const serviceId = item.getAttribute('data-service');
      const data = servicesData[serviceId];
      
      if (data && explorerImg && explorerTitle) {
        // Animate transition
        explorerImg.style.opacity = '0';
        explorerDetails.classList.remove('visible');
        
        setTimeout(() => {
          explorerImg.src = data.img;
          explorerImg.alt = data.title;
          explorerTitle.textContent = data.title;
          
          explorerImg.onload = () => {
            explorerImg.style.opacity = '1';
            explorerDetails.classList.add('visible');
          };
        }, 300);
      }
    });
  });

  // Initial show of explorer details
  if (explorerDetails) {
    setTimeout(() => {
      explorerDetails.classList.add('visible');
    }, 500);
  }

  // Form Validation (Frontend Demo Only)
  const forms = document.querySelectorAll('form');
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const btn = form.querySelector('button');
      const originalText = btn.innerHTML;
      
      // Basic visual feedback
      btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Processing...';
      btn.style.opacity = '0.8';
      
      setTimeout(() => {
        btn.innerHTML = '<i class="fa-solid fa-check"></i> Request Sent';
        btn.style.backgroundColor = '#10B981';
        btn.style.color = '#fff';
        
        setTimeout(() => {
          btn.innerHTML = originalText;
          btn.style = '';
          form.reset();
        }, 3000);
      }, 1500);
    });
  });

  // Parallax subtle effect on mouse move (desktop only)
  if (!prefersReducedMotion && window.innerWidth > 1024) {
    const heroVisuals = document.querySelector('.hero-visuals');
    const floatingPanel = document.querySelector('.floating-panel');
    
    if (heroVisuals && floatingPanel) {
      heroVisuals.addEventListener('mousemove', (e) => {
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;
        
        // Calculate offset, limit rotation
        const moveX = (x - 0.5) * 20; // max 10deg
        const moveY = (y - 0.5) * 20;
        
        floatingPanel.style.transform = `rotateY(${moveX}deg) rotateX(${-moveY}deg) translateY(-10px)`;
      });
      
      heroVisuals.addEventListener('mouseleave', () => {
        floatingPanel.style.transform = `rotateY(-15deg) rotateX(5deg)`;
      });
    }
  }

  // Testimonial Controls
  const prevBtn = document.querySelector('.test-prev');
  const nextBtn = document.querySelector('.test-next');
  const testText = document.querySelector('.testimonial-text');
  const testAuthor = document.querySelector('.testimonial-author');
  const testImg = document.getElementById('test-img');
  
  const testimonials = [
    {
      text: "“The most reassuring part was knowing someone was there who genuinely listened and understood what our family needed.”",
      author: "Emily Carter",
      img: "images/nurses/nurse-01.jpg"
    },
    {
      text: "“NurseConnect provided a level of professional care that allowed my father to recover safely in the comfort of his own home.”",
      author: "David Martinez",
      img: "images/nurses/nurse-02.jpg"
    },
    {
      text: "“From the very first consultation, we felt a sense of relief. The nursing staff is incredibly skilled and compassionate.”",
      author: "Sarah Jenkins",
      img: "images/nurses/nurse-03.jpg"
    }
  ];
  
  let currentTest = 0;
  
  const updateTestimonial = () => {
    if (!testText || !testAuthor) return;
    
    testText.style.opacity = '0';
    if (testImg) testImg.style.opacity = '0';
    
    setTimeout(() => {
      testText.textContent = testimonials[currentTest].text;
      testAuthor.textContent = testimonials[currentTest].author;
      if (testImg) testImg.src = testimonials[currentTest].img;
      
      testText.style.opacity = '1';
      if (testImg) testImg.style.opacity = '1';
    }, 300);
  };
  
  if (prevBtn && nextBtn) {
    prevBtn.addEventListener('click', () => {
      currentTest = (currentTest === 0) ? testimonials.length - 1 : currentTest - 1;
      updateTestimonial();
    });
    
    nextBtn.addEventListener('click', () => {
      currentTest = (currentTest === testimonials.length - 1) ? 0 : currentTest + 1;
      updateTestimonial();
    });
  }

  // About Section Image Swap
  const aboutImagesContainer = document.querySelector('.about-images');
  if (aboutImagesContainer) {
    aboutImagesContainer.addEventListener('click', (e) => {
      // If clicking either image, swap them
      if (e.target.tagName === 'IMG') {
        const imgMain = aboutImagesContainer.querySelector('.img-main');
        const imgSecondary = aboutImagesContainer.querySelector('.img-secondary');
        
        if (imgMain && imgSecondary) {
          // Swap classes
          imgMain.classList.remove('img-main');
          imgMain.classList.add('img-secondary');
          
          imgSecondary.classList.remove('img-secondary');
          imgSecondary.classList.add('img-main');
          
          // Ensure z-index transition looks correct by moving clicked item to front immediately
          e.target.style.zIndex = '3';
          setTimeout(() => {
            imgMain.style.zIndex = '';
            imgSecondary.style.zIndex = '';
          }, 600);
        }
      }
    });
  }

});
