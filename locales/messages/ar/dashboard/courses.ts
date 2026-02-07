export const courses = {
  title: "إدارة دوراتك",
  addCourse: "إضافة دورة جديدة",
  createSuccess: {
    title: "تم إنشاء الدورة",
    description: "تم إنشاء دورتك بنجاح.",
  },
    createError: {
      title: "خطأ",
      description: "فشل في إنشاء الدورة",
    },
    thumbnailSuccess: "تم رفع الصورة المصغرة بنجاح",
    form: {

    createTitle: "دورة جديدة",
    editTitle: "تعديل الدورة",
    steps: {
      basics: {
        title: "الأساسيات",
        description: "عنوان الدورة والصورة المصغرة",
      },
      description: {
        title: "الوصف",
        description: "محتوى الدورة وتفاصيلها",
      },
      publish: {
        title: "النشر",
        description: "الرابط، التسعير، وSEO",
      },
    },
    buttons: {
      back: "رجوع",
      next: "التالي",
      create: "إنشاء دورة",
      save: "حفظ التغييرات",
    },
    errors: {
      slugUnavailable: {
        title: "الرابط غير متاح",
        description: "يرجى اختيار رابط مختلف لدورتك.",
      },
      titleRequired: "يجب أن يكون العنوان 3 أحرف على الأقل",
      thumbnailRequired: "الصورة المصغرة مطلوبة",
      slugFormat:
        "يجب أن يبدأ الرابط وينتهي بحرف أو رقم، ويمكن أن يحتوي فقط على حروف صغيرة وأرقام وشرطات",
      pricePositive: "يجب أن يكون السعر رقماً موجباً",
    },
    fields: {
      title: "عنوان الدورة",
      titlePlaceholder: "مثال: الرياضيات المتقدمة",
      thumbnail: "الصورة المصغرة للدورة",
      thumbnailDescription: "ستظهر هذه الصورة في دليل الدورات",
      thumbnailFormats: "PNG، JPG أو WebP",
      description: "وصف الدورة",
      slug: "رابط الدورة (Slug)",
      slugDescription: "الجزء الفريد من رابط دورتك",
      slugPlaceholder: "advanced-mathematics",
      slugChecking: "جاري التحقق من التوفر...",
      slugAvailable: "هذا الرابط متاح",
      discount: "خصم",
      price: "السعر",
      pricePlaceholder: "0.00",
      overridePrice: "السعر قبل الخصم (اختياري)",
      overridePricePlaceholder: "0.00",
      overridePriceDescription:
        "إذا تم ضبطه، فسيظهر هذا السعر كالسعر الأصلي (مشطوب)",
      seo: {
        title: "إعدادات SEO",
        metaTitle: "عنوان الميتا (Meta Title)",
        metaTitlePlaceholder: "عنوان الميتا للدورة",
        metaDescription: "وصف الميتا (Meta Description)",
        metaDescriptionPlaceholder: "وصف الميتا للدورة",
      },
    },
  },
  table: {
    empty: "لم يتم العثور على دورات.",
    headers: {
      title: "العنوان",
      price: "السعر",
      status: "الحالة",
      createdAt: "تاريخ الإنشاء",
      actions: "الإجراءات",
    },
    actions: {
      openMenu: "فتح القائمة",
      view: "عرض",
      publish: "نشر",
      draft: "مسودة",
      edit: "تعديل",
      delete: "حذف",
      deleteConfirm: {
        title: "هل أنت متأكد تماماً؟",
        description:
          "لا يمكن التراجع عن هذا الإجراء. سيؤدي هذا إلى حذف دورتك بشكل دائم وإزالة بياناتك من خوادمنا.",
        cancel: "إلغاء",
        confirm: "متابعة",
      },
    },
    status: {
      draft: "مسودة",
      published: "منشور",
    },
  },
  drawer: {
    course: {
      title: "تفاصيل الدورة",
      description: "عرض وإدارة دورتك",
    },
    lesson: {
      title: "تفاصيل الدرس",
      description: "عرض وإدارة درسك",
    },
  },
  details: {
    created: "تاريخ الإنشاء",
    price: "السعر",
    seo: "SEO",
    notConfigured: "غير مهيأ",
    description: "الوصف",
    noDescription: "لا يوجد وصف",
    notFound: {
      title: "هذه الدورة غير موجودة",
      description: "هل أنت متأكد من صحة الرابط؟",
    },
  },
  sections: {
    title: "الأقسام",
    addSection: "إضافة قسم",
    newSectionDefaultTitle: "قسم جديد",
    empty: "لا توجد أقسام بعد",
    lessons: {
      empty: "لا توجد دروس بعد",
      free: "مجاني",
      addLesson: "إضافة درس",
    },
  },
  lessonForm: {
    addTitle: "إضافة درس جديد",
    editTitle: "تعديل الدرس",
    createSuccess: {
      title: "تم إنشاء الدرس",
      description: "تم إنشاء درسك بنجاح.",
    },
    createError: {
      title: "خطأ",
      description: "فشل في إنشاء الدرس",
    },
    updateSuccess: {
      title: "تم تحديث الدرس",
      description: "تم تحديث درسك بنجاح.",
    },
    updateError: {
      title: "خطأ",
      description: "فشل في تحديث الدرس",
    },
    buttons: {
      cancel: "إلغاء",
      add: "إضافة درس",
      save: "حفظ التغييرات",
    },
    fields: {
      title: "عنوان الدرس",
      titlePlaceholder: "مثال: مقدمة عن المتغيرات",
      titleDescription: "عنوان واضح ووصفي لهذا الدرس.",
      description: "الوصف (اختياري)",
      descriptionDescription: "أضف تفاصيل عما سيتعلمه الطلاب في هذا الدرس.",
      hostingMode: "استضافة الفيديو",
      hostingModeDescription: "اختر طريقة استضافة فيديو هذا الدرس.",
      hostingMux: "رفع فيديو (مدفوع)",
      hostingYoutube: "رابط يوتيوب (مجاني)",
      video: "فيديو الدرس",
      videoDescription: "ارفع الفيديو الخاص بهذا الدرس. الفيديو مطلوب قبل الحفظ.",
      youtubeUrl: "رابط يوتيوب",
      youtubeUrlDescription: "الصق رابط فيديو يوتيوب (يفضل أن يكون غير مدرج).",
      youtubeUrlPlaceholder: "https://www.youtube.com/watch?v=...",
      attachments: "مرفقات PDF (اختياري)",
      attachmentsDescription: "أضف موارد PDF قابلة للتنزيل لهذا الدرس.",
      attachmentsEmpty: "اسحب وأفلت ملفات PDF هنا، أو انقر للاختيار",
    },
  },
  limits: {
    maxCoursesReached: "لقد وصلت إلى الحد الأقصى لعدد الدورات في الخطة المجانية. قم بالترقية لإنشاء المزيد.",
    muxHostingUpgrade: "رفع الفيديو يتطلب خطة مدفوعة. الخطة المجانية تدعم روابط يوتيوب فقط.",
  },
  lessonDetails: {
    back: "رجوع",
    edit: "تعديل",
    delete: "حذف",
    freePreview: "عرض مجاني",
    description: "الوصف",
    noDescription: "لا يوجد وصف",
    deleteSuccess: {
      title: "تم حذف الدرس",
      description: "تم حذف الدرس بنجاح.",
    },
    deleteError: {
      title: "خطأ",
      description: "فشل في حذف الدرس",
    },
    deleteConfirm: {
      title: "حذف الدرس؟",
      description: "لا يمكن التراجع عن هذا الإجراء. سيؤدي هذا إلى حذف الدرس بشكل دائم وإزالة الفيديو والمرفقات.",
      cancel: "إلغاء",
      confirm: "حذف",
    },
    attachments: {
      title: "المرفقات",
      noAttachments: "لا توجد مرفقات",
      attachment: "مرفق",
    },
    video: {
      processing: "الفيديو قيد المعالجة...",
      waiting: "في انتظار الرفع...",
      failed: "فشلت معالجة الفيديو",
      notAvailable: "الفيديو غير متاح",
    },
    notFound: {
      title: "الدرس غير موجود",
      description: "قد يكون هذا الدرس قد تم حذفه أو غير موجود.",
    },
  },
} as const;
