const fs = require ('fs');
const express = require ('express');
const morgan = require('morgan');

const app = express();

//1.Middleware
app.use(morgan('dev'));
app.use(express.json()); 

//Middleware
app.use((req,res,next)=>{
  console.log('Hello from the middleware');
  next();
})

//Middleware
app.use((req, res, next)=>{
  req.requestTime = new Date().toISOString();
  next();
});

// app.get('/', (req, res) => {
//     res
//       .status(200)
//       .json({ message: 'Hello from the server side!', app: 'natours' });
//   });
  
//   app.post('/', (req, res) => {
//     res.send('You can post to this endpoint...');
//   });
  
const tours =JSON.parse(
    fs.readFileSync(`${__dirname}/4-natours/after-section-06/dev-data/data/tours-simple.json`)
);

//2 Route Handlers

const getAllTours = (req, res)=>{
  console.log(req.requestTime);
  res.status(200).json({
      status: 'succes',
      requestedAt: req.requestTime,
      results: tours.length,
      data:{
          tours
      }
  });
};

const getTour =(req, res)=>{
  console.log(req.params);
  
  const id = req.params.id*1; //it is a trick to convert string into number
  
  const tour =tours.find(el => el.id === id); //find the tours by id. we used java .find method for array
  
  
  // if (id>tours.length)  
  if (!tour)
  {
    return res.status(404).json(
      {
        status:'fail',
        message: 'Invalid ID'
      }
    );
  }
  
  
  res.status(200).json({
      status: 'succes',
      data:{
          tours: tour
      }
  });
}

const createTour = (req, res) => {
  // console.log(req.body);
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);
  fs.writeFile(`${__dirname}/4-natours/after-section-06/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour
      }
    });
  });
}

const updateTour =(req, res)=>{
  console.log(req.body);
  if (req.params.id * 1 > tours.length){return res.status(404).json({
      status:'fail',
      message: 'Invalid ID'
    });
  }
  
  res.status(200).json({
    status: 'success',
    data: {
      tour: 'Updated tour here...',
    },
  });
}

const deleteTour=(req, res)=>{
  console.log(req.body);
  if (req.params.id * 1 > tours.length){return res.status(404).json({
      status:'fail',
      message: 'Invalid ID'
    });
  }
  
  res.status(204).json({
    status: 'success',
    data: null,
  });
};

const getAllUsers = (req,res)=>{
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!'
  })
};

const getUser = (req,res)=>{
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!'
  })
};

const createUser = (req,res)=>{
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!'
  })
};

const updateUser = (req,res)=>{
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!'
  })
};

const deleteUser = (req,res)=>{
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!'
  })
};



// app.get('/api/v1/tours', getAllTours);
// app.get('/api/v1/tours/:id', getTour);
// app.post('/api/v1/tours', createTour);
// app.patch('/api/v1/tours/:id', updateTour );
// app.delete('/api/v1/tours/:id', deleteTour);
  
//3. Routes


const tourRouter = express.Router();
const userRouter = express.Router();

tourRouter
.route('/')
.get(getAllTours)
.post(createTour);

tourRouter
.route('/:id')
.get(getTour)
.patch(updateTour)
.delete(deleteTour);

userRouter
.route('/')
.get(getAllUsers)
.post(createUser);

userRouter
.route('/:id')
.get(getUser)
.patch(updateUser)
.post(createUser);

app.use('/api/v1/tours', tourRouter); //this middleware will run tourRouter

app.use('/api/v1/users', userRouter);

//4. Start Server
const port = 3000;
app.listen(port, ()=> {
    console.log(`App running on port ${port}...`);
});
