/**
 * crudFactory(Model, allowedFields)
 * Returns { getAll, create, update, remove } controller functions
 * for any array-type portfolio section.
 */
const crudFactory = (Model, allowedFields) => {

  const getAll = async (req, res, next) => {
    try {
      const docs = await Model.find().sort('order createdAt');
      res.json({ success: true, data: docs });
    } catch (err) { next(err); }
  };

  const create = async (req, res, next) => {
    try {
      const payload = {};
      allowedFields.forEach(k => { if (req.body[k] !== undefined) payload[k] = req.body[k]; });
      const doc = await Model.create(payload);
      res.status(201).json({ success: true, message: 'Created successfully.', data: doc });
    } catch (err) { next(err); }
  };

  const update = async (req, res, next) => {
    try {
      const payload = {};
      allowedFields.forEach(k => { if (req.body[k] !== undefined) payload[k] = req.body[k]; });
      const doc = await Model.findByIdAndUpdate(req.params.id, payload, { new: true, runValidators: true });
      if (!doc) return res.status(404).json({ success: false, message: 'Not found.' });
      res.json({ success: true, message: 'Updated successfully.', data: doc });
    } catch (err) { next(err); }
  };

  const remove = async (req, res, next) => {
    try {
      const doc = await Model.findByIdAndDelete(req.params.id);
      if (!doc) return res.status(404).json({ success: false, message: 'Not found.' });
      res.json({ success: true, message: 'Deleted successfully.' });
    } catch (err) { next(err); }
  };

  return { getAll, create, update, remove };
};

module.exports = crudFactory;
