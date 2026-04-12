const express = require("express");
const router = express.Router();
const Job = require("../models/Job");

// ============================
// CREATE JOB
// ============================
router.post("/", async (req, res) => {
  try {
    const { title, description, wage, owner, location } = req.body;

    if (!title || !description || !wage || !owner || !location) {
      return res.status(400).json({ message: "All fields required" });
    }

    const job = new Job({
      title,
      description,
      wage,
      owner,
      location,
      applicants: [],
    });

    await job.save();

    res.json({ message: "Job created successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ============================
// GET JOBS
// ============================
router.get("/", async (req, res) => {
  try {
    const { userId, role } = req.query;

    let jobs;

    if (role === "owner") {
      // ✅ owner sees only his jobs
      jobs = await Job.find({ owner: userId })
        .populate("applicants.user");
    } else {
      // ✅ worker sees all jobs
      jobs = await Job.find()
        .populate("applicants.user");
    }

    res.json(jobs);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error fetching jobs" });
  }
});

// ============================
// APPLY JOB
// ============================
router.post("/:jobId/apply", async (req, res) => {
  try {
    const { userId } = req.body;

    const job = await Job.findById(req.params.jobId);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // ✅ prevent duplicate apply
    const already = job.applicants.find(
      (a) => a.user.toString() === userId
    );

    if (already) {
      return res.status(400).json({ message: "Already applied" });
    }

    job.applicants.push({
      user: userId,
      status: "pending",
    });

    await job.save();

    res.json({ message: "Applied successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error applying" });
  }
});

// ============================
// ACCEPT / REJECT (FINAL FIX)
// ============================
router.put("/:jobId/applicant/:userId", async (req, res) => {
  try {
    const { status } = req.body;

    const job = await Job.findById(req.params.jobId);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // ======================
    // REJECT → REMOVE USER
    // ======================
    if (status === "rejected") {
      job.applicants = job.applicants.filter(
        (a) => a.user.toString() !== req.params.userId
      );

      await job.save();

      // 🔔 notify worker
      if (global.io) {
        global.io.to(req.params.userId).emit("notification", {
          message: "Your application was rejected",
        });
      }

      return res.json({ message: "Application rejected and removed" });
    }

    // ======================
    // ACCEPT
    // ======================
    const applicant = job.applicants.find(
      (a) => a.user.toString() === req.params.userId
    );

    if (!applicant) {
      return res.status(404).json({ message: "Applicant not found" });
    }

    applicant.status = "accepted";

    await job.save();

    // 🔔 notify worker
    if (global.io) {
      global.io.to(req.params.userId).emit("notification", {
        message: "Your application was accepted",
      });
    }

    res.json({ message: "Worker accepted" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error updating status" });
  }
});

module.exports = router;