// Prayer Times Module

// DOM Elements
const prayerSection = document.getElementById('prayer-section');
const calculationMethodSelect = document.getElementById('calculation-method-select');
const locationInput = document.getElementById('location-input');
const searchLocationBtn = document.getElementById('search-location-btn');
const useCurrentLocationBtn = document.getElementById('use-current-location-btn');
const monthlyPrayerCalendar = document.getElementById('monthly-prayer-calendar');

// Prayer Times State
const prayerState = {
    calculationMethod: 'makkah',
    prayerTimes: {},
    monthlyPrayerTimes: {},
    notificationSettings: {
        sound: true,
        vibration: true,
        popup: true
    }
};

// Initialize Prayer Feature
function initPrayerFeature() {
    console.log('Initializing Prayer Feature');
    
    // Load saved settings
    loadPrayerSettings();
    
    // Setup event listeners
    setupPrayerEventListeners();
    
    // Update prayer times based on current location
    updatePrayerTimesForLocation(window.appState.location);
    
    // Generate monthly prayer calendar
    generateMonthlyPrayerCalendar();
}

// Load Prayer Settings
function loadPrayerSettings() {
    try {
        const savedMethod = localStorage.getItem('calculationMethod');
        const savedNotifications = localStorage.getItem('notificationSettings');
        
        if (savedMethod) {
            prayerState.calculationMethod = savedMethod;
            calculationMethodSelect.value = savedMethod;
        }
        
        if (savedNotifications) {
            prayerState.notificationSettings = JSON.parse(savedNotifications);
            document.getElementById('notification-sound').checked = prayerState.notificationSettings.sound;
            document.getElementById('notification-vibration').checked = prayerState.notificationSettings.vibration;
            document.getElementById('notification-popup').checked = prayerState.notificationSettings.popup;
        }
    } catch (error) {
        console.error('Error loading prayer settings:', error);
    }
}

// Save Prayer Settings
function savePrayerSettings() {
    try {
        localStorage.setItem('calculationMethod', prayerState.calculationMethod);
        localStorage.setItem('notificationSettings', JSON.stringify(prayerState.notificationSettings));
    } catch (error) {
        console.error('Error saving prayer settings:', error);
    }
}

// Setup Prayer Event Listeners
function setupPrayerEventListeners() {
    // Calculation method change
    calculationMethodSelect.addEventListener('change', (e) => {
        prayerState.calculationMethod = e.target.value;
        savePrayerSettings();
        updatePrayerTimesForLocation(window.appState.location);
    });
    
    // Search location
    searchLocationBtn.addEventListener('click', () => {
        const locationName = locationInput.value.trim();
        if (locationName) {
            searchLocation(locationName);
        }
    });
    
    // Use current location
    useCurrentLocationBtn.addEventListener('click', () => {
        getUserLocation();
    });
    
    // Notification settings
    document.getElementById('notification-sound').addEventListener('change', (e) => {
        prayerState.notificationSettings.sound = e.target.checked;
        savePrayerSettings();
    });
    
    document.getElementById('notification-vibration').addEventListener('change', (e) => {
        prayerState.notificationSettings.vibration = e.target.checked;
        savePrayerSettings();
    });
    
    document.getElementById('notification-popup').addEventListener('change', (e) => {
        prayerState.notificationSettings.popup = e.target.checked;
        savePrayerSettings();
    });
    
    // Enter key in location input
    locationInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            const locationName = locationInput.value.trim();
            if (locationName) {
                searchLocation(locationName);
            }
        }
    });
}

// Get User Location
function getUserLocation() {
    // Show loading indicator
    useCurrentLocationBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري تحديد الموقع...';
    
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
                        window.appState.location = locationData;
                        saveLocation(locationData);
                        updatePrayerTimesForLocation(locationData);
                        
                        // Update location input
                        locationInput.value = locationData.city ? `${locationData.city}, ${locationData.country}` : `${locationData.latitude}, ${locationData.longitude}`;
                        
                        // Reset button
                        useCurrentLocationBtn.innerHTML = '<i class="fas fa-map-marker-alt"></i> استخدام الموقع الحالي';
                    })
                    .catch(error => {
                        console.error('Error getting location details:', error);
                        // Use coordinates only
                        window.appState.location = location;
                        saveLocation(location);
                        updatePrayerTimesForLocation(location);
                        
                        // Update location input
                        locationInput.value = `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`;
                        
                        // Reset button
                        useCurrentLocationBtn.innerHTML = '<i class="fas fa-map-marker-alt"></i> استخدام الموقع الحالي';
                    });
            },
            (error) => {
                console.error('Error getting location:', error);
                // Reset button
                useCurrentLocationBtn.innerHTML = '<i class="fas fa-map-marker-alt"></i> استخدام الموقع الحالي';
                
                // Show error message
                alert('تعذر تحديد الموقع. يرجى التحقق من إعدادات الموقع في المتصفح.');
            }
        );
    } else {
        console.error('Geolocation is not supported by this browser.');
        // Reset button
        useCurrentLocationBtn.innerHTML = '<i class="fas fa-map-marker-alt"></i> استخدام الموقع الحالي';
        
        // Show error message
        alert('تعذر تحديد الموقع. المتصفح الخاص بك لا يدعم خدمة تحديد المواقع.');
    }
}

