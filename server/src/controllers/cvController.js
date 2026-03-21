import CV from '../models/CV.js';
import Joi from 'joi';
import { nanoid } from 'nanoid';

// Validation schema
const cvValidationSchema = Joi.object({
  personalInfo: Joi.object({
    fullName: Joi.string().required().min(2).max(100),
    email: Joi.string().email().required(),
    phone: Joi.string().allow('').max(20),
    location: Joi.string().allow('').max(100),
    linkedin: Joi.string().allow('').max(200),
    github: Joi.string().allow('').max(200),
    website: Joi.string().allow('').max(200)
  }).required(),

  profile: Joi.object({
    summary: Joi.string().allow('').max(1000)
  }),

  experience: Joi.array().items(
    Joi.object({
      id: Joi.string(),
      company: Joi.string().allow('').max(100),
      position: Joi.string().allow('').max(100),
      location: Joi.string().allow('').max(100),
      startDate: Joi.string().allow(''),
      endDate: Joi.string().allow(''),
      current: Joi.boolean(),
      description: Joi.string().allow('').max(2000),
      highlights: Joi.array().items(Joi.string())
    })
  ),

  education: Joi.array().items(
    Joi.object({
      id: Joi.string(),
      institution: Joi.string().allow('').max(100),
      degree: Joi.string().allow('').max(100),
      field: Joi.string().allow('').max(100),
      location: Joi.string().allow('').max(100),
      startDate: Joi.string().allow(''),
      endDate: Joi.string().allow(''),
      gpa: Joi.string().allow('').max(10),
      achievements: Joi.array().items(Joi.string())
    })
  ),

  skills: Joi.object({
    technical: Joi.array().items(Joi.string()),
    soft: Joi.array().items(Joi.string()),
    languages: Joi.array().items(Joi.string()),
    tools: Joi.array().items(Joi.string())
  }),

  projects: Joi.array().items(
    Joi.object({
      id: Joi.string(),
      name: Joi.string().allow('').max(100),
      description: Joi.string().allow('').max(1000),
      technologies: Joi.array().items(Joi.string()),
      link: Joi.string().allow('').max(200),
      startDate: Joi.string().allow(''),
      endDate: Joi.string().allow('')
    })
  ),

  certifications: Joi.array().items(
    Joi.object({
      id: Joi.string(),
      name: Joi.string().allow('').max(100),
      issuer: Joi.string().allow('').max(100),
      date: Joi.string().allow(''),
      expiryDate: Joi.string().allow(''),
      credentialId: Joi.string().allow('').max(50),
      link: Joi.string().allow('').max(200)
    })
  ),

  languages: Joi.array().items(
    Joi.object({
      id: Joi.string(),
      name: Joi.string().allow('').max(50),
      proficiency: Joi.string().allow('').max(20)
    })
  ),

  sectionOrder: Joi.array().items(Joi.string()),
  activeSections: Joi.object(),
  templateId: Joi.string().valid('modern', 'classic', 'minimal'),
  customization: Joi.object({
    primaryColor: Joi.string(),
    secondaryColor: Joi.string(),
    fontFamily: Joi.string(),
    fontSize: Joi.string().valid('small', 'medium', 'large'),
    spacing: Joi.string().valid('compact', 'comfortable', 'spacious'),
    accentStyle: Joi.string().valid('bold', 'italic', 'underline')
  }),

  title: Joi.string().allow('').max(100),
  description: Joi.string().allow('').max(500)
});

