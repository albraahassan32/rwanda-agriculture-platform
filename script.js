/**** Language Data ****/
const translations = {
    "ar": {
        "nav_home": "الرئيسية",
        "nav_market": "السوق",
        "nav_export": "التصدير",
        "nav_resources": "الموارد",
        "nav_about": "عن المنصة",
        "nav_contact": "اتصل بنا",
        "login_button": "تسجيل الدخول",
        "signup_button": "إنشاء حساب",
        "hero_title": "منصة رواندا الزراعية - ربط المزارعين بالأسواق العالمية",
        "hero_subtitle": "نحن نمكّن المزارعين الروانديين من الوصول إلى الأسواق العالمية، وتسهيل التصدير، وتعظيم أرباحهم من خلال منصة رقمية متكاملة",
        "hero_cta_trade": "ابدأ التداول الآن",
        "hero_cta_learn": "تعرف علينا أكثر",
        "current_language_text": "العربية",
        "language_arabic": "العربية",
        "language_english": "English",
        "language_french": "Français",
        "language_kinyarwanda": "Kinyarwanda",
        "market_link": "marketplace.html"
    },
    "en": {
        "nav_home": "Home",
        "nav_market": "Marketplace",
        "nav_export": "Export",
        "nav_resources": "Resources",
        "nav_about": "About Us",
        "nav_contact": "Contact Us",
        "login_button": "Login",
        "signup_button": "Sign Up",
        "hero_title": "Rwanda Agricultural Platform - Connecting Farmers to Global Markets",
        "hero_subtitle": "We empower Rwandan farmers to access global markets, facilitate exports, and maximize their profits through an integrated digital platform.",
        "hero_cta_trade": "Start Trading Now",
        "hero_cta_learn": "Learn More About Us",
        "current_language_text": "English",
        "language_arabic": "العربية",
        "language_english": "English",
        "language_french": "Français",
        "language_kinyarwanda": "Kinyarwanda",
        "market_link": "marketplace.html?lang=en"
    },
    "fr": {
        "nav_home": "Accueil",
        "nav_market": "Marché",
        "nav_export": "Exportation",
        "nav_resources": "Ressources",
        "nav_about": "À propos de nous",
        "nav_contact": "Contactez-nous",
        "login_button": "Connexion",
        "signup_button": "S'inscrire",
        "hero_title": "Plateforme Agricole du Rwanda - Connecter les Agriculteurs aux Marchés Mondiaux",
        "hero_subtitle": "Nous permettons aux agriculteurs rwandais d'accéder aux marchés mondiaux, de faciliter les exportations et de maximiser leurs profits grâce à une plateforme numérique intégrée.",
        "hero_cta_trade": "Commencez à Trader Maintenant",
        "hero_cta_learn": "En Savoir Plus Sur Nous",
        "current_language_text": "Français",
        "language_arabic": "العربية",
        "language_english": "English",
        "language_french": "Français",
        "language_kinyarwanda": "Kinyarwanda",
        "market_link": "marketplace.html?lang=fr"
    },
    "rw": {
        "nav_home": "Ahabanza",
        "nav_market": "Isoko",
        "nav_export": "Kohereza mu Mahanga",
        "nav_resources": "Ibikoresho",
        "nav_about": "Abo Turibo",
        "nav_contact": "Twandikire",
        "login_button": "Injira",
        "signup_button": "Iyandikishe",
        "hero_title": "Urubuga rw'Ubuhinzi mu Rwanda - Guhuza Abahinzi n'Amasoko Mpuzamahanga",
        "hero_subtitle": "Duha imbaraga abahinzi b'u Rwanda kugera ku masoko mpuzamahanga, korohereza kohereza ibicuruzwa mu mahanga, no kongera inyungu zabo binyuze ku rubuga rw'ikoranabuhanga ruhuriweho.",
        "hero_cta_trade": "Tangira Ubucuruzi Nonaha",
        "hero_cta_learn": "Menya Byinshi Kuri Twe",
        "current_language_text": "Kinyarwanda",
        "language_arabic": "العربية",
        "language_english": "English",
        "language_french": "Français",
        "language_kinyarwanda": "Kinyarwanda",
        "market_link": "marketplace.html?lang=rw"
    }
};

let currentLang = 'ar'; // Default language
const API_BASE_URL = 'http://localhost:8081/api'; // Ensure this matches your backend setup
let allProducts = []; // To store all fetched products for client-side filtering/sorting

function setLanguage(lang) {
    currentLang = lang;
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';

    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        if (translations[lang] && translations[lang][key]) {
            element.textContent = translations[lang][key];
        } else if (translations['ar'] && translations['ar'][key]) {
            element.textContent = translations['ar'][key]; // Fallback to Arabic if key not in current lang
        }
    });

    const marketLinkElement = document.querySelector('a[href*="marketplace.html"]');
    if (marketLinkElement && translations[lang] && translations[lang]["market_link"]) {
        marketLinkElement.href = translations[lang]["market_link"];
    }
    
    const currentLangDisplay = document.querySelector('.current-language span:not(.language-icon)');
    if (currentLangDisplay && translations[lang] && translations[lang]['current_language_text']) {
        currentLangDisplay.textContent = translations[lang]['current_language_text'];
    }

    document.querySelectorAll('.language-option').forEach(option => {
        if (option.getAttribute('data-lang') === lang) {
            option.classList.add('active');
        } else {
            option.classList.remove('active');
        }
    });
    localStorage.setItem('preferredLang', lang);
}

