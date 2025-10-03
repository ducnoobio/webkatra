
document.addEventListener('DOMContentLoaded', function() {
    
    let user = JSON.parse(localStorage.getItem('user_info')) || {};
    if (user && user.logged_in !== false && user.name) {
        var loginBtn = document.querySelector('.header-actions .log');
        var registerBtn = document.querySelector('.header-actions .register');
        if (loginBtn) loginBtn.style.display = 'none';
        if (registerBtn) registerBtn.style.display = 'none';
        var userNameEl = document.getElementById('user-name-display');
        if (!userNameEl) {
            userNameEl = document.createElement('span');
            userNameEl.id = 'user-name-display';
            userNameEl.style.textDecoration = 'underline';
            userNameEl.style.cursor = 'pointer';
            userNameEl.style.marginLeft = '1rem';
            var headerActions = document.querySelector('.header-actions');
            if (headerActions) headerActions.appendChild(userNameEl);
        }
        userNameEl.textContent = user.name;
        
        userNameEl.onclick = function() {
            var logoutBtn = document.getElementById('logout-btn');
            if (!logoutBtn) {
                logoutBtn = document.createElement('button');
                logoutBtn.id = 'logout-btn';
                logoutBtn.textContent = 'Đăng xuất';
                logoutBtn.style.position = 'absolute';
                logoutBtn.style.left = (userNameEl.getBoundingClientRect().left + window.scrollX) + 'px';
                logoutBtn.style.top = (userNameEl.getBoundingClientRect().bottom + window.scrollY + 6) + 'px';
                logoutBtn.style.zIndex = '9999';
                logoutBtn.style.padding = '8px 18px';
                logoutBtn.style.borderRadius = '8px';
                logoutBtn.style.border = '1px solid #a67c52';
                logoutBtn.style.background = '#fff';
                logoutBtn.style.color = '#a67c52';
                logoutBtn.style.cursor = 'pointer';
                logoutBtn.style.boxShadow = '0 4px 16px rgba(166,124,82,0.12)';
                logoutBtn.style.opacity = '0';
                logoutBtn.style.transition = 'opacity 0.25s';
                document.body.appendChild(logoutBtn);
                setTimeout(function(){ logoutBtn.style.opacity = '1'; }, 10);
                logoutBtn.onclick = function() {
                    let user = JSON.parse(localStorage.getItem('user_info')) || {};
                    user.logged_in = false;
                    localStorage.setItem('user_info', JSON.stringify(user));
                    window.location.reload();
                };
                
                document.addEventListener('mousedown', function hideBtn(e) {
                    if (e.target !== logoutBtn && e.target !== userNameEl) {
                        logoutBtn.style.opacity = '0';
                        setTimeout(function(){
                            if (logoutBtn.parentNode) logoutBtn.parentNode.removeChild(logoutBtn);
                        }, 250);
                        document.removeEventListener('mousedown', hideBtn);
                    }
                });
            }
        };
    }
    var menuBtn = document.querySelector('.menu-toggle');
    var nav = document.querySelector('.main-nav');
    var overlayEl = document.querySelector('.nav-overlay');
    
    var _lastFocused = null;
    var _trapHandler = null;
    function trapFocus(container) {
        if (!container) return;
        _lastFocused = document.activeElement;
        var focusable = container.querySelectorAll('a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])');
        focusable = Array.prototype.filter.call(focusable, function(el){ return el.offsetWidth > 0 || el.offsetHeight > 0 || el === document.activeElement; });
        if (focusable.length) focusable[0].focus();
        _trapHandler = function(e) {
            if (e.key === 'Tab') {
                var first = focusable[0];
                var last = focusable[focusable.length - 1];
                if (!first || !last) return;
                if (e.shiftKey && document.activeElement === first) {
                    e.preventDefault(); last.focus();
                } else if (!e.shiftKey && document.activeElement === last) {
                    e.preventDefault(); first.focus();
                }
            }
        };
        document.addEventListener('keydown', _trapHandler);
    }
    function releaseFocus() {
        if (_trapHandler) document.removeEventListener('keydown', _trapHandler);
        _trapHandler = null;
        if (_lastFocused && typeof _lastFocused.focus === 'function') {
            try { _lastFocused.focus(); } catch (err) {}
        }
        _lastFocused = null;
    }
    function closeNav() {
        nav.classList.remove('open');
        const overlay = document.querySelector('.nav-overlay');
        if (overlay) overlay.classList.remove('open');
    if (overlay) overlay.setAttribute('aria-hidden','true');
    if (menuBtn) menuBtn.setAttribute('aria-expanded','false');
    releaseFocus();
        document.body.style.overflow = '';
    }
    if (menuBtn) {
        menuBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            
            const willOpen = !nav.classList.contains('open');

            if (willOpen) {
                
                if (!nav._origParent) {
                    nav._origParent = nav.parentNode;
                    nav._origNext = nav.nextSibling;
                }
                
                try { document.body.appendChild(nav); } catch (err) {}

                
                nav.style.setProperty('position', 'fixed', 'important');
                nav.style.setProperty('top', '0', 'important');
                nav.style.setProperty('left', '0', 'important');
                nav.style.setProperty('height', '100%', 'important');
                nav.style.setProperty('width', '74vw', 'important');
                nav.style.setProperty('max-width', '320px', 'important');
                nav.style.setProperty('background', 'linear-gradient(180deg, rgba(255,255,255,0.98), rgba(250,248,246,0.98))', 'important');
                nav.style.setProperty('border-radius', '0 12px 12px 0', 'important');
                nav.style.setProperty('box-shadow', '8px 0 26px rgba(0,0,0,0.10)', 'important');
                nav.style.setProperty('z-index', '2147483646', 'important');
                nav.style.setProperty('pointer-events', 'auto', 'important');
                nav.style.setProperty('overflow-y', 'auto', 'important');

                nav.classList.add('open');
                if (nav) nav.setAttribute('aria-hidden','false');
                if (menuBtn) menuBtn.setAttribute('aria-expanded','true');
                
                
                try { if (overlayEl && overlayEl.parentNode !== document.body) document.body.appendChild(overlayEl); } catch (err) {}
                try { if (overlayEl && overlayEl.parentNode !== document.body) document.body.appendChild(overlayEl); } catch (err) {}
                if (overlayEl) { overlayEl.classList.add('open'); overlayEl.setAttribute('aria-hidden','false'); }
                
                trapFocus(nav);
                document.body.style.overflow = 'hidden';
                
                try {
                    console.log('[menu] open:', { navParent: nav.parentNode && nav.parentNode.tagName, navZ: window.getComputedStyle(nav).zIndex, overlayZ: overlayEl ? window.getComputedStyle(overlayEl).zIndex : null, navClasses: nav.className, overlayClasses: overlayEl ? overlayEl.className : null });
                } catch (err) { console.log('[menu] debug error', err); }
            } else {
                
                nav.classList.remove('open');
                if (overlayEl) { overlayEl.classList.remove('open'); overlayEl.setAttribute('aria-hidden','true'); }
                
                document.body.style.overflow = '';
                if (nav) nav.setAttribute('aria-hidden','true');
                if (menuBtn) menuBtn.setAttribute('aria-expanded','false');
                releaseFocus();

                
                ['position','top','left','right','max-width','background','border-radius','box-shadow','z-index','pointer-events'].forEach(function(p){
                    nav.style.removeProperty(p);
                });

                
                if (nav._origParent) {
                    try {
                        if (nav._origNext && nav._origNext.parentNode === nav._origParent) nav._origParent.insertBefore(nav, nav._origNext);
                        else nav._origParent.appendChild(nav);
                    } catch (err) {}
                }
                try { console.log('[menu] closed:', { navParent: nav.parentNode && nav.parentNode.tagName, navZ: window.getComputedStyle(nav).zIndex, overlayZ: overlayEl ? window.getComputedStyle(overlayEl).zIndex : null, navClasses: nav.className, overlayClasses: overlayEl ? overlayEl.className : null }); } catch (e) {}
            }
        });
    }
    
    if (overlayEl) {
        overlayEl.addEventListener('click', function(e) {
            
            nav.classList.remove('open');
            overlayEl.classList.remove('open');
            document.body.style.overflow = '';
            menuBtn && menuBtn.classList.remove('open');
            if (overlayEl) overlayEl.setAttribute('aria-hidden','true');
            if (nav) nav.setAttribute('aria-hidden','true');
            if (menuBtn) menuBtn.setAttribute('aria-expanded','false');
            releaseFocus();
        });
    }
    
    if (nav) {
        nav.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }
    
    nav && nav.addEventListener('click', function(e) {
        var link = e.target.closest('.nav-link');
        if (link) closeNav();
    });
    window.addEventListener('resize', function() {
        if (window.innerWidth > 600) closeNav();
    });
    
    (function(){
        var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav-link[data-section]'));
        if (!navLinks.length) return;
        var sections = navLinks.map(function(l){ return document.getElementById(l.getAttribute('data-section')); }).filter(Boolean);
        function setActive(sectionId){
            navLinks.forEach(function(link){
                if (link.getAttribute('data-section') === sectionId) {
                    link.classList.add('active');
                    link.setAttribute('aria-current','page');
                } else {
                    link.classList.remove('active');
                    link.removeAttribute('aria-current');
                }
            });
        }
        
        navLinks.forEach(function(link){
            link.addEventListener('click', function(e){
                var id = this.getAttribute('data-section');
                if (id) setActive(id);
                
                setTimeout(function(){ if (window.innerWidth <= 900) closeNav(); }, 120);
            });
        });

        if ('IntersectionObserver' in window && sections.length) {
            var io = new IntersectionObserver(function(entries){
                entries.forEach(function(ent){
                    if (ent.isIntersecting) setActive(ent.target.id);
                });
            }, { root: null, rootMargin: '-35% 0px -45% 0px', threshold: 0 });
            sections.forEach(function(s){ io.observe(s); });
        } else {
            
            var ticking = false;
            function onScrollCheck(){
                var found = null;
                for (var i = 0; i < sections.length; i++){
                    var r = sections[i].getBoundingClientRect();
                    if (r.top <= window.innerHeight * 0.45 && r.bottom >= window.innerHeight * 0.2) { found = sections[i]; break; }
                }
                if (found) setActive(found.id);
                ticking = false;
            }
            window.addEventListener('scroll', function(){ if (!ticking){ ticking = true; requestAnimationFrame(onScrollCheck); } });
            
            setTimeout(onScrollCheck, 120);
        }
    })();
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' || e.key === 'Esc') {
            
            if (nav && nav.classList.contains('open')) {
                nav.classList.remove('open');
                menuBtn && menuBtn.classList.remove('open');
                if (overlayEl) overlayEl.classList.remove('open');
                document.body.style.overflow = '';
            }
            
            var modals = document.querySelectorAll('.modal');
            modals.forEach(function(m){ if (m && m.style.display === 'block') m.style.display = 'none'; });
        }
    });
});

