// Main Application JavaScript

// DOM Elements
const app = document.getElementById('app');
const themeToggleBtn = document.getElementById('theme-toggle-btn');
const languageSelect = document.getElementById('language-select');
const featureCards = document.querySelectorAll('.feature-card');
const backButtons = document.querySelectorAll('.back-btn');
const featureSections = document.querySelectorAll('.feature-section');

// App State
const appState = {
    theme: 'light',
    language: 'ar',
    currentFeature: null,
    prayerTimes: {},
    location: {
        latitude: null,
        longitude: null,
        city: null,
        country: null
    },
    offlineMode: true,
    translations: {}
};

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

// App Initialization
function initApp() {
    // Load saved preferences
    loadPreferences();
    
    // Initialize theme
    setTheme(appState.theme);
    
    // Initialize language
    setLanguage(appState.language);
    
    // Setup event listeners
    setupEventListeners();
    
    // Initialize prayer times
    initPrayerTimes();
    
    // Check for offline capability
    checkOfflineCapability();
    
    // Load daily benefit
    loadDailyBenefit();
}

// Load User Preferences
function loadPreferences() {
    try {
        const savedTheme = localStorage.getItem('theme');
        const savedLanguage = localStorage.getItem('language');
        
        if (savedTheme) {
            appState.theme = savedTheme;
        }
        
        if (savedLanguage) {
            appState.language = savedLanguage;
        }
    } catch (error) {
        console.error('Error loading preferences:', error);
    }
}

// Save User Preferences
function savePreferences() {
    try {
        localStorage.setItem('theme', appState.theme);
        localStorage.setItem('language', appState.language);
    } catch (error) {
        console.error('Error saving preferences:', error);
    }
}

// Set Theme
function setTheme(theme) {
    if (theme === 'dark') {
        document.body.classList.add('dark-theme');
        themeToggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
        document.body.classList.remove('dark-theme');
        themeToggleBtn.innerHTML = '<i class="fas fa-moon"></i>';
    }
    
    appState.theme = theme;
    savePreferences();
}

// Toggle Theme
function toggleTheme() {
    const newTheme = appState.theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
}

// Set Language
function setLanguage(language) {
    // Update language in app state
    appState.language = language;
    
    // Update language selector
    languageSelect.value = language;
    
    // Update document language and direction
    document.documentElement.lang = language;
    document.documentElement.dir = isRTL(language) ? 'rtl' : 'ltr';
    
    // Load translations
    loadTranslations(language);
    
    // Update UI text
    updateUIText();
    
    // Save preferences
    savePreferences();
}

// Check if language is RTL
function isRTL(language) {
    const rtlLanguages = ['ar', 'ur', 'fa', 'he'];
    return rtlLanguages.includes(language);
}

