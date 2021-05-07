const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const CampGround = require("../models/campGround");
const { campgroundSchema } = require("../schemaValidation");

const validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

router.get(
  "/",
  catchAsync(async (req, res) => {
    const campgrounds = await CampGround.find({});
    res.render("campgrounds/index", { campgrounds });
  })
);

router.get("/new", (req, res) => {
  res.render("campgrounds/new");
});

router.post(
  "/",
  validateCampground,
  catchAsync(async (req, res, next) => {
    const campground = new CampGround(req.body.campground);
    await campground.save();
    req.flash("success", "Successfully post a new campground!");
    res.redirect(`/campgrounds/${campground.id}`);
  })
);

router.get(
  "/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await CampGround.findById(id).populate("reviews");
    res.render("campgrounds/show", { campground });
  })
);

router.get("/:id/edit", async (req, res) => {
  const { id } = req.params;
  const campground = await CampGround.findById(id);
  res.render("campgrounds/edit", { campground });
});

router.put(
  "/:id",
  validateCampground,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await CampGround.findByIdAndUpdate(id, {
      ...req.body.campground,
    });
    req.flash("success", "Successfully update a campground!");
    res.redirect(`/campgrounds/${campground.id}`);
  })
);

router.delete(
  "/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await CampGround.findByIdAndDelete(id);
    req.flash("success", "Successfully delete a campground!");
    res.redirect("/campgrounds");
  })
);

module.exports = router;