// Search Location by Name
function searchLocation(locationName) {
    // Show loading indicator
    searchLocationBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    
    // In a real app, this would use a geocoding API
    // For now, we'll simulate it with a timeout
    setTimeout(() => {
        // Simulate geocoding result
        const location = {
            latitude: 21.4225,
            longitude: 39.8262,
            city: locationName.split(',')[0].trim(),
            country: locationName.split(',')[1]?.trim() || 'Unknown Country'
        };
        
        window.appState.location = location;
        saveLocation(location);
        updatePrayerTimesForLocation(location);
        
        // Reset button
        searchLocationBtn.innerHTML = '<i class="fas fa-search"></i>';
    }, 1000);
}

// Save Location
function saveLocation(location) {
    try {
        localStorage.setItem('userLocation', JSON.stringify(location));
    } catch (error) {
        console.error('Error saving location:', error);
    }
}

// Update Prayer Times for Location
function updatePrayerTimesForLocation(location) {
    // Calculate prayer times based on location and calculation method
    const prayerTimes = calculatePrayerTimes(location, prayerState.calculationMethod);
    prayerState.prayerTimes = prayerTimes;
    window.appState.prayerTimes = prayerTimes;
    
    // Update UI
    updatePrayerTimesUI(prayerTimes);
    
    // Calculate monthly prayer times
    calculateMonthlyPrayerTimes(location);
}

// Calculate Prayer Times
function calculatePrayerTimes(location, method) {
    // In a real app, this would use a proper prayer times calculation library
    // For now, we'll use sample data with slight variations based on location
    
    // Base times (for demonstration)
    const baseTimes = {
        fajr: '05:30',
        sunrise: '06:45',
        dhuhr: '12:15',
        asr: '15:30',
        maghrib: '18:10',
        isha: '19:40'
    };
    
    // Adjust times based on latitude (simplified)
    const latitudeAdjustment = Math.floor(Math.abs(location.latitude - 21) / 10);
    
    // Adjust times based on calculation method (simplified)
    const methodAdjustment = {
        'makkah': 0,
        'egypt': 5,
        'karachi': 10,
        'isna': 15,
        'umm-alqura': 0
    }[method] || 0;
    
    // Apply adjustments (simplified)
    const adjustedTimes = {};
    for (const [prayer, time] of Object.entries(baseTimes)) {
        const [hours, minutes] = time.split(':').map(Number);
        let adjustedMinutes = minutes + latitudeAdjustment + methodAdjustment;
        let adjustedHours = hours;
        
        if (adjustedMinutes >= 60) {
            adjustedHours += Math.floor(adjustedMinutes / 60);
            adjustedMinutes %= 60;
        }
        
        adjustedHours %= 24;
        
        adjustedTimes[prayer] = `${adjustedHours.toString().padStart(2, '0')}:${adjustedMinutes.toString().padStart(2, '0')}`;
    }
    
    return adjustedTimes;
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
    
    // Update location display
    const locationDisplay = window.appState.location.city 
        ? `${window.appState.location.city}, ${window.appState.location.country}` 
        : `${window.appState.location.latitude.toFixed(4)}, ${window.appState.location.longitude.toFixed(4)}`;
    
    // If there's a location display element, update it
    const locationDisplayElement = document.querySelector('.location-display');
    if (locationDisplayElement) {
        locationDisplayElement.textContent = locationDisplay;
    }
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
    
    const names = prayerNames[window.appState.language] || prayerNames.ar;
    return names[prayer.name] || prayer.name;
}

