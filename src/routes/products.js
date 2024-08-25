import { Router } from 'express';

const router = Router();

const products = [];

router.get('/', (req, res) => {
    res.json(products);
});

router.get('/:pid', (req, res) => {
    const { pid } = req.params;
    const product = products.find(p => p.id === parseInt(pid));
    if (product) {
        res.json(product);
    } else {
        res.status(404).json({ error: 'Producto no encontrado' });
    }
});

router.post('/', (req, res) => {
    const newProduct = { ...req.body, id: Date.now() };
    products.push(newProduct);
    res.status(201).json(newProduct);
});

router.put('/:pid', (req, res) => {
    const { pid } = req.params;
    const index = products.findIndex(p => p.id === parseInt(pid));
    if (index !== -1) {
        products[index] = { ...products[index], ...req.body };
        res.json(products[index]);
    } else {
        res.status(404).json({ error: 'Producto no encontrado' });
    }
});

router.delete('/:pid', (req, res) => {
    const { pid } = req.params;
    const index = products.findIndex(p => p.id === parseInt(pid));
    if (index !== -1) {
        const deletedProduct = products.splice(index, 1);
        res.json(deletedProduct);
    } else {
        res.status(404).json({ error: 'Producto no encontrado' });
    }
});

export default router;
