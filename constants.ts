
import { Language } from './types';

export const BASE_LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' }
];

export const DOWNLOADABLE_LANGUAGES = [
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'zh', name: '中文 (Chinese)', flag: '🇨🇳' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'hi', name: 'हिन्दी (Hindi)', flag: '🇮🇳' },
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' }
];

export const TRANSLATIONS: Record<string, any> = {
  ar: {
    title: 'Trade Manager Guard Pro V1.1',
    dashboard: 'لوحة التحكم',
    settings: 'الإعدادات والاستراتيجية',
    history: 'سجل الصفقات',
    report: 'التقرير والتحليل',

    // Auth
    loginTitle: 'تسجيل الدخول',
    registerTitle: 'إنشاء حساب جديد',
    email: 'البريد الإلكتروني',
    password: 'كلمة المرور',
    loginBtn: 'دخول',
    registerBtn: 'تسجيل',
    continueWith: 'أو المتابعة باستخدام',
    google: 'Google',
    github: 'GitHub',
    haveAccount: 'لديك حساب بالفعل؟',
    noAccount: 'ليس لديك حساب؟',
    signOut: 'تسجيل الخروج',
    welcome: 'مرحباً',

    // User Menu & Help
    profile: 'الملف الشخصي',
    profileSettings: 'إعدادات الملف الشخصي',
    editProfile: 'تعديل الملف الشخصي',
    nameLabel: 'الاسم',
    avatarLabel: 'رابط الصورة (اختياري)',
    saveChanges: 'حفظ التغييرات',
    profileUpdated: 'تم تحديث الملف الشخصي بنجاح',
    strategyGuide: 'دليل الاستراتيجية (Ronald PRO)',
    openStrategy: 'فتح مساعد الاستراتيجية',
    appTutorial: 'جولة في التطبيق (Live)',
    help: 'المساعدة',

    // Strategy Modal
    stratTitle: 'محلل الاستراتيجية الذكي',
    stratDesc: 'اختر الاستراتيجية المناسبة للبدء.',

    // Menu
    stratMenuTitle: 'الاستراتيجيات',
    stratRonald: 'سكالبينج 30 ثانية (Ronald PRO)',
    stratEmaSar: 'تتبع الاتجاه (EMA + SAR)',

    // Strategy 1: Ronald PRO
    ronaldTitle: 'سكالبينج 30 ثانية (Ronald PRO)',
    ronaldDesc: 'استراتيجية سريعة لصفقات 30 ثانية.',

    // Indicators (Ronald)
    checkEnvelopes: '1. حالة مؤشر Envelopes',
    valEnvelopes: 'الإعدادات: Period 9, Dev 0.01, MA: TMA',
    optEnvTop: 'ملامسة الخط العلوي (مقاومة)',
    optEnvBottom: 'ملامسة الخط السفلي (دعم)',
    optEnvMid: 'في المنتصف / غير واضح',

    checkAroon: '2. حالة مؤشر Aroon',
    valAroon: 'الإعدادات: Period 9',
    optAroonUp: 'الخط الأخضر (UP) هو المرتفع',
    optAroonDown: 'الخط الأحمر (DOWN) هو المرتفع',
    optAroonWeak: 'الخطوط متقاربة / ضعيفة',

    checkAC: '3. مؤشر Awesome Oscillator',
    valAC: 'الإعدادات: Fast 5, Slow 10',
    optAcGreen: 'أعمدة خضراء (صعود)',
    optAcRed: 'أعمدة حمراء (هبوط)',
    optAcWeak: 'ضعيفة / متذبذبة',

    checkRsi: '4. فلتر ADX (قوة الاتجاه)',
    valRsi: 'الإعدادات: Period 14, Min 20',
    optRsiBuy: 'اتجاه قوي (ADX > 20)',
    optRsiSell: 'تذبذب / اتجاه ضعيف',

    // Strategy 2: EMA + SAR
    emaSarTitle: 'تتبع الاتجاه (EMA + SAR)',
    emaSarDesc: 'التداول مع الاتجاه بتقاطع المتوسطات والبارابوليك.',

    checkEma: '1. تقاطع المتوسطات (EMA)',
    valEma: 'Fast: 8 (أصفر), Slow: 21 (أبيض)',
    optEmaBuy: 'الأصفر فوق الأبيض (اتجاه صاعد)',
    optEmaSell: 'الأصفر تحت الأبيض (اتجاه هابط)',
    optEmaFlat: 'الخطوط متشابكة / مسطحة',

    checkSar: '2. نقاط Parabolic SAR',
    valSar: 'Start: 0.02, Max: 0.2',
    optSarBelow: 'النقاط أسفل الشموع (شراء)',
    optSarAbove: 'النقاط أعلى الشموع (بيع)',

    checkFilter: '3. فلتر الإشارة (Signal)',
    valFilter: 'Pink Filter / AO',
    optFilterBuy: 'نقطة خضراء / إشارة شراء قوية',
    optFilterSell: 'نقطة حمراء / إشارة بيع قوية',
    optFilterNone: 'لا توجد إشارة واضحة',

    // Results
    resultAnalyzing: 'جاري التحليل...',
    resultBuy: 'قرار استراتيجي: شــــراء (CALL) 🟢',
    resultSell: 'قرار استراتيجي: بيــــع (PUT) 🔴',
    resultWait: 'القرار:  انتظر.. السوق غير واضح ✋',
    resultPartial: 'إشارة ضعيفة: لا تغامر',

    resetChecklist: 'مسح الاختيارات',
    contactSupport: 'تواصل مع الدعم',
    version: 'الإصدار 1.1',
    contactSubject: 'دعم فني - Trade Manager Guard Pro',
    contactBody: 'مرحباً، لدي استفسار بخصوص...',
    theme: 'المظهر',
    darkMode: 'الوضع الليلي',
    lightMode: 'الوضع النهاري',
    keyboardShortcuts: 'اختصارات لوحة المفاتيح',
    pressKey: 'اضغط أي مفتاح...',
    winAction: 'تسجيل ربح',
    lossAction: 'تسجيل خسارة',

    // Settings
    initialCapital: 'رأس المال الكلي',
    initialStake: 'مبلغ الصفقة الأولى',
    profitPct: 'نسبة الربح % (Payout)',
    winIncPct: 'زيادة عند الربح (%)',
    lossMult: 'مضاعف التعويض عند الخسارة',
    maxLosses: 'الحد الأقصى للخسائر المتتالية',
    assetName: 'قائمة الأصول (اختر 1)',
    currency: 'العملة',
    strategyName: 'اسم الاستراتيجية',
    strategyPlaceholder: 'اسم الاستراتيجية التي تعمل عليها اذا وجدت',
    assetsTitle: 'الأصول المفضلة (الاسم | نسبة الربح)  *يمكنك تغيير وكتابة اسم الاصل ونسبة ربحه',
    configureStrategy: 'ضبط الاستراتيجية والإعدادات',
    saveAndReturn: 'حفظ والعودة',

    // Actions
    win: 'ربحت',
    loss: 'خسرت',
    reset: 'تصفير وبدء جديد',
    newSession: 'جلسة جديدة',
    export: 'تصدير لـ Google Sheets',
    exportExcel: 'تصدير Excel (ملون)',
    exportPDF: 'حفظ التقرير (PDF)',
    printSession: 'طباعة هذه الجلسة',
    options: 'خيارات',
    installApp: 'تثبيت التطبيق',
    miniMode: 'الوضع المصغر (عائم)',
    openMini: 'فتح النافذة العائمة',
    opacity: 'الشفافية',
    drag: 'سحب',
    addLanguage: 'إضافة لغة',
    downloading: 'جاري تنزيل حزمة اللغة...',
    downloadComplete: 'تم التثبيت بنجاح',

    // Language Store
    languageStore: 'متجر اللغات',
    availableLangs: 'اللغات المتاحة للتنزيل',
    install: 'تنزيل',
    installed: 'مثبت',

    // Stats
    currentBalance: 'الرصيد الحالي',
    nextStake: 'مبلغ الصفقة القادمة',
    totalProfit: 'صافي الربح/الخسارة',
    winRate: 'نسبة الفوز',
    tradesCount: 'عدد الصفقات',
    consLosses: 'الخسائر المتتالية الحالية',

    // Sessions
    sessionsHistory: 'أرشيف الجلسات',
    sessionStart: 'البداية',
    sessionEnd: 'النهاية',
    sessionProfit: 'الربح',
    clearAllHistory: 'مسح كل المحفوظات',
    confirmDelete: 'تحذير: سيتم حذف جميع سجلات الجلسات والصفقات نهائياً. هل أنت متأكد؟',
    confirmReset: 'هل أنت متأكد من تصفير الحساب والبدء من جديد؟ (يستخدم فقط عند خسارة كامل رأس المال)',
    totalAllSessions: 'إجمالي كل الجلسات',

    // Modals
    confirmResetTitle: 'تأكيد التصفير الشامل',
    confirmResetBody: 'تحذير: هذا الخيار يستخدم فقط في حال خسارة كامل رأس المال (المرجنة). هل أنت متأكد أنك تريد تصفير الحساب والبدء من جديد؟ سيتم أرشفة الجلسة الحالية.',
    confirmDeleteTitle: 'حذف الأرشيف',
    confirmDeleteBody: 'تحذير: سيتم حذف جميع الجلسات والصفقات نهائياً. لا يمكن التراجع عن هذا الإجراء.',
    confirmAction: 'نعم، نفذ',
    cancelAction: 'إلغاء',

    // Messages
    maxLossHit: 'تم الوصول لحد الخسائر! زر الخسارة معطل حتى بدء جلسة جديدة.',
    balanceLow: 'الرصيد غير كافي! ابدء بجلسة جديدة.',
    balanceCritical: 'رصيدك أقل من 1$. يجب عليك تصفير الحساب والبدء من جديد.',
    sessionReset: 'تم بدء جلسة جديدة بناءً على الرصيد المتبقي (2%).',
    enterProfitPct: 'الرجاء إدخال نسبة الربح او نسبة الأصول المفضلة',

    // Table
    time: 'الوقت',
    asset: 'الأصل',
    stake: 'المبلغ',
    outcome: 'النتيجة',
    profit: 'العائد',
    balance: 'الرصيد',
    sortAsc: 'ترتيب: الأقدم أولاً',
    sortDesc: 'ترتيب: الأحدث أولاً',

    // Welcome & Tour
    welcomeTourTitle: 'مرحباً بك في Trade Manager Guard Pro',
    welcomeTourDesc: 'هل ترغب في جولة سريعة للتعرف على ميزات التطبيق وكيفية استخدامه بفعالية؟',
    startTour: 'بدء الجولة',
    skipTour: 'تخطي',
    dontShowAgain: 'لا تظهر هذه الرسالة مرة أخرى',
    nextHint: 'التالي',
    prevHint: 'السابق',
    finishHint: 'إنهاء الجولة',

    // Tour Hints
    tourBalanceTitle: 'لوحة المعلومات',
    tourBalanceDesc: 'هنا يظهر رصيدك الحالي، والعملة المستخدمة. النظام يحسب المخاطرة والصفقات القادمة بناءً على هذا الرصيد.',
    tourStakeTitle: 'الصفقة القادمة',
    tourStakeDesc: 'هذا هو المبلغ الذي يجب أن تدخل به الصفقة التالية. يتم حسابه تلقائياً وبدقة بناءً على نتيجة الصفقة السابقة.',
    tourActionsTitle: 'تسجيل النتائج',
    tourActionsDesc: 'اضغط "ربحت" عند نجاح الصفقة لزيادة الربح، أو "خسرت" ليقوم النظام بتفعيل خطة التعويض.',
    tourSessionTitle: 'إدارة الجلسة والتصفير',
    tourSessionDesc: 'استخدم "جلسة جديدة" عند الوصول لحد الخسارة لإعادة الحسابات بأمان. أما "تصفير" فيستخدم فقط في حال خسارة كامل رأس المال للبدء من الصفر.',
    tourAssetsTitle: 'قائمة الأصول الذكية',
    tourAssetsEditDesc: 'قائمة موسعة بـ 10 أصول. اختر الأصل للتداول عليه.',
    tourAssetEditTitle: 'تعديل الأصل',
    tourAssetEditDesc: 'اضغط مباشرة على اسم الأصل أو نسبة الربح لتعديلها. التغييرات تحفظ تلقائياً.',
    tourConfigTitle: 'زر الإعدادات',
    tourConfigDesc: 'اضغط هنا لفتح نافذة الاستراتيجية وضبط رأس المال، نسب الربح، وحدود المخاطرة.',

    // Granular Settings Tour
    tourCapitalTitle: 'رأس المال',
    tourCapitalDesc: 'أدخل المبلغ الكلي الذي ستبدأ به. التطبيق سيستخدم هذا الرقم لحساب نسبة المخاطرة الآمنة.',
    tourInitStakeTitle: 'مبلغ البداية',
    tourInitStakeDesc: 'يتم ضبطه تلقائياً على 2%، ولكن يمكنك تعديله يدوياً. هذا هو المبلغ الذي تبدأ به الجلسة أو تعود إليه بعد سلسلة انتصارات.',
    tourCurrencyTitle: 'عملة الحساب',
    tourCurrencyDesc: 'اختر العملة التي تناسب محفظتك (USD, EUR, USDT...). هذا للتوضيح فقط ولا يؤثر على الحسابات.',
    tourPayoutTitle: 'نسبة العائد (Payout)',
    tourPayoutDesc: 'مهم جداً! أدخل نسبة عائد المنصة (مثلاً 85%). بدون هذا الرقم لا يمكن حساب الأرباح بدقة.',
    tourWinIncTitle: 'نسبة الزيادة عند الربح',
    tourWinIncDesc: 'هذه النسبة تضاف لمبلغ الصفقة القادمة عند الفوز، لتنمية رأس المال بشكل تراكمي (Compound).',
    tourLossMultTitle: 'مضاعف الخسارة',
    tourLossMultDesc: 'في حال الخسارة، يضرب النظام المبلغ بهذا الرقم (2.84) لتعويض الخسارة السابقة وتحقيق ربح بسيط.',
    tourLimitsTitle: 'حدود الأمان',
    tourLimitsDesc: 'حدد أقصى عدد للخسائر المتتالية المسموح بها قبل أن يمنعك التطبيق من التداول لحماية رصيدك من الانهيار.',

    // Reporting & Features Tour
    tourChartTitle: 'الرسم البياني',
    tourChartDesc: 'تتبع نمو رصيدك بصرياً. المنطقة الخضراء تعني أنك في ربح، والحمراء تعني أنك تحت رأس المال الأساسي.',
    tourHistoryTitle: 'سجل الصفقات',
    tourHistoryDesc: 'جدول تفصيلي لكل صفقة. يمكنك الضغط على العناوين لترتيب الجدول تصاعدياً أو تنازلياً.',
    tourArchiveTitle: 'أرشيف الجلسات',
    tourArchiveDesc: 'كل جلسة تداول (من البداية حتى التصفير أو جلسة جديدة) تحفظ هنا كملف مستقل.',
    tourArchiveActionsTitle: 'طباعة وحذف',
    tourArchiveActionsDesc: 'يمكنك طباعة تقرير PDF شامل لكل الجلسات، أو تصدير ملف Excel، أو مسح الأرشيف بالكامل.',

    tourMiniModeTitle: 'الوضع المصغر (PiP)',
    tourMiniModeDesc: 'اضغط هنا لفصل التطبيق في نافذة عائمة صغيرة تبقى فوق جميع النوافذ الأخرى، لتتداول وتراقب المنصة في نفس الوقت.',
    tourMiniWindowTitle: 'النافذة العائمة',
    tourMiniWindowDesc: 'هذه النافذة تبقى فوق متصفحك. يمكنك سحبها من الشريط العلوي لأي مكان.',
    tourMiniControlsTitle: 'أزرار التحكم المصغرة',
    tourMiniControlsDesc: 'سجل النتائج بسرعة وشاهد مبلغ الصفقة القادمة دون الحاجة للعودة للتطبيق الرئيسي.',
    tourMiniOpacityTitle: 'الشفافية',
    tourMiniOpacityDesc: 'تحكم بشفافية النافذة لتتمكن من رؤية الشارت خلفها بوضوح.',

    tourMenuTitle: 'القائمة والمظهر',
    tourMenuDesc: 'من هنا يمكنك تغيير اللغة، تفعيل الوضع الليلي/النهاري، وضبط اختصارات لوحة المفاتيح.',

    // Strategy Guide Content
    guideTitle: 'الدليل الشامل لاستراتيجية Trade Guard',
    guideIntro: 'مرحباً بك. هذا التطبيق ليس مجرد أداة لتسجيل الصفقات، بل هو نظام متكامل لإدارة رأس المال (Money Management) يهدف لحمايتك من الخسائر الكبيرة وتنمية حسابك بذكاء. يعتمد النظام على الرياضيات لتقليل المخاطر.',
    guideRule1: '1. الأساس: قاعدة الـ 2% والحفاظ على الرصيد',
    guideRule1Desc: 'القاعدة الذهبية في التداول هي البقاء في السوق. لذلك، يقوم التطبيق دائماً بحساب مبلغ الصفقة الأولى ليكون 2% فقط من رأس مالك المتاح. هذا يعني أنه حتى لو تعرضت لسلسلة خسائر، فإن حسابك لن يتبخر بسرعة، مما يعطيك فرصاً أكثر للتعويض.',
    guideRule2: '2. في حالة الربح (تنمية المكاسب)',
    guideRule2Desc: 'عندما تربح صفقة، لا نكتفي بالربح الثابت. النظام يقوم بزيادة مبلغ الصفقة التالية بنسبة مئوية بسيطة (افتراضياً 20% أو 5%). الهدف هو استغلال "سلسلة الانتصارات" (Winning Streak) لتحقيق أرباح مركبة دون تعريض رأس المال الأصلي لمخاطرة كبيرة.',
    guideRule3: '3. في حالة الخسارة (استراتيجية التعويض الذكي)',
    guideRule3Desc: 'الخسارة جزء من اللعبة. عند تسجيل خسارة، لا داعي للذعر. النظام يستخدم معامل ضرب (افتراضياً 2.84) لحساب مبلغ الصفقة التالية. هذا المبلغ الجديد مصمم ليعوض لك قيمة الخسارة السابقة + يضيف ربحاً بسيطاً فوقها. بمجرد الفوز في صفقة التعويض، يعيدك النظام تلقائياً لأخر مبلغ رابح آمن.',
    guideRule4: '4. شبكة الأمان (مانع المرجنة)',
    guideRule4Desc: 'أخطر ما يواجه المتداول هو العناد. لذلك، وضعنا حداً أقصى للخسائر المتتالية (افتراضياً 3). إذا خسرت 3 مرات متتالية، سيقوم التطبيق بتعطيل زر "خسرت" ويجبرك على التوقف. هنا يجب عليك أخذ استراحة، ثم الضغط على "جلسة جديدة" ليعيد النظام حساب المخاطرة بناءً على ما تبقى من رصيد، بدلاً من المغامرة بمبالغ ضخمة.',
  },
  en: {
    title: 'Trade Manager Guard Pro V1.1',
    dashboard: 'Dashboard',
    settings: 'Settings & Strategy',
    history: 'Trade History',
    report: 'Report & Analytics',

    // Auth
    loginTitle: 'Login',
    registerTitle: 'Create Account',
    email: 'Email Address',
    password: 'Password',
    loginBtn: 'Sign In',
    registerBtn: 'Register',
    continueWith: 'Or continue with',
    google: 'Google',
    github: 'GitHub',
    haveAccount: 'Already have an account?',
    noAccount: 'Don\'t have an account?',
    signOut: 'Sign Out',
    welcome: 'Welcome',

    // User Menu & Help
    profile: 'Profile',
    profileSettings: 'Profile Settings',
    editProfile: 'Edit Profile',
    nameLabel: 'Name',
    avatarLabel: 'Avatar URL (Optional)',
    saveChanges: 'Save Changes',
    profileUpdated: 'Profile updated successfully',
    strategyGuide: 'Strategy Guide (Ronald PRO)',
    openStrategy: 'Open Strategy Assistant',
    appTutorial: 'App Tour (Live)',

    // Strategy Modal
    stratTitle: 'Smart Strategy Analyzer',
    stratDesc: 'Select a strategy to get started.',

    // Menu
    stratMenuTitle: 'Strategies',
    stratRonald: '30s Scalping (Ronald PRO)',
    stratEmaSar: 'Trend Follow (EMA + SAR)',

    // Strategy 1: Ronald PRO
    ronaldTitle: '30s Scalping (Ronald PRO)',
    ronaldDesc: 'High frequency scalping for 30s expiration.',

    // Indicators (Ronald) - With Settings
    checkEnvelopes: '1. Envelopes Status',
    valEnvelopes: 'Period: 9, Dev: 0.01, MA: TMA, Source: Open',
    optEnvTop: 'Touching Upper Band (Resistance)',
    optEnvBottom: 'Touching Lower Band (Support)',
    optEnvMid: 'Middle / Unclear',

    checkAroon: '2. Aroon Status',
    valAroon: 'Period: 9',
    optAroonUp: 'Green Line (UP) is High',
    optAroonDown: 'Red Line (DOWN) is High',
    optAroonWeak: 'Lines Converging / Weak',

    checkAC: '3. Awesome Oscillator',
    valAC: 'Settings: Fast 5, Slow 10',
    optAcGreen: 'Green Bars (Bullish)',
    optAcRed: 'Red Bars (Bearish)',
    optAcWeak: 'Small / Weak',

    checkRsi: '4. ADX Filter (Trend Strength)',
    valRsi: 'Period: 14, Min Strength: 20',
    optRsiBuy: 'Strong Trend (ADX > 20)',
    optRsiSell: 'Weak / Ranging (ADX < 20)',

    // Strategy 2: EMA + SAR
    emaSarTitle: 'Trend Follow (EMA + SAR)',
    emaSarDesc: 'Follow the trend with EMA Cross and SAR confirmation.',

    checkEma: '1. EMA Crossover',
    valEma: 'Fast: 8 (Yellow), Slow: 21 (White)',
    optEmaBuy: 'Yellow > White (Up Trend)',
    optEmaSell: 'Yellow < White (Down Trend)',
    optEmaFlat: 'Lines Tangled / Flat',

    checkSar: '2. Parabolic SAR',
    valSar: 'Start: 0.02, Max: 0.2',
    optSarBelow: 'Dots BELOW Candles (Bullish)',
    optSarAbove: 'Dots ABOVE Candles (Bearish)',

    checkFilter: '3. Signal Filter',
    valFilter: 'Pink Filter / AO',
    optFilterBuy: 'Green Dot / Strong Buy Signal',
    optFilterSell: 'Red Dot / Strong Sell Signal',
    optFilterNone: 'No Clear Signal',

    // Results
    resultAnalyzing: 'Analyzing...',
    resultBuy: 'Decision: CALL (BUY) 🟢',
    resultSell: 'Decision: PUT (SELL) 🔴',
    resultWait: 'Decision: WAIT... Market Unclear ✋',
    resultPartial: 'Weak Signal: Do Not Trade',

    resetChecklist: 'Reset Selection',
    help: 'Help',
    contactSupport: 'Contact Support',
    version: 'Version 1.1',
    contactSubject: 'Support Request - Trade Manager Guard Pro',
    contactBody: 'Hello, I need help with...',
    theme: 'Theme',
    darkMode: 'Dark Mode',
    lightMode: 'Light Mode',
    keyboardShortcuts: 'Keyboard Shortcuts',
    pressKey: 'Press any key...',
    winAction: 'Log Win',
    lossAction: 'Log Loss',

    // Settings
    initialCapital: 'Total Capital',
    initialStake: 'Initial Stake',
    profitPct: 'Profit Percentage % (Payout)',
    winIncPct: 'Increase on Win (%)',
    lossMult: 'Loss Recovery Multiplier',
    maxLosses: 'Max Consecutive Losses',
    assetName: 'Asset List (Select 1)',
    currency: 'Currency',
    strategyName: 'Strategy Name',
    strategyPlaceholder: 'The name of the strategy you are working on, if any',
    assetsTitle: 'Favorite Assets (Name | Payout %)  *You can edit name and payout',
    configureStrategy: 'Configure Strategy & Settings',
    saveAndReturn: 'Save & Return',

    // Actions
    win: 'WIN',
    loss: 'LOSS',
    reset: 'Reset & Restart',
    newSession: 'New Session',
    export: 'Export to Google Sheets',
    exportExcel: 'Export Excel (Colored)',
    exportPDF: 'Save Report (PDF)',
    printSession: 'Print This Session',
    options: 'Options',
    installApp: 'Install App',
    miniMode: 'Mini Mode (Floating)',
    openMini: 'Open Floating Window',
    opacity: 'Opacity',
    drag: 'Drag',
    addLanguage: 'Add Language',
    downloading: 'Downloading language pack...',
    downloadComplete: 'Installed successfully',

    // Language Store
    languageStore: 'Language Store',
    availableLangs: 'Available for Download',
    install: 'Install',
    installed: 'Installed',

    // Stats
    currentBalance: 'Current Balance',
    nextStake: 'Next Trade Amount',
    totalProfit: 'Net P/L',
    winRate: 'Win Rate',
    tradesCount: 'Total Trades',
    consLosses: 'Current Cons. Losses',

    // Sessions
    sessionsHistory: 'Sessions Archive',
    sessionStart: 'Start',
    sessionEnd: 'End',
    sessionProfit: 'Profit',
    clearAllHistory: 'Clear All History',
    confirmDelete: 'WARNING: This will permanently delete all session logs and trades. Are you sure?',
    confirmReset: 'Are you sure you want to fully reset? (Only use if you lost all capital)',
    totalAllSessions: 'Total All Sessions',

    // Modals
    confirmResetTitle: 'Confirm Full Reset',
    confirmResetBody: 'WARNING: This is intended for use ONLY if you have lost your entire capital. Are you sure you want to reset and start over?',
    confirmDeleteTitle: 'Delete Archive',
    confirmDeleteBody: 'Warning: This will permanently delete all history and cannot be undone.',
    confirmAction: 'Yes, Proceed',
    cancelAction: 'Cancel',

    // Messages
    maxLossHit: 'Max losses reached! Loss button disabled until New Session.',
    balanceLow: 'Insufficient balance! Please start a New Session.',
    balanceCritical: 'Balance below $1. You must Reset and start over.',
    sessionReset: 'New session started based on remaining balance (2%).',
    enterProfitPct: 'Please enter Profit Percentage or Favorite Asset Percentage',

    // Table
    time: 'Time',
    asset: 'Asset',
    stake: 'Stake',
    outcome: 'Outcome',
    profit: 'Return',
    balance: 'Balance',
    sortAsc: 'Sort: Oldest First',
    sortDesc: 'Sort: Newest First',

    // Welcome & Tour
    welcomeTourTitle: 'Welcome to Trade Manager Guard Pro',
    welcomeTourDesc: 'Would you like a quick interactive tour to learn the features and how to use them effectively?',
    startTour: 'Start Tour',
    skipTour: 'Skip',
    dontShowAgain: 'Don\'t show this again',
    nextHint: 'Next',
    prevHint: 'Previous',
    finishHint: 'Finish Tour',

    // Tour Hints
    tourBalanceTitle: 'Dashboard Info',
    tourBalanceDesc: 'Here you see your current balance and currency. The system calculates risk based on this amount.',
    tourStakeTitle: 'Next Stake',
    tourStakeDesc: 'This is the amount for your next trade. It is auto-calculated based on the previous outcome.',
    tourActionsTitle: 'Logging Results',
    tourActionsDesc: 'Click "WIN" to log profit and increase stake, or "LOSS" to trigger the recovery plan.',
    tourSessionTitle: 'Session & Reset',
    tourSessionDesc: 'Use "New Session" when max losses are reached to recalculate safety. "Reset" is ONLY for when you have lost your total capital and need a fresh start.',
    tourAssetsTitle: 'Smart Asset List',
    tourAssetsEditDesc: 'Expanded list of 10 assets. Select one to trade.',
    tourAssetEditTitle: 'Edit Assets',
    tourAssetEditDesc: 'Click directly on the Asset Name or Payout % to edit them instantly.',
    tourConfigTitle: 'Settings Button',
    tourConfigDesc: 'Click here to open the configuration window where you can adjust your Capital, Risk Limits, and Strategy rules.',

    // Granular Settings Tour
    tourCapitalTitle: 'Total Capital',
    tourCapitalDesc: 'Enter your total starting funds here. The app uses this to calculate safe 2% entry stakes.',
    tourInitStakeTitle: 'Initial Stake',
    tourInitStakeDesc: 'Defaults to 2%, but you can override it manually. This is your "Base" stake.',
    tourCurrencyTitle: 'Currency',
    tourCurrencyDesc: 'Select your preferred currency (USD, EUR, USDT...). This is for display purposes only.',
    tourPayoutTitle: 'Payout %',
    tourPayoutDesc: 'Crucial! Enter the broker\'s payout percentage (e.g., 85) for accurate profit calculations.',
    tourWinIncTitle: 'Win Increase %',
    tourWinIncDesc: 'How much to increase your stake after a win to compound profits (e.g., 5% or 20%).',
    tourLossMultTitle: 'Loss Multiplier',
    tourLossMultDesc: 'The multiplication factor (default 2.84) used after a loss to recover funds + profit.',
    tourLimitsTitle: 'Safety Limits',
    tourLimitsDesc: 'Set the maximum allowed consecutive losses. The app locks the Loss button when hit to save your account.',

    // Reporting & Features
    tourChartTitle: 'Performance Chart',
    tourChartDesc: 'Visualizes your balance growth. Green area indicates profit, red indicates drawdown below starting capital.',
    tourHistoryTitle: 'Trade History',
    tourHistoryDesc: 'Detailed log of every trade. Click column headers to sort. Shows outcome, profit, and running balance.',
    tourArchiveTitle: 'Session Archive',
    tourArchiveDesc: 'Every trading session is saved here automatically when you reset or start over.',
    tourArchiveActionsTitle: 'Archive Actions',
    tourArchiveActionsDesc: 'Print reports, export to Excel, or manage individual session data.',

    tourMiniModeTitle: 'Mini Mode (PiP)',
    tourMiniModeDesc: 'Click this to detach the app into a small floating window that stays on top of other windows.',
    tourMiniWindowTitle: 'Floating Window',
    tourMiniWindowDesc: 'This window stays on top of your broker. You can drag it anywhere.',
    tourMiniControlsTitle: 'Compact Controls',
    tourMiniControlsDesc: 'Quickly Log Wins/Losses and see the next stake without switching windows.',
    tourMiniOpacityTitle: 'Transparency',
    tourMiniOpacityDesc: 'Adjust visibility to see the charts behind the floating window.',

    tourMenuTitle: 'Main Menu & Theme',
    tourMenuDesc: 'Access Language settings, switch Dark/Light theme, configure Hotkeys, and see the Strategy Guide.',

    // Strategy Guide Content
    guideTitle: 'The Comprehensive TradeGuard Strategy',
    guideIntro: 'Welcome. This app is more than a trade logger; it is a complete Money Management system designed to shield you from large drawdowns and grow your account intelligently using mathematical probability.',
    guideRule1: '1. Foundation: The 2% Rule',
    guideRule1Desc: 'The golden rule of trading is survival. This app calculates your starting stake as exactly 2% of your available capital. This ensures that even a bad streak won\'t deplete your account, giving you plenty of room to recover.',
    guideRule2: '2. Winning: Compound Growth',
    guideRule2Desc: 'When you win, we don\'t just stay static. The system increases your next stake by a small percentage (default 20%). This allows you to capitalize on "Winning Streaks" to build profit faster using the market\'s money, not just your own.',
    guideRule3: '3. Losing: Smart Recovery',
    guideRule3Desc: 'Losses happen. When you log a loss, the system applies a multiplier (default 2.84) to the next stake. This calculated amount is designed to recover the previous loss AND generate a small profit when you win. Once recovered, it reverts to a safe stake.',
    guideRule4: '4. Safety Net: Anti-Blowout',
    guideRule4Desc: 'To prevent emotional trading (revenge trading), there is a hard limit on consecutive losses (default 3). If you hit this limit, the "LOSS" button locks. You must take a break and click "New Session", which recalculates a safe stake based on the REMAINING balance, preventing total account blowout.',
  }
};
