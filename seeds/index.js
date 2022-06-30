const mongoose = require('mongoose');
const cities = require('./cities');
const {places , descriptors} = require('./seedHelpers');
const Campground = require('../models/campground');

mongoose.connect('mongodb://localhost:27017/yelp-camp')
.then(() => {
    console.log("Connection Open");
})
.catch(err => {
    console.log("Oh No! Error!!!");
    console.log(err);
});
const db = mongoose.connection;


const sample = array => array[Math.floor(Math.random()*array.length)];


const seedDB = async () => {
    await Campground.deleteMany({});
    for(let i=0; i<50; i++){
        const random1000 = Math.floor(Math.random()*1000);
        const random = Math.floor(Math.random()*30) + 10;
        const camp = new Campground({
            author: '62a8b5e21f47b4ef7639f7aa' ,
            location : `${cities[random1000].city} , ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}` ,
            description: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Minima totam consequatur corporis necessitatibus architecto incidunt animi rem, officia laborum eaque aut saepe quas, nam quasi molestias deleniti sequi aspernatur illo.' ,
            price: random ,
            image:  [
                {
                  url: 'https://res.cloudinary.com/pritcloud/image/upload/v1655475809/YelpCamp/nbbwdjrgb3lb8rruk076.png',
                  filename: 'YelpCamp/nbbwdjrgb3lb8rruk076',
                },
                {
                  url: 'https://res.cloudinary.com/pritcloud/image/upload/v1655475809/YelpCamp/vekgbdjoctpnnmtul87e.jpg',
                  filename: 'YelpCamp/vekgbdjoctpnnmtul87e',
                }
              ],
            
        })
        await camp.save();
    }
}

seedDB().then( () => {
    mongoose.connection.close();
});