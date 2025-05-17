// Islamic Challenges Module

// DOM Elements
const challengesSection = document.createElement('section');
challengesSection.id = 'challenges-section';
challengesSection.className = 'feature-section hidden';

// Challenges State
const challengesState = {
    currentCategory: 'fiqh',
    currentQuestion: null,
    score: 0,
    answeredQuestions: [],
    questions: {}
};

// Initialize Challenges Feature
function initChallengesFeature() {
    console.log('Initializing Islamic Challenges Feature');
    
    // Create challenges section if it doesn't exist
    if (!document.getElementById('challenges-section')) {
        createChallengesSection();
    }
    
    // Load saved progress
    loadChallengesProgress();
    
    // Load questions data
    loadQuestionsData();
    
    // Setup event listeners
    setupChallengesEventListeners();
}

// Create Challenges Section
function createChallengesSection() {
    challengesSection.innerHTML = `
        <div class="section-header">
            <button class="back-btn"><i class="fas fa-arrow-right"></i></button>
            <h2>التحديات الإسلامية</h2>
        </div>
        <div class="section-content">
            <div class="challenges-navigation">
                <div class="challenges-categories">
                    <div class="category-item active" data-category="fiqh">
                        <span>أسئلة فقهية</span>
                    </div>
                    <div class="category-item" data-category="aqeedah">
                        <span>أسئلة عقائدية</span>
                    </div>
                    <div class="category-item" data-category="seerah">
                        <span>أسئلة في السيرة</span>
                    </div>
                    <div class="category-item" data-category="quran">
                        <span>أسئلة قرآنية</span>
                    </div>
                    <div class="category-item" data-category="hadith">
                        <span>أسئلة في الحديث</span>
                    </div>
                </div>
            </div>
            <div class="challenges-content">
                <div class="challenges-info">
                    <div class="score-display">
                        <h3>النتيجة: <span id="current-score">0</span></h3>
                    </div>
                    <div class="progress-display">
                        <h3>التقدم: <span id="progress-count">0/0</span></h3>
                    </div>
                </div>
                <div class="question-container">
                    <h3 id="question-text">جاري تحميل السؤال...</h3>
                    <div class="options-container" id="options-container">
                        <!-- Options will be added dynamically -->
                    </div>
                    <div class="question-feedback" id="question-feedback">
                        <!-- Feedback will be shown here -->
                    </div>
                </div>
                <div class="question-actions">
                    <button id="next-question-btn" disabled>السؤال التالي</button>
                    <button id="reset-category-btn">إعادة تعيين هذه الفئة</button>
                </div>
            </div>
        </div>
    `;
    
    // Add back button event listener
    const backBtn = challengesSection.querySelector('.back-btn');
    backBtn.addEventListener('click', () => {
        window.hideFeatures();
    });
    
    // Add to document
    document.getElementById('app').appendChild(challengesSection);
    
    // Add feature card to main page if it doesn't exist
    if (!document.querySelector('.feature-card[data-feature="challenges"]')) {
        const featuresGrid = document.querySelector('.features-grid');
        if (featuresGrid) {
            const challengesCard = document.createElement('div');
            challengesCard.className = 'feature-card';
            challengesCard.setAttribute('data-feature', 'challenges');
            challengesCard.innerHTML = `
                <div class="feature-icon">
                    <i class="fas fa-question-circle"></i>
                </div>
                <h3>التحديات الإسلامية</h3>
            `;
            
            challengesCard.addEventListener('click', () => {
                window.showFeature('challenges');
            });
            
            featuresGrid.appendChild(challengesCard);
        }
    }
}

// Load Challenges Progress
function loadChallengesProgress() {
    try {
        const savedScore = localStorage.getItem('challengesScore');
        const savedAnswered = localStorage.getItem('answeredQuestions');
        
        if (savedScore) {
            challengesState.score = parseInt(savedScore);
        }
        
        if (savedAnswered) {
            challengesState.answeredQuestions = JSON.parse(savedAnswered);
        }
        
        // Update score display
        updateScoreDisplay();
    } catch (error) {
        console.error('Error loading challenges progress:', error);
    }
}