document.addEventListener('DOMContentLoaded', function() {
    var loginBtn = document.querySelector('.header-actions .log');
    var registerBtn = document.querySelector('.header-actions .register');
    var cartBtn = document.querySelector('.header-actions .cart-link');
    var loginModal = document.getElementById('login-modal');
    var registerModal = document.getElementById('register-modal');
    var cartModal = document.getElementById('cart-modal');
    var closeBtns = document.querySelectorAll('.close-modal');
    var showRegister = document.getElementById('show-register');
    var showLogin = document.getElementById('show-login');

    if (loginBtn && loginModal) {
        loginBtn.addEventListener('click', function(e) {
            e.preventDefault();
            loginModal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
    }
    if (registerBtn && registerModal) {
        registerBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (loginModal) loginModal.style.display = 'none';
            registerModal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
    }
    if (cartBtn && cartModal) {
        cartBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (loginModal) loginModal.style.display = 'none';
            if (registerModal) registerModal.style.display = 'none';
            cartModal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
    }
    
    document.body.addEventListener('click', function(e) {
        var btn = e.target.closest('.close-modal');
        if (btn) {
            var modalId = btn.getAttribute('data-modal');
            var modal = document.getElementById(modalId);
            if (modal) modal.style.display = 'none';
            document.body.style.overflow = '';
        }
    });
    
    if (showRegister && registerModal && loginModal) {
        showRegister.addEventListener('click', function(e) {
            e.preventDefault();
            loginModal.style.display = 'none';
            registerModal.style.display = 'block';
        });
    }
    if (showLogin && registerModal && loginModal) {
        showLogin.addEventListener('click', function(e) {
            e.preventDefault();
            registerModal.style.display = 'none';
            loginModal.style.display = 'block';
        });
    }
    
    function handleModalOutsideClick(e) {
        var modals = [loginModal, registerModal, cartModal];
        for (var i = 0; i < modals.length; i++) {
            var modal = modals[i];
            if (modal && e.target === modal) {
                modal.style.display = 'none';
                document.body.style.overflow = '';
            }
        }
    }
    if (loginModal) loginModal.addEventListener('mousedown', handleModalOutsideClick);
    if (registerModal) registerModal.addEventListener('mousedown', handleModalOutsideClick);
    if (cartModal) cartModal.addEventListener('mousedown', handleModalOutsideClick);
});

document.addEventListener('DOMContentLoaded', function() {
    
    var productModal = document.getElementById('product-modal');
    if (productModal) {
        var closeBtn = productModal.querySelector('.close-modal');
        if (closeBtn) {
            closeBtn.addEventListener('click', function() {
                productModal.style.display = 'none';
                document.body.style.overflow = '';
            });
        }
    }
    
    var loginForm = document.querySelector('.login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            var email = document.getElementById('login-email').value.trim();
            var pass = document.getElementById('login-password').value;
            var emailError = document.getElementById('login-email-error');
            var passError = document.getElementById('login-password-error');
            var success = document.getElementById('login-success');
            var fail = document.getElementById('login-fail');
            emailError.textContent = '';
            passError.textContent = '';
            success.textContent = '';
            fail.textContent = '';
            var valid = true;
            if (!email.match(/^[^@\s]+@[^@\s]+\.[^@\s]+$/)) {
                emailError.textContent = 'Email không hợp lệ';
                valid = false;
            }
            if (pass.length < 6) {
                passError.textContent = 'Mật khẩu tối thiểu 6 ký tự';
                valid = false;
            }
            if (!valid) return;
            var btn = document.getElementById('login-submit');
            btn.querySelector('.btn-text').style.display = 'none';
            btn.querySelector('.btn-loading').style.display = 'inline-block';
            setTimeout(function() {
                btn.querySelector('.btn-text').style.display = '';
                btn.querySelector('.btn-loading').style.display = 'none';
                
                
                let user = JSON.parse(localStorage.getItem('user_info')) || {};
                if (email === user.email && pass === user.password) {
                    success.textContent = 'Đăng nhập thành công!';
                    fail.textContent = '';
                    
                    localStorage.setItem('user_info', JSON.stringify(user));
                    
                    setTimeout(function() {
                        success.textContent = '';
                        var loginModal = document.getElementById('login-modal');
                        if (loginModal) loginModal.style.display = 'none';
                        document.body.style.overflow = '';
                        var loginBtn = document.querySelector('.header-actions .log');
                        var registerBtn = document.querySelector('.header-actions .register');
                        if (loginBtn) loginBtn.style.display = 'none';
                        if (registerBtn) registerBtn.style.display = 'none';
                        
                        var userName = user.name || email;
                        var userNameEl = document.getElementById('user-name-display');
                        if (!userNameEl) {
                            userNameEl = document.createElement('span');
                            userNameEl.id = 'user-name-display';
                            userNameEl.style.textDecoration = 'underline';
                            userNameEl.style.cursor = 'pointer';
                            userNameEl.style.marginLeft = '1rem';
                            var headerActions = document.querySelector('.header-actions');
                            if (headerActions) headerActions.appendChild(userNameEl);
                        }
                        userNameEl.textContent = userName;
                        
                        userNameEl.onclick = function() {
                            var logoutBtn = document.getElementById('logout-btn');
                            if (!logoutBtn) {
                                logoutBtn = document.createElement('button');
                                logoutBtn.id = 'logout-btn';
                                logoutBtn.textContent = 'Đăng xuất';
                                logoutBtn.style.marginLeft = '0.7rem';
                                logoutBtn.style.padding = '4px 12px';
                                logoutBtn.style.borderRadius = '6px';
                                logoutBtn.style.border = '1px solid #a67c52';
                                logoutBtn.style.background = '#fff';
                                logoutBtn.style.color = '#a67c52';
                                logoutBtn.style.cursor = 'pointer';
                                userNameEl.parentNode.insertBefore(logoutBtn, userNameEl.nextSibling);
                                logoutBtn.onclick = function() {
                                    
                                    
                                    let user = JSON.parse(localStorage.getItem('user_info')) || {};
                                    user.logged_in = false;
                                    localStorage.setItem('user_info', JSON.stringify(user));
                                    window.location.reload();
                                };
                            } else {
                                logoutBtn.style.display = (logoutBtn.style.display === 'none' ? 'inline-block' : 'none');
                            }
                        };
                    }, 1200);
                } else {
                    fail.textContent = 'Email hoặc mật khẩu không đúng!';
                    success.textContent = '';
                }
            }, 1200);
        });
    }
    
    var registerForm = document.querySelector('.register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            var name = document.getElementById('register-name').value.trim();
            var email = document.getElementById('register-email').value.trim();
            var pass = document.getElementById('register-password').value;
            var pass2 = document.getElementById('register-password2').value;
            var agree = document.getElementById('agree-term').checked;
            var nameError = document.getElementById('register-name-error');
            var emailError = document.getElementById('register-email-error');
            var passError = document.getElementById('register-password-error');
            var pass2Error = document.getElementById('register-password2-error');
            var success = document.getElementById('register-success');
            var fail = document.getElementById('register-fail');
            nameError.textContent = '';
            emailError.textContent = '';
            passError.textContent = '';
            pass2Error.textContent = '';
            success.textContent = '';
            fail.textContent = '';
            var valid = true;
            if (name.length < 2) {
                nameError.textContent = 'Vui lòng nhập họ tên';
                valid = false;
            }
            if (!email.match(/^[^@\s]+@[^@\s]+\.[^@\s]+$/)) {
                emailError.textContent = 'Email không hợp lệ';
                valid = false;
            }
            if (pass.length < 6) {
                passError.textContent = 'Mật khẩu tối thiểu 6 ký tự';
                valid = false;
            }
            if (pass !== pass2) {
                pass2Error.textContent = 'Mật khẩu nhập lại không khớp';
                valid = false;
            }
            if (!agree) {
                fail.textContent = 'Bạn phải đồng ý điều khoản';
                valid = false;
            }
            if (!valid) return;
            var btn = document.getElementById('register-submit');
            btn.querySelector('.btn-text').style.display = 'none';
            btn.querySelector('.btn-loading').style.display = 'inline-block';
            setTimeout(function() {
                btn.querySelector('.btn-text').style.display = '';
                btn.querySelector('.btn-loading').style.display = 'none';
                
                success.textContent = 'Đăng ký thành công!';
                fail.textContent = '';
                
                localStorage.setItem('user_info', JSON.stringify({ name: name, email: email, password: pass }));
                
                setTimeout(function() {
                    success.textContent = '';
                    var registerModal = document.getElementById('register-modal');
                    if (registerModal) registerModal.style.display = 'none';
                    
                    var authModals = document.querySelectorAll('.modal-content.auth-modal');
                    authModals.forEach(function(modal){ modal.style.display = 'block'; });
                    var loginModal = document.getElementById('login-modal');
                    if (loginModal) loginModal.style.display = 'block';
                }, 1200);
            }, 1200);
        });
    }
});

