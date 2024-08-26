import fs from 'fs';
import path from 'path';
import { Router } from 'express';

const router = Router();

const productsFilePath = path.join(process.cwd(), 'data', 'productos.json');

function readProductsFromFile() {
    if (!fs.existsSync(productsFilePath)) {
        return [];
    }
    const data = fs.readFileSync(productsFilePath, 'utf-8');
    return JSON.parse(data);
}

function writeProductsToFile(products) {
    fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2), 'utf-8');
}

router.get('/', (req, res) => {
    const products = readProductsFromFile();
    res.json(products);
});

router.get('/:pid', (req, res) => {
    const { pid } = req.params;
    const products = readProductsFromFile();
    const product = products.find(p => p.id === parseInt(pid));
    if (product) {
        res.json(product);
    } else {
        res.status(404).json({ error: 'Producto no encontrado' });
    }
});

router.post('/', (req, res) => {
    const products = readProductsFromFile();
    const newProduct = { ...req.body, id: Date.now() };
    products.push(newProduct);
    writeProductsToFile(products);
    res.status(201).json(newProduct);
});

router.put('/:pid', (req, res) => {
    const { pid } = req.params;
    const products = readProductsFromFile();
    const index = products.findIndex(p => p.id === parseInt(pid));
    if (index !== -1) {
        products[index] = { ...products[index], ...req.body };
        writeProductsToFile(products);
        res.json(products[index]);
    } else {
        res.status(404).json({ error: 'Producto no encontrado' });
    }
});

router.delete('/:pid', (req, res) => {
    const { pid } = req.params;
    const products = readProductsFromFile();
    const index = products.findIndex(p => p.id === parseInt(pid));
    if (index !== -1) {
        const deletedProduct = products.splice(index, 1);
        writeProductsToFile(products);
        res.json(deletedProduct);
    } else {
        res.status(404).json({ error: 'Producto no encontrado' });
    }
});

export default router;