// Save Challenges Progress
function saveChallengesProgress() {
    try {
        localStorage.setItem('challengesScore', challengesState.score.toString());
        localStorage.setItem('answeredQuestions', JSON.stringify(challengesState.answeredQuestions));
    } catch (error) {
        console.error('Error saving challenges progress:', error);
    }
}

// Load Questions Data
function loadQuestionsData() {
    // In a real app, this would load from a database or API
    // For now, we'll use sample data based on Islamic sources
    challengesState.questions = {
        'fiqh': [
            {
                id: 'fiqh-1',
                question: 'ما هي شروط صحة الصلاة؟',
                options: [
                    'الإسلام، العقل، البلوغ، دخول الوقت، الطهارة، ستر العورة، استقبال القبلة، النية',
                    'الإسلام، العقل، البلوغ، الطهارة فقط',
                    'الإسلام، دخول الوقت، استقبال القبلة فقط',
                    'الإسلام، النية، الطهارة فقط'
                ],
                correctAnswer: 0,
                explanation: 'شروط صحة الصلاة هي: الإسلام، العقل، البلوغ، دخول الوقت، الطهارة، ستر العورة، استقبال القبلة، والنية. قال الشيخ ابن عثيمين رحمه الله: "شروط الصلاة هي الأمور التي يجب توفرها قبل الصلاة، وتبطل الصلاة بفقدها".',
                source: 'الشرح الممتع على زاد المستقنع - الشيخ محمد بن صالح العثيمين'
            },
            {
                id: 'fiqh-2',
                question: 'ما هو حكم صلاة الجماعة للرجال؟',
                options: [
                    'واجبة على الأعيان',
                    'سنة مؤكدة',
                    'فرض كفاية',
                    'مستحبة'
                ],
                correctAnswer: 0,
                explanation: 'صلاة الجماعة واجبة على الرجال الأحرار المكلفين القادرين، وهذا هو الراجح من أقوال أهل العلم. قال الشيخ ابن باز رحمه الله: "الصواب أن صلاة الجماعة واجبة على الرجال في المساجد، وهذا هو قول جمهور أهل العلم، وهو مذهب الإمام أحمد".',
                source: 'مجموع فتاوى ابن باز'
            },
            {
                id: 'fiqh-3',
                question: 'ما هي أركان الصلاة؟',
                options: [
                    'القيام مع القدرة، تكبيرة الإحرام، قراءة الفاتحة، الركوع، الرفع من الركوع، السجود، الجلوس بين السجدتين، التشهد الأخير، الجلوس له، السلام',
                    'تكبيرة الإحرام، قراءة الفاتحة، الركوع، السجود فقط',
                    'القيام، الركوع، السجود، التشهد، السلام فقط',
                    'النية، تكبيرة الإحرام، قراءة الفاتحة، الركوع، السجود فقط'
                ],
                correctAnswer: 0,
                explanation: 'أركان الصلاة هي: القيام مع القدرة، تكبيرة الإحرام، قراءة الفاتحة، الركوع، الرفع من الركوع، السجود، الجلوس بين السجدتين، التشهد الأخير، الجلوس له، والسلام. قال الشيخ ابن عثيمين رحمه الله: "الأركان هي أجزاء الماهية التي لا تتم إلا بها، ولا تسقط سهواً ولا جهلاً ولا عمداً".',
                source: 'الشرح الممتع على زاد المستقنع - الشيخ محمد بن صالح العثيمين'
            },
            {
                id: 'fiqh-4',
                question: 'ما هو نصاب الزكاة في الذهب؟',
                options: [
                    '20 ديناراً (85 جراماً تقريباً)',
                    '40 ديناراً',
                    '10 دنانير',
                    '100 دينار'
                ],
                correctAnswer: 0,
                explanation: 'نصاب الزكاة في الذهب هو 20 ديناراً، وهو ما يعادل 85 جراماً من الذهب الخالص تقريباً. قال الشيخ ابن باز رحمه الله: "نصاب الذهب عشرون مثقالاً، وهو ما يعادل عشرين ديناراً، أو خمسة وثمانين جراماً تقريباً".',
                source: 'مجموع فتاوى ابن باز'
            },
            {
                id: 'fiqh-5',
                question: 'ما هي شروط وجوب الزكاة؟',
                options: [
                    'الإسلام، الحرية، الملك التام، بلوغ النصاب، حولان الحول (إلا في الزروع والثمار والمعادن والركاز)',
                    'الإسلام، البلوغ، العقل، بلوغ النصاب فقط',
                    'الإسلام، الملك التام، بلوغ النصاب فقط',
                    'الإسلام، الحرية، بلوغ النصاب فقط'
                ],
                correctAnswer: 0,
                explanation: 'شروط وجوب الزكاة هي: الإسلام، الحرية، الملك التام، بلوغ النصاب، وحولان الحول (إلا في الزروع والثمار والمعادن والركاز). قال الشيخ ابن عثيمين رحمه الله: "لا تجب الزكاة إلا بشروط خمسة: الإسلام، والحرية، وملك النصاب ملكاً تاماً، وحولان الحول إلا في الخارج من الأرض".',
                source: 'الشرح الممتع على زاد المستقنع - الشيخ محمد بن صالح العثيمين'
            }
        ],
        'aqeedah': [
            {
                id: 'aqeedah-1',
                question: 'ما هي أقسام التوحيد؟',
                options: [
                    'توحيد الربوبية، توحيد الألوهية، توحيد الأسماء والصفات',
                    'توحيد الذات، توحيد الصفات، توحيد الأفعال',
                    'توحيد القول، توحيد العمل، توحيد الاعتقاد',
                    'توحيد العبادة، توحيد الطاعة، توحيد المحبة'
                ],
                correctAnswer: 0,
                explanation: 'أقسام التوحيد ثلاثة: توحيد الربوبية، وتوحيد الألوهية، وتوحيد الأسماء والصفات. قال الشيخ محمد بن عبد الوهاب رحمه الله: "التوحيد الذي دعت إليه الرسل، وأنزلت به الكتب، هو توحيد الإلهية المتضمن لتوحيد الربوبية".',
                source: 'كتاب التوحيد - الشيخ محمد بن عبد الوهاب'
            },
            {
                id: 'aqeedah-2',
                question: 'ما هو تعريف العبادة؟',
                options: [
                    'اسم جامع لكل ما يحبه الله ويرضاه من الأقوال والأعمال الظاهرة والباطنة',
                    'الصلاة والصيام والزكاة والحج فقط',
                    'طاعة الله في أوامره فقط',
                    'الخضوع والتذلل لله فقط'
                ],
                correctAnswer: 0,
                explanation: 'العبادة هي اسم جامع لكل ما يحبه الله ويرضاه من الأقوال والأعمال الظاهرة والباطنة. قال شيخ الإسلام ابن تيمية رحمه الله: "العبادة هي اسم جامع لكل ما يحبه الله ويرضاه من الأقوال والأعمال الباطنة والظاهرة".',
                source: 'العبودية - شيخ الإسلام ابن تيمية'
            },
            {
                id: 'aqeedah-3',
                question: 'ما هو الإيمان في الاصطلاح الشرعي؟',
                options: [
                    'قول باللسان، واعتقاد بالقلب، وعمل بالجوارح، يزيد بالطاعة وينقص بالمعصية',
                    'التصديق بالقلب فقط',
                    'النطق بالشهادتين فقط',
                    'العمل بالجوارح فقط'
                ],
                correctAnswer: 0,
                explanation: 'الإيمان في الاصطلاح الشرعي هو قول باللسان، واعتقاد بالقلب، وعمل بالجوارح، يزيد بالطاعة وينقص بالمعصية. قال الإمام البخاري رحمه الله: "الإيمان قول وعمل، يزيد وينقص".',
                source: 'شرح العقيدة الطحاوية - ابن أبي العز الحنفي'
            },
            {
                id: 'aqeedah-4',
                question: 'ما هي أركان الإيمان؟',
                options: [
                    'الإيمان بالله، وملائكته، وكتبه، ورسله، واليوم الآخر، والقدر خيره وشره',
                    'الإيمان بالله، والملائكة، والكتب، والرسل فقط',
                    'الإيمان بالله، واليوم الآخر، والقدر فقط',
                    'الإيمان بالله، والرسل، واليوم الآخر فقط'
                ],
                correctAnswer: 0,
                explanation: 'أركان الإيمان ستة، وهي: الإيمان بالله، وملائكته، وكتبه، ورسله، واليوم الآخر، والقدر خيره وشره. وهذا ثابت في حديث جبريل المشهور عندما سأل النبي صلى الله عليه وسلم عن الإيمان.',
                source: 'صحيح مسلم - حديث جبريل'
            },
            {
                id: 'aqeedah-5',
                question: 'ما هو موقف أهل السنة والجماعة من أسماء الله وصفاته؟',
                options: [
                    'إثباتها كما جاءت في الكتاب والسنة من غير تحريف ولا تعطيل ولا تكييف ولا تمثيل',
                    'تأويلها بما يناسب العقل',
                    'تفويض معانيها إلى الله مع نفي حقائقها',
                    'إثبات بعضها ونفي بعضها الآخر'
                ],
                correctAnswer: 0,
                explanation: 'موقف أهل السنة والجماعة من أسماء الله وصفاته هو إثباتها كما جاءت في الكتاب والسنة من غير تحريف ولا تعطيل ولا تكييف ولا تمثيل. قال الإمام أحمد رحمه الله: "نؤمن بها، ونصدق بها، ولا نرد شيئاً منها، ولا نحد، ولا نعلم كيفية إلا بما وصف به نفسه".',
                source: 'العقيدة الواسطية - شيخ الإسلام ابن تيمية'
            }
        ],
        'seerah': [
            {
                id: 'seerah-1',
                question: 'متى ولد النبي صلى الله عليه وسلم؟',
                options: [
                    'في عام الفيل (570م تقريباً)',
                    'في عام 580م',
                    'في عام 560م',
                    'في عام 590م'
                ],
                correctAnswer: 0,
                explanation: 'ولد النبي صلى الله عليه وسلم في عام الفيل، الموافق لعام 570م تقريباً، في شهر ربيع الأول. قال ابن كثير رحمه الله: "ولد رسول الله صلى الله عليه وسلم عام الفيل، وقيل: بعده بثلاثين يوماً، وقيل: بخمسين يوماً، وقيل: بأربعين يوماً".',
                source: 'البداية والنهاية - ابن كثير'
            },
            {
                id: 'seerah-2',
                question: 'كم كان عمر النبي صلى الله عليه وسلم عندما بعث؟',
                options: [
                    '40 سنة',
                    '35 سنة',
                    '45 سنة',
                    '50 سنة'
                ],
                correctAnswer: 0,
                explanation: 'بعث النبي صلى الله عليه وسلم وعمره 40 سنة. قال ابن كثير رحمه الله: "وكان ابتداء نزول الوحي عليه صلى الله عليه وسلم وهو ابن أربعين سنة".',
                source: 'البداية والنهاية - ابن كثير'
            },
            {
                id: 'seerah-3',
                question: 'كم استمرت الدعوة السرية في مكة؟',
                options: [
                    '3 سنوات',
                    'سنة واحدة',
                    '5 سنوات',
                    '10 سنوات'
                ],
                correctAnswer: 0,
                explanation: 'استمرت الدعوة السرية في مكة 3 سنوات، ثم أمر الله نبيه بالجهر بالدعوة بقوله: ﴿فَاصْدَعْ بِمَا تُؤْمَرُ وَأَعْرِضْ عَنِ الْمُشْرِكِينَ﴾ [الحجر: 94].',
                source: 'الرحيق المختوم - صفي الرحمن المباركفوري'
            },
            {
                id: 'seerah-4',
                question: 'في أي سنة كانت الهجرة النبوية من مكة إلى المدينة؟',
                options: [
                    'السنة 13 من البعثة (622م)',
                    'السنة 10 من البعثة',
                    'السنة 15 من البعثة',
                    'السنة 20 من البعثة'
                ],
                correctAnswer: 0,
                explanation: 'كانت الهجرة النبوية من مكة إلى المدينة في السنة 13 من البعثة، الموافق لعام 622م. وقد اتخذها عمر بن الخطاب رضي الله عنه بداية للتقويم الهجري.',
                source: 'الرحيق المختوم - صفي الرحمن المباركفوري'
            },
            {
                id: 'seerah-5',
                question: 'في أي سنة توفي النبي صلى الله عليه وسلم؟',
                options: [
                    'السنة 11 للهجرة (632م)',
                    'السنة 10 للهجرة',
                    'السنة 12 للهجرة',
                    'السنة 13 للهجرة'
                ],
                correctAnswer: 0,
                explanation: 'توفي النبي صلى الله عليه وسلم في السنة 11 للهجرة، الموافق لعام 632م، وكان عمره 63 سنة. قال ابن كثير رحمه الله: "توفي رسول الله صلى الله عليه وسلم يوم الاثنين لاثنتي عشرة ليلة خلت من شهر ربيع الأول سنة إحدى عشرة من الهجرة".',
                source: 'البداية والنهاية - ابن كثير'
            }
        ],
        'quran': [
            {
                id: 'quran-1',
                question: 'كم عدد سور القرآن الكريم؟',
                options: [
                    '114 سورة',
                    '120 سورة',
                    '110 سورة',
                    '115 سورة'
                ],
                correctAnswer: 0,
                explanation: 'عدد سور القرآن الكريم 114 سورة، منها 86 سورة مكية، و28 سورة مدنية على الراجح.',
                source: 'الإتقان في علوم القرآن - السيوطي'
            },
            {
                id: 'quran-2',
                question: 'ما هي أول سورة نزلت على النبي صلى الله عليه وسلم؟',
                options: [
                    'سورة العلق (اقرأ)',
                    'سورة الفاتحة',
                    'سورة المدثر',
                    'سورة القلم'
                ],
                correctAnswer: 0,
                explanation: 'أول سورة نزلت على النبي صلى الله عليه وسلم هي سورة العلق، وتحديداً الآيات الخمس الأولى منها: ﴿اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ﴾ [العلق: 1].',
                source: 'صحيح البخاري - حديث عائشة رضي الله عنها'
            },
            {
                id: 'quran-3',
                question: 'ما هي آخر سورة نزلت كاملة على النبي صلى الله عليه وسلم؟',
                options: [
                    'سورة النصر',
                    'سورة التوبة',
                    'سورة المائدة',
                    'سورة البقرة'
                ],
                correctAnswer: 0,
                explanation: 'آخر سورة نزلت كاملة على النبي صلى الله عليه وسلم هي سورة النصر. قال ابن عباس رضي الله عنهما: "آخر سورة نزلت كاملة سورة إذا جاء نصر الله والفتح".',
                source: 'صحيح البخاري'
            },
            {
                id: 'quran-4',
                question: 'ما هي أطول سورة في القرآن الكريم؟',
                options: [
                    'سورة البقرة',
                    'سورة آل عمران',
                    'سورة النساء',
                    'سورة المائدة'
                ],
                correctAnswer: 0,
                explanation: 'أطول سورة في القرآن الكريم هي سورة البقرة، وعدد آياتها 286 آية.',
                source: 'الإتقان في علوم القرآن - السيوطي'
            },
            {
                id: 'quran-5',
                question: 'ما هي السورة التي تعدل ثلث القرآن؟',
                options: [
                    'سورة الإخلاص',
                    'سورة الفاتحة',
                    'سورة الكوثر',
                    'سورة العصر'
                ],
                correctAnswer: 0,
                explanation: 'سورة الإخلاص تعدل ثلث القرآن، كما ثبت في الحديث الصحيح أن النبي صلى الله عليه وسلم قال: «قل هو الله أحد تعدل ثلث القرآن».',
                source: 'صحيح مسلم'
            }
        ],
        'hadith': [
            {
                id: 'hadith-1',
                question: 'ما هو حديث "إنما الأعمال بالنيات"؟',
                options: [
                    'إنما الأعمال بالنيات، وإنما لكل امرئ ما نوى، فمن كانت هجرته إلى الله ورسوله فهجرته إلى الله ورسوله، ومن كانت هجرته لدنيا يصيبها أو امرأة ينكحها فهجرته إلى ما هاجر إليه',
                    'إنما الأعمال بالخواتيم',
                    'إنما الأعمال بالنيات، ومن نوى خيراً فله خير',
                    'إنما الأعمال بالنيات، والنية خير من العمل'
                ],
                correctAnswer: 0,
                explanation: 'حديث "إنما الأعمال بالنيات" هو: "إنما الأعمال بالنيات، وإنما لكل امرئ ما نوى، فمن كانت هجرته إلى الله ورسوله فهجرته إلى الله ورسوله، ومن كانت هجرته لدنيا يصيبها أو امرأة ينكحها فهجرته إلى ما هاجر إليه". وهو أول حديث في صحيح البخاري.',
                source: 'صحيح البخاري'
            },
            {
                id: 'hadith-2',
                question: 'من هم أصحاب الكتب الستة؟',
                options: [
                    'البخاري، مسلم، أبو داود، الترمذي، النسائي، ابن ماجه',
                    'البخاري، مسلم، أحمد، أبو داود، الترمذي، النسائي',
                    'البخاري، مسلم، مالك، أبو داود، الترمذي، النسائي',
                    'البخاري، مسلم، أبو داود، الترمذي، النسائي، الدارمي'
                ],
                correctAnswer: 0,
                explanation: 'أصحاب الكتب الستة هم: البخاري، مسلم، أبو داود، الترمذي، النسائي، وابن ماجه. وهي أهم كتب الحديث المعتمدة عند أهل السنة والجماعة.',
                source: 'مصطلح الحديث - ابن عثيمين'
            },
            {
                id: 'hadith-3',
                question: 'ما هو الحديث القدسي؟',
                options: [
                    'ما أضافه النبي صلى الله عليه وسلم إلى ربه عز وجل من قول',
                    'ما رواه الصحابة عن النبي صلى الله عليه وسلم',
                    'ما نزل به جبريل على النبي صلى الله عليه وسلم',
                    'ما كان متواتراً من الأحاديث'
                ],
                correctAnswer: 0,
                explanation: 'الحديث القدسي هو ما أضافه النبي صلى الله عليه وسلم إلى ربه عز وجل من قول. قال الشيخ ابن عثيمين رحمه الله: "الحديث القدسي هو ما رواه النبي صلى الله عليه وسلم عن ربه عز وجل".',
                source: 'مصطلح الحديث - ابن عثيمين'
            },
            {
                id: 'hadith-4',
                question: 'ما هو الحديث المتواتر؟',
                options: [
                    'ما رواه عدد كبير يستحيل تواطؤهم على الكذب عن مثلهم إلى منتهاه',
                    'ما رواه صحابي واحد عن النبي صلى الله عليه وسلم',
                    'ما رواه التابعون عن الصحابة',
                    'ما رواه الثقات من الرواة'
                ],
                correctAnswer: 0,
                explanation: 'الحديث المتواتر هو ما رواه عدد كبير يستحيل تواطؤهم على الكذب عن مثلهم إلى منتهاه. قال الشيخ ابن عثيمين رحمه الله: "المتواتر هو ما رواه جمع عن جمع يستحيل تواطؤهم على الكذب".',
                source: 'مصطلح الحديث - ابن عثيمين'
            },
            {
                id: 'hadith-5',
                question: 'ما هي شروط الحديث الصحيح؟',
                options: [
                    'اتصال السند، عدالة الرواة، ضبط الرواة، عدم الشذوذ، عدم العلة',
                    'اتصال السند، عدالة الرواة، ضبط الرواة فقط',
                    'عدالة الرواة، ضبط الرواة، عدم الشذوذ فقط',
                    'اتصال السند، عدم الشذوذ، عدم العلة فقط'
                ],
                correctAnswer: 0,
                explanation: 'شروط الحديث الصحيح خمسة: اتصال السند، عدالة الرواة، ضبط الرواة، عدم الشذوذ، وعدم العلة. قال الحافظ ابن حجر رحمه الله: "الصحيح هو ما اتصل سنده بنقل العدل الضابط عن مثله إلى منتهاه من غير شذوذ ولا علة".',
                source: 'نزهة النظر في توضيح نخبة الفكر - ابن حجر العسقلاني'
            }
        ]
    };
    
    // Display questions for default category
    displayQuestion(challengesState.currentCategory);
}