document.addEventListener('DOMContentLoaded', function() {
    var logoLink = document.querySelector('.logo a');
    if (logoLink) {
        logoLink.addEventListener('click', function(e) {
            e.preventDefault();
            
            var homeTab = document.querySelector('.nav-link[data-section="home"]');
            if (homeTab && !homeTab.classList.contains('active')) {
                homeTab.click();
                
                setTimeout(function() {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }, 300);
            } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    }
});

const bannerContainer = document.getElementById('banner-container');
const slides = document.querySelectorAll('.banner-slide');
const indicators = document.querySelectorAll('.indicator');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
let currentSlide = 0;
const slideCount = slides.length;

function updateSlider() {
    bannerContainer.style.transform = `translateX(-${currentSlide * 100}%)`;
    
    
    indicators.forEach((indicator, index) => {
        if (index === currentSlide) {
            indicator.classList.add('active');
        } else {
            indicator.classList.remove('active');
        }
    });
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % slideCount;
    updateSlider();
}

function prevSlide() {
    currentSlide = (currentSlide - 1 + slideCount) % slideCount;
    updateSlider();
}


nextBtn.addEventListener('click', nextSlide);
prevBtn.addEventListener('click', prevSlide);

indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => {
        currentSlide = index;
        updateSlider();
    });
});


let slideInterval = setInterval(nextSlide, 5000);


bannerContainer.addEventListener('mouseenter', () => {
    clearInterval(slideInterval);
});

bannerContainer.addEventListener('mouseleave', () => {
    slideInterval = setInterval(nextSlide, 5000);
});


const categoryTabs = document.querySelectorAll('.tab-button');
const productCategories = document.querySelectorAll('.product-category');

categoryTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const category = tab.dataset.category;
        
        
        categoryTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        
        productCategories.forEach(cat => {
            if (cat.id === `${category}-products`) {
                cat.classList.add('active');
            } else {
                cat.classList.remove('active');
            }
        });
    });
});


const categoryCards = document.querySelectorAll('.category-card');
categoryCards.forEach(card => {
    card.addEventListener('click', (e) => {
        e.preventDefault();
        const category = card.dataset.category;
        const tabToActivate = document.querySelector(`.tab-button[data-category="${category}"]`);
        
        
        document.getElementById('product-tabs').scrollIntoView({ behavior: 'smooth' });
        
        
        setTimeout(() => {
            tabToActivate.click();
        }, 500);
    });
});


const scrollBtns = document.querySelectorAll('.scroll-btn');

scrollBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const direction = btn.dataset.direction;
        const category = btn.dataset.category;
        const slider = document.querySelector(`#${category}-products .product-slider`);
        const scrollAmount = slider.clientWidth / 2;
        
        if (direction === 'left') {
            slider.scrollBy({
                left: -scrollAmount,
                behavior: 'smooth'
            });
        } else {
            slider.scrollBy({
                left: scrollAmount,
                behavior: 'smooth'
            });
        }
    });
});


const backToTopBtn = document.getElementById('back-to-top');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        backToTopBtn.classList.add('visible');
    } else {
        backToTopBtn.classList.remove('visible');
    }
});

backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});


const modal = document.getElementById('product-modal');
const closeModal = document.querySelector('.close-modal');
const productCards = document.querySelectorAll('.product-card');
const modalProductImage = document.getElementById('modal-product-image');
const modalProductTitle = document.getElementById('modal-product-title');
const modalRatingCount = document.getElementById('modal-rating-count');
const modalOldPrice = document.getElementById('modal-old-price');
const modalCurrentPrice = document.getElementById('modal-current-price');
const modalProductDescription = document.getElementById('modal-product-description');
const modalProductSpecs = document.getElementById('modal-product-specs');
const quantityInput = document.getElementById('quantity');
const minusBtn = document.querySelector('.quantity-btn.minus');
const plusBtn = document.querySelector('.quantity-btn.plus');


