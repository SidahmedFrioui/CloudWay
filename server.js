const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const expressValidator = require('express-validator')
const exphbs  = require('express-handlebars')
const bodyParser = require('body-parser')
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const mongo = require('mongodb')
const mongoose = require('mongoose')

mongoose.connect('mongodb://sidahmed:11092000@ds119588.mlab.com:19588/cloudway')

var db = mongoose.connection
var User = require('./models/user')
var event = require('./models/event')
var routes = require('./routes/index')
var users = require('./routes/users')
var login = require('./routes/loggedin')
var coreFunctions = require('./core/functions')

const app = express();

app.set('views', path.join(__dirname, 'views'))
app.engine('handlebars', exphbs({defaultLayout: 'layout'}))
app.set('view engine', 'handlebars')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Cache-Control', 'no-cache')

    next()
})
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
app.use(session({
  secret: 'secret',
  saveUninitialized: true,
  resave: true
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']'
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    }
  }
}))
app.use(flash())
app.use(function(req, res, next){
  res.locals.success_msg = req.flash('success_msg')
  res.locals.error_msg = req.flash('error_msg')
  res.locals.error = req.flash('error')
  res.locals.user = req.user || null
  next()
})
app.use('/', routes)
app.use('/users', users)
app.use('/', login)

app.post('/register', (req, res) => {
  var usname = req.body.uname
  var em = req.body.mail
  var pass = req.body.psw
  var psw = req.body.pswc
  var fname = req.body.fname
  var sname = req.body.sname


  var newUser = new User({
    fname: fname,
    sname: sname,
    email: em,
    password: pass,
    username: usname
  })
  User.createUser(newUser, (err, user) => {
    if(err) throw err
    console.log(User)
    res.render('index')
  })
})
passport.use(new LocalStrategy(
  function(username, password, done) {
   User.getUserByUsername(username, function(err, user){
   	if(err) throw err
   	if(!user){
   		return done(null, false, {message: 'Unknown User'})
   	}

   	User.comparePassword(password, user.password, function(err, isMatch){
   		if(err) throw err
   		if(isMatch){
   			return done(null, user)
   		} else {
   			return done(null, false, {message: 'Invalid password'})
   		}
   	})
   })
  }))

passport.serializeUser(function(user, done) {
  done(null, user.id)
})

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user)
  })
})

app.post('/login',
  passport.authenticate('local', {successRedirect:'/home', failureRedirect:'/users/login',failureFlash: true}),
  function(req, res) {
    res.redirect('/')
  })

app.get('/logout', function(req, res){
	req.logout()

	req.flash('success_msg', 'You are logged out')

	res.redirect('/users/login')
});
app.post('/event:create', function(req, res){
  var title = req.body.title
  var content = req.body.content
  var uploader = req.user.fname + ' ' + req.user.sname
  var userr = req.user.username

  var newEvent = new event({
    title: title,
    content: content,
    uploader: uploader,
    user: userr
  })
  newEvent.save()
  if(res.local === '/events'){
    res.redirect('/events')
  }else{
    res.redirect('/myevents')
  }
})
app.post('/add:friend', (req, res) => {
  var first = req.user.username
  var second = 'wissem'
  first.friendRequest(second._id, function (err, request) {
    if (err) throw err;
    console.log('request', request)
  })
})
app.post('/search', (req, res) => {
  var firstname = req.body.fname
  var lastname = req.body.sname
  User.find({fname: firstname, sname: lastname}, function(err, user) {
    if (err) return console.error(err)
    res.render('users',
      {
        title: 'Search Result',
        users: user
      }
    )
  })
})
app.get('/myevents', (req, res) => {
  event.find({user: req.user.username}, function(err, events) {
    if (err) return console.error(err)
    res.render('myevents',
      {
        title: 'My Events',
        events: events
      }
    )
  }).sort({uptime: -1})
})
app.get('/friends', (req, res) => {
  User.find({username: req.user.username}, function(err, user) {
    if (err) return console.error(err)
    res.render('friends',
      {
        title: 'Friends',
        user: user
      }
    )
  })
})
app.get('/like/:id', (req,res) => {
  event.findOne({_id: req.params.id}, function(err, event) {
    if (err) return console.error(err)
    var likes = event.likes
    event.update({likes: likes + 1}, function(err, affected, resp) {
        res.json({event: likes + 1})
    })
  })
})
app.use(function(req, res, next){
  res.status(404)

  if (req.accepts('html')) {
    res.render('404', { url: req.url })
    return;
  }
  if (req.accepts('json')) {
    res.send({ error: 'Not found' })
    return;
  }
  res.type('txt').send('Not found')
})
app.set('port', (process.env.PORT || 3000))

app.listen(app.get('port'), () => {
  console.log('Server started on port ' + app.get('port'))
})
