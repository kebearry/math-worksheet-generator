const express = require('express');
const router = express.Router();
const Template = require('../models/Template');

// Get all templates
router.get('/', async (req, res) => {
  try {
    const templates = await Template.find().sort({ createdAt: -1 });
    res.json(templates);
  } catch (err) {
    console.error('Error fetching templates:', err);
    res.status(500).json({ message: err.message });
  }
});

// Create a new template
router.post('/', async (req, res) => {
  try {
    const { name, settings, isPublic } = req.body;
    
    // Validate required fields
    if (!name || !settings) {
      return res.status(400).json({ message: 'Name and settings are required' });
    }

    // Check if template with same name exists
    const existingTemplate = await Template.findOne({ name });
    
    if (existingTemplate) {
      // Update existing template
      existingTemplate.settings = settings;
      existingTemplate.isPublic = isPublic || false;
      const updatedTemplate = await existingTemplate.save();
      return res.json(updatedTemplate);
    }

    // Create new template if no existing one found
    const template = new Template({
      name,
      settings,
      isPublic: isPublic || false,
      createdBy: 'anonymous'
    });

    const savedTemplate = await template.save();
    res.status(201).json(savedTemplate);
  } catch (err) {
    console.error('Error creating/updating template:', err);
    res.status(400).json({ message: err.message });
  }
});

// Get a specific template
router.get('/:id', async (req, res) => {
  try {
    const template = await Template.findById(req.params.id);
    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }
    res.json(template);
  } catch (err) {
    console.error('Error fetching template:', err);
    res.status(500).json({ message: err.message });
  }
});

// Delete a template
router.delete('/:id', async (req, res) => {
  try {
    const template = await Template.findById(req.params.id);
    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }
    await template.deleteOne();
    res.json({ message: 'Template deleted successfully' });
  } catch (err) {
    console.error('Error deleting template:', err);
    res.status(500).json({ message: err.message });
  }
});

// Update template
router.patch('/:id', async (req, res) => {
  try {
    const template = await Template.findById(req.params.id);
    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }

    if (req.body.name) template.name = req.body.name;
    if (req.body.settings) template.settings = req.body.settings;
    if (req.body.isPublic !== undefined) template.isPublic = req.body.isPublic;
    if (req.body.metadata) template.metadata = req.body.metadata;

    const updatedTemplate = await template.save();
    res.json(updatedTemplate);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update usage stats
router.post('/:id/use', async (req, res) => {
  try {
    const template = await Template.findById(req.params.id);
    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }

    template.usageStats.timesUsed += 1;
    template.usageStats.lastUsed = new Date();
    
    const updatedTemplate = await template.save();
    res.json(updatedTemplate);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router; 