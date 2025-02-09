const express = require('express');
const path = require('path');
const Products = require('./database/data.js');
const methodOverride = require('method-override');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public'))); 
app.use(methodOverride('_method'));


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
    res.send('Server is running!');
});


app.get('/product/new', (req, res) => {
    res.render('addProduct');
});

app.post('/product', (req, res) => {
    const { productName, category, price } = req.body;

    const newProduct = {
        id: Products.length + 1,
        productName,
        category,
        price
    };

    Products.push(newProduct);
    console.log("Product Added:", newProduct);
    res.redirect('/products/show');
});


app.get('/products/show', (req, res) => {
    res.render('ShowProduct', { Products });
});


app.delete('/product/delete/:id', (req, res) => {
    const pid = req.params.id;
    const productIndex = Products.findIndex((u) => u.id == pid);

    if (productIndex !== -1) {
        Products.splice(productIndex, 1);
        console.log(`Product with ID ${pid} deleted.`);
    }

    res.redirect('/products/show');
});


app.get('/product/update/:id', (req, res) => {
    const pid = req.params.id;
    const product = Products.find((u) => u.id == pid);

    if (!product) {
        return res.status(404).send('Product not found');
    }

    res.render('editForm', { product });
});


app.put('/product/update/:id', (req, res) => {
    const { id } = req.params;
    const product = Products.find((u) => u.id == id);

    if (!product) {
        return res.status(404).send('Product not found');
    }

    const { productName, category, price } = req.body;
    product.productName = productName;
    product.category = category;
    product.price = price;

    console.log(`Product with ID ${id} updated.`);
    res.redirect('/products/show');
});


app.listen(7000, () => {
    console.log('Server is running at port 7000');
});