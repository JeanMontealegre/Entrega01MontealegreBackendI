import { Router } from 'express';

const router = Router();

const carts = [];

router.post('/', (req, res) => {
    const newCart = { id: Date.now(), products: [] };
    carts.push(newCart);
    res.status(201).json(newCart);
});

router.get('/:cid', (req, res) => {
    const { cid } = req.params;
    const cart = carts.find(c => c.id === parseInt(cid));
    if (cart) {
        res.json(cart.products);
    } else {
        res.status(404).json({ error: 'Carrito no encontrado' });
    }
});

router.post('/:cid/product/:pid', (req, res) => {
    const { cid, pid } = req.params;
    const cart = carts.find(c => c.id === parseInt(cid));
    if (cart) {
        const existingProduct = cart.products.find(p => p.product === parseInt(pid));
        if (existingProduct) {
            existingProduct.quantity += 1;
        } else {
            cart.products.push({ product: parseInt(pid), quantity: 1 });
        }
        res.status(201).json(cart);
    } else {
        res.status(404).json({ error: 'Carrito no encontrado' });
    }
});

export default router;
