import express from 'express';
import Job from '../models/Job.js';     
import Event from '../models/Event.js'; 

const router = express.Router();

const verifyAlumniAppKey = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  const token = authHeader.split(' ')[1]; 
  if (token === process.env.ALUMNI_ANDROID_SECRET) {
    next(); 
  } else {
    res.status(403).json({ error: "Invalid API Secret Token." });
  }
};

// Clean path: /api/alumni + /external/job = /api/alumni/external/job
router.post('/external/job', verifyAlumniAppKey, async (req, res) => {
  try {
    const { 
      userId, 
      posterName, 
      type, 
      title, 
      company, 
      location, 
      description, 
      salaryRange, 
      contactEmail 
    } = req.body;
    
    const newJob = new Job({
      userId: userId || process.env.DEFAULT_ANDROID_USER_ID || "65a12b3c4d5e6f7a8b9c0d1e",
      posterName: posterName || "Android App User",
      type: type || "Job",
      title,
      company,
      location: location || "Remote",
      description,
      salaryRange: salaryRange || "Negotiable",
      contactEmail: contactEmail || "alumni@igitalumni.in"
    });
    
    await newJob.save();
    res.status(201).json({ success: true, message: "Job successfully posted to website!" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/external/event', verifyAlumniAppKey, async (req, res) => {
  try {
    const { 
      title, 
      description, 
      date, 
      time, 
      location, 
      registrationLink, 
      organizer, 
      contactEmail 
    } = req.body;
    
    const newEvent = new Event({
      title,
      description,
      date: date || new Date(),
      time,
      location,
      registrationLink,
      organizer: organizer || "Android App Integration",
      contactEmail
    });
    
    await newEvent.save();
    res.status(201).json({ success: true, message: "Event successfully posted to website!" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get('/external/job', verifyAlumniAppKey, async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: jobs });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get('/external/event', verifyAlumniAppKey, async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: events });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.put('/external/job/:id', verifyAlumniAppKey, async (req, res) => {
  try {
    const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updatedJob) return res.status(404).json({ success: false, error: "Job not found" });
    res.status(200).json({ success: true, message: "Job successfully updated!", data: updatedJob });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.delete('/external/job/:id', verifyAlumniAppKey, async (req, res) => {
  try {
    const deletedJob = await Job.findByIdAndDelete(req.params.id);
    if (!deletedJob) return res.status(404).json({ success: false, error: "Job not found" });
    res.status(200).json({ success: true, message: "Job successfully deleted!" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.put('/external/event/:id', verifyAlumniAppKey, async (req, res) => {
  try {
    const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updatedEvent) return res.status(404).json({ success: false, error: "Event not found" });
    res.status(200).json({ success: true, message: "Event successfully updated!", data: updatedEvent });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.delete('/external/event/:id', verifyAlumniAppKey, async (req, res) => {
  try {
    const deletedEvent = await Event.findByIdAndDelete(req.params.id);
    if (!deletedEvent) return res.status(404).json({ success: false, error: "Event not found" });
    res.status(200).json({ success: true, message: "Event successfully deleted!" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;