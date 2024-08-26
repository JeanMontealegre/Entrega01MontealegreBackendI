import fs from 'fs';
import path from 'path';
import { Router } from 'express';

const router = Router();

const cartsFilePath = path.join(process.cwd(), 'data', 'carrito.json');

function readCartsFromFile() {
    if (!fs.existsSync(cartsFilePath)) {
        return [];
    }
    const data = fs.readFileSync(cartsFilePath, 'utf-8');
    return JSON.parse(data);
}

function writeCartsToFile(carts) {
    fs.writeFileSync(cartsFilePath, JSON.stringify(carts, null, 2), 'utf-8');
}

router.post('/', (req, res) => {
    const carts = readCartsFromFile();
    const newCart = { id: Date.now(), products: [] };
    carts.push(newCart);
    writeCartsToFile(carts);
    res.status(201).json(newCart);
});

router.get('/:cid', (req, res) => {
    const { cid } = req.params;
    const carts = readCartsFromFile();
    const cart = carts.find(c => c.id === parseInt(cid));
    if (cart) {
        res.json(cart.products);
    } else {
        res.status(404).json({ error: 'Carrito no encontrado' });
    }
});

router.post('/:cid/product/:pid', (req, res) => {
    const { cid, pid } = req.params;
    const carts = readCartsFromFile();
    const cart = carts.find(c => c.id === parseInt(cid));
    if (cart) {
        const existingProduct = cart.products.find(p => p.product === parseInt(pid));
        if (existingProduct) {
            existingProduct.quantity += 1;
        } else {
            cart.products.push({ product: parseInt(pid), quantity: 1 });
        }
        writeCartsToFile(carts);
        res.status(201).json(cart);
    } else {
        res.status(404).json({ error: 'Carrito no encontrado' });
    }
});

export default router;
