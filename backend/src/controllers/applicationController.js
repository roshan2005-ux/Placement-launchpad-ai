import JobApplication, { VALID_STATUSES, VALID_JOB_TYPES } from '../models/JobApplication.js';

/**
 * Validates a URL string if provided
 */
const isValidUrl = (urlString) => {
  if (!urlString || typeof urlString !== 'string' || !urlString.trim()) return true;
  try {
    const url = new URL(urlString.trim());
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
};

// @desc    Get all job applications for authenticated student
// @route   GET /api/applications
// @access  Private
export const getApplications = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const { status, search } = req.query;

    const query = { userId };
    if (status && VALID_STATUSES.includes(status)) {
      query.status = status;
    }

    let applications = await JobApplication.find(query);

    // If search filter is provided, filter by companyName or jobRole
    if (search && search.trim()) {
      const term = search.trim().toLowerCase();
      applications = applications.filter((app) => {
        const company = (app.companyName || '').toLowerCase();
        const role = (app.jobRole || '').toLowerCase();
        const location = (app.location || '').toLowerCase();
        return company.includes(term) || role.includes(term) || location.includes(term);
      });
    }

    return res.status(200).json({
      status: 'success',
      count: applications.length,
      applications: applications.map((app) => app.toSafeObject()),
    });
  } catch (error) {
    console.error('[Get Applications Error]:', error.message);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve job applications.',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    });
  }
};

// @desc    Get aggregate statistics of student's job applications
// @route   GET /api/applications/stats
// @access  Private
export const getApplicationStats = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const allApplications = await JobApplication.find({ userId });

    const stats = {
      total: allApplications.length,
      applied: 0,
      assessment: 0,
      interview: 0,
      selected: 0,
      rejected: 0,
      active: 0,
    };

    for (const app of allApplications) {
      const s = app.status;
      if (s === 'Applied') stats.applied++;
      else if (s === 'Assessment') stats.assessment++;
      else if (s === 'Interview') stats.interview++;
      else if (s === 'Selected') stats.selected++;
      else if (s === 'Rejected') stats.rejected++;
    }

    stats.active = stats.applied + stats.assessment + stats.interview;

    return res.status(200).json({
      status: 'success',
      stats,
    });
  } catch (error) {
    console.error('[Get Application Stats Error]:', error.message);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to calculate application statistics.',
    });
  }
};

// @desc    Create a new job application
// @route   POST /api/applications
// @access  Private
export const createApplication = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const {
      companyName,
      jobRole,
      location,
      applicationDate,
      jobType,
      status,
      jobUrl,
      notes,
    } = req.body;

    // 1. Validation: Company Name
    if (!companyName || typeof companyName !== 'string' || !companyName.trim()) {
      return res.status(400).json({
        status: 'error',
        message: 'Company name is required.',
      });
    }

    // 2. Validation: Job Role
    if (!jobRole || typeof jobRole !== 'string' || !jobRole.trim()) {
      return res.status(400).json({
        status: 'error',
        message: 'Job role is required.',
      });
    }

    // 3. Validation: Status
    const normalizedStatus = status ? String(status).trim() : 'Applied';
    if (!VALID_STATUSES.includes(normalizedStatus)) {
      return res.status(400).json({
        status: 'error',
        message: `Invalid application status "${status}". Allowed values: ${VALID_STATUSES.join(', ')}.`,
      });
    }

    // 4. Validation: Job Type
    const normalizedJobType = jobType ? String(jobType).trim() : 'Full-Time';
    if (!VALID_JOB_TYPES.includes(normalizedJobType)) {
      return res.status(400).json({
        status: 'error',
        message: `Invalid job type "${jobType}". Allowed values: ${VALID_JOB_TYPES.join(', ')}.`,
      });
    }

    // 5. Validation: Job URL
    if (jobUrl && jobUrl.trim() && !isValidUrl(jobUrl)) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide a valid URL starting with http:// or https://.',
      });
    }

    // 6. Create document
    const newApplication = await JobApplication.create({
      userId,
      companyName: companyName.trim(),
      jobRole: jobRole.trim(),
      location: location ? String(location).trim() : 'Remote',
      applicationDate: applicationDate ? new Date(applicationDate) : new Date(),
      jobType: normalizedJobType,
      status: normalizedStatus,
      jobUrl: jobUrl ? String(jobUrl).trim() : '',
      notes: notes ? String(notes).trim() : '',
    });

    return res.status(201).json({
      status: 'success',
      message: 'Job application added successfully.',
      application: newApplication.toSafeObject(),
    });
  } catch (error) {
    console.error('[Create Application Error]:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to create job application.',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    });
  }
};

