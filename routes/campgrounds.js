const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const CampGround = require('../models/campGround');

const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');

router.get(
  '/',
  catchAsync(async (req, res) => {
    const campgrounds = await CampGround.find({});
    res.render('campgrounds/index', { campgrounds });
  })
);

router.get('/new', isLoggedIn, (req, res) => {
  res.render('campgrounds/new');
});

router.post(
  '/',
  isLoggedIn,
  validateCampground,
  catchAsync(async (req, res, next) => {
    const campground = new CampGround(req.body.campground);
    campground.author = req.user.id;
    await campground.save();
    req.flash('success', 'Successfully made a new campground!');
    res.redirect(`/campgrounds/${campground.id}`);
  })
);

router.get(
  '/:id',
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await CampGround.findById(id)
      .populate({
        path: 'reviews',
        populate: {
          path: 'author',
        },
      })
      .populate('author');
    console.log(campground);

    if (!campground) {
      req.flash('error', 'Sorry! Cannot find that campground.');
      return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { campground });
  })
);

router.get(
  '/:id/edit',
  isLoggedIn,
  isAuthor,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await CampGround.findById(id);

    if (!campground) {
      req.flash('error', 'Sorry! Cannot find that campground.');
      return res.redirect('/campgrounds');
    }

    res.render('campgrounds/edit', { campground });
  })
);

router.put(
  '/:id',
  isLoggedIn,
  isAuthor,
  validateCampground,
  catchAsync(async (req, res) => {
    const { id } = req.params;

    const campground = await CampGround.findByIdAndUpdate(id, {
      ...req.body.campground,
    });
    req.flash('success', 'Successfully update a campground!');
    res.redirect(`/campgrounds/${campground.id}`);
  })
);

router.delete(
  '/:id',
  isAuthor,
  isLoggedIn,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await CampGround.findById(id);

    await CampGround.findByIdAndDelete(id);
    req.flash('success', 'Successfully delete a campground!');
    res.redirect('/campgrounds');
  })
);

module.exports = router;