// Setup Challenges Event Listeners
function setupChallengesEventListeners() {
    // Category selection
    const categoryItems = document.querySelectorAll('#challenges-section .category-item');
    categoryItems.forEach(category => {
        category.addEventListener('click', () => {
            const categoryId = category.getAttribute('data-category');
            
            // Update active category
            categoryItems.forEach(cat => cat.classList.remove('active'));
            category.classList.add('active');
            
            // Update current category and display question
            challengesState.currentCategory = categoryId;
            displayQuestion(categoryId);
        });
    });
    
    // Next question button
    const nextQuestionBtn = document.getElementById('next-question-btn');
    if (nextQuestionBtn) {
        nextQuestionBtn.addEventListener('click', () => {
            displayQuestion(challengesState.currentCategory);
        });
    }
    
    // Reset category button
    const resetCategoryBtn = document.getElementById('reset-category-btn');
    if (resetCategoryBtn) {
        resetCategoryBtn.addEventListener('click', () => {
            resetCategory(challengesState.currentCategory);
        });
    }
}

// Display Question
function displayQuestion(categoryId) {
    const questions = challengesState.questions[categoryId] || [];
    const questionText = document.getElementById('question-text');
    const optionsContainer = document.getElementById('options-container');
    const questionFeedback = document.getElementById('question-feedback');
    const nextQuestionBtn = document.getElementById('next-question-btn');
    
    // Clear previous question
    if (questionText) questionText.textContent = 'جاري تحميل السؤال...';
    if (optionsContainer) optionsContainer.innerHTML = '';
    if (questionFeedback) questionFeedback.innerHTML = '';
    if (nextQuestionBtn) nextQuestionBtn.disabled = true;
    
    // Get unanswered questions
    const answeredIds = challengesState.answeredQuestions.map(q => q.id);
    const unansweredQuestions = questions.filter(q => !answeredIds.includes(q.id));
    
    // If all questions are answered, show a message
    if (unansweredQuestions.length === 0) {
        if (questionText) questionText.textContent = 'لقد أجبت على جميع الأسئلة في هذه الفئة!';
        if (questionFeedback) {
            questionFeedback.innerHTML = `
                <div class="feedback-message success">
                    <p>أحسنت! لقد أكملت جميع الأسئلة في هذه الفئة.</p>
                    <p>يمكنك إعادة تعيين هذه الفئة للإجابة على الأسئلة مرة أخرى، أو اختيار فئة أخرى.</p>
                </div>
            `;
        }
        updateProgressCount(categoryId);
        return;
    }
    
    // Select a random question
    const randomIndex = Math.floor(Math.random() * unansweredQuestions.length);
    const question = unansweredQuestions[randomIndex];
    challengesState.currentQuestion = question;
    
    // Display question
    if (questionText) questionText.textContent = question.question;
    
    // Display options
    if (optionsContainer) {
        question.options.forEach((option, index) => {
            const optionElement = document.createElement('div');
            optionElement.className = 'option';
            optionElement.innerHTML = `
                <input type="radio" id="option-${index}" name="answer" value="${index}">
                <label for="option-${index}">${option}</label>
            `;
            
            // Add click event
            optionElement.addEventListener('click', () => {
                // Select the radio button
                const radio = optionElement.querySelector('input[type="radio"]');
                radio.checked = true;
                
                // Check answer
                checkAnswer(index);
            });
            
            optionsContainer.appendChild(optionElement);
        });
    }
    
    // Update progress count
    updateProgressCount(categoryId);
}