// Load Translations
function loadTranslations(language) {
    // In a real app, this would load translations from a file or API
    // For now, we'll use a simple object with some basic translations
    const translations = {
        ar: {
            'app_title': 'تطبيق إسلامي شامل',
            'prayer_times': 'مواقيت الصلاة',
            'next_prayer': 'الصلاة القادمة',
            'daily_benefit': 'فائدة اليوم',
            'duas': 'الأدعية',
            'quran': 'القرآن الكريم',
            'qibla': 'القبلة',
            'calendar': 'التقويم الهجري',
            'seerah': 'السيرة النبوية',
            'fiqh': 'كتب الفقه',
            'benefits': 'الفوائد اليومية',
            'location': 'تحديد الموقع',
            'back': 'رجوع'
        },
        en: {
            'app_title': 'Comprehensive Islamic App',
            'prayer_times': 'Prayer Times',
            'next_prayer': 'Next Prayer',
            'daily_benefit': 'Daily Benefit',
            'duas': 'Duas',
            'quran': 'Quran',
            'qibla': 'Qibla',
            'calendar': 'Hijri Calendar',
            'seerah': 'Prophet\'s Biography',
            'fiqh': 'Fiqh Books',
            'benefits': 'Daily Benefits',
            'location': 'Set Location',
            'back': 'Back'
        },
        fr: {
            'app_title': 'Application Islamique Complète',
            'prayer_times': 'Heures de Prière',
            'next_prayer': 'Prochaine Prière',
            'daily_benefit': 'Bénéfice Quotidien',
            'duas': 'Invocations',
            'quran': 'Coran',
            'qibla': 'Qibla',
            'calendar': 'Calendrier Hijri',
            'seerah': 'Biographie du Prophète',
            'fiqh': 'Livres de Fiqh',
            'benefits': 'Bénéfices Quotidiens',
            'location': 'Définir l\'emplacement',
            'back': 'Retour'
        },
        ur: {
            'app_title': 'جامع اسلامی ایپلیکیشن',
            'prayer_times': 'نماز کے اوقات',
            'next_prayer': 'اگلی نماز',
            'daily_benefit': 'روزانہ کا فائدہ',
            'duas': 'دعائیں',
            'quran': 'قرآن کریم',
            'qibla': 'قبلہ',
            'calendar': 'ہجری کیلنڈر',
            'seerah': 'سیرت النبی',
            'fiqh': 'فقہ کی کتابیں',
            'benefits': 'روزانہ کے فوائد',
            'location': 'مقام متعین کریں',
            'back': 'واپس'
        },
        id: {
            'app_title': 'Aplikasi Islam Komprehensif',
            'prayer_times': 'Waktu Shalat',
            'next_prayer': 'Shalat Berikutnya',
            'daily_benefit': 'Manfaat Harian',
            'duas': 'Doa-doa',
            'quran': 'Al-Quran',
            'qibla': 'Kiblat',
            'calendar': 'Kalender Hijriah',
            'seerah': 'Biografi Nabi',
            'fiqh': 'Buku-buku Fiqih',
            'benefits': 'Manfaat Harian',
            'location': 'Atur Lokasi',
            'back': 'Kembali'
        }
    };
    
    appState.translations = translations[language] || translations.ar;
}

// Update UI Text based on selected language
function updateUIText() {
    const translations = appState.translations;
    
    // Update static text elements
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        if (translations[key]) {
            element.textContent = translations[key];
        }
    });
    
    // Update specific elements
    document.querySelector('.logo h1').textContent = translations.app_title || 'تطبيق إسلامي شامل';
    document.querySelector('#prayer-section h2').textContent = translations.prayer_times || 'مواقيت الصلاة';
    document.querySelector('#duas-section h2').textContent = translations.duas || 'الأدعية';
    document.querySelector('#quran-section h2').textContent = translations.quran || 'القرآن الكريم';
    document.querySelector('#qibla-section h2').textContent = translations.qibla || 'القبلة';
    document.querySelector('#calendar-section h2').textContent = translations.calendar || 'التقويم الهجري';
    document.querySelector('#seerah-section h2').textContent = translations.seerah || 'السيرة النبوية';
    document.querySelector('#fiqh-section h2').textContent = translations.fiqh || 'كتب الفقه';
    document.querySelector('#benefits-section h2').textContent = translations.benefits || 'الفوائد اليومية';
}

// Setup Event Listeners
function setupEventListeners() {
    // Theme toggle
    themeToggleBtn.addEventListener('click', toggleTheme);
    
    // Language selector
    languageSelect.addEventListener('change', (e) => {
        setLanguage(e.target.value);
    });
    
    // Feature cards
    featureCards.forEach(card => {
        card.addEventListener('click', () => {
            const feature = card.getAttribute('data-feature');
            showFeature(feature);
        });
    });
    
    // Back buttons
    backButtons.forEach(button => {
        button.addEventListener('click', hideFeatures);
    });
    
    // Location button
    document.getElementById('location-btn').addEventListener('click', getUserLocation);
    
    // Other feature-specific event listeners will be set up in their respective modules
}

// Show Feature Section
function showFeature(feature) {
    // Hide all feature sections
    featureSections.forEach(section => {
        section.classList.add('hidden');
    });
    
    // Show selected feature section
    const featureSection = document.getElementById(`${feature}-section`);
    if (featureSection) {
        featureSection.classList.remove('hidden');
        appState.currentFeature = feature;
        
        // Initialize feature-specific functionality
        initFeature(feature);
    }
}