const productData = {
    
    cera1: {
        title: "Coffee Machine PCM03S",
        image: "./img/img_cera/PMC03s.webp",
        rating: "4.5",
        ratingCount: "120",
        oldPrice: "5.500.000₫",
        currentPrice: "3.550.000₫",
        description: "PCM03S — Máy pha cà phê di động CERA+ với tính năng self-heating, pin dung lượng lớn, áp suất 20 bar; tương thích cà phê bột và capsule. Thiết kế nhỏ gọn, thân kim loại, phù hợp cho di chuyển và sử dụng cá nhân.",
        specs: [
            "Màu sắc: Space Grey, White, Orange, Forest Green, Cream",
            "Chất liệu: Nhựa ABS + Hợp kim nhôm",
            "Làm nóng: Có (Self Heating)",
            "Áp suất tối đa: 20 bar",
            "Pin: 13.500 mAh",
            "Thời gian sạc: 2–2.5 giờ",
            "Trọng lượng: 716 g",
            "Tương thích: Nespresso Capsule & cà phê bột"
        ]
    },
    cera2: {
        title: "Coffee Machine PCM01",
        image: "./img/img_cera/PCM01.webp",
        rating: "4.0",
        ratingCount: "85",
        oldPrice: "",
        currentPrice: "1.949.000₫",
        description: "PCM01 — Máy pha espresso mini di động, thiết kế đơn giản, pin tích hợp nhỏ gọn, phù hợp pha nhanh mọi lúc mọi nơi. Không có tính năng self-heating.",
        specs: [
            "Áp suất tối đa: 20 bar",
            "Pin: 1.800 mAh",
            "Thời gian sạc: ~1.5 giờ",
            "Dung tích bình nước: 120 ml",
            "Trọng lượng: ~500 g",
            "Tương thích: Nespresso Capsule & cà phê bột"
        ]
    },
    cera3: {
        title: "Coffee Machine PCM02",
        image: "./img/img_cera/PCM02.webp",
        rating: "5.0",
        ratingCount: "42",
        oldPrice: "",
        currentPrice: "1.949.000₫",
        description: "PCM02 — Máy pha espresso di động, thiết kế gọn nhẹ, pin trung bình, dễ sử dụng, phù hợp nhu cầu hàng ngày và du lịch ngắn ngày.",
        specs: [
            "Áp suất tối đa: 20 bar",
            "Pin: 1.800 mAh",
            "Thời gian sạc: ~1.5 giờ",
            "Trọng lượng: 540 g",
            "Tương thích: Nespresso Capsule & cà phê bột"
        ]
    },
    cera4: {
        title: "Coffee Machine PCM03",
        image: "./img/img_cera/PCM03.webp",
        rating: "4.5",
        ratingCount: "98",
        oldPrice: "",
        currentPrice: "1.200.000₫",
        description: "PCM03 — Phiên bản nâng cấp với pin lớn hơn so với PCM02, có tùy chọn self-heating, chiết xuất espresso ổn định, thích hợp cho người thường xuyên di chuyển.",
        specs: [
            "Áp suất tối đa: 20 bar",
            "Pin: 7.500 mAh",
            "Thời gian sạc: 2–2.5 giờ",
            "Trọng lượng: ~640 g",
            "Tương thích: Nespresso Capsule & cà phê bột"
        ]
    },
    cera5: {
        title: "Coffee Machine PCM04",
        image: "./img/img_cera/PCM04.webp",
        rating: "4.5",
        ratingCount: "98",
        oldPrice: "",
        currentPrice: "3.237.000₫",
        description: "PCM04 — Máy pha espresso di động pin dung lượng cao, thiết kế chắc chắn, hỗ trợ self-heating và sử dụng liên tục cho nhu cầu thường xuyên.",
        specs: [
            "Áp suất tối đa: 20 bar",
            "Pin: 7.500 mAh",
            "Thời gian sạc: 2.5–3.5 giờ",
            "Trọng lượng: 593 g",
            "Tương thích: Nespresso Capsule & cà phê bột"
        ]
    },
    cera6: {
        title: "Coffee Machine PCM04A",
        image: "./img/img_cera/PMC04A.webp",
        rating: "4.6",
        ratingCount: "64",
        oldPrice: "",
        currentPrice: "4.200.000₫",
        description: "PCM04A — Phiên bản cao cấp với portafilter trần (naked portafilter) 51mm, cho phép quan sát quá trình chiết xuất, hướng tới trải nghiệm chuyên nghiệp hơn và phù hợp cho cà phê bột.",
        specs: [
            "Áp suất tối đa: 20 bar",
            "Pin: 7.500 mAh",
            "Portafilter: Naked (51 mm)",
            "Tương thích: Cà phê bột"
        ]
    },
    cera7: {
        title: "CGE01 Portable Electric Grinder",
        image: "./img/img_cera/CGE01.webp",
        rating: "4.5",
        ratingCount: "85",
        oldPrice: "2.500.000₫",
        currentPrice: "2.398.000₫",
        description: "Máy xay cà phê điện cầm tay CGE01, thiết kế nhỏ gọn, tiện lợi cho việc xay cà phê tại nhà hoặc mang đi du lịch. Động cơ mạnh mẽ, lưỡi xay thép không gỉ cho độ bền cao.",
        specs: [
            "Công suất: 150W",
            "Dung tích: 60g cà phê hạt",
            "Chất liệu: Thép không gỉ, nhựa ABS",
            "Pin: 1200mAh, sạc USB",
            "Kích thước: 19 x 7 x 7 cm",
            "Bảo hành: 12 tháng"
        ]
    },
    cera8: {
        title: "CG01 Manual Version Coffee Grinder",
        image: "./img/img_cera/CG01.webp",
        rating: "5.0",
        ratingCount: "65",
        oldPrice: "2.500.000₫",
        currentPrice: "2.398.000₫",
        description: "Máy xay cà phê tay CG01 phiên bản cao cấp, lưỡi xay bằng thép không gỉ, điều chỉnh độ mịn dễ dàng, phù hợp cho mọi phương pháp pha chế.",
        specs: [
            "Chất liệu: Thép không gỉ, nhôm cao cấp",
            "Dung tích: 40g cà phê hạt",
            "Điều chỉnh độ mịn: 12 cấp độ",
            "Kích thước: 16 x 5 x 5 cm",
            "Trọng lượng: 420g",
            "Bảo hành: 12 tháng"
        ]
    },
    
    tea1: {
        title: "Trà Đông Phương Mĩ Nhân",
        image: "./img/img_haan/haan_dpmn.jpg",
        rating: "4.5",
        ratingCount: "56",
        oldPrice: "450.000₫",
        currentPrice: "405.000₫",
        description: "Trà Ô Long cao cấp, đặc trưng bởi hương mật ong và trái cây tự nhiên. Được hái thủ công từ những búp non, chế biến theo quy trình truyền thống kết hợp hiện đại.",
        specs: [
            "Xuất xứ: Hà Giang",
            "Giống trà: Ô Long đặc biệt",
            "Hương vị: Ngọt hậu, hương mật ong, trái cây",
            "Quy cách: Gói 100g / 200g",
            "Bảo quản: Nơi khô ráo, thoáng mát"
        ]
    },
    tea2: {
        title: "Hồng Trà Rừng",
        image: "./img/img_haan/haan_hongtrarung.jpg",
        rating: "4.0",
        ratingCount: "42",
        oldPrice: "",
        currentPrice: "320.000₫",
        description: "Trà đen lên men tự nhiên, thu hái từ cây trà cổ thụ trong rừng. Vị đậm đà, hậu ngọt sâu, phù hợp thưởng trà đậm vị.",
        specs: [
            "Xuất xứ: Hoàng Su Phì, Hà Giang",
            "Giống trà: Shan tuyết cổ thụ",
            "Hương vị: Đậm, hậu ngọt, thoảng hương mật",
            "Quy cách: Gói 100g / 200g",
            "Bảo quản: Tránh ánh nắng trực tiếp"
        ]
    },
    tea3: {
        title: "Hộp Trà Quà Tặng",
        image: "./img/img_haan/haan_hopqua.jpg",
        rating: "5.0",
        ratingCount: "28",
        oldPrice: "",
        currentPrice: "280.000₫",
        description: "Bộ quà tặng trà tinh tế, kết hợp nhiều loại trà đặc sản của Hà An Trà, phù hợp làm quà biếu trong dịp lễ Tết, hội họp.",
        specs: [
            "Thành phần: Có thể gồm Ô Long, Hồng Trà, Trà Xanh, Trà Shan Tuyết",
            "Quy cách: Hộp 2–6 loại trà, mỗi loại 50–100g",
            "Bao bì: Hộp giấy cao cấp, thiết kế sang trọng",
            "Xuất xứ: Hà Giang"
        ]
    },
    tea4: {
        title: "Măng Trà",
        image: "./img/img_haan/haan_mangtra.jpg",
        rating: "3.5",
        ratingCount: "35",
        oldPrice: "",
        currentPrice: "290.000₫",
        description: "Trà măng non, được hái từ những chồi trà đầu mùa, hương vị thanh nhẹ, hậu ngọt dịu.",
        specs: [
            "Xuất xứ: Cao nguyên Hà Giang",
            "Nguyên liệu: Búp trà non",
            "Hương vị: Thanh mát, nhẹ nhàng, hậu ngọt",
            "Quy cách: Gói 100g",
            "Dùng tốt cho: Thưởng trà nhẹ, detox cơ thể"
        ]
    },
    tea5: {
        title: "Mật Ong Hồng Trà",
        image: "./img/img_haan/haan_matonghongtra.jpg",
        rating: "5.0",
        ratingCount: "47",
        oldPrice: "",
        currentPrice: "493.000₫",
        description: "Kết hợp giữa hồng trà Hà Giang và mật ong thiên nhiên, mang lại vị ngọt dịu, dễ uống, giàu năng lượng.",
        specs: [
            "Xuất xứ: Hoàng Su Phì, Hà Giang",
            "Thành phần: Hồng trà + mật ong nguyên chất",
            "Hương vị: Ngọt thanh, thơm dịu",
            "Quy cách: Hũ 250ml / 500ml",
            "Bảo quản: Nơi khô ráo, thoáng mát"
        ]
    },
    tea6: {
        title: "Trà Ô Long San Tuyết",
        image: "./img/img_haan/haan_olongsantuyet.jpg",
        rating: "4.5",
        ratingCount: "45",
        oldPrice: "",
        currentPrice: "320.000₫",
        description: "Trà Ô Long Shan Tuyết được chế biến từ cây trà cổ thụ vùng cao, hương thơm hoa cỏ, vị ngọt thanh kéo dài.",
        specs: [
            "Xuất xứ: Hà Giang",
            "Giống trà: Shan Tuyết cổ thụ",
            "Hương vị: Ngọt hậu, hương hoa, thoảng mật ong",
            "Quy cách: Gói 100g / 200g",
            "Thích hợp: Thưởng trà tinh tế, biếu tặng"
        ]
    },
    tea7: {
        title: "Trà Xanh",
        image: "./img/img_haan/haan_traxanh.jpg",
        rating: "4.0",
        ratingCount: "45",
        oldPrice: "",
        currentPrice: "170.000₫",
        description: "Trà xanh truyền thống, vị chát dịu, hương cốm non, giàu chất chống oxy hóa, tốt cho sức khỏe.",
        specs: [
            "Xuất xứ: Hà Giang",
            "Nguyên liệu: Búp trà xanh non",
            "Hương vị: Chát dịu, hậu ngọt, hương cốm",
            "Quy cách: Gói 100g / 200g",
            "Dùng tốt cho: Uống hằng ngày, thanh lọc cơ thể"
        ]
    },
    tea8: {
        title: "Trà Mật Ong Hà An",
        image: "./img/img_haan/haan_matonghongtra.jpg",
        rating: "4.8",
        ratingCount: "38",
        oldPrice: "210.000₫",
        currentPrice: "185.000₫",
        description: "Sản phẩm kết hợp trà và mật ong tự nhiên, vị ngọt dịu, phù hợp cho người cần tăng năng lượng và dễ uống.",
        specs: [
            "Thành phần: Trà chọn lọc + mật ong nguyên chất",
            "Quy cách: Hũ 250ml / Gói 100g",
            "Hương vị: Ngọt thanh, thơm mật ong",
            "Bảo quản: Nơi khô ráo, thoáng mát"
        ]
    },
    
    
    coffee1: {
        title: "Red Bourbon Đà Lạt",
        image: "./img/img_katra/katra_redboubon.jpg",
        rating: "4.5",
        ratingCount: "48",
        oldPrice: "250.000₫",
        currentPrice: "220.000₫",
        description: "Cà phê Red Bourbon Đà Lạt được trồng ở độ cao 1500m, thu hoạch và chế biến thủ công để đảm bảo chất lượng tốt nhất. Hạt cà phê có hương thơm đặc trưng với notes của chocolate, caramel và trái cây.",
        specs: [
            "Xuất xứ: Đà Lạt, Lâm Đồng",
            "Độ cao: 1500m",
            "Quy cách: Gói 250g",
            "Hương vị: Chocolate, caramel, trái cây",
            "Rang xay: Medium roast",
            "Hạn sử dụng: 12 tháng"
        ]
    },
    coffee2: {
        title: "Ethiopia Guji",
        image: "./img/img_katra/katra_ethy.jpg",
        rating: "5.0",
        ratingCount: "32",
        oldPrice: "",
        currentPrice: "280.000₫",
        description: "Cà phê Ethiopia Guji có hương vị đặc trưng của vùng Guji, Ethiopia - một trong những vùng sản xuất cà phê nổi tiếng nhất thế giới. Hạt cà phê mang hương thơm của hoa, trái cây và vị chua thanh.",
        specs: [
            "Xuất xứ: Guji, Ethiopia",
            "Độ cao: 1800-2000m",
            "Quy cách: Gói 250g",
            "Hương vị: Hoa, trái cây, vị chua thanh",
            "Rang xay: Light to medium roast",
            "Hạn sử dụng: 12 tháng"
        ]
    },
    coffee3: {
        title: "Red Bourbon Specialty",
        image: "./img/img_katra/katra_redboubon.jpg",
        rating: "4.0",
        ratingCount: "26",
        oldPrice: "",
        currentPrice: "320.000₫",
        description: "Red Bourbon Specialty là dòng cà phê đặc sản cao cấp từ Đà Lạt, được chọn lọc kỹ lưỡng từ những hạt cà phê tốt nhất. Hương vị phức tạp với notes của chocolate đen, hạt dẻ và vị ngọt của mật ong.",
        specs: [
            "Xuất xứ: Đà Lạt, Lâm Đồng",
            "Độ cao: 1600-1800m",
            "Quy cách: Gói 200g",
            "Hương vị: Chocolate đen, hạt dẻ, mật ong",
            "Rang xay: Medium roast",
            "Hạn sử dụng: 12 tháng"
        ]
    },
    coffee4: {
        title: "Ethiopia Guji Specialty",
        image: "./img/img_katra/katra_ethy.jpg",
        rating: "4.5",
        ratingCount: "38",
        oldPrice: "",
        currentPrice: "350.000₫",
        description: "Ethiopia Guji Specialty là dòng cà phê đặc sản cao cấp nhất từ vùng Guji, Ethiopia. Hạt cà phê được chọn lọc kỹ lưỡng, mang đến hương vị phức tạp với notes của hoa, trái cây nhiệt đới và vị chua thanh.",
        specs: [
            "Xuất xứ: Guji, Ethiopia",
            "Độ cao: 2000-2200m",
            "Quy cách: Gói 200g",
            "Hương vị: Hoa, trái cây nhiệt đới, vị chua thanh",
            "Rang xay: Light roast",
            "Hạn sử dụng: 12 tháng"
        ]
    },
    coffee5: {
        title: "Cà Phê Blend Đặc Biệt",
        image: "./img/img_katra/katra_redboubon.jpg",
        rating: "5.0",
        ratingCount: "52",
        oldPrice: "300.000₫",
        currentPrice: "276.000₫",
        description: "Cà Phê Blend Đặc Biệt là sự kết hợp hoàn hảo giữa hạt Arabica Đà Lạt và Ethiopia, tạo nên hương vị cân bằng, đậm đà nhưng không quá đắng. Phù hợp cho cả pha espresso và pour over.",
        specs: [
            "Thành phần: 70% Arabica Đà Lạt, 30% Ethiopia",
            "Quy cách: Gói 250g",
            "Hương vị: Cân bằng, chocolate, caramel, hậu vị trái cây",
            "Rang xay: Medium-dark roast",
            "Phương pháp: Phù hợp cho espresso và pour over",
            "Hạn sử dụng: 12 tháng"
        ]
    },
    
    capsule1: {
        title: "Viên nén Red Bourbon",
        image: "./img/img_katra/katra_redboubon.jpg",
        rating: "4.5",
        ratingCount: "18",
        oldPrice: "120.000₫",
        currentPrice: "99.000₫",
        description: "Viên nén Red Bourbon - cà phê đặc sản, hương vị ngọt thanh, hậu vị chocolate, đóng hộp 10 viên tiện lợi. Thương hiệu Katra, phù hợp cho máy pha viên nén chuẩn Nespresso.",
        specs: [
            "Thành phần: 100% Red Bourbon đặc sản",
            "Quy cách: Hộp 10 viên",
            "Thương hiệu: Katra",
            "Hương vị: Ngọt thanh, hậu chocolate",
            "Phù hợp: Máy pha viên nén chuẩn Nespresso",
            "Hạn sử dụng: 12 tháng"
        ]
    },
    capsule2: {
        title: "Viên nén Ethyopia",
        image: "./img/img_katra/katra_ethy.jpg",
        rating: "4.5",
        ratingCount: "15",
        oldPrice: "109.000₫",
        currentPrice: "109.000₫",
        description: "Viên nén Ethyopia - cà phê vùng Ethiopia, hương hoa quả, vị chua thanh, đóng hộp 10 viên. Thương hiệu Katra, dùng cho máy viên nén chuẩn Nespresso.",
        specs: [
            "Thành phần: 100% Arabica Ethiopia",
            "Quy cách: Hộp 10 viên",
            "Thương hiệu: Katra",
            "Hương vị: Hoa quả, chua thanh",
            "Phù hợp: Máy pha viên nén chuẩn Nespresso",
            "Hạn sử dụng: 12 tháng"
        ]
    },
    capsule3: {
        title: "Viên nén Geisha lên men",
        image: "./img/img_katra/katra_redboubon.jpg",
        rating: "4.2",
        ratingCount: "22",
        oldPrice: "130.000₫",
        currentPrice: "115.000₫",
        description: "Viên nén Geisha lên men - cà phê Geisha lên men tự nhiên, hương vị phức hợp, đóng hộp 10 viên. Thương hiệu Katra, dùng cho máy viên nén chuẩn Nespresso.",
        specs: [
            "Thành phần: Geisha lên men tự nhiên",
            "Quy cách: Hộp 10 viên",
            "Thương hiệu: Katra",
            "Hương vị: Phức hợp, hậu ngọt",
            "Phù hợp: Máy pha viên nén chuẩn Nespresso",
            "Hạn sử dụng: 12 tháng"
        ]
    },
    capsule4: {
        title: "Viên nén Arabica lên men",
        image: "./img/img_katra/katra_ethy.jpg",
        rating: "4.7",
        ratingCount: "15",
        oldPrice: "140.000₫",
        currentPrice: "125.000₫",
        description: "Viên nén Arabica lên men - cà phê Arabica lên men, vị chua thanh, hậu ngọt, đóng hộp 10 viên. Thương hiệu Katra, dùng cho máy viên nén chuẩn Nespresso.",
        specs: [
            "Thành phần: Arabica lên men",
            "Quy cách: Hộp 10 viên",
            "Thương hiệu: Katra",
            "Hương vị: Chua thanh, hậu ngọt",
            "Phù hợp: Máy pha viên nén chuẩn Nespresso",
            "Hạn sử dụng: 12 tháng"
        ]
    },
    capsule5: {
        title: "Viên nén Robusta lên men",
        image: "./img/img_katra/katra_redboubon.jpg",
        rating: "4.3",
        ratingCount: "28",
        oldPrice: "130.000₫",
        currentPrice: "115.000₫",
        description: "Viên nén Robusta lên men - cà phê Robusta lên men, vị đậm, hậu ngọt, đóng hộp 10 viên. Thương hiệu Katra, dùng cho máy viên nén chuẩn Nespresso.",
        specs: [
            "Thành phần: Robusta lên men",
            "Quy cách: Hộp 10 viên",
            "Thương hiệu: Katra",
            "Hương vị: Đậm, hậu ngọt",
            "Phù hợp: Máy pha viên nén chuẩn Nespresso",
            "Hạn sử dụng: 12 tháng"
        ]
    }
    ,
    capsule6: {
        title: "Viên nén tổng hợp 5 vị",
        image: "./img/img_katra/katra_redboubon.jpg",
        rating: "4.8",
        ratingCount: "35",
        oldPrice: "135.000₫",
        currentPrice: "125.000₫",
        description: "Viên nén tổng hợp 5 vị - mỗi hộp gồm 2 viên Red Bourbon, 2 viên Ethyopia, 2 viên Geisha lên men, 2 viên Arabica lên men, 2 viên Robusta lên men. Tổng cộng 10 viên, thương hiệu Katra, phù hợp cho máy pha viên nén chuẩn Nespresso.",
        specs: [
            "Thành phần: 2 viên Red Bourbon, 2 viên Ethyopia, 2 viên Geisha lên men, 2 viên Arabica lên men, 2 viên Robusta lên men",
            "Quy cách: Hộp 10 viên (5 vị, mỗi vị 2 viên)",
            "Thương hiệu: Katra",
            "Hương vị: Tổng hợp đặc sản, trải nghiệm đa dạng",
            "Phù hợp: Máy pha viên nén chuẩn Nespresso",
            "Hạn sử dụng: 12 tháng"
        ]
    }
};


