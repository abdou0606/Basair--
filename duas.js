// Duas Module

// DOM Elements
const duasSection = document.getElementById('duas-section');
const duasCategories = document.querySelectorAll('#duas-section .category-item');
const duasList = document.getElementById('duas-list');
const duaDetails = document.getElementById('dua-details');
const duaTitle = document.getElementById('dua-title');
const playBtn = document.querySelector('.play-btn');
const favoriteBtn = document.querySelector('.favorite-btn');
const shareBtn = document.querySelector('.share-btn');

// Duas State
const duasState = {
    currentCategory: 'morning-evening',
    currentDua: null,
    favorites: [],
    duas: {}
};

// Initialize Duas Feature
function initDuasFeature() {
    console.log('Initializing Duas Feature');
    
    // Load saved favorites
    loadFavorites();
    
    // Load duas data
    loadDuasData();
    
    // Setup event listeners
    setupDuasEventListeners();
}

// Load Favorites
function loadFavorites() {
    try {
        const savedFavorites = localStorage.getItem('favoritesDuas');
        if (savedFavorites) {
            duasState.favorites = JSON.parse(savedFavorites);
        }
    } catch (error) {
        console.error('Error loading favorites:', error);
    }
}

// Save Favorites
function saveFavorites() {
    try {
        localStorage.setItem('favoritesDuas', JSON.stringify(duasState.favorites));
    } catch (error) {
        console.error('Error saving favorites:', error);
    }
}