// Hide All Feature Sections
function hideFeatures() {
    featureSections.forEach(section => {
        section.classList.add('hidden');
    });
    appState.currentFeature = null;
}

// Initialize Feature-specific Functionality
function initFeature(feature) {
    switch (feature) {
        case 'prayer':
            initPrayerFeature();
            break;
        case 'duas':
            initDuasFeature();
            break;
        case 'quran':
            initQuranFeature();
            break;
        case 'qibla':
            initQiblaFeature();
            break;
        case 'calendar':
            initCalendarFeature();
            break;
        case 'seerah':
            initSeerahFeature();
            break;
        case 'fiqh':
            initFiqhFeature();
            break;
        case 'benefits':
            initBenefitsFeature();
            break;
    }
}

// Initialize Prayer Times
function initPrayerTimes() {
    // Check if we have saved location
    const savedLocation = getSavedLocation();
    
    if (savedLocation) {
        appState.location = savedLocation;
        updatePrayerTimes(savedLocation);
    } else {
        // Try to get user location
        getUserLocation();
    }
    
    // Start prayer time countdown
    startPrayerCountdown();
}

// Get User Location
function getUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const location = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                };
                
                // Reverse geocode to get city and country
                reverseGeocode(location)
                    .then(locationData => {
                        appState.location = locationData;
                        saveLocation(locationData);
                        updatePrayerTimes(locationData);
                    })
                    .catch(error => {
                        console.error('Error getting location details:', error);
                        // Use coordinates only
                        appState.location = location;
                        saveLocation(location);
                        updatePrayerTimes(location);
                    });
            },
            (error) => {
                console.error('Error getting location:', error);
                // Use default location (Mecca)
                const defaultLocation = {
                    latitude: 21.4225,
                    longitude: 39.8262,
                    city: 'Mecca',
                    country: 'Saudi Arabia'
                };
                appState.location = defaultLocation;
                updatePrayerTimes(defaultLocation);
            }
        );
    } else {
        console.error('Geolocation is not supported by this browser.');
        // Use default location (Mecca)
        const defaultLocation = {
            latitude: 21.4225,
            longitude: 39.8262,
            city: 'Mecca',
            country: 'Saudi Arabia'
        };
        appState.location = defaultLocation;
        updatePrayerTimes(defaultLocation);
    }
}

// Reverse Geocode
async function reverseGeocode(location) {
    try {
        // In a real app, this would use a geocoding API
        // For now, we'll simulate it
        return {
            ...location,
            city: 'Unknown City',
            country: 'Unknown Country'
        };
    } catch (error) {
        console.error('Error in reverse geocoding:', error);
        throw error;
    }
}

// Save Location
function saveLocation(location) {
    try {
        localStorage.setItem('userLocation', JSON.stringify(location));
    } catch (error) {
        console.error('Error saving location:', error);
    }
}

// Get Saved Location
function getSavedLocation() {
    try {
        const savedLocation = localStorage.getItem('userLocation');
        return savedLocation ? JSON.parse(savedLocation) : null;
    } catch (error) {
        console.error('Error getting saved location:', error);
        return null;
    }
}

// Update Prayer Times
function updatePrayerTimes(location) {
    // In a real app, this would call a prayer times API
    // For now, we'll use sample data
    const prayerTimes = calculatePrayerTimes(location);
    appState.prayerTimes = prayerTimes;
    
    // Update UI
    updatePrayerTimesUI(prayerTimes);
}

// Calculate Prayer Times
function calculatePrayerTimes(location) {
    // This is a simplified calculation for demonstration
    // In a real app, this would use proper astronomical calculations
    
    // Sample prayer times (for demonstration)
    return {
        fajr: '05:30',
        sunrise: '06:45',
        dhuhr: '12:15',
        asr: '15:30',
        maghrib: '18:10',
        isha: '19:40',
        midnight: '00:00'
    };
}