const CART_KEY = 'katra_cart';
let cart = [];

function parseCurrency(str) {
    if (!str) return 0;
    const n = parseInt(String(str).replace(/[^0-9]/g, ''));
    return isNaN(n) ? 0 : n;
}
function formatCurrency(n) {
    try {
        const s = Math.max(0, Math.round(n)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        return s + '₫';
    } catch { return '0₫'; }
}
function saveCart() {
    try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch {}
}
function loadCart() {
    try {
        const raw = localStorage.getItem(CART_KEY);
        cart = raw ? JSON.parse(raw) : [];
        if (!Array.isArray(cart)) cart = [];
    } catch { cart = []; }
}
function getCartCount() {
    return cart.reduce((sum, it) => sum + (it.qty || 0), 0);
}
function updateCartBadge() {
    const badge = document.querySelector('.cart-count');
    if (badge) badge.textContent = String(getCartCount());
}
function addToCart(productId, qty = 1) {
    const p = productData[productId];
    if (!p) return;
    const price = parseCurrency(p.currentPrice);
    const existing = cart.find(it => it.id === productId);
    if (existing) {
        existing.qty += qty;
    } else {
        cart.push({ id: productId, title: p.title, image: p.image, price, qty });
    }
    saveCart();
    updateCartBadge();
    renderCart();
}
function removeFromCart(productId) {
    cart = cart.filter(it => it.id !== productId);
    saveCart();
    updateCartBadge();
    renderCart();
}
function changeQty(productId, delta) {
    const it = cart.find(i => i.id === productId);
    if (!it) return;
    it.qty += delta;
    if (it.qty <= 0) {
        removeFromCart(productId);
        return;
    }
    saveCart();
    updateCartBadge();
    renderCart();
}

function renderCart() {
    const list = document.querySelector('#cart-modal .cart-items');
    const totalEl = document.querySelector('#cart-modal .cart-total-price');
    const checkoutBtn = document.querySelector('#cart-modal .btn-checkout');
    if (!list) return;
    if (!cart.length) {
        list.innerHTML = '<div class="cart-item empty">Chưa có sản phẩm nào trong giỏ hàng.</div>';
        if (totalEl) totalEl.textContent = '0₫';
        if (checkoutBtn) checkoutBtn.disabled = true;
        return;
    }
    let total = 0;
    list.innerHTML = cart.map(it => {
        const line = (it.price || 0) * (it.qty || 0);
        total += line;
        return `
        <div class="cart-item" data-id="${it.id}">
            <div class="cart-item-thumb"><img src="${it.image}" alt="${it.title}"></div>
            <div class="cart-item-info">
                <div class="cart-item-name">${it.title}</div>
                <div class="cart-item-qty">
                    <button class="cart-qty-dec" aria-label="Giảm">-</button>
                    <span class="qty">${it.qty}</span>
                    <button class="cart-qty-inc" aria-label="Tăng">+</button>
                </div>
            </div>
            <div class="cart-item-price">${formatCurrency(line)}</div>
            <button class="cart-item-remove" aria-label="Xóa" title="Xóa">×</button>
        </div>`;
    }).join('');
    if (totalEl) totalEl.textContent = formatCurrency(total);
    if (checkoutBtn) checkoutBtn.disabled = false;
}


document.addEventListener('DOMContentLoaded', function() {
    loadCart();
    updateCartBadge();
    renderCart();
    const list = document.querySelector('#cart-modal .cart-items');
    if (list) {
        list.addEventListener('click', function(e) {
            const dec = e.target.closest('.cart-qty-dec');
            const inc = e.target.closest('.cart-qty-inc');
            const rm = e.target.closest('.cart-item-remove');
            const itemEl = e.target.closest('.cart-item');
            if (!itemEl) return;
            const id = itemEl.getAttribute('data-id');
            if (inc) { changeQty(id, +1); }
            else if (dec) { changeQty(id, -1); }
            else if (rm) { removeFromCart(id); }
        });
    }
    
    const cartBtn = document.querySelector('.header-actions .cart-link');
    if (cartBtn) {
        cartBtn.addEventListener('click', function() { renderCart(); });
    }
});


productCards.forEach(card => {
    card.addEventListener('click', () => {
        const productId = card.dataset.id;
        const product = productData[productId];
        
        if (product) {
            modalProductImage.src = product.image;
            modalProductImage.alt = product.title;
            modalProductTitle.textContent = product.title;
            modalRatingCount.textContent = `(${product.ratingCount})`;
            if (product.oldPrice) {
                modalOldPrice.textContent = product.oldPrice;
                modalOldPrice.style.display = 'inline';
            } else {
                modalOldPrice.style.display = 'none';
            }
            modalCurrentPrice.textContent = product.currentPrice;
            modalProductDescription.textContent = product.description;

            
            const wrapDefault = document.getElementById('modal-specs-default');
            const wrapTea = document.getElementById('modal-specs-tea');
            const wrapCapsule = document.getElementById('modal-specs-capsule');
            const wrapCoffee = document.getElementById('modal-specs-coffee');

            const ulDefault = document.getElementById('modal-product-specs');
            const ulTea = document.getElementById('modal-tea-specs');
            const ulCapsule = document.getElementById('modal-capsule-specs');
            const ulCoffee = document.getElementById('modal-coffee-specs');

            const linkDefault = document.getElementById('show-specs-link');
            const linkTea = document.getElementById('show-tea-specs-link');
            const linkCapsule = document.getElementById('show-capsule-specs-link');
            const linkCoffee = document.getElementById('show-coffee-specs-link');

            
            [wrapDefault, wrapTea, wrapCapsule, wrapCoffee].forEach(el => { if (el) el.style.display = 'none'; });
            [ulDefault, ulTea, ulCapsule, ulCoffee].forEach(el => { if (el) el.style.display = 'none'; if (el) el.innerHTML = ''; });
            [linkDefault, linkTea, linkCapsule, linkCoffee].forEach(el => { if (el) el.style.display = ''; });

            if (productId.startsWith('tea')) {
                
                if (wrapTea) wrapTea.style.display = '';
                if (ulTea) {
                    product.specs.forEach(spec => {
                        const li = document.createElement('li');
                        li.textContent = spec;
                        ulTea.appendChild(li);
                    });
                }
                modalCurrentPrice.className = 'current-price tea-price';
            } else {
                
                if (wrapDefault) wrapDefault.style.display = '';
                if (ulDefault) {
                    product.specs.forEach(spec => {
                        const li = document.createElement('li');
                        li.textContent = spec;
                        ulDefault.appendChild(li);
                    });
                }
                if (productId.startsWith('coffee')) {
                    modalCurrentPrice.className = 'current-price coffee-price';
                } else {
                    modalCurrentPrice.className = 'current-price';
                }
            }

            
            quantityInput.value = 1;
            
            if (modal) modal.setAttribute('data-product-id', productId);
            
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden'; 
        }
    });
});


closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
    document.body.style.overflow = ''; 
});