// Check Answer
function checkAnswer(selectedIndex) {
    const question = challengesState.currentQuestion;
    const questionFeedback = document.getElementById('question-feedback');
    const nextQuestionBtn = document.getElementById('next-question-btn');
    const optionsContainer = document.getElementById('options-container');
    
    if (!question) return;
    
    // Disable all options
    const options = optionsContainer.querySelectorAll('.option');
    options.forEach(option => {
        option.classList.add('disabled');
        option.removeEventListener('click', () => {});
    });
    
    // Check if answer is correct
    const isCorrect = selectedIndex === question.correctAnswer;
    
    // Highlight correct and incorrect answers
    options.forEach((option, index) => {
        if (index === question.correctAnswer) {
            option.classList.add('correct');
        } else if (index === selectedIndex && !isCorrect) {
            option.classList.add('incorrect');
        }
    });
    
    // Show feedback
    if (questionFeedback) {
        questionFeedback.innerHTML = `
            <div class="feedback-message ${isCorrect ? 'success' : 'error'}">
                <p>${isCorrect ? 'أحسنت! الإجابة صحيحة.' : 'للأسف، الإجابة خاطئة.'}</p>
                <p><strong>التوضيح:</strong> ${question.explanation}</p>
                <p><strong>المصدر:</strong> ${question.source}</p>
            </div>
        `;
    }
    
    // Enable next question button
    if (nextQuestionBtn) {
        nextQuestionBtn.disabled = false;
    }
    
    // Update score and answered questions
    if (isCorrect) {
        challengesState.score += 10;
    }
    
    challengesState.answeredQuestions.push({
        id: question.id,
        correct: isCorrect
    });
    
    // Save progress
    saveChallengesProgress();
    
    // Update score display
    updateScoreDisplay();
    
    // Update progress count
    updateProgressCount(challengesState.currentCategory);
}