// Update Prayer Times UI
function updatePrayerTimesUI(prayerTimes) {
    // Update prayer times in the dashboard
    document.querySelector('.prayer-item:nth-child(1) .prayer-time').textContent = prayerTimes.fajr;
    document.querySelector('.prayer-item:nth-child(2) .prayer-time').textContent = prayerTimes.sunrise;
    document.querySelector('.prayer-item:nth-child(3) .prayer-time').textContent = prayerTimes.dhuhr;
    document.querySelector('.prayer-item:nth-child(4) .prayer-time').textContent = prayerTimes.asr;
    document.querySelector('.prayer-item:nth-child(5) .prayer-time').textContent = prayerTimes.maghrib;
    document.querySelector('.prayer-item:nth-child(6) .prayer-time').textContent = prayerTimes.isha;
    
    // Update next prayer
    const nextPrayer = getNextPrayer(prayerTimes);
    document.getElementById('next-prayer').textContent = getNextPrayerName(nextPrayer);
}

// Get Next Prayer
function getNextPrayer(prayerTimes) {
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    const prayers = [
        { name: 'fajr', time: prayerTimes.fajr },
        { name: 'sunrise', time: prayerTimes.sunrise },
        { name: 'dhuhr', time: prayerTimes.dhuhr },
        { name: 'asr', time: prayerTimes.asr },
        { name: 'maghrib', time: prayerTimes.maghrib },
        { name: 'isha', time: prayerTimes.isha }
    ];
    
    // Find the next prayer
    for (const prayer of prayers) {
        if (currentTime < prayer.time) {
            return prayer;
        }
    }
    
    // If all prayers for today have passed, return Fajr for tomorrow
    return { name: 'fajr', time: prayerTimes.fajr };
}

// Get Next Prayer Name (translated)
function getNextPrayerName(prayer) {
    const prayerNames = {
        ar: {
            fajr: 'الفجر',
            sunrise: 'الشروق',
            dhuhr: 'الظهر',
            asr: 'العصر',
            maghrib: 'المغرب',
            isha: 'العشاء'
        },
        en: {
            fajr: 'Fajr',
            sunrise: 'Sunrise',
            dhuhr: 'Dhuhr',
            asr: 'Asr',
            maghrib: 'Maghrib',
            isha: 'Isha'
        }
    };
    
    const names = prayerNames[appState.language] || prayerNames.ar;
    return names[prayer.name] || prayer.name;
}

// Start Prayer Countdown
function startPrayerCountdown() {
    // Update countdown every second
    setInterval(() => {
        updatePrayerCountdown();
    }, 1000);
    
    // Initial update
    updatePrayerCountdown();
}

// Update Prayer Countdown
function updatePrayerCountdown() {
    const nextPrayer = getNextPrayer(appState.prayerTimes);
    const now = new Date();
    
    // Parse prayer time
    const [hours, minutes] = nextPrayer.time.split(':').map(Number);
    const prayerTime = new Date();
    prayerTime.setHours(hours, minutes, 0, 0);
    
    // If prayer is tomorrow
    if (prayerTime < now) {
        prayerTime.setDate(prayerTime.getDate() + 1);
    }
    
    // Calculate time difference
    const diff = prayerTime - now;
    
    // Convert to hours, minutes, seconds
    const hours_remaining = Math.floor(diff / (1000 * 60 * 60));
    const minutes_remaining = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds_remaining = Math.floor((diff % (1000 * 60)) / 1000);
    
    // Update countdown display
    document.getElementById('prayer-countdown').textContent = 
        `${hours_remaining.toString().padStart(2, '0')}:${minutes_remaining.toString().padStart(2, '0')}:${seconds_remaining.toString().padStart(2, '0')}`;
}

// Check Offline Capability
function checkOfflineCapability() {
    // Check if service worker is supported
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/service-worker.js')
                .then(registration => {
                    console.log('ServiceWorker registration successful with scope: ', registration.scope);
                })
                .catch(error => {
                    console.log('ServiceWorker registration failed: ', error);
                    appState.offlineMode = false;
                });
        });
    } else {
        console.log('Service workers are not supported.');
        appState.offlineMode = false;
    }
}

