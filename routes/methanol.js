const express = require('express');
const router = express.Router();
const db = require('../db');
const XLSX = require('xlsx');

// POST: Save methanol report
router.post('/methanol', async (req, res) => {
  try {
    const data = req.body;
    const result = await db.collection('methanol_reports').insertOne(data);
    res.json({ _id: result.insertedId });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save methanol report' });
  }
});

// GET: Fetch all methanol reports
router.get('/methanol', async (req, res) => {
  try {
    const records = await db.collection('methanol_reports').find().toArray();
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch reports' });
  }
});

// GET: Export methanol reports as Excel
router.get('/methanol/export', async (req, res) => {
  try {
    const data = await db.collection('methanol_reports').find().toArray();
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Methanol");

    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
    res.setHeader('Content-Disposition', 'attachment; filename=methanol-report.xlsx');
    res.type('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.send(buffer);
  } catch (err) {
    res.status(500).json({ error: 'Export failed' });
  }
});

module.exports = router;