// Update Score Display
function updateScoreDisplay() {
    const scoreElement = document.getElementById('current-score');
    if (scoreElement) {
        scoreElement.textContent = challengesState.score;
    }
}

// Update Progress Count
function updateProgressCount(categoryId) {
    const progressElement = document.getElementById('progress-count');
    if (!progressElement) return;
    
    const questions = challengesState.questions[categoryId] || [];
    const answeredIds = challengesState.answeredQuestions
        .filter(q => q.id.startsWith(categoryId))
        .map(q => q.id);
    
    const answeredCount = new Set(answeredIds).size;
    const totalCount = questions.length;
    
    progressElement.textContent = `${answeredCount}/${totalCount}`;
}

// Reset Category
function resetCategory(categoryId) {
    // Remove answered questions from this category
    challengesState.answeredQuestions = challengesState.answeredQuestions.filter(q => !q.id.startsWith(categoryId));
    
    // Save progress
    saveChallengesProgress();
    
    // Display new question
    displayQuestion(categoryId);
}

// Add CSS for Challenges
function addChallengesStyles() {
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        #challenges-section {
            background-color: #E8F5E9;
        }
        
        .challenges-categories {
            display: flex;
            overflow-x: auto;
            padding-bottom: 0.5rem;
            margin-bottom: 1rem;
            white-space: nowrap;
        }
        
        .challenges-info {
            display: flex;
            justify-content: space-between;
            margin-bottom: 1rem;
        }
        
        .question-container {
            background-color: #fff;
            border-radius: 8px;
            padding: 1rem;
            margin-bottom: 1rem;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        
        .options-container {
            margin-top: 1rem;
        }
        
        .option {
            padding: 0.75rem;
            margin-bottom: 0.5rem;
            background-color: #f5f5f5;
            border-radius: 4px;
            cursor: pointer;
            transition: background-color 0.3s ease;
        }
        
        .option:hover {
            background-color: #e0e0e0;
        }
        
        .option.correct {
            background-color: #C8E6C9;
            border: 1px solid #4CAF50;
        }
        
        .option.incorrect {
            background-color: #FFCDD2;
            border: 1px solid #F44336;
        }
        
        .option.disabled {
            pointer-events: none;
        }
        
        .question-feedback {
            margin-top: 1rem;
        }
        
        .feedback-message {
            padding: 1rem;
            border-radius: 4px;
            margin-bottom: 1rem;
        }
        
        .feedback-message.success {
            background-color: #C8E6C9;
            border: 1px solid #4CAF50;
        }
        
        .feedback-message.error {
            background-color: #FFCDD2;
            border: 1px solid #F44336;
        }
        
        .question-actions {
            display: flex;
            justify-content: space-between;
        }
    `;
    
    document.head.appendChild(styleElement);
}

// Initialize the module
function initChallenges() {
    // Add CSS
    addChallengesStyles();
    
    // Initialize feature
    initChallengesFeature();
    
    // Make function available globally
    if (typeof window !== 'undefined') {
        window.initChallengesFeature = initChallengesFeature;
        
        // Add to window.showFeature
        const originalShowFeature = window.showFeature;
        window.showFeature = function(feature) {
            if (feature === 'challenges') {
                // Initialize challenges if not already initialized
                if (!document.getElementById('challenges-section')) {
                    initChallengesFeature();
                }
            }
            
            // Call original function
            originalShowFeature(feature);
        };
    }
}

// Initialize on load
if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initChallenges);
    } else {
        initChallenges();
    }
}