// Load Daily Benefit
function loadDailyBenefit() {
    // In a real app, this would load from a database or API
    // For now, we'll use a sample benefit
    const benefits = [
        {
            ar: {
                text: 'قال الله تعالى: ﴿وَمَا خَلَقْتُ الْجِنَّ وَالْإِنسَ إِلَّا لِيَعْبُدُونِ﴾ [الذاريات: 56]',
                explanation: 'خلق الله الإنسان لعبادته وحده لا شريك له، وهذه هي الغاية من الخلق. قال الشيخ السعدي رحمه الله: "أي ليعرفوني ويوحدوني، فإن العبادة المأمور بها تتضمن معرفة الله، ومحبته، والإنابة إليه، والإقبال عليه، والإعراض عما سواه، وهذا هو معنى لا إله إلا الله".'
            },
            en: {
                text: 'Allah says: "And I did not create the jinn and mankind except to worship Me." [Adh-Dhariyat: 56]',
                explanation: 'Allah created humans to worship Him alone, and this is the purpose of creation. Sheikh As-Sa\'di said: "That is, to know Me and to affirm My Oneness, for the worship that is commanded includes knowledge of Allah, love for Him, turning to Him, approaching Him, and turning away from all else, and this is the meaning of La ilaha illa Allah (there is no god but Allah)."'
            }
        },
        {
            ar: {
                text: 'قال الله تعالى: ﴿إِنَّ الَّذِينَ يَتْلُونَ كِتَابَ اللَّهِ وَأَقَامُوا الصَّلَاةَ وَأَنفَقُوا مِمَّا رَزَقْنَاهُمْ سِرًّا وَعَلَانِيَةً يَرْجُونَ تِجَارَةً لَّن تَبُورَ﴾ [فاطر: 29]',
                explanation: 'تلاوة القرآن من أعظم القربات إلى الله تعالى، وهي تجارة رابحة لا تبور. قال الشيخ ابن باز رحمه الله: "تلاوة القرآن الكريم من أفضل الأعمال وأجلها، وقد جاءت الأحاديث الصحيحة عن النبي صلى الله عليه وسلم في فضل تلاوة القرآن والعناية به".'
            },
            en: {
                text: 'Allah says: "Indeed, those who recite the Book of Allah and establish prayer and spend [in His cause] out of what We have provided them, secretly and publicly, [can] expect a profit that will never perish." [Fatir: 29]',
                explanation: 'Reciting the Quran is one of the greatest ways to draw closer to Allah, and it is a profitable trade that will never perish. Sheikh Ibn Baz said: "Reciting the Noble Quran is one of the best and most honorable deeds, and authentic hadiths have been reported from the Prophet (peace be upon him) regarding the virtue of reciting the Quran and taking care of it."'
            }
        }
    ];
    
    // Get today's date to determine which benefit to show
    const today = new Date();
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
    const benefitIndex = dayOfYear % benefits.length;
    
    // Get benefit in current language or default to Arabic
    const benefit = benefits[benefitIndex][appState.language] || benefits[benefitIndex].ar;
    
    // Update UI
    const benefitElement = document.getElementById('daily-benefit');
    benefitElement.innerHTML = `<p>${benefit.text}</p><p><strong>الفائدة:</strong> ${benefit.explanation}</p>`;
}

// Feature-specific initialization functions
// These will be implemented in their respective module files

function initPrayerFeature() {
    console.log('Initializing Prayer Feature');
    // This will be implemented in prayer.js
}

function initDuasFeature() {
    console.log('Initializing Duas Feature');
    // This will be implemented in duas.js
}

function initQuranFeature() {
    console.log('Initializing Quran Feature');
    // This will be implemented in quran.js
}

function initQiblaFeature() {
    console.log('Initializing Qibla Feature');
    // This will be implemented in qibla.js
}

function initCalendarFeature() {
    console.log('Initializing Calendar Feature');
    // This will be implemented in calendar.js
}

function initSeerahFeature() {
    console.log('Initializing Seerah Feature');
    // This will be implemented in seerah.js
}

function initFiqhFeature() {
    console.log('Initializing Fiqh Feature');
    // This will be implemented in fiqh.js
}

function initBenefitsFeature() {
    console.log('Initializing Benefits Feature');
    // This will be implemented in benefits.js
}

// Export functions for use in other modules
window.appState = appState;
window.showFeature = showFeature;
window.hideFeatures = hideFeatures;
window.setLanguage = setLanguage;
window.updateUIText = updateUIText;
