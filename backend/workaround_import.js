const mongoose = require('mongoose');
const CurrencyDataSet = require('./models/currencyDataSet'); // Sostituisci con il percorso al tuo modello Mongoose

// Stabilisci la connessione al database MongoDB.
mongoose.connect('mongodb://localhost:27017/fx', { useNewUrlParser: true, useUnifiedTopology: true });

const removeDuplicateCandles = async (documentId) => {
  try {
    // Esegui la query di aggregazione solo sul documento con l'ID specificato.
    const duplicates = await CurrencyDataSet.aggregate([
      { $match: { _id: mongoose.Types.ObjectId(documentId) } },
      { $unwind: "$candles" },
      { $group: {
          _id: "$candles.time",
          docId: { $first: '$_id' }, // Questo assicura che il docId sia preservato per riferimenti futuri.
          ids: { $push: "$candles._id" }
        }
      },
      { $match: { 'ids.1': { $exists: true } } } // Match solo se c'è più di un ID (indicando duplicati)
    ]);

    // Per ogni gruppo di duplicati, rimuovi i duplicati eccetto il primo.
    for (const duplicate of duplicates) {
      await CurrencyDataSet.updateOne(
        { _id: duplicate.docId },
        { $pull: { candles: { _id: { $in: duplicate.ids.slice(1) } } } }
      );
    }
  } catch (err) {
    console.error("An error occurred:", err);
  }
};

// Sostituisci 'yourDocumentId' con l'ID del documento che vuoi processare.
removeDuplicateCandles('6546ae9bc563465666ab0a37').then(() => {
  console.log('Duplicate candles have been removed');
  // Chiudi la connessione una volta che la promessa è risolta.
  mongoose.disconnect();
});
