const Application = require('../models/Application');
const Job = require('../models/Job');

// @desc    Apply for job with file upload
// @route   POST /api/applications/apply
// @access  Public/Private
exports.applyForJob = async (req, res) => {
  try {
    console.log('Request body:', req.body);
    console.log('File:', req.file);

    const { jobId, name, email, phone, coverLetter } = req.body;
    
    // Get file info if uploaded
    const resumeUrl = req.file ? `/uploads/${req.file.filename}` : '';

    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ 
        success: false,
        message: 'Job not found' 
      });
    }

    // Check if already applied (optional)
    const existingApplication = await Application.findOne({ 
      jobId, 
      email 
    });
    
    if (existingApplication) {
      return res.status(400).json({ 
        success: false,
        message: 'You have already applied for this job' 
      });
    }

    // Create application
    const application = await Application.create({
      jobId,
      name,
      email,
      phone,
      resume: resumeUrl,
      coverLetter: coverLetter || 'No cover letter provided',
      userId: req.user ? req.user.id : null
    });

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      application: {
        id: application._id,
        jobId: application.jobId,
        name: application.name,
        email: application.email,
        status: application.status,
        resume: application.resume
      }
    });

  } catch (error) {
    console.error('Application error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error',
      error: error.message 
    });
  }
};

// @desc    Get all applications
// @route   GET /api/applications
// @access  Private (Admin/Manager)
exports.getApplications = async (req, res) => {
  try {
    const applications = await Application.find()
      .populate('jobId', 'title company location')
      .populate('userId', 'name email')
      .sort('-appliedAt');
    
    res.json({
      success: true,
      count: applications.length,
      applications
    });

  } catch (error) {
    console.error('Get applications error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error' 
    });
  }
};

// @desc    Get single application
// @route   GET /api/applications/:id
// @access  Private
exports.getApplicationById = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate('jobId')
      .populate('userId', 'name email');
    
    if (!application) {
      return res.status(404).json({ 
        success: false,
        message: 'Application not found' 
      });
    }

    // Check if user is authorized to view this application
    if (req.user.role === 'user' && application.userId?.toString() !== req.user.id) {
      return res.status(403).json({ 
        success: false,
        message: 'Not authorized to view this application' 
      });
    }

    res.json({
      success: true,
      application
    });

  } catch (error) {
    console.error('Get application error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error' 
    });
  }
};

// @desc    Update application status
// @route   PUT /api/applications/:id/status
// @access  Private (Admin/Manager)
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { status, notes } = req.body;
    
    const application = await Application.findById(req.params.id);
    
    if (!application) {
      return res.status(404).json({ 
        success: false,
        message: 'Application not found' 
      });
    }

    application.status = status;
    if (notes) application.notes = notes;
    await application.save();

    res.json({
      success: true,
      message: `Application status updated to ${status}`,
      application
    });

  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error' 
    });
  }
};

// @desc    Get applications for a specific job
// @route   GET /api/applications/job/:jobId
// @access  Private (Admin/Manager)
exports.getJobApplications = async (req, res) => {
  try {
    const applications = await Application.find({ 
      jobId: req.params.jobId 
    }).populate('userId', 'name email');
    
    res.json({
      success: true,
      count: applications.length,
      applications
    });

  } catch (error) {
    console.error('Get job applications error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error' 
    });
  }
};

// @desc    Withdraw application
// @route   DELETE /api/applications/:id
// @access  Private
exports.withdrawApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);
    
    if (!application) {
      return res.status(404).json({ 
        success: false,
        message: 'Application not found' 
      });
    }

    // Check if user is authorized to withdraw this application
    if (req.user.role === 'user' && application.userId?.toString() !== req.user.id) {
      return res.status(403).json({ 
        success: false,
        message: 'Not authorized to withdraw this application' 
      });
    }

    await application.deleteOne();

    res.json({
      success: true,
      message: 'Application withdrawn successfully'
    });

  } catch (error) {
    console.error('Withdraw application error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error' 
    });
  }
};