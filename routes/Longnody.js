const express = require('express');
const router = express.Router();
const db = require('../db');
const XLSX = require('xlsx');

// POST: Save long body report
router.post('/long-body', async (req, res) => {
  try {
    const data = req.body;
    const result = await db.collection('long_body_reports').insertOne(data);
    res.json({ _id: result.insertedId });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save long body report' });
  }
});

// GET: Fetch all long body reports
router.get('/long-body', async (req, res) => {
  try {
    const records = await db.collection('long_body_reports').find().toArray();
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch reports' });
  }
});

// GET: Export long body reports as Excel
router.get('/long-body/export', async (req, res) => {
  try {
    const data = await db.collection('long_body_reports').find().toArray();
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "LongBody");

    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
    res.setHeader('Content-Disposition', 'attachment; filename=long-body-report.xlsx');
    res.type('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.send(buffer);
  } catch (err) {
    res.status(500).json({ error: 'Export failed' });
  }
});

module.exports = router;
