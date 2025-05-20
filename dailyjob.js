const cron = require("node-cron");
const { deletePreviousRides, addNewRide } = require("./controllers/CarsController");

const startDailyJob = () => {
  cron.schedule("0 5 * * *", async () => {
    console.log("🚗 Daily job started...");

    await deletePreviousRides();

    await addNewRide({
      driver_name: "Generated Driver",
      plate: "AA-123-BB",
      direction_from: "tbilisi",
      direction_to: "batumi",
      seat_count: 12,
    });

    console.log("✅ Daily car ride updated");
  });
};

module.exports = startDailyJob;