// Load Duas Data
function loadDuasData() {
    // In a real app, this would load from a database or API
    // For now, we'll use sample data
    duasState.duas = {
        'morning-evening': [
            {
                id: 'morning-1',
                title: 'دعاء الاستيقاظ من النوم',
                arabic: 'الحمد لله الذي أحيانا بعد ما أماتنا وإليه النشور.',
                translation: 'الحمد لله الذي أعادنا للحياة بعد أن أماتنا (في النوم)، وإليه البعث والنشور.',
                source: 'رواه البخاري، وصححه الألباني في صحيح الأذكار',
                audio: 'assets/audio/morning-1.mp3'
            },
            {
                id: 'morning-2',
                title: 'دعاء لبس الثوب',
                arabic: 'الحمد لله الذي كساني هذا (الثوب) ورزقنيه من غير حول مني ولا قوة.',
                translation: 'الحمد لله الذي ألبسني هذا (الثوب) ورزقني إياه من غير حول مني ولا قوة.',
                source: 'رواه أبو داود والترمذي، وصححه الألباني',
                audio: 'assets/audio/morning-2.mp3'
            },
            {
                id: 'morning-3',
                title: 'دعاء الخروج من المنزل',
                arabic: 'بسم الله، توكلت على الله، ولا حول ولا قوة إلا بالله.',
                translation: 'باسم الله، اعتمدت على الله، ولا حول ولا قوة إلا بالله.',
                source: 'رواه أبو داود والترمذي، وصححه الألباني',
                audio: 'assets/audio/morning-3.mp3'
            },
            {
                id: 'evening-1',
                title: 'دعاء المساء',
                arabic: 'أمسينا وأمسى الملك لله، والحمد لله، لا إله إلا الله وحده لا شريك له، له الملك وله الحمد وهو على كل شيء قدير. رب أسألك خير ما في هذه الليلة وخير ما بعدها، وأعوذ بك من شر ما في هذه الليلة وشر ما بعدها. رب أعوذ بك من الكسل وسوء الكبر، رب أعوذ بك من عذاب في النار وعذاب في القبر.',
                translation: 'أصبحنا وأصبح الملك لله، والحمد لله، لا إله إلا الله وحده لا شريك له، له الملك وله الحمد وهو على كل شيء قدير. رب أسألك خير ما في هذا اليوم وخير ما بعده، وأعوذ بك من شر ما في هذا اليوم وشر ما بعده. رب أعوذ بك من الكسل وسوء الكبر، رب أعوذ بك من عذاب في النار وعذاب في القبر.',
                source: 'رواه مسلم',
                audio: 'assets/audio/evening-1.mp3'
            }
        ],
        'sleep': [
            {
                id: 'sleep-1',
                title: 'دعاء النوم',
                arabic: 'باسمك اللهم أموت وأحيا.',
                translation: 'باسمك يا الله أموت وأحيا.',
                source: 'رواه البخاري',
                audio: 'assets/audio/sleep-1.mp3'
            },
            {
                id: 'sleep-2',
                title: 'دعاء الفزع في النوم',
                arabic: 'أعوذ بكلمات الله التامات من غضبه وعقابه، وشر عباده، ومن همزات الشياطين وأن يحضرون.',
                translation: 'أعوذ بكلمات الله التامات من غضبه وعقابه، وشر عباده، ومن وساوس الشياطين وأن يحضرون.',
                source: 'رواه أبو داود، وصححه الألباني',
                audio: 'assets/audio/sleep-2.mp3'
            }
        ],
        'food': [
            {
                id: 'food-1',
                title: 'دعاء قبل الطعام',
                arabic: 'بسم الله.',
                translation: 'باسم الله.',
                source: 'رواه أبو داود والترمذي، وصححه الألباني',
                audio: 'assets/audio/food-1.mp3'
            },
            {
                id: 'food-2',
                title: 'دعاء بعد الطعام',
                arabic: 'الحمد لله الذي أطعمني هذا، ورزقنيه من غير حول مني ولا قوة.',
                translation: 'الحمد لله الذي أطعمني هذا، ورزقني إياه من غير حول مني ولا قوة.',
                source: 'رواه أبو داود والترمذي، وصححه الألباني',
                audio: 'assets/audio/food-2.mp3'
            }
        ],
        'travel': [
            {
                id: 'travel-1',
                title: 'دعاء السفر',
                arabic: 'الله أكبر، الله أكبر، الله أكبر، سبحان الذي سخر لنا هذا وما كنا له مقرنين، وإنا إلى ربنا لمنقلبون. اللهم إنا نسألك في سفرنا هذا البر والتقوى، ومن العمل ما ترضى. اللهم هون علينا سفرنا هذا، واطو عنا بعده. اللهم أنت الصاحب في السفر، والخليفة في الأهل. اللهم إني أعوذ بك من وعثاء السفر، وكآبة المنظر، وسوء المنقلب في المال والأهل.',
                translation: 'الله أكبر، الله أكبر، الله أكبر، سبحان الذي سخر لنا هذا وما كنا له مقرنين، وإنا إلى ربنا لمنقلبون. اللهم إنا نسألك في سفرنا هذا البر والتقوى، ومن العمل ما ترضى. اللهم هون علينا سفرنا هذا، واطو عنا بعده. اللهم أنت الصاحب في السفر، والخليفة في الأهل. اللهم إني أعوذ بك من وعثاء السفر، وكآبة المنظر، وسوء المنقلب في المال والأهل.',
                source: 'رواه مسلم',
                audio: 'assets/audio/travel-1.mp3'
            }
        ],
        'prophetic': [
            {
                id: 'prophetic-1',
                title: 'دعاء الاستخارة',
                arabic: 'اللهم إني أستخيرك بعلمك، وأستقدرك بقدرتك، وأسألك من فضلك العظيم، فإنك تقدر ولا أقدر، وتعلم ولا أعلم، وأنت علام الغيوب. اللهم إن كنت تعلم أن هذا الأمر (ويسمي حاجته) خير لي في ديني ومعاشي وعاقبة أمري، فاقدره لي ويسره لي، ثم بارك لي فيه. وإن كنت تعلم أن هذا الأمر شر لي في ديني ومعاشي وعاقبة أمري، فاصرفه عني واصرفني عنه، واقدر لي الخير حيث كان، ثم أرضني به.',
                translation: 'اللهم إني أستخيرك بعلمك، وأستقدرك بقدرتك، وأسألك من فضلك العظيم، فإنك تقدر ولا أقدر، وتعلم ولا أعلم، وأنت علام الغيوب. اللهم إن كنت تعلم أن هذا الأمر (ويسمي حاجته) خير لي في ديني ومعاشي وعاقبة أمري، فاقدره لي ويسره لي، ثم بارك لي فيه. وإن كنت تعلم أن هذا الأمر شر لي في ديني ومعاشي وعاقبة أمري، فاصرفه عني واصرفني عنه، واقدر لي الخير حيث كان، ثم أرضني به.',
                source: 'رواه البخاري',
                audio: 'assets/audio/prophetic-1.mp3'
            },
            {
                id: 'prophetic-2',
                title: 'دعاء الكرب',
                arabic: 'لا إله إلا الله العظيم الحليم، لا إله إلا الله رب العرش العظيم، لا إله إلا الله رب السماوات ورب الأرض ورب العرش الكريم.',
                translation: 'لا إله إلا الله العظيم الحليم، لا إله إلا الله رب العرش العظيم، لا إله إلا الله رب السماوات ورب الأرض ورب العرش الكريم.',
                source: 'متفق عليه',
                audio: 'assets/audio/prophetic-2.mp3'
            }
        ],
        'occasions': [
            {
                id: 'occasions-1',
                title: 'دعاء دخول المسجد',
                arabic: 'اللهم افتح لي أبواب رحمتك.',
                translation: 'اللهم افتح لي أبواب رحمتك.',
                source: 'رواه مسلم',
                audio: 'assets/audio/occasions-1.mp3'
            },
            {
                id: 'occasions-2',
                title: 'دعاء الخروج من المسجد',
                arabic: 'اللهم إني أسألك من فضلك.',
                translation: 'اللهم إني أسألك من فضلك.',
                source: 'رواه مسلم',
                audio: 'assets/audio/occasions-2.mp3'
            }
        ]
    };
    
    // Display duas for default category
    displayDuasList(duasState.currentCategory);
}

