export const courses = {
  title: "Manage Your Courses",
  addCourse: "Add New Course",
  createSuccess: {
    title: "Course created",
    description: "Your course has been created successfully.",
  },
  createError: {
    title: "Error",
    description: "Failed to create course",
  },
  thumbnailSuccess: "Thumbnail uploaded successfully",
  form: {
    createTitle: "New Course",
    editTitle: "Edit Course",
    steps: {
      basics: {
        title: "Basics",
        description: "Course title and thumbnail",
      },
      description: {
        title: "Description",
        description: "Course content and details",
      },
      publish: {
        title: "Publish",
        description: "URL, pricing, and SEO",
      },
    },
    buttons: {
      back: "Back",
      next: "Next",
      create: "Create Course",
      save: "Save Changes",
    },
    errors: {
      slugUnavailable: {
        title: "Slug unavailable",
        description: "Please choose a different URL for your course.",
      },
      titleRequired: "Title must be at least 3 characters",
      thumbnailRequired: "Thumbnail is required",
      slugFormat:
        "Slug must start and end with a letter or number, and can only contain lowercase letters, numbers, and hyphens",
      pricePositive: "Price must be a positive number",
    },
    fields: {
      title: "Course Title",
      titlePlaceholder: "e.g. Advanced Mathematics",
      thumbnail: "Course Thumbnail",
      thumbnailDescription: "This image will be shown in the course catalog",
      thumbnailFormats: "PNG, JPG or WebP",
      description: "Course Description",
      slug: "Course URL (Slug)",
      slugDescription: "The unique part of your course's URL",
      slugPlaceholder: "advanced-mathematics",
      slugChecking: "Checking availability...",
      slugAvailable: "This URL is available",
      discount: "discount",
      price: "Price",
      pricePlaceholder: "0.00",
      overridePrice: "Override Price (Optional)",
      overridePricePlaceholder: "0.00",
      overridePriceDescription:
        "If set, this price will be shown as the original price (strikethrough)",
      seo: {
        title: "SEO Settings",
        metaTitle: "Meta Title",
        metaTitlePlaceholder: "Course Meta Title",
        metaDescription: "Meta Description",
        metaDescriptionPlaceholder: "Course Meta Description",
      },
    },
  },
  table: {
    empty: "No Courses Found.",
    headers: {
      title: "Title",
      price: "Price",
      status: "Status",
      createdAt: "Created At",
      actions: "Actions",
    },
    actions: {
      openMenu: "Open menu",
      view: "View",
      publish: "Publish",
      draft: "Draft",
      edit: "Edit",
      delete: "Delete",
      deleteConfirm: {
        title: "Are you absolutely sure?",
        description:
          "This action cannot be undone. This will permanently delete your course and remove your data from our servers.",
        cancel: "Cancel",
        confirm: "Continue",
      },
    },
    status: {
      draft: "Draft",
      published: "Published",
    },
  },
  drawer: {
    course: {
      title: "Course Details",
      description: "View and manage your course",
    },
    lesson: {
      title: "Lesson Details",
      description: "View and manage your lesson",
    },
  },
  details: {
    created: "Created",
    price: "Price",
    seo: "SEO",
    notConfigured: "Not configured",
    description: "Description",
    noDescription: "No Description",
    notFound: {
      title: "This Course Doesn't Exist",
      description: "Are you sure the URL is correct?",
    },
  },
  sections: {
    title: "Sections",
    addSection: "Add Section",
    newSectionDefaultTitle: "New Section",
    empty: "No Section Yet",
    lessons: {
      empty: "No Lessons Yet",
      free: "Free",
      addLesson: "Add Lesson",
    },
  },
  lessonForm: {
    addTitle: "Add New Lesson",
    createSuccess: {
      title: "Lesson created",
      description: "Your lesson has been created successfully.",
    },
    createError: {
      title: "Error",
      description: "Failed to create lesson",
    },
    buttons: {
      cancel: "Cancel",
      add: "Add Lesson",
    },
    fields: {
      title: "Lesson Title",
      titlePlaceholder: "e.g. Introduction to Variables",
      titleDescription: "A clear, descriptive title for this lesson.",
      titleRequired: "Title must be at least 3 characters",
      isFree: "Free Preview",
      isFreeDescription:
        "Allow non-enrolled students to preview this lesson for free.",
      description: "Description (Optional)",
      descriptionDescription:
        "Add details about what students will learn in this lesson.",
      video: "Lesson Video",
      videoDescription:
        "Upload the video for this lesson. Video is required before saving.",
      videoRequired: "Video is required",
      attachments: "PDF Attachments (Optional)",
      attachmentsDescription: "Add downloadable PDF resources for this lesson.",
      attachmentsEmpty: "Drag and drop PDF files here, or click to select",
    },
  },
  lessonDetails: {
    back: "Back",
    freePreview: "Free Preview",
    description: "Description",
    noDescription: "No Description",
    attachments: {
      title: "Attachments",
      noAttachments: "No Attachments",
      attachment: "Attachment",
    },
    video: {
      processing: "Video is processing...",
      waiting: "Waiting for upload...",
      failed: "Video processing failed",
      notAvailable: "Video not available",
    },
    notFound: {
      title: "Lesson Not Found",
      description: "This lesson may have been deleted or doesn't exist.",
    },
  },
} as const;
