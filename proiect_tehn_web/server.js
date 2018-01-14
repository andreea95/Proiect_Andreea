var express = require('express')
var cors = require('cors')
var bodyParser = require('body-parser')
var	Sequelize = require('sequelize')

var app = express()

app.use(express.static(__dirname + '/app')) //creaza un server Express
app.use(cors())//Cross-origin resource sharing (CORS) 
// CORS- e un mecanism care permite resurselor restrctionate dintr-o pag web sa fie cerute de un domeniu din afara domeniului pe provenieta al resurselor
app.use(bodyParser.json())

var	sequelize = new Sequelize('nodespa', 'root', '', { dialect : 'mysql', port : 3306}) 
//sequelize e un ORM(Object-relational mapping) pt node.js si io.js. Suporta Mysql, SQLLite etc.
//ORM- creaza  "virtual object database"
var Persoana = sequelize.define('persons', {
	
	nume : {
		type : Sequelize.STRING,
			validate : { len : [3,15] },
				allowNull: false
	},
	
	prenume : {
		type : Sequelize.STRING,
			validate : { len : [3,30] },
				allowNull: false
	},
	
	email : {
		type : Sequelize.STRING,
			validate : { isEmail:true }
	},
	
	telefon : {
		type : Sequelize.STRING,
			validate : { len : [7,30] }		
	}
	
	
})

var Contact = sequelize.define('contacts',{
	
	telefon_secundar : {
		type : Sequelize.STRING,
			validate : { len : [10,13] },
				allowNull: false
	},
	
	notite: {
		type : Sequelize.TEXT,
			validate : { len : [5, 1000] },
				allowNull: false
	},
	

	
})

Persoana.hasMany(Contact, {foreignKey : 'persoanaId'} ) // a...
Contact.belongsTo(Persoana, {foreignKey : 'persoanaId'} )

app.get('/create', function(req, res){                  //----------creare entitati------------
	sequelize
		.sync({ force: true })
		.then(function(){ res.status(201).send('created') })
		.catch(function(error) {
			console.warn(error)
				res.status(500).send('not created')
		})
})

app.get('/persoane', function(req, res) {
	Persoana
		.findAll({attributes : ['id','nume','prenume','email','telefon']})
		.then(function(persoana1i){
			res.status(200).send(persoana1i)
		})
		.catch(function(error){
			console.warn(error)
				res.status(500).send('not created')
		})
})

app.get('/persoane/:id', function(req, res) {
	var id = req.params.id
		Persoana
			.find({where : {id : id},attributes : ['id','nume','prenume','email','telefon'] })
			.then(function(persoana1) { res.status(200).send(persoana1) })
			.catch(function(error) {
				console.warn(error)
					res.status(500).send('not created')
			})
})

app.post('/persoane',function(req, res){              
	Persoana
		.create(req.body)
		.then(function(){
			res.status(201).send('created')
		})
		.catch(function(error){
			console.warn(error)
			res.status(500).send('not created')
		})
})

app.put('/persoane/:id',function(req, res) {               
	var id = req.params.id
	Persoana
		.find({where : {id : id}})
		.then(function(persoana1) {
			return persoana1.updateAttributes(req.body)
		})
		.then(function(){
			res.status(201).send('updated')
		})
		.catch(function(error) {
			console.warn(error)
			res.status(500).send('not created')
		})
})

app.delete('/persoane/:id',function(req,res){
	var id = req.params.id
	Persoana
		.find({where : {id : id}})
		.then(function(persoana1){
			persoana1.destroy()
		})
		.then(function(){
			res.status(201).send('updated')
		})
		.catch(function(error){
			console.warn(error)
			res.status(500).send('not created')
		})
})

app.get('/persoane/:id/contact_info', function(req,res) { 
	var id = req.params.id
	Persoana
		.find({where : {id : id}, include : [Contact]})
		.then(function(persoana1){
			return persoana1.contacts
		})
		.then(function(contact_info1){
			console.warn(contact_info1)
			res.status(200).send(contact_info1)
		})
		.catch(function(error){
			console.warn(error)
			res.status(500).send('error')
		})
})

app.post('/persoane/:id/contact_info', function(req, res) {
	var id = req.params.id
	Persoana
		.find({where : {id : id}})
		.then(function(persoana1){
			return Contact.create({
				telefon_secundar : req.body.telefon_secundar,
				notite : req.body.notite,
				// stil : req.body.stil,
				// onomastica : req.body.onomastica,
				// porecla : req.body.porecla,
		persoanaId : persoana1.id
			})
		})
		.then(function() { res.status(201).send('created') })
		.catch(function(error){
			console.warn(error)
				res.status(500).send('error')
		})
})

app.put('/persoane/:id/contact_info/:mId', function(req, res) {
	var mId = req.params.mId
	Contact
		.find({where : {id : mId}})
		.then(function(contacts){
				contacts.telefon_secundar = req.body.telefon_secundar
				contacts.notite = req.body.notite
				// contacts.stil = req.body.stil
				// contacts.onomastica = req.body.onomastica
				// contacts.porecla = req.body.porecla

			return contacts.save(['body','content'])
		})
		.then(function(){
			res.status(201).send('updated')
		})
		.catch(function(error){
			console.warn(error)
			res.status(500).send('not created')
		})
})

app.delete('/persoane/:id/contact_info/:mId', function(req, res) {
	var mId = req.params.mId
	Contact
		.find({where : {id : mId}})
		.then(function(contacts){
			contacts.destroy()
		})
		.then(function(){
			res.status(201).send('deleted')
		})
		.catch(function(error){
			console.warn(error)
			res.status(500).send('not created')
		})
})

app.listen(8080)