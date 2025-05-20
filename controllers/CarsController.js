const CarModel = require("../models/CarModel");
const SeatsModel = require("../models/SeatsModel");


const useDateFormat = (date) => {
  let itemDate = new Date(date)

  const dateFormat = {
      getMonth: () => {
          let month = itemDate.getMonth() + 1
          return month < 10 ? '0' + month : month
      },
      getDate: () => {
          let date = itemDate.getDate()
          return date < 10 ? '0' + date : date
      },
      getHours: () => {
          let horse = itemDate.getHours()
          return horse < 10 ? '0' + horse : horse
      },
      getMinutes: () => {
          let minutes = itemDate.getMinutes()
          return minutes < 10 ? '0' + minutes : minutes
      },
      getYear: () => {
          let year = itemDate.getFullYear()
          return year
      }
  } 

  return dateFormat
}

const getCars = async (req, res) => {
  try {
    const { from, to, getDate } = req.query;

    if (from && to && getDate) {
      const cars = await CarModel.find({
        direction_from: from,
        direction_to: to,
        getDate: getDate,
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
    console.log(error)
    return res.status(500).send("Something went wrong while getting cars!");
  }
};

const createCar = async (req, res) => {
  try {
    const seats = [];

    const {
      driver_name,
      date,
      getDate,
      getTime,
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
      getDate: date && `${useDateFormat(date).getDate()}-${useDateFormat(date).getMonth()}`,
      getTime: date && `${useDateFormat(date).getHours()}:${useDateFormat(date).getMinutes()}`,
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



// ✅ წაშლის ყველა წინა დღის მგზავრობას
const deletePreviousRides = async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  await CarModel.deleteMany({ createdAt: { $lt: today } });
};

// ✅ ამატებს ახალ მგზავრობას
const addNewRide = async (rideData = {}) => {
  const {
    driver_name = "Default Driver",
    plate = "XX-000-XX",
    direction_from = "Tbilisi",
    direction_to = "Batumi",
    seat_count = 10,
  } = rideData;

  const seats = Array.from({ length: seat_count }, (_, i) =>
    new SeatsModel({ seat_id: i + 1 })
  );

  const now = new Date();
  const format = useDateFormat(now);

  const car = new CarModel({
    driver_name,
    plate,
    direction_from,
    direction_to,
    seats,
    seat_count,
    date: now,
    getDate: `${format.getDate()}-${format.getMonth()}`,
    getTime: `${format.getHours()}:${format.getMinutes()}`,
  });

  await car.save();
};


module.exports = {
  deletePreviousRides,
  addNewRide,
  getCars,
  createCar,
  reserveSeat,
  deleteReserve,
};
