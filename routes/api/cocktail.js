const express = require('express');
const router = express.Router();
const db = require('../../database');

router.get('/', (req, res) => {
  db.select().from('cocktails').orderBy('id').then(data => {
    res.send(data);
  })
});

router.post('/', (req, res) => {
  console.log(req.body);
  db.insert(req.body).returning('*').into('cocktails').then(data => {
    res.send(data);
  })
});

router.patch('/:id', (req,res) => {
  db('cocktails').where({id: req.params.id}).update(req.body).returning('*').then(data => {
    res.send(data);
  });
});

router.put('/:id', (req,res) => {
  db('cocktails').where({id: req.params.id}).update({
    title: req.body.title || null,
    description: req.body.description || null,
    price: req.body.price || 0,
    image_path: req.body.image_path || "https://storage.googleapis.com/vfruits-293408.appspot.com/cocktails/cocktail.webp",
    ingredients: req.body.ingredients || null
  }).returning('*').then(data => {
    res.send(data);
  });
});

router.delete('/:id', async (req, res) => {
  db('cocktails').where({id: req.params.id}).del().then(() => {
    res.json({success: true});
  })
});

router.get('/:id', async (req, res) => {
  db('cocktails').where({id: req.params.id}).select().then(data => {
    res.send(data);
  })
})

module.exports = router;