async function fetchProducts() {
    try {
        const response = await fetch(`${API_BASE_URL}/products/`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        allProducts = await response.json();
        displayProducts(allProducts);
    } catch (error) {
        console.error("Failed to fetch products:", error);
        const productsGrid = document.querySelector('.products-grid');
        if (productsGrid) {
            productsGrid.innerHTML = '<p>Failed to load products. Please try again later.</p>';
        }
    }
}

function displayProducts(productsToDisplay) {
    const productsGrid = document.querySelector('.products-grid');
    if (!productsGrid) {
        console.error("Products grid container not found");
        return;
    }
    productsGrid.innerHTML = ''; // Clear existing products

    if (productsToDisplay.length === 0) {
        productsGrid.innerHTML = '<p>No products found.</p>';
        return;
    }

    productsToDisplay.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        // Default image if product.image_paths is not available or empty
        const imageUrl = (product.image_paths && product.image_paths.length > 0) ? product.image_paths[0] : 'https://via.placeholder.com/400x200.png?text=No+Image';

        productCard.innerHTML = `
            <div class="product-img" style="background-image: url('${imageUrl}');">
                ${product.category ? `<span class="product-badge">${product.category}</span>` : ''}
            </div>
            <div class="product-content">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-farm">
                    <span data-translate="sold_by">يباع بواسطة:</span> ${product.author_username || 'Unknown Seller'}
                    <i class="fas fa-store farm-icon"></i>
                </p>
                <p class="product-description">${product.description || 'No description available.'}</p>
                <div class="product-meta">
                    <span class="product-price">${product.price ? `${product.price} RWF` : 'Price not set'}</span>
                    <div class="product-actions">
                        <button class="action-btn"><i class="fas fa-heart"></i></button>
                        <button class="action-btn"><i class="fas fa-shopping-cart"></i></button>
                    </div>
                </div>
            </div>
        `;
        productsGrid.appendChild(productCard);
    });
    // Re-apply translations for any new dynamic content if necessary
    setLanguage(currentLang);
}

function filterAndSortProducts() {
    let filteredProducts = [...allProducts];
    const searchTerm = document.querySelector('.search-input')?.value.toLowerCase() || '';
    const sortBy = document.getElementById('sort-by')?.value || 'name-asc'; // Example sort element

    // Filter by search term (name or description)
    if (searchTerm) {
        filteredProducts = filteredProducts.filter(product => 
            (product.name && product.name.toLowerCase().includes(searchTerm)) || 
            (product.description && product.description.toLowerCase().includes(searchTerm))
        );
    }

    // Sort products
    switch (sortBy) {
        case 'price-asc':
            filteredProducts.sort((a, b) => (a.price || 0) - (b.price || 0));
            break;
        case 'price-desc':
            filteredProducts.sort((a, b) => (b.price || 0) - (a.price || 0));
            break;
        case 'name-asc':
            filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'name-desc':
            filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
            break;
    }
    displayProducts(filteredProducts);
}


document.addEventListener('DOMContentLoaded', () => {
    const preferredLang = localStorage.getItem('preferredLang');
    if (preferredLang && translations[preferredLang]) {
        setLanguage(preferredLang);
    } else {
        setLanguage('ar'); 
    }

    document.querySelectorAll('.language-option').forEach(option => {
        option.addEventListener('click', (event) => {
            event.preventDefault();
            const lang = option.getAttribute('data-lang');
            setLanguage(lang);
            // If on marketplace, re-fetch or re-display products to apply language to dynamic parts
            if (window.location.pathname.includes('marketplace.html')) {
                filterAndSortProducts(); // Re-render products with current filters/sort
            }
        });
    });

    // Signup form submission
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const username = document.getElementById('signup-username').value;
            const email = document.getElementById('signup-email').value;
            const password = document.getElementById('signup-password').value;
            
            try {
                const response = await fetch(`${API_BASE_URL}/auth/register`, { // Corrected endpoint
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, email, password }),
                });
                const result = await response.json();
                alert(result.message || (response.ok ? 'Registration successful!' : 'Registration failed.'));
            } catch (error) {
                console.error('Signup error:', error);
                alert('An error occurred during registration.');
            }
        });
    }

    // Login form submission
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;

            try {
                const response = await fetch(`${API_BASE_URL}/auth/login`, { // Corrected endpoint
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password }),
                });
                const result = await response.json();
                alert(result.message || (response.ok ? 'Login successful!' : 'Login failed.'));
                if(response.ok && result.user_id) {
                    localStorage.setItem('userId', result.user_id);
                    localStorage.setItem('username', result.username);
                     // window.location.href = 'marketplace.html'; // Or user dashboard
                }
            } catch (error) {
                console.error('Login error:', error);
                alert('An error occurred during login.');
            }
        });
    }

    // If on marketplace page, fetch products and set up search/sort listeners
    if (window.location.pathname.includes('marketplace.html')) {
        fetchProducts();
        const searchInput = document.querySelector('.search-input');
        if (searchInput) {
            searchInput.addEventListener('input', filterAndSortProducts);
        }
        const sortBySelect = document.getElementById('sort-by'); // Assuming you add this select element
        if (sortBySelect) {
            sortBySelect.addEventListener('change', filterAndSortProducts);
        }
    }

    // Fallback for old buttons if forms are not yet implemented with these IDs
    const loginButtonOld = document.querySelector('button.login-btn'); 
    if (loginButtonOld && !loginForm) { 
        loginButtonOld.addEventListener('click', (e) => {
            e.preventDefault();
            alert('Login form not fully integrated yet. Please use the form if available or ensure IDs match.');
        });
    }

    const signupButtonOld = document.querySelector('button.signup-btn');
    if (signupButtonOld && !signupForm) {
        signupButtonOld.addEventListener('click', (e) => {
            e.preventDefault();
            alert('Signup form not fully integrated yet. Please use the form if available or ensure IDs match.');
        });
    }
});

