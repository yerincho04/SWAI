/* ============================================
   TemplateMo 3D Glassmorphism Dashboard
   https://templatemo.com
   JavaScript
============================================ */

(function() {
    'use strict';

    // ============================================
    // Theme Toggle
    // ============================================
    function initThemeToggle() {
        const themeToggle = document.getElementById('theme-toggle');
        if (!themeToggle) return;

        const iconSun = themeToggle.querySelector('.icon-sun');
        const iconMoon = themeToggle.querySelector('.icon-moon');
        
        function setTheme(theme) {
            document.documentElement.setAttribute('data-theme', theme);
            localStorage.setItem('theme', theme);
            
            if (iconSun && iconMoon) {
                if (theme === 'light') {
                    iconSun.style.display = 'none';
                    iconMoon.style.display = 'block';
                } else {
                    iconSun.style.display = 'block';
                    iconMoon.style.display = 'none';
                }
            }
        }
        
        // Force light as the current project default.
        setTheme('light');
        
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            setTheme(currentTheme === 'dark' ? 'light' : 'dark');
        });
    }

    // ============================================
    // 3D Tilt Effect
    // ============================================
    function initTiltEffect() {
        document.querySelectorAll('.glass-card-3d').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 20;
                const rotateY = (centerX - x) / 20;
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
            });
        });
    }

    // ============================================
    // Animated Counters
    // ============================================
    function animateCounter(element, target, duration = 2000) {
        const start = 0;
        const startTime = performance.now();
        
        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(start + (target - start) * easeOut);
            
            if (element.dataset.prefix) {
                element.textContent = element.dataset.prefix + current.toLocaleString() + (element.dataset.suffix || '');
            } else {
                element.textContent = current.toLocaleString() + (element.dataset.suffix || '');
            }
            
            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }
        
        requestAnimationFrame(update);
    }

    function initCounters() {
        const counters = document.querySelectorAll('.stat-value');
        counters.forEach(counter => {
            const text = counter.textContent;
            const value = parseInt(text.replace(/[^0-9]/g, ''));
            
            if (text.includes('$')) {
                counter.dataset.prefix = '$';
            }
            if (text.includes('%')) {
                counter.dataset.suffix = '%';
            }
            
            animateCounter(counter, value);
        });
    }

    // ============================================
    // Mobile Menu Toggle
    // ============================================
    function initMobileMenu() {
        const menuToggle = document.querySelector('.mobile-menu-toggle');
        const sidebar = document.getElementById('sidebar');
        
        if (menuToggle && sidebar) {
            menuToggle.addEventListener('click', () => {
                sidebar.classList.toggle('open');
            });

            // Close sidebar when clicking outside
            document.addEventListener('click', (e) => {
                if (sidebar.classList.contains('open') && 
                    !sidebar.contains(e.target) && 
                    !menuToggle.contains(e.target)) {
                    sidebar.classList.remove('open');
                }
            });
        }
    }

    // ============================================
    // Form Validation (for login/register)
    // ============================================
    function initFormValidation() {
        const forms = document.querySelectorAll('form[data-validate]');
        
        forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                
                let isValid = true;
                const inputs = form.querySelectorAll('.form-input[required]');
                
                inputs.forEach(input => {
                    if (!input.value.trim()) {
                        isValid = false;
                        input.style.borderColor = '#ff6b6b';
                    } else {
                        input.style.borderColor = '';
                    }
                });

                // Email validation
                const emailInput = form.querySelector('input[type="email"]');
                if (emailInput && emailInput.value) {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(emailInput.value)) {
                        isValid = false;
                        emailInput.style.borderColor = '#ff6b6b';
                    }
                }

                if (isValid) {
                    // Form is valid - you can add your submission logic here
                    console.log('Form is valid');
                    // For demo purposes, redirect to dashboard
                    if (form.dataset.redirect) {
                        window.location.href = form.dataset.redirect;
                    }
                }
            });
        });
    }

    // ============================================
    // Password Visibility Toggle
    // ============================================
    function initPasswordToggle() {
        const toggleButtons = document.querySelectorAll('.password-toggle');
        
        toggleButtons.forEach(button => {
            button.addEventListener('click', () => {
                const input = button.parentElement.querySelector('input');
                const icon = button.querySelector('svg');
                
                if (input.type === 'password') {
                    input.type = 'text';
                    icon.innerHTML = '<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>';
                } else {
                    input.type = 'password';
                    icon.innerHTML = '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>';
                }
            });
        });
    }

    // ============================================
    // Smooth Page Transitions
    // ============================================
    function initPageTransitions() {
        const links = document.querySelectorAll('a[href$=".html"]');
        
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                // Skip external links
                if (link.hostname !== window.location.hostname) return;
                
                e.preventDefault();
                const href = link.getAttribute('href');
                
                document.body.style.opacity = '0';
                document.body.style.transition = 'opacity 0.3s ease';
                
                setTimeout(() => {
                    window.location.href = href;
                }, 300);
            });
        });

        // Fade in on page load
        window.addEventListener('load', () => {
            document.body.style.opacity = '1';
        });
    }

    // ============================================
    // Settings Tab Navigation
    // ============================================
    function initSettingsTabs() {
        const tabLinks = document.querySelectorAll('.settings-nav-link[data-tab]');
        
        if (tabLinks.length === 0) return;

        tabLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Get target tab
                const tabId = link.getAttribute('data-tab');
                
                // Remove active class from all nav links
                document.querySelectorAll('.settings-nav-link').forEach(navLink => {
                    navLink.classList.remove('active');
                });
                
                // Add active class to clicked link
                link.classList.add('active');
                
                // Hide all tab contents
                document.querySelectorAll('.settings-tab-content').forEach(tab => {
                    tab.classList.remove('active');
                });
                
                // Show target tab content
                const targetTab = document.getElementById('tab-' + tabId);
                if (targetTab) {
                    targetTab.classList.add('active');
                }
            });
        });

        // Theme select sync with toggle
        const themeSelect = document.getElementById('theme-select');
        if (themeSelect) {
            const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
            themeSelect.value = currentTheme;
            
            themeSelect.addEventListener('change', () => {
                const theme = themeSelect.value;
                if (theme === 'system') {
                    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                    document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
                } else {
                    document.documentElement.setAttribute('data-theme', theme);
                    localStorage.setItem('theme', theme);
                }
                
                // Update theme toggle icons
                const iconSun = document.querySelector('#theme-toggle .icon-sun');
                const iconMoon = document.querySelector('#theme-toggle .icon-moon');
                if (iconSun && iconMoon) {
                    const effectiveTheme = document.documentElement.getAttribute('data-theme');
                    if (effectiveTheme === 'light') {
                        iconSun.style.display = 'none';
                        iconMoon.style.display = 'block';
                    } else {
                        iconSun.style.display = 'block';
                        iconMoon.style.display = 'none';
                    }
                }
            });
        }
    }

    // ============================================
    // Google Sheet Insert Test
    // ============================================
    function getCookieValue(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) {
            return parts.pop().split(';').shift();
        }
        return '';
    }

    function setCookieValue(name, value, days) {
        let expires = '';

        if (days) {
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = `; expires=${date.toUTCString()}`;
        }

        document.cookie = `${name}=${value || ''}${expires}; path=/`;
    }

    function getVisitorId() {
        const cookieName = 'glassdash_uv';
        const existingId = getCookieValue(cookieName);

        if (existingId) {
            return existingId;
        }

        const newId = Math.random().toString(36).slice(2, 10);
        setCookieValue(cookieName, newId, 365);
        return newId;
    }

    function requestJsonp(url) {
        return new Promise((resolve, reject) => {
            const callbackName = `sheetInsertCallback_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
            const script = document.createElement('script');
            const separator = url.includes('?') ? '&' : '?';
            const cleanup = () => {
                delete window[callbackName];
                if (script.parentNode) {
                    script.parentNode.removeChild(script);
                }
            };

            window[callbackName] = (data) => {
                cleanup();
                resolve(data);
            };

            script.src = `${url}${separator}callback=${callbackName}`;
            script.onerror = () => {
                cleanup();
                reject(new Error('Failed to reach the Apps Script endpoint.'));
            };

            document.body.appendChild(script);
        });
    }

    function initSheetInsertTest() {
        const button = document.getElementById('sheet-insert-test-btn');
        if (!button) return;

        const scriptUrlInput = document.getElementById('sheet-script-url');
        const tableInput = document.getElementById('sheet-table-name');
        const emailInput = document.getElementById('sheet-test-email');
        const adviceInput = document.getElementById('sheet-test-advice');
        const status = document.getElementById('sheet-insert-status');

        button.addEventListener('click', async () => {
            const scriptUrl = scriptUrlInput.value.trim();
            const tableName = tableInput.value.trim() || 'tab_final';
            const email = emailInput.value.trim();
            const advice = adviceInput.value.trim();
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!scriptUrl) {
                status.textContent = 'Add your deployed Apps Script URL first.';
                scriptUrlInput.focus();
                return;
            }

            if (!email || !emailRegex.test(email)) {
                status.textContent = 'Enter a valid email before sending the test row.';
                emailInput.focus();
                return;
            }

            const payload = JSON.stringify({
                id: getVisitorId(),
                email,
                advice
            });

            const requestUrl = `${scriptUrl}?action=insert&table=${encodeURIComponent(tableName)}&data=${encodeURIComponent(payload)}`;

            button.disabled = true;
            status.textContent = 'Sending test row to Google Sheets...';

            try {
                const response = await requestJsonp(requestUrl);

                if (response && response.success) {
                    status.textContent = `Insert succeeded. Saved row for ${email}.`;
                    adviceInput.value = '';
                } else {
                    const errorMessage = response && response.data && response.data.error
                        ? response.data.error
                        : 'The script responded, but it did not report success.';
                    status.textContent = `Insert failed: ${errorMessage}`;
                }
            } catch (error) {
                status.textContent = `Insert failed: ${error.message}`;
            } finally {
                button.disabled = false;
            }
        });
    }

    // ============================================
    // Initialize All Functions
    // ============================================
    function init() {
        initThemeToggle();
        initTiltEffect();
        initCounters();
        initMobileMenu();
        initFormValidation();
        initPasswordToggle();
        initPageTransitions();
        initSettingsTabs();
        initSheetInsertTest();
    }

    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