window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
        document.body.style.overflow = ''; 
    }
});


minusBtn.addEventListener('click', () => {
    const currentValue = parseInt(quantityInput.value);
    if (currentValue > 1) {
        quantityInput.value = currentValue - 1;
    }
});

plusBtn.addEventListener('click', () => {
    const currentValue = parseInt(quantityInput.value);
    if (currentValue < 99) {
        quantityInput.value = currentValue + 1;
    }
});


quantityInput.addEventListener('input', () => {
    quantityInput.value = quantityInput.value.replace(/[^0-9]/g, '');
    if (quantityInput.value === '' || parseInt(quantityInput.value) < 1) {
        quantityInput.value = 1;
    } else if (parseInt(quantityInput.value) > 99) {
        quantityInput.value = 99;
    }
});


document.querySelector('.add-to-cart-modal').addEventListener('click', () => {
    const quantity = parseInt(quantityInput.value) || 1;
    const productId = modal ? modal.getAttribute('data-product-id') : null;
    if (productId) {
        addToCart(productId, quantity);
    }
    modal.style.display = 'none';
    document.body.style.overflow = '';
});



document.querySelector('.buy-now').addEventListener('click', () => {
    const productName = modalProductTitle.textContent;
    const quantity = parseInt(quantityInput.value);
    
    const orderModal = document.getElementById('order-modal');
    const productsList = document.getElementById('order-products-list');
    if (orderModal && productsList) {
        productsList.innerHTML = `
            <div class="form-group" style="display:flex; flex-direction:row; gap:1rem; align-items:center; margin-bottom:0.5rem;">
                <div style="flex:2; display:flex; flex-direction:column;">
                    <label style="font-weight:500; margin-bottom:0.3rem; color:#6c4c2b;">Sản phẩm</label>
                    <input type="text" readonly value="${productName}" style="background:#f7f7f7; border:1px solid #e0e0e0; border-radius:8px; padding:0.7rem; font-size:1rem; color:#333;">
                </div>
                <div style="flex:1; display:flex; flex-direction:column; align-items:center;">
                    <label style="font-weight:500; margin-bottom:0.3rem; color:#6c4c2b;">Số lượng</label>
                    <div class="order-qty-selector" style="display:flex; gap:0.35rem; align-items:center;">
                        <button type="button" class="order-qty-dec" style="width:34px;height:34px;border-radius:6px;border:1px solid #e0e0e0;background:#f7f7f7;">-</button>
                        <input type="number" class="order-qty-input" min="1" max="99" value="${quantity}" style="width:56px;text-align:center;padding:0.45rem;border:1px solid #e0e0e0;border-radius:6px;background:#f7f7f7;font-size:1rem;color:#333;">
                        <button type="button" class="order-qty-inc" style="width:34px;height:34px;border-radius:6px;border:1px solid #e0e0e0;background:#f7f7f7;">+</button>
                    </div>
                </div>
            </div>
        `;
        
        setupOrderQtyControls(productsList);
        orderModal.style.display = 'block';
        modal.style.display = 'none';
        document.body.style.overflow = 'hidden';
    }
});


