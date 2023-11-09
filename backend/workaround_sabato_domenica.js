const moment = require('moment');
const Pair = require('./models/currencyDataSet');
const { Decimal128, ObjectId } = require('mongodb');// Assumi che Pair sia il modello Mongoose per la tua collection

  // Imposta la tua data di fine

    const createCandle = async (daysToSubtract, currentDate) => {

    const previousDay = currentDate.clone().subtract(daysToSubtract, 'days');
    const formattedDateStart = previousDay.toISOString().split('T')[0];
    const fullDate = formattedDateStart + 'T00:00:00.000Z';
    const nextDay = new Date(new Date(fullDate).getTime() + 24 * 60 * 60 * 1000);
    const nextFullDate = nextDay.toISOString();
    console.log(currentDate, previousDay, currentDate.day(),  nextFullDate);

    

    const previousCandle = await Pair.findOne({
      "candles.time": {
        $gte: previousDay.startOf('day').toDate(),
        $lt: previousDay.endOf('day').toDate(),
      },
    });

  
    if (previousCandle) {
      const newCandle = {
        complete: true,
        volume: 0,
        time: currentDate.toDate(),
        ask: previousCandle.candles[0].ask,
        _id: new ObjectId(),
      };
  /*
       Pair.updateOne(
        { _id: Pair._id },
        { $push: { candles: newCandle } }
      ).then(() => {
        console.log(`Nuova candle aggiunta con time: ${newCandle.time}`);
      }).catch((err) => {
        console.error('Errore:', err);
      });
      */
    }
    

  }
  
  async function addCandles() {
    const startDate = moment('2013-01-01');
    const endDate = moment('2013-01-10');

  
    for (let currentDate = startDate.clone(); currentDate.isSameOrBefore(endDate); currentDate.add(1, 'days')) {
      
      console.log(`Il giorno corrente ${currentDate.format('YYYY-MM-DD')}`);

      if (currentDate.day() === 6) {
      createCandle(1, currentDate);
      } else if(currentDate.day() === 0){
        createCandle(2, currentDate);
      }

      /*
      if (currentDate.day() === 6) {
        // Sabato: Prendi il valore ask del giorno precedente (venerdì)
         createCandle(1, currentDate);
      } else if (currentDate.day() === 0) {
        // Domenica: Prendi il valore ask del secondo giorno precedente (venerdì)
         createCandle(2, currentDate);
      }
      */

    }
  }
  
  addCandles().then(() => {
    console.log('Tutte le nuove candle sono state aggiunte con successo.');
  }).catch((err) => {
    console.error(err);
  });


