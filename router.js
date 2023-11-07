const {
  getCars,
  createCar,
  reserveSeat,
  deleteReserve,
} = require("./controllers/CarsController");

const router = require("express").Router();

router.get("/", (req, res) => {
  res.send("Welcome to Directions API");
});

router.get("/cars", getCars);
router.post("/cars", createCar);
router.patch("/cars/reserve-seat", reserveSeat);
router.patch("/cars/delete-reserve", deleteReserve);

module.exports = router;