window.addEventListener('click', (e) => {
    const orderModal = document.getElementById('order-modal');
    if (orderModal && e.target === orderModal) {
        orderModal.style.display = 'none';
        document.body.style.overflow = '';
    }
});


document.addEventListener('DOMContentLoaded', function() {
    const orderForm = document.querySelector('.order-form');
    if (orderForm) {
        orderForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('order-name').value.trim();
            const phone = document.getElementById('order-phone').value.trim();
            const address = document.getElementById('order-address').value.trim();
            
            const noteEl = document.getElementById('order-note');
            const noteRaw = noteEl ? noteEl.value.trim() : '';
            
            const order_note = noteRaw ? noteRaw.replace(/\n/g, '<br>') : 'Không có ghi chú';
            
            const productsList = document.getElementById('order-products-list');
            let productArr = [];
            if (productsList) {
                const groups = productsList.querySelectorAll('.form-group');
                groups.forEach(group => {
                    const titleInput = group.querySelector('input[type="text"]');
                    const qtyInput = group.querySelector('input[type="number"]');
                    if (titleInput && qtyInput) {
                        const title = titleInput.value;
                        const qty = qtyInput.value;
                        productArr.push(`<div style='margin-bottom:6px;'>Sản phẩm: <strong>${title}</strong> &nbsp; SL: <strong>${qty}</strong></div>`);
                    }
                });
            }
            const order_product_table = productArr.join('');
            const success = document.getElementById('order-success');
            const successMsg = document.getElementById('order-success-msg');
            const error = document.getElementById('order-error');
            success.style.display = 'none';
            successMsg.textContent = '';
            error.textContent = '';
            let valid = true;
            if (name.length < 2) {
                error.textContent = 'Vui lòng nhập họ tên.';
                valid = false;
            }
            if (!phone.match(/^0[0-9]{9,10}$/)) {
                error.textContent = 'Số điện thoại không hợp lệ.';
                valid = false;
            }
            if (address.length < 5) {
                error.textContent = 'Vui lòng nhập địa chỉ.';
                valid = false;
            }
            if (!valid) return;
            
            const templateParams = {
                order_name: name,
                order_phone: phone,
                order_address: address,
                order_product_table: order_product_table,
                
                order_note: order_note
            };
            emailjs.send('service_3o1xdxo', 'template_2chvftz', templateParams)
                .then(function(response) {
                    
                    const toast = document.getElementById('toast-order');
                    const toastMsg = document.getElementById('toast-order-msg');
                    const toastClose = document.getElementById('toast-order-close');
                    toastMsg.innerHTML = `<strong style='font-size:1.18rem;'>Đã nhận đơn hàng!</strong><br><span style='color:#a67c52'>Cảm ơn bạn đã đặt hàng. Chúng tôi sẽ liên hệ xác nhận qua số <span style='color:#a67c52'>${phone}</span> và giao hàng tới địa chỉ bạn cung cấp.</span>`;
                    toast.style.display = 'block';
                    setTimeout(function(){ toast.style.opacity = '1'; }, 50);
                    
                    toastClose.onclick = function() {
                        toast.style.opacity = '0';
                        setTimeout(function(){ toast.style.display = 'none'; }, 500);
                    };
                    
                    success.style.display = 'none';
                    error.textContent = '';
                    orderForm.reset();
                    setTimeout(function() {
                        document.getElementById('order-modal').style.display = 'none';
                        document.body.style.overflow = '';
                    }, 1200);
                }, function(errorObj) {
                    error.textContent = 'Gửi email thất bại, vui lòng thử lại!';
                });
        });
    }

    
    const checkoutBtn = document.querySelector('.btn-checkout');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
                
                let cartList = cart || [];
            if (!cartList.length) return;
            
            const orderModal = document.getElementById('order-modal');
            const productsList = document.getElementById('order-products-list');
            if (orderModal && productsList) {
                productsList.innerHTML = cartList.map(it => `
                    <div class="form-group" style="display:flex; flex-direction:row; gap:1rem; align-items:center; margin-bottom:0.5rem;">
                        <div style="flex:2; display:flex; flex-direction:column;">
                            <label style="font-weight:500; margin-bottom:0.3rem; color:#6c4c2b;">Sản phẩm</label>
                            <input type="text" readonly value="${it.title}" style="background:#f7f7f7; border:1px solid #e0e0e0; border-radius:8px; padding:0.7rem; font-size:1rem; color:#333;">
                        </div>
                        <div style="flex:1; display:flex; flex-direction:column; align-items:center;">
                            <label style="font-weight:500; margin-bottom:0.3rem; color:#6c4c2b;">Số lượng</label>
                            <div class="order-qty-selector" style="display:flex; gap:0.35rem; align-items:center;">
                                <button type="button" class="order-qty-dec" style="width:34px;height:34px;border-radius:6px;border:1px solid #e0e0e0;background:#f7f7f7;">-</button>
                                <input type="number" class="order-qty-input" min="1" max="99" value="${it.qty}" style="width:56px;text-align:center;padding:0.45rem;border:1px solid #e0e0e0;border-radius:6px;background:#f7f7f7;font-size:1rem;color:#333;">
                                <button type="button" class="order-qty-inc" style="width:34px;height:34px;border-radius:6px;border:1px solid #e0e0e0;background:#f7f7f7;">+</button>
                            </div>
                        </div>
                    </div>
                `).join('');
                
                setupOrderQtyControls(productsList);
                orderModal.style.display = 'block';
                document.body.style.overflow = 'hidden';
                
                const cartModal = document.getElementById('cart-modal');
                if (cartModal) cartModal.style.display = 'none';
            }
        });
    }
});


const addToCartButtons = document.querySelectorAll('.add-to-cart');
addToCartButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        e.stopPropagation(); 
        const card = button.closest('.product-card');
        const productId = card ? card.getAttribute('data-id') : null;
        if (productId) addToCart(productId, 1);
    });
});


const newsletterForm = document.querySelector('.newsletter-form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = newsletterForm.querySelector('input').value;
        alert(`Cảm ơn bạn đã đăng ký nhận thông tin với email: ${email}`);
        newsletterForm.reset();
    });
}


document.addEventListener('DOMContentLoaded', () => {
    // For banner images
    bannerImages.forEach((img, index) => {
        const colors = ['#D2691E', '#008000', '#654321'];
        const titles = ['Máy Lọc Nước Cera', 'Hà An Trà - Trà Thượng Hạng', 'Cà Phê Hạt Cao Cấp'];
        img.src = `data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1200' height='400' viewBox='0 0 1200 400' preserveAspectRatio='none'%3E%3Crect fill='${colors[index]}' width='1200' height='400'/%3E%3Ctext fill='rgba(255,255,255,0.8)' font-family='Arial' font-size='40' x='50%25' y='50%25' text-anchor='middle' dominant-baseline='middle'%3E${titles[index]}%3C/text%3E%3C/svg%3E`;
    });
    
    productImages.forEach(img => {
        const productId = img.closest('.product-card').dataset.id;
        let color = '#D2691E';
        
        if (productId.startsWith('tea')) {
            color = '#008000';
        } else if (productId.startsWith('coffee')) {
            color = '#654321';
        }
        
        img.src = `data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300' viewBox='0 0 300 300' preserveAspectRatio='none'%3E%3Crect fill='${color}' width='300' height='300'/%3E%3Ctext fill='rgba(255,255,255,0.8)' font-family='Arial' font-size='20' x='50%25' y='50%25' text-anchor='middle' dominant-baseline='middle'%3E${img.alt}%3C/text%3E%3C/svg%3E`;
    });
});


