import express from 'express';
import axios from 'axios';
import cors from 'cors';
import path from "path"

const app = express();
const port = 3030;

app.use(cors());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set('view engine', 'ejs');


let products = [
  {
    id: 1,
    name: "Nike Air Max 90",
    description: "Classic sneaker with Air cushioning for comfort.",
    price: 129.99,
    category: 1,
    image: "airmax.jpeg"
  },
  {
    id: 2,
    name: "Adidas Superstar",
    description: "Iconic shell-toe sneaker with timeless style.",
    price: 89.99,
    category: 2,
    image: "adidast.jpeg"
  },
  {
    id: 3,
    name: "Converse Chuck Taylor All Star",
    description: "Canvas high-top sneaker for casual wear.",
    price: 59.99,
    category: 1,
    image: "converschuck.jpeg"
  },
  {
    id: 4,
    name: "Puma Cali",
    description: "Retro-style sneaker with a modern twist.",
    price: 79.99,
    category: 2,
    image: "pumacali.jpeg"
  },
  {
    id: 5,
    name: "New Balance 990",
    description: "Premium running shoe with superior cushioning.",
    price: 149.99,
    category: 1,
    image: "nb990.jpeg"
  },
  {
    id: 6,
    name: "Vans Old Skool",
    description: "Skateboarding shoe with signature side stripe.",
    price: 69.99,
    category: 2,
    image: "vansod.jpeg"
  },
  {
    id: 7,
    name: "Reebok Classic Leather",
    description: "Timeless leather sneaker with a sleek design.",
    price: 74.99,
    category: 1,
    image: "rebook.jpeg"
  },
  {
    id: 8,
    name: "Asics Gel-Kayano 27",
    description: "High-performance running shoe with stability features.",
    price: 159.99,
    category: 1,
    image: "asics.jpeg"
  },
  {
    id: 9,
    name: "Jordan 1 Retro High",
    description: "Legendary basketball shoe with iconic design.",
    price: 179.99,
    category: 2,
    image: "jordan1.jpeg"
  },
  {
    id: 10,
    name: "Skechers Go Walk 5",
    description: "Comfortable walking shoe with lightweight design.",
    price: 49.99,
    category: 1,
    image: "skechers.jpeg"
  },
];


let categories = [
  { id: 1, name: "Sneakers" },
  { id: 2, name: "Boots" },
  { id: 3, name: "Sandals" },
  { id: 4, name: "Heels" },
  { id: 5, name: "Flats" },
];

function getCategoryName(categoryId) {
  const category = categories.find(c => c.id === categoryId);
  return category ? category.name : 'Unknown Category';
}


app.get('/', (req, res) => {
  res.render('home', { products, });
});

app.get('/admin', (req, res) => {
  res.render('admin', { products, categories,getCategoryName  });
});

app.get('/products/:productName', (req, res) => {
  const productName = req.params.productName;
  const product = products.find(p => p.name === productName);

  if (product) {
    res.render('product', { product });
  } else {
   
    res.status(404).send('Product not found');
  }
});


app.get('/admin/add-product', (req, res) => {
  res.render('add-product', { categories });
});

app.post('/admin/add-product', (req, res) => {
  const { name, description, price, category, image } = req.body;
  const newProduct = {
    id: products.length + 1,
    name,
    description,
    price: parseFloat(price),
    category: parseInt(category),
    image
  };
  products.push(newProduct);
  res.redirect('/admin');
});

app.post('/admin/edit-product/:productId', async (req, res) => {
  const productId = req.params.productId;
  const { name, description, price, category, image } = req.body;
  try {
    products[productId - 1] = {
      id: productId,
      name,
      description,
      price: parseFloat(price),
      category: parseInt(category),
      image
    };
    res.redirect('/admin');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/admin/delete-product/:productId', async (req, res) => {
  const productId = req.params.productId;
  try {
    products.splice(productId - 1, 1);
    res.redirect('/admin');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/admin/add-category', (req, res) => {
  res.render('add-category');
});


app.post('/admin/add-category', (req, res) => {
  const { name } = req.body;

  categories.push({ name });
  res.redirect('/admin');
});


app.get('/admin/edit-category/:categoryId', (req, res) => {
  const categoryId = req.params.categoryId;

  const category = categories.find(cat => cat.id === categoryId);
  res.render('edit-category', { category });
});


app.post('/admin/edit-category/:categoryId', (req, res) => {
  const categoryId = req.params.categoryId;
  const { name } = req.body;
  
  const category = categories.find(cat => cat.id === categoryId);
  category.name = name;
  res.redirect('/admin');
});


app.get('/admin/delete-category/:categoryId', (req, res) => {
  const categoryId = req.params.categoryId;
  
  categories = categories.filter(cat => cat.id !== categoryId);
  res.redirect('/admin');
});




app.listen(port, () => {
    console.log(`Server pronto alla porta ${port}`);
  });