// Calculate Monthly Prayer Times
function calculateMonthlyPrayerTimes(location) {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    
    // Get number of days in the month
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    // Calculate prayer times for each day
    const monthlyTimes = {};
    for (let day = 1; day <= daysInMonth; day++) {
        // In a real app, this would calculate based on the specific date
        // For now, we'll use the current prayer times with slight variations
        
        const dayAdjustment = (day % 5) - 2; // -2 to +2 minutes
        const dayTimes = {};
        
        for (const [prayer, time] of Object.entries(prayerState.prayerTimes)) {
            const [hours, minutes] = time.split(':').map(Number);
            let adjustedMinutes = minutes + dayAdjustment;
            let adjustedHours = hours;
            
            if (adjustedMinutes >= 60) {
                adjustedHours += Math.floor(adjustedMinutes / 60);
                adjustedMinutes %= 60;
            } else if (adjustedMinutes < 0) {
                adjustedHours -= 1;
                adjustedMinutes += 60;
            }
            
            adjustedHours = (adjustedHours + 24) % 24;
            
            dayTimes[prayer] = `${adjustedHours.toString().padStart(2, '0')}:${adjustedMinutes.toString().padStart(2, '0')}`;
        }
        
        monthlyTimes[day] = dayTimes;
    }
    
    prayerState.monthlyPrayerTimes = monthlyTimes;
    
    // Generate monthly calendar
    generateMonthlyPrayerCalendar();
}

// Generate Monthly Prayer Calendar
function generateMonthlyPrayerCalendar() {
    if (!monthlyPrayerCalendar) return;
    
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    
    // Get month name
    const monthNames = {
        ar: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
        en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    };
    
    const monthName = (monthNames[window.appState.language] || monthNames.ar)[month];
    
    // Create table
    let calendarHTML = `
        <h4>${monthName} ${year}</h4>
        <table class="prayer-calendar">
            <thead>
                <tr>
                    <th>اليوم</th>
                    <th>الفجر</th>
                    <th>الشروق</th>
                    <th>الظهر</th>
                    <th>العصر</th>
                    <th>المغرب</th>
                    <th>العشاء</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    // Add rows for each day
    for (let day = 1; day <= Object.keys(prayerState.monthlyPrayerTimes).length; day++) {
        const dayTimes = prayerState.monthlyPrayerTimes[day];
        const isToday = day === today.getDate();
        
        calendarHTML += `
            <tr class="${isToday ? 'today' : ''}">
                <td>${day}</td>
                <td>${dayTimes.fajr}</td>
                <td>${dayTimes.sunrise}</td>
                <td>${dayTimes.dhuhr}</td>
                <td>${dayTimes.asr}</td>
                <td>${dayTimes.maghrib}</td>
                <td>${dayTimes.isha}</td>
            </tr>
        `;
    }
    
    calendarHTML += `
            </tbody>
        </table>
    `;
    
    monthlyPrayerCalendar.innerHTML = calendarHTML;
}

// Setup Prayer Notifications
function setupPrayerNotifications() {
    // Check if notifications are supported
    if (!('Notification' in window)) {
        console.log('This browser does not support notifications');
        return;
    }
    
    // Request permission
    Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
            console.log('Notification permission granted');
            
            // Set up notification checks
            setInterval(checkForPrayerNotifications, 60000); // Check every minute
        }
    });
}

// Check for Prayer Notifications
function checkForPrayerNotifications() {
    if (!prayerState.notificationSettings.popup) return;
    
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTime = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;
    
    // Check each prayer time
    for (const [prayer, time] of Object.entries(prayerState.prayerTimes)) {
        // If it's time for prayer (within 1 minute)
        if (time === currentTime) {
            // Show notification
            showPrayerNotification(prayer);
            
            // Play sound if enabled
            if (prayerState.notificationSettings.sound) {
                playAdhan(prayer);
            }
            
            // Vibrate if enabled
            if (prayerState.notificationSettings.vibration && 'vibrate' in navigator) {
                navigator.vibrate([500, 200, 500]);
            }
        }
    }
}

// Show Prayer Notification
function showPrayerNotification(prayer) {
    if (Notification.permission === 'granted') {
        const prayerNames = {
            fajr: 'الفجر',
            sunrise: 'الشروق',
            dhuhr: 'الظهر',
            asr: 'العصر',
            maghrib: 'المغرب',
            isha: 'العشاء'
        };
        
        const prayerName = prayerNames[prayer] || prayer;
        
        const notification = new Notification('حان وقت الصلاة', {
            body: `حان الآن وقت صلاة ${prayerName}`,
            icon: '/assets/icons/prayer-icon.png'
        });
        
        // Close notification after 10 seconds
        setTimeout(() => {
            notification.close();
        }, 10000);
    }
}

// Play Adhan
function playAdhan(prayer) {
    // In a real app, this would play the adhan sound
    // For now, we'll just log it
    console.log(`Playing adhan for ${prayer}`);
    
    // Create audio element
    const adhan = new Audio('/assets/sounds/adhan.mp3');
    adhan.play().catch(error => {
        console.error('Error playing adhan:', error);
    });
}

// Initialize the module
if (typeof window !== 'undefined') {
    // Make functions available globally
    window.initPrayerFeature = initPrayerFeature;
}
