const mongoose = require('mongoose')

var CounterSchema = mongoose.Schema({
  _id: {type: String, required: true},
  seq: { type: Number, default: 0 }
});

var Counter = mongoose.model('counter', CounterSchema);


const urlShortSchema = mongoose.Schema({
  original: {
    type: String,
    required: true
  },
  short: {
    type: Number,
  }
})

urlShortSchema.pre('save', async function(next)  {
  var doc = this;
  try {
    let counter = await Counter.findById('urlShortId')
    if(!counter) {
      counter = Counter({ _id: 'urlShortId', seq: 0})
    }
    counter.seq = counter.seq + 1
    counter.save()

    doc.short = counter.seq
    next()
  }
  catch(err) {
    next(err)
  }
})

const UrlShort = mongoose.model('UrlShort', urlShortSchema)

module.exports = UrlShort