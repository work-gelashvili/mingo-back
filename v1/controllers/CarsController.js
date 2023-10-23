const CarModel = require("../models/CarModel");
const SeatsModel = require("../models/SeatsModel");

const getCars = async (req, res) => {
  try {
    const { from, to } = req.query;

    if (from && to) {
      const cars = await CarModel.find({
        direction_from: from,
        direction_to: to,
      });

      return res.status(200).send(cars);
    }

    if (from) {
      const cars = await CarModel.find({
        direction_from: from,
      });

      return res.status(200).send(cars);
    }
    if (to) {
      const cars = await CarModel.find({
        direction_to: to,
      });

      return res.status(200).send(cars);
    }

    const cars = await CarModel.find();

    return res.status(200).send(cars);
  } catch (error) {
    return res.status(500).send("Something went wrong while getting cars!");
  }
};

const createCar = async (req, res) => {
  try {
    const seats = [];

    const {
      driver_name,
      date,
      direction_from,
      direction_to,
      plate,
      seat_count,
    } = req.body;

    for (let i = 0; i < seat_count; i++) {
      const seat = new SeatsModel({
        seat_id: i + 1,
      });

      seats.push(seat);
    }

    const car = new CarModel({
      seats,
      driver_name,
      date: date ? date : new Date(),
      direction_from,
      direction_to,
      plate,
      seat_count,
    });

    const cars = await car.save();

    return res.status(200).send(cars);
  } catch (error) {
    return res.status(500).send("Something went wrong while creating car!");
  }
};

const reserveSeat = async (req, res) => {
  try {
    const { car_id, seat_id } = req.query;

    const car = await CarModel.findById(car_id);

    if (!car) {
      return res.status(404).send("No car found!");
    }

    const seat = car.seats.filter((seat) => seat.seat_id === Number(seat_id));

    if (seat.length < 1) {
      return res.status(404).send("No seat found!");
    }

    if (seat[0].reserved === true) {
      return res.status(409).send("Seat has already been reserved!");
    }

    const foundedSeatIndex = car.seats.findIndex(
      (car) => car.seat_id === Number(seat_id)
    );

    const foundedSeat = (car.seats[foundedSeatIndex].reserved = true);

    await CarModel.findOneAndUpdate(
      { _id: car_id },
      {
        $set: {
          seats: car.seats,
        },
      },
      { new: true }
    );

    return res.status(200).send("Car seat has been reserved!");
  } catch (error) {
    return res.status(500).send("Something went wrong while creating car!");
  }
};

const deleteReserve = async (req, res) => {
  try {
    const { car_id, seat_id } = req.query;

    const car = await CarModel.findById(car_id);

    if (!car) {
      return res.status(404).send("No car found!");
    }

    const seat = car.seats.filter((seat) => seat.seat_id === Number(seat_id));

    if (seat.length < 1) {
      return res.status(404).send("No seat found!");
    }

    const foundedSeatIndex = car.seats.findIndex(
      (car) => car.seat_id === Number(seat_id)
    );

    const foundedSeat = (car.seats[foundedSeatIndex].reserved = false);

    await CarModel.findOneAndUpdate(
      { _id: car_id },
      {
        $set: {
          seats: car.seats,
        },
      },
      { new: true }
    );

    return res.status(200).send("Reserve has been deleted!");
  } catch (error) {
    return res.status(500).send("Something went wrong while creating car!");
  }
};

module.exports = {
  getCars,
  createCar,
  reserveSeat,
  deleteReserve,
};