// Setup Duas Event Listeners
function setupDuasEventListeners() {
    // Category selection
    duasCategories.forEach(category => {
        category.addEventListener('click', () => {
            const categoryId = category.getAttribute('data-category');
            
            // Update active category
            duasCategories.forEach(cat => cat.classList.remove('active'));
            category.classList.add('active');
            
            // Update current category and display duas
            duasState.currentCategory = categoryId;
            displayDuasList(categoryId);
        });
    });
    
    // Play button
    if (playBtn) {
        playBtn.addEventListener('click', () => {
            if (duasState.currentDua) {
                playDua(duasState.currentDua);
            }
        });
    }
    
    // Favorite button
    if (favoriteBtn) {
        favoriteBtn.addEventListener('click', () => {
            if (duasState.currentDua) {
                toggleFavorite(duasState.currentDua.id);
            }
        });
    }
    
    // Share button
    if (shareBtn) {
        shareBtn.addEventListener('click', () => {
            if (duasState.currentDua) {
                shareDua(duasState.currentDua);
            }
        });
    }
}

// Display Duas List
function displayDuasList(categoryId) {
    if (!duasList) return;
    
    const duas = duasState.duas[categoryId] || [];
    
    // Clear current list
    duasList.innerHTML = '';
    
    // Add duas to list
    duas.forEach(dua => {
        const duaItem = document.createElement('div');
        duaItem.className = 'dua-item';
        duaItem.innerHTML = `
            <h4>${dua.title}</h4>
            <p class="dua-preview">${dua.arabic.substring(0, 50)}...</p>
        `;
        
        // Add click event
        duaItem.addEventListener('click', () => {
            displayDuaDetails(dua);
        });
        
        duasList.appendChild(duaItem);
    });
    
    // Display first dua details if available
    if (duas.length > 0) {
        displayDuaDetails(duas[0]);
    }
}

// Display Dua Details
function displayDuaDetails(dua) {
    if (!duaDetails) return;
    
    // Update current dua
    duasState.currentDua = dua;
    
    // Update dua title
    if (duaTitle) {
        duaTitle.textContent = dua.title;
    }
    
    // Update dua text
    const duaText = duaDetails.querySelector('.dua-text');
    if (duaText) {
        duaText.innerHTML = `
            <p class="arabic">${dua.arabic}</p>
            <p class="translation">${dua.translation}</p>
        `;
    }
    
    // Update dua source
    const duaSource = duaDetails.querySelector('.dua-source');
    if (duaSource) {
        duaSource.innerHTML = `<p>${dua.source}</p>`;
    }
    
    // Update favorite button
    updateFavoriteButton(dua.id);
}

// Play Dua
function playDua(dua) {
    // In a real app, this would play the audio file
    console.log(`Playing dua: ${dua.title}`);
    
    // Create audio element
    const audio = new Audio(dua.audio);
    
    // Handle errors
    audio.onerror = () => {
        console.error('Error playing audio');
        alert('عذراً، تعذر تشغيل الصوت.');
    };
    
    // Play audio
    audio.play().catch(error => {
        console.error('Error playing audio:', error);
        alert('عذراً، تعذر تشغيل الصوت.');
    });
}

// Toggle Favorite
function toggleFavorite(duaId) {
    const index = duasState.favorites.indexOf(duaId);
    
    if (index === -1) {
        // Add to favorites
        duasState.favorites.push(duaId);
    } else {
        // Remove from favorites
        duasState.favorites.splice(index, 1);
    }
    
    // Save favorites
    saveFavorites();
    
    // Update favorite button
    updateFavoriteButton(duaId);
}

// Update Favorite Button
function updateFavoriteButton(duaId) {
    if (!favoriteBtn) return;
    
    const isFavorite = duasState.favorites.includes(duaId);
    
    if (isFavorite) {
        favoriteBtn.innerHTML = '<i class="fas fa-heart"></i> إزالة من المفضلة';
        favoriteBtn.classList.add('favorited');
    } else {
        favoriteBtn.innerHTML = '<i class="far fa-heart"></i> إضافة للمفضلة';
        favoriteBtn.classList.remove('favorited');
    }
}

// Share Dua
function shareDua(dua) {
    // In a real app, this would use the Web Share API
    console.log(`Sharing dua: ${dua.title}`);
    
    // Check if Web Share API is supported
    if (navigator.share) {
        navigator.share({
            title: dua.title,
            text: `${dua.arabic}\n\n${dua.translation}\n\n${dua.source}`,
            url: window.location.href
        })
        .then(() => console.log('Dua shared successfully'))
        .catch(error => console.error('Error sharing dua:', error));
    } else {
        // Fallback for browsers that don't support Web Share API
        alert(`
            ${dua.title}
            
            ${dua.arabic}
            
            ${dua.translation}
            
            ${dua.source}
        `);
    }
}

// Initialize the module
if (typeof window !== 'undefined') {
    // Make functions available globally
    window.initDuasFeature = initDuasFeature;
}
