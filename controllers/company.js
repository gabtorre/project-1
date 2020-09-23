/* External mudules */
const express = require('express');
const router = express.Router();
const db  = require('../models');
const session = require('express-session')

const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
const fullMonths = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];


// Index Route
router.get('/', (req, res)=>{
    
  db.Company.find({}, (error , foundCompanies)=>{
      if(error){
          return res.send(error)
      }else{
        const context = {companies: foundCompanies ,
            // session current user after login 
            user: req.session.currentUser}
         
        res.render('./company/index.ejs', context)
       
      }
  } )  
})



// New Route
router.get('/new', (req, res)=>{
    res.render('./company/new.ejs', {user: req.session.currentUser})
  })



// Post Route
router.post('/' , (req, res)=>{
    db.Company.create(req.body, (error, companyCreated)=>{
        if(error){
            return res.send(error)
        }else{
            res.redirect('/company')
        }
    })
})


// Show Route
router.get('/:id', async (req, res) => {
    try {
        const foundCompany = await db.Company.findById(req.params.id);
        const foundBookings = await db.Booking.find({'company': req.params.id})

        res.render('./company/show.ejs', {
            company: foundCompany,
            bookings: foundBookings,
            user: req.session.currentUser, // session current user after login 
            days: days,
            months: months,
            fullMonths: fullMonths
        })
        
    } catch (error) {
        console.log(error);
        res.send({ message: "Internal server error" });
    }
});



// Admin Route
router.get('/:id/admin', async (req, res) => {
    try {
        const foundCompany = await db.Company.findById(req.params.id);
        const foundBookings = await db.Booking.find({ 'company': req.params.id }).populate('user').exec();

        res.render('./company/admin.ejs', {
            company: foundCompany,
            bookings: foundBookings,
            user: req.session.currentUser // session current user after login 
        })
        
    } catch (error) {
        console.log(error);
        res.send({ message: "Internal server error" });
    }
});



// Edit Route
router.get('/:id/edit', (req, res)=>{
    db.Company.findById(req.params.id, (error, foundCompany)=>{
        if(error){
            return res.send(error)
        }else{
            const context = {company: foundCompany , user: req.session.currentUser}
            res.render('./company/edit.ejs' , context)
        }
    })
})



// Put Route 
router.put('/:id', (req, res)=>{
    db.Company.findByIdAndUpdate(req.params.id, req.body, {new: true}, (error, infoUpdated)=>{
        if(error){
           return res.send(error)
        }else{
            res.redirect(`/company/${infoUpdated._id}`)
        }
    })
})



// Delete Route
router.delete('/:id', (req , res)=>{
    db.Company.findByIdAndDelete(req.params.id, (error, companyDeleted)=>{
        if(error){
            return res.send(error)
        }else{
            res.redirect('/company')
        }
    })
})



module.exports = router;