import mongoose from "mongoose";

const CVSchema = new mongoose.Schema(
  {
    // Unique identifier for sharing
    shareId: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
    },

    // CV Data
    personalInfo: {
      fullName: { type: String, required: true },
      email: { type: String, required: true },
      phone: String,
      location: String,
      linkedin: String,
      github: String,
      website: String,
    },

    profile: {
      summary: String,
    },

    experience: [
      {
        id: String,
        company: String,
        position: String,
        location: String,
        startDate: String,
        endDate: String,
        current: Boolean,
        description: String,
        highlights: [String],
      },
    ],

    education: [
      {
        id: String,
        institution: String,
        degree: String,
        field: String,
        location: String,
        startDate: String,
        endDate: String,
        gpa: String,
        achievements: [String],
      },
    ],

    skills: {
      technical: [String],
      soft: [String],
      languages: [String],
      tools: [String],
    },

    projects: [
      {
        id: String,
        name: String,
        description: String,
        technologies: [String],
        link: String,
        startDate: String,
        endDate: String,
      },
    ],

    certifications: [
      {
        id: String,
        name: String,
        issuer: String,
        date: String,
        expiryDate: String,
        credentialId: String,
        link: String,
      },
    ],

    languages: [
      {
        id: String,
        name: String,
        proficiency: String,
      },
    ],

    // Section configuration
    sectionOrder: [String],
    activeSections: {
      personalInfo: { type: Boolean, default: true },
      profile: { type: Boolean, default: true },
      experience: { type: Boolean, default: true },
      education: { type: Boolean, default: true },
      skills: { type: Boolean, default: true },
      projects: { type: Boolean, default: false },
      certifications: { type: Boolean, default: false },
      languages: { type: Boolean, default: false },
    },

    // Sharing configuration
    isPublic: {
      type: Boolean,
      default: false,
    },

    allowComments: {
      type: Boolean,
      default: false,
    },

    // Optional metadata
    title: String,
    description: String,

    // Analytics
    viewCount: {
      type: Number,
      default: 0,
    },

    lastViewedAt: Date,

    // Template and customization
    templateId: {
      type: String,
      default: "modern",
    },

    customization: {
      primaryColor: { type: String, default: "#3b82f6" },
      secondaryColor: { type: String, default: "#64748b" },
      fontFamily: { type: String, default: "Inter" },
      fontSize: { type: String, default: "medium" },
      spacing: { type: String, default: "comfortable" },
      accentStyle: { type: String, default: "bold" },
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
    versionKey: false,
  },
);

// Indexes for better performance
CVSchema.index({ shareId: 1 });
CVSchema.index({ "personalInfo.email": 1 });
CVSchema.index({ isPublic: 1 });
CVSchema.index({ createdAt: -1 });

// Virtual for share URL
CVSchema.virtual("shareUrl").get(function () {
  if (!this.shareId) return null;

  const baseUrl = process.env.CLIENT_URL || "http://localhost:5173";
  return `${baseUrl}/share/${this.shareId}`;
});

// Method to increment view count
CVSchema.methods.incrementViews = function () {
  this.viewCount = (this.viewCount || 0) + 1;
  this.lastViewedAt = new Date();
  return this.save();
};

// Method to make public with share ID
CVSchema.methods.makePublic = function () {
  if (!this.shareId) {
    // Generate a unique share ID
    this.shareId = generateShareId();
  }
  this.isPublic = true;
  return this.save();
};

// Method to make private
CVSchema.methods.makePrivate = function () {
  this.isPublic = false;
  return this.save();
};

// Static method to find by share ID
CVSchema.statics.findByShareId = function (shareId) {
  return this.findOne({ shareId, isPublic: true });
};

// Helper function to generate unique share ID
const generateShareId = () => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Pre-save middleware to generate share ID if making public
CVSchema.pre("save", function (next) {
  if (this.isPublic && !this.shareId) {
    this.shareId = generateShareId();
  }
  next();
});

// Transform output to include virtual fields
CVSchema.set("toJSON", {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret._id;
    return ret;
  },
});

export default mongoose.model("CV", CVSchema);
