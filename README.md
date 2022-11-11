# Full_Stack_Ecommerce_Site_Part_1

Step 1: Make two folders "frontend" and "backend"

Step 2: Inside backend create two files "app.js" and "server.js"

Step 3: Inside root directory open a terminal and type command, "npm init" and inside the entry point, type "backend/server.js"

Step 4: Install the packages "npm install mongoose express dotenv"


Step 5: Install the package "npm install nodemon"


Step 6: Setup the app.js file as

			const express = require("express");

			const app = express();

			module.exports = app;


Step 7: Setup the server.js file as
			const app = require("./app");

			app.listen(process.env.PORT, ()=>{
			    console.log(`Server is listening on http://localhost:${process.env.PORT}`);
			})

Step 8: Make a folder inside "backend" by the name "config" and inside config, make a file "config.env" and inside config.env type
			PORT=4000

Step 9: Import dotenv in "server.js" file as:

			const dotenv = require("dotenv")
			dotenv.config({path:"backend/config/config.env"})

Step 10: Add the following inside the "package.json" file, inside the "script" and here if we run start then it will open it in using node and if we run dev then it will open it using nodemon and we will use dev in the development mode but in the production mode we use node

			    "start": "node backend/server.js",
			    "dev": "nodemon backend/server.js"

Step 11: Make two folders inside the "backend" named "routes" and "controllers"

Step 12: Inside the "routes" make a new file "productRoute.js" and inside the "controllers", make a new file named "productController.js"

Step 13: Inside the "productController.js", type the following

			exports.getAllProducts = (req, res) => {
 			   res.status(200).json({message: "route is working fine"});
			}

Step 14: Inside the "productRoute.js", type the following

			const express = require("express");
			const { getAllProducts } = require("../controllers/productController");
			const router = express.Router();
			router.route("/products").get(getAllProducts);
			module.exports = router;

Step 15: Import the Route in your "app.js" file  and now your app.js file will look like the following:

			const express = require("express");
			const app = express();

			app.use(express.json());

			// Route Import
			const product = require("./routes/productRoute");

			app.use("/api/v1",product)

			module.exports = app;
			
Step 16: Now open the terminal and run the app in the dev mode by
			npm run dev

Step 17: Now go to the postman and make a new Collection named "Ecommerce"... Now click on the + option at the top left and make a get request to 
			http://localhost:4000/api/v1/products

	You'll see the message on the screen inside the postman that "server is working fine"

_______________________________Connecting Database______________________________________________________

Step 18: Create a folder inside "config", named "database.js"

Step 19: Write the following code inside "database.js"

			const mongoose = require("mongoose");

			const connectDatabase = ()=>{
			    mongoose.connect(process.env.DB_URI).then((data)=>{
			        console.log(`MongoDB connected with server: ${data.connection.host}`);
			    }).catch((err)=>{
			            console.log(err);
			        })
			}
			module.exports = connectDatabase;


Step 20: Import the database inside the "server.js"

			const connectDatabase = require("./config/database");

Step 21: Run the connectDatabase function

			connectDatabase();

______________________________________________models_________________________________________________________

Step 22: Make a new folder named "models" inside "backend" folder.

Step 23: Make a new file named "productModel.js" inside "models"

Step 24: Make a product Schema inside "productModels.js"

			const mongoose = require("mongoose");
			const productSchema = new mongoose.Schema({
			    name: {
			        type:String,
			        required:[true, "Please enter the name of product"],
			        trim:true
			    },
			    description: {
			        type: String,
			        required:[true, "Please enter the description of product"]
			    },
			    price: {
			        type: Number,
			        required:[true, "Please enter the price of product"],
			        maxLength:[8, "Price cannot exceed 8 characters"]
			    },
			    rating: {
			        type: Number,
			        default:0
			    },
			    images: [
			        {
			            public_id: {
			                type:String,
			                required:true
			            },
			            url: {
			                type:String,
			                required: true
			            }
			        }
			    ],
			    category: {
			        type: String,
			        required:[true, "Please enter product category"]
			    },
			    Stock: {
			        type: Number,
			        required: [true, "Please enter product stock"],
			        maxLength: [4, "Stock length cannot exceed 4 characters"],
			        default: 1
			    },
			    numOfReviews: {
			        type: Number,
			        default: 0
			    },
			    reviews: [
			        {
			            name: {
			                type: String,
			                required: true
			            },
			            rating: {
			                type: Number,
			                required: true
			            },
			            comment: {
			                type: String,
			                required: true
			            }
			        }
			    ],
			    createdAt: {
			        type: Date,
			        default: Date.now
			    }
			})

			module.exports = mongoose.model("Product", productSchema);

______________________________________________createProduct_________________________________________________________

Step 25: Go to the "productController.js" inside "controllers" and type the following

				// Create Product --- Admin
				
				exports.createProduct = async (req, res, next)=> {
				    const product = await Product.create(req.body);

				    res.status(201).json({
				        success: true,
				        product
				    })
				}

Step 26: Now the "productController.js" will be something like

				const Product = require("../models/productModel");
				// Create Product --- Admin

				exports.createProduct = async (req, res, next)=> {
				    const product = await Product.create(req.body);
				
				    res.status(201).json({
				        success: true,
			        product
			    })
			}
				// Get All Products
				exports.getAllProducts = async (req, res) => {
				    const products = await Product.find();
			
				    res.status(200).json(
				        {
				            success: true,
				            products
				        }
				    )
				}

Step 27: Add a new router inside "productRoute.js" 
				router.route("/product/new").post(createProduct);

______________________________________________Update Product_________________________________________________________

Step 28: Add the following in "productController.js" 

				// Update Product --- Admin

				exports.updateProduct = async (req, res, next) => {
				    let product = Product.findById(req.params.id);
				
				    if(!product){
				        return res.status(500).json({
				            success:false,
				            message: "Product not found"
				        })
				    }

				    product = await Product.findByIdAndUpdate(req.params.id, req.body,
			        {
			            new: true,
			            runValidators: true,
			            userFindandModify: false
				})

				    res.status(200).json({
				        success: true,
				        product
				    })
				}
______________________________________________Delete Product_________________________________________________________

Step 29: Add the following in "productController.js" 

				// Delete Product --- Admin

				exports.deleteProduct = async (req, res, next) => {
				    const product = await Product.findById(req.params.id);
		
				    if(!product){
				        return res.status(500).json({
				            success:false,
				            message: "Product not found"
				        })
				    }
		
				    await product.remove();
			
				    res.status(200).json({
				        success: true,
				        message: "Product Deleted successfully"
				    })
				}

_____________________________________________Get Product Details_____________________________________________

Step 30: Inside the "productController.js" type the following

				// Get Product Details
				exports.getProductDetails = async (req, res, next)=>{
				    const product = await Product.findById(req.params.id);

				    if(!product){
				        res.status(500).json({
				            success: false,
				            message: "Product not found"
				        })
				    }
			
				    res.status(200).json({
				        success: true,
				        product
				    })
				}

Step 31: Add the routes of the above insde the "productRoute.js" as
				router.route("/products").get(getAllProducts);
				router.route("/product/new").post(createProduct);
				router.route("/product/:id").put(updateProduct).delete(deleteProduct).get(getProductDetails);

