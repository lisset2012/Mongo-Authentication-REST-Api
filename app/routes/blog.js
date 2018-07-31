const Art = require('./models/article');

module.exports = funtion(app){

    app.get('/find_art_title/:art_title', funtion(err,res){
        // To find multiple documents
        Art.find({art_title: 'art_title' }, function( err, results) { 
            // handle the err
            //do something with result
        })
    });

    

// To find only one document
Art.findOne({someKey: 'the value' }, function( err, results) { 
	// handle the err
	//do something with result
})

// To update document
Art.update({
	someKey: 'the value' 
}, {
	$set: {
		someOtherKey
	}
}, {new: true}, // this is to make sure we get the updated document
function( err, newresult) { 
	// handle the err
	//do something with newresult
})

// To remove document
Art.remove({someKey: 'the value' }, function( err, results) { 
	// handle the err
	//do something with result
})
}
}