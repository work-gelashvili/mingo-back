const cron = require('node-cron');
const { deletePreviousRides, addNewRide } = require('./controllers/CarsController');

const startDailyRideJob = () => {
  // შესრულდება ყოველდღე დილის 5 საათზე
  cron.schedule('0 5 * * *', async () => {
    try {
      console.log('🚗 Daily job started');

      await deletePreviousRides();

      await addNewRide({
        destination: 'Tbilisi', // შეგიძლია შეცვალო დინამიკურად
        passengers: 3,
        date: new Date(),
      });

      console.log('✅ Daily ride updated');
    } catch (error) {
      console.error('❌ Cron job error:', error);
    }
  });
};

module.exports = startDailyRideJob;