function setupShowSpecsLinks() {
    [
        { link: 'show-specs-link', list: 'modal-product-specs' },
        { link: 'show-tea-specs-link', list: 'modal-tea-specs' },
        { link: 'show-capsule-specs-link', list: 'modal-capsule-specs' },
        { link: 'show-coffee-specs-link', list: 'modal-coffee-specs' }
    ].forEach(function(item) {
        var link = document.getElementById(item.link);
        var list = document.getElementById(item.list);
        if (link && list) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                list.style.display = 'block';
                link.style.display = 'none';
            });
        }
    });
}
document.addEventListener('DOMContentLoaded', setupShowSpecsLinks);




(function setupSearchAutocomplete(){
    const input = document.getElementById('search-input');
    const suggestionsEl = document.getElementById('search-suggestions');
    const searchBtn = document.getElementById('search-button');
    if (!input || !suggestionsEl) return;

    let items = Object.keys(productData).map(id => ({ id, title: productData[id].title || id, image: productData[id].image || '', price: productData[id].currentPrice || '' }));
    let activeIndex = -1;

    function renderSuggestions(list){
        suggestionsEl.innerHTML = '';
        if (!list.length) {
            suggestionsEl.setAttribute('aria-hidden', 'true');
            return;
        }
        list.forEach((it, idx) => {
            const el = document.createElement('div');
            el.className = 'suggestion-item';
            el.setAttribute('role','option');
            el.setAttribute('data-id', it.id);
            el.setAttribute('data-idx', idx);
            el.innerHTML = `
                <div class="suggestion-thumb"><img src="${it.image}" alt="${it.title}"></div>
                <div class="suggestion-meta">
                    <div class="suggestion-title">${it.title}</div>
                    <div class="suggestion-sub">${it.price}</div>
                </div>`;
            el.addEventListener('click', function(e){
                const pid = this.getAttribute('data-id');
                selectSuggestion(pid);
            });
            suggestionsEl.appendChild(el);
        });
        suggestionsEl.setAttribute('aria-hidden', 'false');
        activeIndex = -1;
    }

    function filterQuery(q){
        if (!q || q.trim().length < 1) return [];
        q = q.trim().toLowerCase();
        
        const out = items.filter(it => it.title.toLowerCase().includes(q) || it.id.toLowerCase().includes(q));
        return out.slice(0,8);
    }

    function selectSuggestion(productId){
        
        suggestionsEl.setAttribute('aria-hidden', 'true');
        suggestionsEl.innerHTML = '';
        input.value = '';
        
        const product = productData[productId];
        if (product) {
            
            const modalEl = document.getElementById('product-modal');
            if (modalEl) {
                modalEl.setAttribute('data-product-id', productId);
            }
            
            if (typeof openProductById === 'function') {
                openProductById(productId);
            } else {
                
                const modalProductImage = document.getElementById('modal-product-image');
                const modalProductTitle = document.getElementById('modal-product-title');
                const modalRatingCount = document.getElementById('modal-rating-count');
                const modalOldPrice = document.getElementById('modal-old-price');
                const modalCurrentPrice = document.getElementById('modal-current-price');
                const modalProductDescription = document.getElementById('modal-product-description');

                modalProductImage.src = product.image;
                modalProductImage.alt = product.title;
                modalProductTitle.textContent = product.title;
                modalRatingCount.textContent = `(${product.ratingCount || ''})`;
                if (product.oldPrice) { modalOldPrice.textContent = product.oldPrice; modalOldPrice.style.display = 'inline'; } else { modalOldPrice.style.display = 'none'; }
                modalCurrentPrice.textContent = product.currentPrice || '';
                modalProductDescription.textContent = product.description || '';
                const modal = document.getElementById('product-modal');
                if (modal) { modal.style.display = 'block'; document.body.style.overflow = 'hidden'; modal.setAttribute('data-product-id', productId); }
            }
        }
    }

    input.addEventListener('input', function(){
        const q = input.value;
        const list = filterQuery(q);
        renderSuggestions(list);
    });

    input.addEventListener('keydown', function(e){
        const visible = suggestionsEl.getAttribute('aria-hidden') === 'false';
        const opts = suggestionsEl.querySelectorAll('.suggestion-item');
        if (!visible || !opts.length) return;
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            activeIndex = Math.min(activeIndex + 1, opts.length - 1);
            opts.forEach((o,i)=> o.setAttribute('aria-selected', i===activeIndex));
            opts[activeIndex] && opts[activeIndex].scrollIntoView({ block: 'nearest' });
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            activeIndex = Math.max(activeIndex - 1, 0);
            opts.forEach((o,i)=> o.setAttribute('aria-selected', i===activeIndex));
            opts[activeIndex] && opts[activeIndex].scrollIntoView({ block: 'nearest' });
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (activeIndex >= 0 && opts[activeIndex]) {
                const pid = opts[activeIndex].getAttribute('data-id');
                selectSuggestion(pid);
            } else if (opts[0]) {
                selectSuggestion(opts[0].getAttribute('data-id'));
            }
        } else if (e.key === 'Escape') {
            suggestionsEl.setAttribute('aria-hidden','true');
        }
    });

    
    document.addEventListener('click', function(e){
        if (!input.contains(e.target) && !suggestionsEl.contains(e.target)) {
            suggestionsEl.setAttribute('aria-hidden','true');
        }
    });

    
    if (searchBtn) {
        searchBtn.addEventListener('click', function(e){
            e.preventDefault();
            const q = input.value.trim();
            if (!q) { input.focus(); return; }
            const list = filterQuery(q);
            if (list && list.length) selectSuggestion(list[0].id);
        });
    }

    
    window.openProductById = function(productId) {
        const card = document.querySelector(`.product-card[data-id="${productId}"]`);
        if (card) {
            card.click();
            return;
        }
        
        const product = productData[productId];
        if (!product) return;
        const modalProductImage = document.getElementById('modal-product-image');
        const modalProductTitle = document.getElementById('modal-product-title');
        const modalRatingCount = document.getElementById('modal-rating-count');
        const modalOldPrice = document.getElementById('modal-old-price');
        const modalCurrentPrice = document.getElementById('modal-current-price');
        const modalProductDescription = document.getElementById('modal-product-description');

        modalProductImage.src = product.image;
        modalProductImage.alt = product.title;
        modalProductTitle.textContent = product.title;
        modalRatingCount.textContent = `(${product.ratingCount || ''})`;
        if (product.oldPrice) { modalOldPrice.textContent = product.oldPrice; modalOldPrice.style.display = 'inline'; } else { modalOldPrice.style.display = 'none'; }
        modalCurrentPrice.textContent = product.currentPrice || '';
        modalProductDescription.textContent = product.description || '';
        const modal = document.getElementById('product-modal');
        if (modal) { modal.style.display = 'block'; document.body.style.overflow = 'hidden'; modal.setAttribute('data-product-id', productId); }
    };

})();


function setupOrderQtyControls(container) {
    if (!container) return;
    
    const decBtns = container.querySelectorAll('.order-qty-dec');
    const incBtns = container.querySelectorAll('.order-qty-inc');
    const inputs = container.querySelectorAll('.order-qty-input');

    function clampInput(input) {
        if (!input) return;
        let v = parseInt(input.value, 10);
        if (isNaN(v) || v < parseInt(input.min || 1)) v = parseInt(input.min || 1);
        if (parseInt(input.max || 99) && v > parseInt(input.max || 99)) v = parseInt(input.max || 99);
        input.value = v;
    }

    decBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const input = this.parentElement.querySelector('.order-qty-input');
            if (!input) return;
            let v = parseInt(input.value, 10) || 1;
            v = Math.max(parseInt(input.min || 1), v - 1);
            input.value = v;
            input.dispatchEvent(new Event('change'));
        });
    });

    incBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const input = this.parentElement.querySelector('.order-qty-input');
            if (!input) return;
            let v = parseInt(input.value, 10) || 1;
            v = Math.min(parseInt(input.max || 99), v + 1);
            input.value = v;
            input.dispatchEvent(new Event('change'));
        });
    });

    inputs.forEach(input => {
        
        input.addEventListener('input', function() {
            this.value = this.value.replace(/[^0-9]/g, '');
        });
        input.addEventListener('change', function() {
            clampInput(this);
        });
    });
}



function initBannerCarousel() {
    const slides = document.querySelectorAll('.carousel-slide');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    let currentIndex = 0;

    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
        });
    }

    function nextSlide() {
        currentIndex = (currentIndex + 1) % slides.length;
        showSlide(currentIndex);
    }

    function prevSlide() {
        currentIndex = (currentIndex - 1 + slides.length) % slides.length;
        showSlide(currentIndex);
    }

    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);

    
    setInterval(nextSlide, 1000);

    showSlide(currentIndex);
}

document.addEventListener('DOMContentLoaded', initBannerCarousel);
