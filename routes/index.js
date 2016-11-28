const express = require('express')
const router = express.Router()
var event = require('../models/event')
var coreFunctions = require('../core/functions')

var today = new Date();
var dd = today.getDate();
var mm = today.getMonth()+1;
var yyyy = today.getFullYear();

router.get('/', (req, res) => {
  if (req.isAuthenticated()) {
      res.redirect('/home')
  }else{
      res.render('index',
      {
        title: 'CloudWay network'
      }
    )
  }
})
router.get('/about', (req, res) => {
  res.render('about',
    {
      title: 'About CloudWay Network',
      dd: dd, mm: mm, yyyy: yyyy
    }
  )
})
router.get('/termsprivacy', (req, res) => {
  res.render('termsprivacy',
    {
      title: 'Terms & privacy'
    }
  )
})
router.get('/bugreport', (req,res) => {
  res.render('reportbug',
    {
      title: 'Report Bug'
    }
  )
})
router.get('/help', (req, res) => {
  res.render('help',
    {
      title: 'CloudWay Help'
    }
  )
})
module.exports = router
