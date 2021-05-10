const CampGround = require('../models/campGround');
const { campgroundSchema } = require('../schemaValidation');

module.exports.index = async (req, res) => {
  const campgrounds = await CampGround.find({});
  res.render('campgrounds/index', { campgrounds });
};

module.exports.renderNewForm = (req, res) => {
  res.render('campgrounds/new');
};

module.exports.createCampground = async (req, res, next) => {
  const campground = new CampGround(req.body.campground);
  campground.images = req.files.map(file => ({
    url: file.path,
    filename: file.filename,
  }));
  campground.author = req.user.id;
  await campground.save();
  console.log('CAMPGROUND =>', campground);
  req.flash('success', 'Successfully made a new campground!');
  res.redirect(`/campgrounds/${campground.id}`);
};

module.exports.showCampground = async (req, res) => {
  const { id } = req.params;
  const campground = await CampGround.findById(id)
    .populate({
      path: 'reviews',
      populate: {
        path: 'author',
      },
    })
    .populate('author');

  if (!campground) {
    req.flash('error', 'Sorry! Cannot find that campground.');
    return res.redirect('/campgrounds');
  }
  res.render('campgrounds/show', { campground });
};

module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const campground = await CampGround.findById(id);

  if (!campground) {
    req.flash('error', 'Sorry! Cannot find that campground.');
    return res.redirect('/campgrounds');
  }

  res.render('campgrounds/edit', { campground });
};

module.exports.updateCampground = async (req, res) => {
  const { id } = req.params;

  const campground = await CampGround.findByIdAndUpdate(id, {
    ...req.body.campground,
  });
  req.flash('success', 'Successfully update a campground!');
  res.redirect(`/campgrounds/${campground.id}`);
};

module.exports.deleteCampground = async (req, res) => {
  const { id } = req.params;
  await CampGround.findByIdAndDelete(id);
  req.flash('success', 'Successfully delete a campground!');
  res.redirect('/campgrounds');
};
