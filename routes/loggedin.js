const express = require('express')
const router = express.Router()
var event = require('../models/event')
var user = require('../models/user')
var coreFunctions = require('../core/functions')


var today = new Date();
var dd = today.getDate();
var mm = today.getMonth()+1; //January is 0!
var yyyy = today.getFullYear();

router.get('/home', coreFunctions.ensureAuthenticated, (req, res) =>{
  event.find(function (err, events) {
  if (err) return console.error(err);
  res.render('dash',
    {
       title: 'Home',
       dd: dd, mm: mm, yyyy: yyyy,
       events: events
    }
  )
  }).sort({uptime: -1})
})
router.get('/publications', coreFunctions.ensureAuthenticated, (req, res) => {
  event.find(function (err, events) {
  if (err) return console.error(err);
    res.render('publications',
      {
        title: 'Publications',
         dd: dd, mm: mm, yyyy: yyyy,
         events: events
      }
    )
  }).sort({uptime: -1})
})
router.get('/users', coreFunctions.ensureAuthenticated, (req, res) => {
  user.find(function (err, users) {
    if (err) return console.error(err)
    res.render('users',
      {
        title: 'Users',
        users: users
      }
    )
  })
})
router.get('/groups', coreFunctions.ensureAuthenticated, (req, res) => {
  res.render('groups',
    {
      title: 'Groups'
    }
  )
})
router.get('/myfriends', coreFunctions.ensureAuthenticated, (req, res) => {
  user.find(function (err, users) {
      res.render('myfriends',
        {
          title: 'My Friends',
          friend: users.friends
        }
      )
  })
})
router.get('/settings', coreFunctions.ensureAuthenticated, (req, res) => {
  res.render('settings',
    {
      title: 'Account Settings'
    }
  )
})
router.get('/myphotos', coreFunctions.ensureAuthenticated, (req, res) => {
  res.render('myphotos',
    {
      title: 'My Photos'
    }
  )
})
router.get('/mygroups', coreFunctions.ensureAuthenticated, (req, res) => {
  res.render('mygroups',
    {
      title: 'My Groups'
    }
  )
})
router.get('/requests', coreFunctions.ensureAuthenticated, (req, res) => {
  res.render('requests',
    {
      title: 'Requests'
    }
  )
})
router.get('/messages', coreFunctions.ensureAuthenticated, (req, res) => {
  res.render('messages',
    {
      title: 'Messages'
    }
  )
})
router.get('/notifications', coreFunctions.ensureAuthenticated, (req, res) => {
  res.render('notifications',
    {
      title: 'Notifications'
    }
  )
})
router.get('/viewprofile/:id', coreFunctions.ensureAuthenticated, (req, res) => {
  user.findOne({_id: req.params.id}, function(err, userr) {
    event.find({user: userr.username}, function(err, eventss) {
      res.render('viewprofile',
        {
          title: userr.fname + ' ' + userr.sname,
          userr: userr,
          eventss: eventss
        }
      )
    })
  })
})
router.get('/delete/:id', coreFunctions.ensureAuthenticated, (req, res) => {
  event.findOne({_id: req.params.id}, function(err, eventt) {
    eventt.remove({}, function(err, removed) {
      res.redirect('/myevents')
    })
  })
})
module.exports = router
