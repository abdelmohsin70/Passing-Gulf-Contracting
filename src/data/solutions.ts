import type { Bilingual } from "./process";

export type FAQItem = {
  question: Bilingual;
  answer: Bilingual;
};

export type Solution = {
  slug: string;
  icon:
    | "wrench"
    | "sparkles"
    | "hammer"
    | "leaf"
    | "plane"
    | "bug"
    | "concierge"
    | "home";
  title: Bilingual;
  /** Short line used on cards and navigation. */
  summary: Bilingual;
  /** Business outcome framing used in the solution page hero. */
  heroOutcome: Bilingual;
  /** The problem this solution exists to solve. */
  problem: Bilingual;
  /** 6-10 concrete scope-of-work bullets. */
  scope: Bilingual[];
  /** Which sectors this solution serves best. */
  sectors: string[];
  methodology: Bilingual;
  quality: Bilingual;
  faqs: FAQItem[];
  /** Leads the "one partner" narrative on the homepage. */
  featured: boolean;
};

export const solutions: Solution[] = [
  {
    slug: "facility-management",
    icon: "wrench",
    title: {
      ar: "إدارة المرافق والتشغيل والصيانة",
      en: "Facility Management, Operation & Maintenance",
    },
    summary: {
      ar: "تشغيل وصيانة يومية لمرافقك تقلل التوقف وتطيل عمر أصولك.",
      en: "Day-to-day operation and maintenance that cuts downtime and extends asset life.",
    },
    heroOutcome: {
      ar: "مرافق تعمل بلا مفاجآت، وأصول تدوم لفترة تشغيلية أطول.",
      en: "Facilities that run without surprises, and assets that last longer.",
    },
    problem: {
      ar: "الأعطال المفاجئة وتوقف المعدات تكلّف منشأتك وقتًا ومالًا أكثر من أي برنامج صيانة وقائي. بدون خطة تشغيل وصيانة واضحة، تتحول كل مشكلة صغيرة إلى أزمة تشغيلية.",
      en: "Sudden breakdowns and equipment downtime cost your facility more time and money than any preventive program ever would. Without a clear operation and maintenance plan, every small issue becomes an operational crisis.",
    },
    scope: [
      { ar: "الصيانة الوقائية الدورية لجميع الأنظمة والمعدات", en: "Scheduled preventive maintenance for all systems and equipment" },
      { ar: "الصيانة التصحيحية والاستجابة السريعة للأعطال", en: "Corrective maintenance with fast response to breakdowns" },
      { ar: "أعمال التكييف والتبريد (HVAC) بجميع أنواعها", en: "HVAC systems of all types" },
      { ar: "الأعمال الكهربائية والسباكة والميكانيكية", en: "Electrical, plumbing, and mechanical works" },
      { ar: "متابعة عمر المعدات وجدولة الاستبدال قبل الأعطال", en: "Equipment lifecycle tracking and scheduled replacement before failure" },
      { ar: "أنظمة إدارة الصيانة المحوسبة (CMMS) عند توفرها لدى العميل", en: "Computerized Maintenance Management Systems (CMMS) where available" },
      { ar: "تقارير أداء دورية ومؤشرات تشغيلية", en: "Recurring performance reports and operational indicators" },
      { ar: "دعم إجراءات السلامة والحفاظ عليها داخل الموقع", en: "On-site safety procedure support and enforcement" },
    ],
    sectors: ["commercial-admin", "healthcare", "residential-hospitality", "industrial-logistics", "government"],
    methodology: {
      ar: "نبدأ بمسح ميداني لكل الأنظمة والمعدات، ثم نضع خطة صيانة وقائية وتصحيحية مع مستوى خدمة (SLA) واضح، ونشغّلها بفريق فني مقيم أو متنقل حسب حجم المنشأة، مع تقارير دورية لصاحب القرار.",
      en: "We start with a full survey of systems and equipment, build a preventive and corrective maintenance plan with a clear SLA, run it with a resident or mobile technical team depending on facility size, and report back to decision-makers on a regular cadence.",
    },
    quality: {
      ar: "فريقنا من المهندسين والفنيين يعمل وفق إجراءات صحة وسلامة صارمة، باستخدام معدات حديثة ومواد آمنة، لضمان بيئة عمل سليمة للعاملين والزوار داخل المرفق.",
      en: "Our engineers and technicians follow strict health and safety procedures, using modern equipment and safe materials, to keep the facility environment safe for both staff and visitors.",
    },
    faqs: [
      {
        question: { ar: "هل تقدمون صيانة على مدار الساعة؟", en: "Do you provide 24/7 maintenance coverage?" },
        answer: {
          ar: "نعم، فرقنا الفنية جاهزة للاستجابة للأعطال الطارئة على مدار الساعة حسب اتفاقية مستوى الخدمة المتفق عليها مع كل عميل.",
          en: "Yes, our technical teams are ready to respond to emergency breakdowns around the clock, based on the service level agreement set with each client.",
        },
      },
      {
        question: { ar: "هل يمكن تخصيص خطة الصيانة حسب نوع المنشأة؟", en: "Can the maintenance plan be tailored to our facility type?" },
        answer: {
          ar: "بالتأكيد، نصمم كل خطة بعد زيارة ميدانية ودراسة احتياج المنشأة الفعلي، سواء كانت مبنى إداريًا أو مصنعًا أو منشأة صحية.",
          en: "Absolutely — every plan is designed after a site visit and a study of the facility's actual needs, whether it is an office building, a factory, or a healthcare facility.",
        },
      },
      {
        question: { ar: "هل تديرون معدات ملاك المنشأة الحالية أم توفرون معدات جديدة؟", en: "Do you manage the facility's existing equipment or supply new equipment?" },
        answer: {
          ar: "في الغالب ندير وندعم المعدات القائمة لديكم، ونقترح خطط تحديث أو استبدال عند الضرورة فقط بناءً على تقييم فني موثق.",
          en: "In most cases we manage and support your existing equipment, and only propose upgrade or replacement plans when justified by a documented technical assessment.",
        },
      },
    ],
    featured: true,
  },
  {
    slug: "cleaning-soft-services",
    icon: "sparkles",
    title: { ar: "النظافة والخدمات الناعمة", en: "Cleaning & Soft Services" },
    summary: {
      ar: "نظافة عامة ومتخصصة وتعقيم يحافظ على بيئة صحية داخل منشأتك.",
      en: "General, specialized, and sanitization services that keep your facility healthy.",
    },
    heroOutcome: {
      ar: "بيئة نظيفة وآمنة تحمي صحة العاملين والزوار كل يوم.",
      en: "A clean, safe environment that protects staff and visitor health every day.",
    },
    problem: {
      ar: "المنشآت المزدحمة مثل المستشفيات والمدارس والمراكز التجارية تحتاج عناية يومية دقيقة لمنع تلوث وانتشار الأمراض. النظافة غير المنتظمة تؤثر على صحة العاملين وسمعة المنشأة.",
      en: "High-traffic facilities like hospitals, schools, and malls need precise daily care to prevent contamination and disease spread. Inconsistent cleaning affects staff health and facility reputation.",
    },
    scope: [
      { ar: "نظافة يومية للمباني من الداخل والخارج", en: "Daily interior and exterior building cleaning" },
      { ar: "تنظيف الأرضيات الخشبية والرخام والسيراميك", en: "Wood floor, marble, and ceramic cleaning" },
      { ar: "تنظيف النوافذ والواجهات الزجاجية", en: "Window and glass facade cleaning" },
      { ar: "تنظيف وتعقيم خزانات المياه", en: "Water tank cleaning and sanitization" },
      { ar: "التعقيم المتخصص للمرافق الصحية والتجارية", en: "Specialized sanitization for healthcare and commercial facilities" },
      { ar: "تنظيف ما بعد البناء والترميم", en: "Post-construction and post-renovation cleaning" },
      { ar: "تنظيف المسابح ومتابعتها الدورية", en: "Swimming pool cleaning and periodic follow-up" },
      { ar: "استخدام مواد صديقة للبيئة وآمنة على الصحة", en: "Use of environmentally friendly, health-safe materials" },
    ],
    sectors: ["healthcare", "commercial-admin", "education", "residential-hospitality"],
    methodology: {
      ar: "نحدد برنامج تنظيف يناسب طبيعة كل منشأة وساعات تشغيلها، بإشراف مديري مشاريع ومشرفين ذوي خبرة، وفريق عمل مدرّب على أحدث أنظمة النظافة والتعقيم.",
      en: "We define a cleaning program that fits each facility's nature and operating hours, supervised by experienced project managers, with a team trained on the latest cleaning and sanitization systems.",
    },
    quality: {
      ar: "نطبق إجراءات ضبط جودة صارمة ونستخدم مواد كيميائية آمنة وفعالة، مع مراجعة مستمرة لضمان بيئة صحية في جميع المرافق التي نخدمها.",
      en: "We apply strict quality control procedures and use safe, effective chemicals, with continuous review to ensure a healthy environment across every facility we serve.",
    },
    faqs: [
      {
        question: { ar: "هل يمكن تنفيذ النظافة خارج ساعات العمل الرسمية؟", en: "Can cleaning be scheduled outside official working hours?" },
        answer: {
          ar: "نعم، نجدول أعمال النظافة في الأوقات الأنسب لعملياتكم لتفادي أي إزعاج للموظفين أو الزوار.",
          en: "Yes, we schedule cleaning at the times that suit your operations best, avoiding any disruption to staff or visitors.",
        },
      },
      {
        question: { ar: "هل المواد المستخدمة آمنة للأطفال والمرضى؟", en: "Are the materials used safe for children and patients?" },
        answer: {
          ar: "نستخدم مواد كيميائية معتمدة وآمنة تراعي طبيعة كل منشأة، خصوصًا المدارس والمرافق الصحية.",
          en: "We use approved, safe chemicals suited to each facility's nature, especially schools and healthcare sites.",
        },
      },
      {
        question: { ar: "هل تقدمون عقود نظافة طويلة أو قصيرة المدى؟", en: "Do you offer both short and long-term cleaning contracts?" },
        answer: {
          ar: "نوفر الخيارين، من عقود تشغيل سنوية إلى تنفيذ مهام محددة مثل التنظيف بعد البناء.",
          en: "We offer both — from annual operating contracts to defined one-off tasks such as post-construction cleaning.",
        },
      },
    ],
    featured: true,
  },
  {
    slug: "renovation-projects",
    icon: "hammer",
    title: { ar: "الترميم والتجديد والمشاريع", en: "Renovation, Refurbishment & Projects" },
    summary: {
      ar: "تأهيل وتجديد المباني بأعمال معمارية ومدنية وMEP متكاملة.",
      en: "Building rehabilitation and refurbishment through integrated architectural, civil, and MEP works.",
    },
    heroOutcome: {
      ar: "منشأة مؤهلة وآمنة، بمظهر وأداء يليقان بعلامتك.",
      en: "A rehabilitated, safe facility with a look and performance worthy of your brand.",
    },
    problem: {
      ar: "المباني القائمة تفقد كفاءتها ومظهرها مع الوقت، وتحتاج تدخلًا فنيًا منسقًا بين عدة تخصصات في آن واحد بدل التعامل مع مقاولين منفصلين لكل بند.",
      en: "Existing buildings lose efficiency and appearance over time, and need coordinated technical intervention across multiple disciplines at once instead of separate contractors for every line item.",
    },
    scope: [
      { ar: "التصميم المعماري والداخلي", en: "Architectural and interior design" },
      { ar: "التصاميم الكهربائية والإلكتروميكانيكية", en: "Electrical and electromechanical design" },
      { ar: "الأعمال المدنية والمعمارية لتأهيل المباني القائمة", en: "Civil and architectural works to rehabilitate existing buildings" },
      { ar: "أعمال الدهانات ومعالجة المشاكل الإنشائية", en: "Painting works and structural issue remediation" },
      { ar: "أعمال السباكة والصرف الصحي", en: "Plumbing and sanitary drainage works" },
      { ar: "الأعمال الكهربائية والميكانيكية", en: "Electrical and mechanical works" },
      { ar: "تركيب السياج الأمني والحواجز الخرسانية", en: "Security fencing and concrete barrier installation" },
      { ar: "التشطيبات المعمارية الداخلية والخارجية", en: "Interior and exterior architectural finishing" },
      { ar: "تصميم وتوريد وتركيب أنظمة الكاميرات والمراقبة (CCTV)", en: "Design, supply, and installation of CCTV and surveillance systems" },
      { ar: "خدمات الطوارئ والاستجابة السريعة عند الحوادث", en: "Emergency and rapid-response services for incidents" },
    ],
    sectors: ["government", "commercial-admin", "industrial-logistics", "residential-hospitality"],
    methodology: {
      ar: "نبدأ بتقييم فني للمبنى وتحديد نطاق العمل، ثم ننسق بين فرق التصميم والتنفيذ المدني والكهروميكانيكي تحت إدارة مشروع واحدة لضمان إنجاز كل مرحلة في وقتها.",
      en: "We start with a technical assessment of the building and a defined scope of work, then coordinate design, civil, and electromechanical teams under a single project management umbrella to keep every phase on schedule.",
    },
    quality: {
      ar: "نلتزم بمعايير السلامة الإنشائية والمهنية في كل موقع تنفيذ، مع متابعة هندسية مستمرة لضمان جودة التنفيذ ومطابقته للمواصفات المعتمدة.",
      en: "We follow structural and professional safety standards on every site, with continuous engineering oversight to ensure execution quality and compliance with approved specifications.",
    },
    faqs: [
      {
        question: { ar: "هل تتولون التصميم والتنفيذ معًا؟", en: "Do you handle both design and execution?" },
        answer: {
          ar: "نعم، فريقنا يغطي التصميم المعماري والداخلي والكهروميكانيكي وصولًا للتنفيذ الكامل تحت إدارة مشروع واحدة.",
          en: "Yes, our team covers architectural, interior, and electromechanical design through to full execution under a single project management structure.",
        },
      },
      {
        question: { ar: "هل يمكن تنفيذ الترميم دون إخلاء المبنى بالكامل؟", en: "Can renovation happen without fully vacating the building?" },
        answer: {
          ar: "في كثير من الحالات نعم، نضع خطة تنفيذ مرحلية تراعي استمرارية تشغيل المنشأة قدر الإمكان.",
          en: "In many cases yes — we build a phased execution plan that keeps the facility operating as much as possible.",
        },
      },
      {
        question: { ar: "هل تشمل الخدمة أنظمة المراقبة الأمنية؟", en: "Does the service include security and surveillance systems?" },
        answer: {
          ar: "نعم، نوفر تصميم وتوريد وتركيب أنظمة الكاميرات والسياج الأمني كجزء من مشاريع الترميم والتجديد.",
          en: "Yes, we provide design, supply, and installation of CCTV and security fencing systems as part of renovation projects.",
        },
      },
    ],
    featured: false,
  },
  {
    slug: "landscape-agriculture",
    icon: "leaf",
    title: { ar: "اللاندسكيب والزراعة", en: "Landscaping & Agriculture" },
    summary: {
      ar: "تصميم وتنفيذ وصيانة مساحات خضراء تعكس مستوى منشأتك.",
      en: "Design, execution, and maintenance of green spaces that reflect your facility's standard.",
    },
    heroOutcome: {
      ar: "مساحات خضراء تُبقي منشأتك في أفضل مظهر طوال العام.",
      en: "Green spaces that keep your facility looking its best all year round.",
    },
    problem: {
      ar: "الحدائق والمساحات الخضراء دون صيانة دورية تفقد جاذبيتها بسرعة وتتحول إلى عبء بدل أن تكون قيمة مضافة للمنشأة.",
      en: "Gardens and green spaces without regular maintenance quickly lose their appeal and become a burden instead of an asset for the facility.",
    },
    scope: [
      { ar: "تصميم الحدائق والمساحات الخضراء", en: "Garden and green space design" },
      { ar: "إنشاء وتنفيذ المساحات الخضراء الجديدة", en: "Construction and execution of new green spaces" },
      { ar: "التشجير وتنسيق المواقع", en: "Tree planting and site landscaping" },
      { ar: "الصيانة الدورية للحدائق والري", en: "Regular garden and irrigation maintenance" },
      { ar: "مسح ميداني للموقع قبل اقتراح الحل المناسب", en: "On-site survey before proposing the right solution" },
      { ar: "خدمة الفنادق والمستشفيات والمجمعات السكنية والقصور", en: "Serving hotels, hospitals, residential compounds, and palaces" },
    ],
    sectors: ["residential-hospitality", "commercial-admin", "healthcare"],
    methodology: {
      ar: "يدرس مهندسونا احتياج الموقع ثم يجرون مسحًا ميدانيًا قبل اقتراح تصميم وحل عملي، وننفذه بأدوات وأنظمة ري حديثة مع صيانة دورية بعد التسليم.",
      en: "Our engineers study the site's needs then carry out a field survey before proposing a practical design, execute it with modern irrigation tools and systems, and follow up with regular maintenance after handover.",
    },
    quality: {
      ar: "نطوّر خدماتنا باستمرار من خلال تدريب الفريق الفني والاطلاع على أحدث تقنيات الزراعة والري لضمان نتيجة تدوم.",
      en: "We continuously develop our services through technical staff training and the latest irrigation and landscaping techniques to ensure results that last.",
    },
    faqs: [
      {
        question: { ar: "هل تشمل الخدمة تصميم الحديقة من الصفر؟", en: "Does the service include designing a garden from scratch?" },
        answer: {
          ar: "نعم، نبدأ من دراسة الموقع والتصميم وصولًا إلى التنفيذ الكامل والصيانة الدورية بعد التسليم.",
          en: "Yes, we start from site study and design through to full execution and ongoing maintenance after handover.",
        },
      },
      {
        question: { ar: "هل تديرون أنظمة الري الآلي؟", en: "Do you manage automated irrigation systems?" },
        answer: {
          ar: "نعم، تركيب وصيانة أنظمة الري من ضمن أعمالنا لضمان استمرارية المساحات الخضراء دون هدر للمياه.",
          en: "Yes, irrigation system installation and maintenance is part of our scope to keep green spaces thriving without wasting water.",
        },
      },
    ],
    featured: false,
  },
  {
    slug: "airport-services",
    icon: "plane",
    title: { ar: "خدمات المطارات", en: "Airport Services" },
    summary: {
      ar: "خدمات أرضية ونظافة متخصصة للمطارات المحلية والدولية.",
      en: "Specialized ground and cleaning services for domestic and international airports.",
    },
    heroOutcome: {
      ar: "تشغيل أرضي سلس يخدم الركاب والطائرات دون تأخير.",
      en: "Smooth ground operations that serve passengers and aircraft without delay.",
    },
    problem: {
      ar: "عمليات المطارات لا تحتمل التأخير أو نقص الكوادر المدربة؛ أي خلل في خدمات المناولة أو النظافة ينعكس مباشرة على تجربة الركاب وجدولة الرحلات.",
      en: "Airport operations cannot tolerate delay or a shortage of trained staff; any gap in handling or cleaning services directly affects passenger experience and flight scheduling.",
    },
    scope: [
      { ar: "خدمة السلالم المتحركة لصعود ونزول الركاب", en: "Passenger stair services for boarding and disembarking" },
      { ar: "تحميل وتفريغ الطائرات", en: "Aircraft loading and offloading" },
      { ar: "مناولة وفرز أمتعة الركاب", en: "Passenger baggage handling and sorting" },
      { ar: "تنظيف الطائرات من الداخل", en: "Interior aircraft cleaning" },
      { ar: "نظافة مرافق المطار", en: "Airport facility cleaning" },
      { ar: "مساعدة الركاب أصحاب الهمم للسفر دون عناء", en: "Assistance for passengers with disabilities to travel with ease" },
      { ar: "مكافحة الآفات داخل مرافق المطار", en: "Pest control within airport facilities" },
    ],
    sectors: ["airports-transport"],
    methodology: {
      ar: "نعمل وفق إجراءات التشغيل المعتمدة في كل مطار، بفرق مدربة على المناولة الأرضية والسلامة الجوية، مع تنسيق زمني دقيق مع جداول الرحلات.",
      en: "We operate according to each airport's approved procedures, with teams trained in ground handling and aviation safety, coordinated precisely with flight schedules.",
    },
    quality: {
      ar: "الالتزام بمعايير السلامة داخل مناطق المطار غير قابل للتفاوض؛ فرقنا مدربة ومؤهلة للعمل في البيئات الحساسة زمنيًا وأمنيًا.",
      en: "Compliance with safety standards inside airport zones is non-negotiable; our teams are trained and qualified to work in time-sensitive, security-sensitive environments.",
    },
    faqs: [
      {
        question: { ar: "هل تخدمون المطارات المحلية والدولية؟", en: "Do you serve both domestic and international airports?" },
        answer: {
          ar: "نعم، نقدم خدماتنا في المطارات المحلية والدولية داخل المملكة.",
          en: "Yes, we provide our services at both domestic and international airports within the Kingdom.",
        },
      },
      {
        question: { ar: "هل يشمل ذلك مساعدة ذوي الإعاقة؟", en: "Does this include assistance for passengers with disabilities?" },
        answer: {
          ar: "نعم، نوفر خدمات مساعدة مخصصة لذوي الهمم لمساعدتهم على السفر دون عناء.",
          en: "Yes, we provide dedicated assistance services to help passengers with disabilities travel with ease.",
        },
      },
    ],
    featured: false,
  },
  {
    slug: "pest-control",
    icon: "bug",
    title: { ar: "مكافحة الآفات", en: "Pest Control" },
    summary: {
      ar: "مكافحة احترافية للحشرات والقوارض بمواد آمنة ومعتمدة.",
      en: "Professional insect and rodent control using safe, approved materials.",
    },
    heroOutcome: {
      ar: "منشأة محمية من الآفات دون مخاطرة على صحة العاملين.",
      en: "A facility protected from pests without risking staff health.",
    },
    problem: {
      ar: "الآفات مثل النمل الأبيض والقوارض والحشرات الزاحفة تهدد سلامة الأصول والمخزون والصحة العامة، وتحتاج برنامج مكافحة منتظم لا معالجة عرضية.",
      en: "Pests like termites, rodents, and crawling insects threaten asset integrity, stored goods, and public health, and need a regular control program rather than one-off treatment.",
    },
    scope: [
      { ar: "مكافحة الحشرات الطائرة والزاحفة", en: "Control of flying and crawling insects" },
      { ar: "مكافحة الفئران والقوارض", en: "Rodent and rat control" },
      { ar: "مكافحة النمل الأبيض (معالجة وقائية وتصحيحية)", en: "Termite control (preventive and corrective treatment)" },
      { ar: "مكافحة الحشرات المنزلية بشكل دوري منتظم", en: "Regular scheduled household/facility insect control" },
      { ar: "خدمات التبخير للمستودعات والسفن والطائرات", en: "Fumigation services for warehouses, ships, and aircraft" },
      { ar: "مكافحة البعوض عبر رش المصادر والتصبيب الحراري", en: "Mosquito control via source spraying and thermal fogging" },
    ],
    sectors: ["healthcare", "commercial-admin", "industrial-logistics", "education", "airports-transport"],
    methodology: {
      ar: "نطبق أحدث النظم التشغيلية بمعايير جودة عالية، باستخدام معدات آمنة ومواد كيميائية معتمدة، مع برنامج متابعة دوري يمنع عودة الإصابة.",
      en: "We apply the latest operational systems with high quality standards, using safe equipment and approved chemicals, backed by a regular follow-up program that prevents pest recurrence.",
    },
    quality: {
      ar: "فريقنا مدرب على مكافحة جميع أنواع الحشرات والقوارض، ونقدم ضمانًا على خدماتنا مع الالتزام بمعايير السلامة البيئية والصحية.",
      en: "Our team is trained to control all types of insects and rodents, and we guarantee our work while adhering to environmental and health safety standards.",
    },
    faqs: [
      {
        question: { ar: "هل المواد المستخدمة آمنة على الأطفال والحيوانات الأليفة؟", en: "Are the materials used safe for children and pets?" },
        answer: {
          ar: "نستخدم مواد كيميائية معتمدة ونتّبع إجراءات تطبيق آمنة، مع توجيهات واضحة قبل وبعد المعالجة.",
          en: "We use approved chemicals and follow safe application procedures, with clear guidance provided before and after treatment.",
        },
      },
      {
        question: { ar: "كم مرة يلزم تكرار المعالجة؟", en: "How often does treatment need to be repeated?" },
        answer: {
          ar: "يعتمد ذلك على نوع الآفة وطبيعة الموقع؛ نقترح برنامج متابعة دوري بعد المعاينة الأولى.",
          en: "This depends on the pest type and site nature; we propose a follow-up schedule after the initial assessment.",
        },
      },
    ],
    featured: false,
  },
  {
    slug: "hospitality-workforce",
    icon: "concierge",
    title: { ar: "الضيافة والكوادر التشغيلية", en: "Hospitality & Operational Workforce" },
    summary: {
      ar: "ضيافة احترافية وكوادر تشغيلية مؤهلة تخفف العبء عن فريقك.",
      en: "Professional hospitality and qualified operational staff that lighten your team's load.",
    },
    heroOutcome: {
      ar: "ضيوف وموظفون تُستقبَل احتياجاتهم اليومية باحترافية دون أن تشغل فريقك الأساسي.",
      en: "Guests and staff whose day-to-day needs are handled professionally, without pulling your core team away from its work.",
    },
    problem: {
      ar: "المؤسسات تحتاج كوادر إدارية وضيافة وتشغيل موثوقة دون تحمّل عبء التوظيف المباشر والتدريب المستمر، خاصة في المهام الموسمية أو المساندة.",
      en: "Organizations need reliable hospitality, administrative, and operational staff without carrying the burden of direct hiring and ongoing training, especially for seasonal or support tasks.",
    },
    scope: [
      { ar: "خدمات الضيافة العربية (قهوة وشاي ومشروبات) للموظفين والضيوف", en: "Arabic hospitality service (coffee, tea, beverages) for staff and guests" },
      { ar: "موظفو استقبال وسكرتارية", en: "Reception and secretarial staff" },
      { ar: "موظفون إداريون ومساعدون إداريون", en: "Administrative staff and assistants" },
      { ar: "سائقون وسائقو شاحنات ورافعات شوكية", en: "Drivers, truck drivers, and forklift operators" },
      { ar: "عمال تحميل وتنزيل وخطوط إنتاج", en: "Loading/unloading labor and production line workers" },
      { ar: "توفير الأيدي العاملة بجميع أنواعها حسب احتياج المنشأة", en: "Provision of manpower of all types based on facility needs" },
    ],
    sectors: ["commercial-admin", "residential-hospitality", "industrial-logistics"],
    methodology: {
      ar: "نختار الكوادر ونؤهلها بتدريب مكثف على مبادئ اللباقة والضيافة والاحترافية، ونديرها ونشرف عليها ميدانيًا لضمان التزامها بمعايير عملائنا.",
      en: "We select and train staff intensively on courtesy, hospitality, and professionalism principles, then manage and supervise them on the ground to ensure they meet our clients' standards.",
    },
    quality: {
      ar: "القوة العاملة لدينا على درجة عالية من التدريب والاحتراف المهني، ونطبق إجراءات مشددة لضبط جودة الأداء وخدمة العملاء.",
      en: "Our workforce is highly trained and professionally disciplined, and we apply strict measures to control performance quality and customer service.",
    },
    faqs: [
      {
        question: { ar: "هل يمكن توفير كوادر لمهمة قصيرة المدى؟", en: "Can staff be provided for a short-term assignment?" },
        answer: {
          ar: "نعم، نوفر كوادر لمهام موسمية أو مشاريع محددة إلى جانب العقود طويلة المدى.",
          en: "Yes, we provide staff for seasonal tasks or specific projects alongside long-term contracts.",
        },
      },
      {
        question: { ar: "من يتحمل مسؤولية إدارة الكوادر الموفَّرة؟", en: "Who is responsible for managing the provided staff?" },
        answer: {
          ar: "نتولى الإشراف والإدارة الميدانية للكوادر لضمان التزامها بمعايير عملائنا وجودة الخدمة المتفق عليها.",
          en: "We handle field supervision and management of the staff to ensure they meet our clients' standards and the agreed service quality.",
        },
      },
    ],
    featured: false,
  },
  {
    slug: "home-care",
    icon: "home",
    title: { ar: "العناية المنزلية الشاملة", en: "Total Home Care" },
    summary: {
      ar: "برنامج صيانة شامل لفلتك أو منزلك من التكييف إلى الحدائق.",
      en: "A comprehensive maintenance program for your villa or home — from A/C to gardens.",
    },
    heroOutcome: {
      ar: "منزل تُدار صيانته باحترافية دون أن تبحث عن فني مختلف لكل عطل.",
      en: "A home whose maintenance is handled professionally, without hunting for a different technician for every issue.",
    },
    problem: {
      ar: "أصحاب المنازل والفلل يتعاملون عادة مع فنيين متفرقين لكل خدمة، وهو ما يهدر الوقت ولا يضمن جودة ثابتة. برنامج العناية المنزلية الشاملة يجمع كل هذه الاحتياجات تحت مزود واحد موثوق.",
      en: "Villa and homeowners typically deal with separate technicians for each service, wasting time with no guarantee of consistent quality. Total Home Care brings all these needs under one trusted provider.",
    },
    scope: [
      { ar: "صيانة أنظمة وأجهزة التكييف بجميع أنواعها", en: "Maintenance of all types of A/C systems and units" },
      { ar: "صيانة المصاعد المنزلية", en: "Home elevator maintenance" },
      { ar: "الصيانة الوقائية للسباكة والكهرباء", en: "Preventive plumbing and electrical maintenance" },
      { ar: "الصيانة الدورية للمسابح", en: "Regular swimming pool maintenance" },
      { ar: "مكافحة الحشرات والآفات", en: "Insect and pest control" },
      { ar: "صيانة المزروعات وأعمال البستنة", en: "Plant maintenance and gardening works" },
      { ar: "أعمال الترميمات والتجديدات والدهانات", en: "Renovation, refurbishment, and painting works" },
      { ar: "خدمات النظافة المتخصصة", en: "Specialized cleaning services" },
      { ar: "الأنظمة الأمنية لحماية المنازل", en: "Home security systems" },
    ],
    sectors: ["residential-hospitality"],
    methodology: {
      ar: "برنامج صيانة وقائية وتصحيحية مصمم خصيصًا للمنازل الخاصة والفلل والمجمعات السكنية، مع جدولة زيارات دورية وفني نداء سريع عند الحاجة.",
      en: "A preventive and corrective maintenance program designed specifically for private homes, villas, and residential compounds, with scheduled visits and a rapid-response technician when needed.",
    },
    quality: {
      ar: "نفس معايير الجودة والسلامة المطبقة في مشاريعنا المؤسسية، بفريق مدرب يتعامل مع منزلك باحترافية واحترام.",
      en: "The same quality and safety standards applied across our corporate projects, delivered by a trained team that treats your home with professionalism and respect.",
    },
    faqs: [
      {
        question: { ar: "هل يمكن الاشتراك بخدمة واحدة فقط بدل الباقة الكاملة؟", en: "Can I subscribe to a single service instead of the full package?" },
        answer: {
          ar: "نعم، يمكن طلب خدمة منزلية واحدة أو الاشتراك في برنامج العناية الشاملة حسب رغبتك.",
          en: "Yes, you can request a single home service or subscribe to the full Total Home Care program, whichever suits you.",
        },
      },
      {
        question: { ar: "هل تخدمون الفلل والمجمعات السكنية معًا؟", en: "Do you serve both individual villas and residential compounds?" },
        answer: {
          ar: "نعم، برنامجنا مصمم للمنازل الخاصة والفلل والمجمعات السكنية على حد سواء.",
          en: "Yes, our program is designed for private homes, villas, and residential compounds alike.",
        },
      },
    ],
    featured: false,
  },
];

export function getSolutionBySlug(slug: string): Solution | undefined {
  return solutions.find((solution) => solution.slug === slug);
}