export const cvController = {
  // Create a new CV
  async create(req, res) {
    try {
      const { error, value } = cvValidationSchema.validate(req.body);
      if (error) {
        return res.status(400).json({
          error: 'Validation Error',
          details: error.details.map(d => d.message)
        });
      }

      const cv = new CV(value);
      await cv.save();

      res.status(201).json({
        success: true,
        message: 'CV created successfully',
        data: cv
      });
    } catch (error) {
      console.error('Create CV error:', error);
      res.status(500).json({
        error: 'Server Error',
        message: 'Failed to create CV'
      });
    }
  },

  // Get CV by ID
  async getById(req, res) {
    try {
      const { id } = req.params;
      const cv = await CV.findById(id);

      if (!cv) {
        return res.status(404).json({
          error: 'Not Found',
          message: 'CV not found'
        });
      }

      res.json({
        success: true,
        data: cv
      });
    } catch (error) {
      console.error('Get CV error:', error);
      res.status(500).json({
        error: 'Server Error',
        message: 'Failed to retrieve CV'
      });
    }
  },

  // Update CV
  async update(req, res) {
    try {
      const { id } = req.params;
      const { error, value } = cvValidationSchema.validate(req.body);

      if (error) {
        return res.status(400).json({
          error: 'Validation Error',
          details: error.details.map(d => d.message)
        });
      }

      const cv = await CV.findByIdAndUpdate(
        id,
        { ...value, updatedAt: new Date() },
        { new: true, runValidators: true }
      );

      if (!cv) {
        return res.status(404).json({
          error: 'Not Found',
          message: 'CV not found'
        });
      }

      res.json({
        success: true,
        message: 'CV updated successfully',
        data: cv
      });
    } catch (error) {
      console.error('Update CV error:', error);
      res.status(500).json({
        error: 'Server Error',
        message: 'Failed to update CV'
      });
    }
  },

  // Delete CV
  async delete(req, res) {
    try {
      const { id } = req.params;
      const cv = await CV.findByIdAndDelete(id);

      if (!cv) {
        return res.status(404).json({
          error: 'Not Found',
          message: 'CV not found'
        });
      }

      res.json({
        success: true,
        message: 'CV deleted successfully'
      });
    } catch (error) {
      console.error('Delete CV error:', error);
      res.status(500).json({
        error: 'Server Error',
        message: 'Failed to delete CV'
      });
    }
  },

  // Make CV public (shareable)
  async makePublic(req, res) {
    try {
      const { id } = req.params;
      const cv = await CV.findById(id);

      if (!cv) {
        return res.status(404).json({
          error: 'Not Found',
          message: 'CV not found'
        });
      }

      await cv.makePublic();

      res.json({
        success: true,
        message: 'CV is now public',
        data: {
          shareId: cv.shareId,
          shareUrl: cv.shareUrl,
          isPublic: cv.isPublic
        }
      });
    } catch (error) {
      console.error('Make public error:', error);
      res.status(500).json({
        error: 'Server Error',
        message: 'Failed to make CV public'
      });
    }
  },

  // Make CV private
  async makePrivate(req, res) {
    try {
      const { id } = req.params;
      const cv = await CV.findById(id);

      if (!cv) {
        return res.status(404).json({
          error: 'Not Found',
          message: 'CV not found'
        });
      }

      await cv.makePrivate();

      res.json({
        success: true,
        message: 'CV is now private',
        data: {
          isPublic: cv.isPublic
        }
      });
    } catch (error) {
      console.error('Make private error:', error);
      res.status(500).json({
        error: 'Server Error',
        message: 'Failed to make CV private'
      });
    }
  },

  // Get CV by share ID (public access)
  async getByShareId(req, res) {
    try {
      const { shareId } = req.params;
      const cv = await CV.findByShareId(shareId);

      if (!cv) {
        return res.status(404).json({
          error: 'Not Found',
          message: 'CV not found or not public'
        });
      }

      // Increment view count
      await cv.incrementViews();

      res.json({
        success: true,
        data: cv
      });
    } catch (error) {
      console.error('Get shared CV error:', error);
      res.status(500).json({
        error: 'Server Error',
        message: 'Failed to retrieve shared CV'
      });
    }
  },

  // Get CV analytics
  async getAnalytics(req, res) {
    try {
      const { id } = req.params;
      const cv = await CV.findById(id);

      if (!cv) {
        return res.status(404).json({
          error: 'Not Found',
          message: 'CV not found'
        });
      }

      res.json({
        success: true,
        data: {
          viewCount: cv.viewCount || 0,
          lastViewedAt: cv.lastViewedAt,
          isPublic: cv.isPublic,
          shareId: cv.shareId,
          shareUrl: cv.shareUrl,
          createdAt: cv.createdAt,
          updatedAt: cv.updatedAt
        }
      });
    } catch (error) {
      console.error('Get analytics error:', error);
      res.status(500).json({
        error: 'Server Error',
        message: 'Failed to retrieve analytics'
      });
    }
  }
};