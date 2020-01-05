var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();

var Superhero = require('../models/superhero')
var Dialpad = require('../models/dialpad')

// var db = require('../db/db')

/* GET home page. */
router.get('/', function (req, res) {
  res.send('No data to show here!')
});


//Get the list of superheros
router.get('/get-superheros', function (req, res) {

  Superhero.find(
    function (err, result) {
      if (err) {
        // console.log('err', err);
        res.send(err);
      } else {
        res.send(result)
        // console.log('result', result);
      }
    }
  );
})


//For adding a superhero
router.post('/add-superhero', function (req, res) {
  console.log(req.query); console.log(req.body);

  const superhero = new Superhero({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name
  })

  superhero.save(function (err, result) {
    if (err) {
      res.send({ data: 'Error while adding Hero!', error: err })
    }

    console.log(result);
    res.send(result)
  })
})

//For adding a dialpad value
router.post('/set-dialpad', function (req, res) {
  console.log(req.query);
  console.log(req.body);

  const dialpad = new Dialpad({
    _id: new mongoose.Types.ObjectId(),
    number: req.body.number,
    values: req.body.values
  })

  dialpad.save(function (err, result) {
    if (err) {
      console.log(err)
      res.send(err)
    }

    console.log(result);
    res.send(result)
  })
})

//Getting the dialpad
router.get('/get-dialpad', function (req, res) {

  Dialpad.find(
    function (err, result) {
      if (err) {
        console.log('err', err);
        res.status(404).json(err);
      } else {
        res.send(result)
      }
    }
  );
});

router.get('/call-superhero', function (req, res) {

  // console.log('QUERY: ', JSON.parse(req.query.expression))
  const numArr = req.query.number.toString().split('');
  const valueArr = req.query.values.split(',');
  console.log(valueArr)
  let superheros = [];
  let dialpadValue = valueArr[0].split('');
  // console.log('numArr', numArr)

  let query = []
  for (let value of dialpadValue) {
    query.push({ name: { $regex: '^' + value } })
  }
  Superhero.find({ $or: query }, function (err, docs) {
    if (err) {
      console.log(err)
      res.status(404).json({ err: 'Cannot find any superheros' })

    } else {
      superheros = validSuperhero(docs, valueArr)
      res.send(superheros);
    }
  });

});

function validSuperhero(superheros, expression) {
  let validSuperheros = [];
  for (let hero of superheros) {
    let herofound;
    // console.log(hero.name.length, expression.length)
    if (hero.name.length == expression.length) {
      for (let i = 0; i < expression.length; i++) {
        if (expression[i].includes(hero.name.charAt(i))) {
          if (herofound === undefined) {
            herofound = true;
          }
        } else {
          herofound = false;
        }
      }
    }
    else {
      herofound == false;
    }

    if (herofound == true) {
      console.log("HERO FOUND!!!", hero.name);
      validSuperheros.push(hero.name)
    }
  }

  return validSuperheros;
}
module.exports = router;