// @desc    Update an existing job application
// @route   PUT /api/applications/:id
// @access  Private
export const updateApplication = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const { id } = req.params;
    const {
      companyName,
      jobRole,
      location,
      applicationDate,
      jobType,
      status,
      jobUrl,
      notes,
    } = req.body;

    const application = await JobApplication.findOne({ _id: id, userId });
    if (!application) {
      return res.status(404).json({
        status: 'error',
        message: 'Job application not found or unauthorized.',
      });
    }

    // Validate updates if provided
    if (companyName !== undefined) {
      if (!companyName || typeof companyName !== 'string' || !companyName.trim()) {
        return res.status(400).json({
          status: 'error',
          message: 'Company name cannot be empty.',
        });
      }
      application.companyName = companyName.trim();
    }

    if (jobRole !== undefined) {
      if (!jobRole || typeof jobRole !== 'string' || !jobRole.trim()) {
        return res.status(400).json({
          status: 'error',
          message: 'Job role cannot be empty.',
        });
      }
      application.jobRole = jobRole.trim();
    }

    if (status !== undefined) {
      const normalizedStatus = String(status).trim();
      if (!VALID_STATUSES.includes(normalizedStatus)) {
        return res.status(400).json({
          status: 'error',
          message: `Invalid application status "${status}". Allowed values: ${VALID_STATUSES.join(', ')}.`,
        });
      }
      application.status = normalizedStatus;
    }

    if (jobType !== undefined) {
      const normalizedJobType = String(jobType).trim();
      if (!VALID_JOB_TYPES.includes(normalizedJobType)) {
        return res.status(400).json({
          status: 'error',
          message: `Invalid job type "${jobType}". Allowed values: ${VALID_JOB_TYPES.join(', ')}.`,
        });
      }
      application.jobType = normalizedJobType;
    }

    if (jobUrl !== undefined) {
      if (jobUrl && jobUrl.trim() && !isValidUrl(jobUrl)) {
        return res.status(400).json({
          status: 'error',
          message: 'Please provide a valid URL starting with http:// or https://.',
        });
      }
      application.jobUrl = jobUrl ? String(jobUrl).trim() : '';
    }

    if (location !== undefined) {
      application.location = String(location).trim() || 'Remote';
    }

    if (applicationDate !== undefined) {
      application.applicationDate = applicationDate ? new Date(applicationDate) : new Date();
    }

    if (notes !== undefined) {
      application.notes = String(notes).trim();
    }

    await application.save();

    return res.status(200).json({
      status: 'success',
      message: 'Job application updated successfully.',
      application: application.toSafeObject(),
    });
  } catch (error) {
    console.error('[Update Application Error]:', error.message);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to update job application.',
    });
  }
};

// @desc    Quick update status of a job application
// @route   PATCH /api/applications/:id/status
// @access  Private
export const updateApplicationStatus = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !VALID_STATUSES.includes(String(status).trim())) {
      return res.status(400).json({
        status: 'error',
        message: `Invalid application status "${status}". Allowed values: ${VALID_STATUSES.join(', ')}.`,
      });
    }

    const application = await JobApplication.findOne({ _id: id, userId });
    if (!application) {
      return res.status(404).json({
        status: 'error',
        message: 'Job application not found or unauthorized.',
      });
    }

    application.status = String(status).trim();
    await application.save();

    return res.status(200).json({
      status: 'success',
      message: `Status updated to ${application.status}.`,
      application: application.toSafeObject(),
    });
  } catch (error) {
    console.error('[Update Status Error]:', error.message);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to update application status.',
    });
  }
};

// @desc    Delete a job application
// @route   DELETE /api/applications/:id
// @access  Private
export const deleteApplication = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const { id } = req.params;

    const application = await JobApplication.findOne({ _id: id, userId });
    if (!application) {
      return res.status(404).json({
        status: 'error',
        message: 'Job application not found or unauthorized.',
      });
    }

    await JobApplication.findByIdAndDelete(application._id || id);

    return res.status(200).json({
      status: 'success',
      message: 'Job application deleted successfully.',
    });
  } catch (error) {
    console.error('[Delete Application Error]:', error.message);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to delete job application.',
    });
  }
};
