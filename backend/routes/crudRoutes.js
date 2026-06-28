const router  = require('express').Router;
const { protect } = require('../middleware/auth');

/**
 * crudRoutes(controller)
 * Builds standard GET / POST / PUT/:id / DELETE/:id routes.
 * GET is public; POST, PUT, DELETE are protected.
 */
const crudRoutes = (controller) => {
  const r = router();
  r.get   ('/',     controller.getAll);
  r.post  ('/',     protect, controller.create);
  r.put   ('/:id',  protect, controller.update);
  r.delete('/:id',  protect, controller.remove);
  return r;
};

module.exports = crudRoutes;
