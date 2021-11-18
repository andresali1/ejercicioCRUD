const fs = require('fs');
const path = require('path');

const productsFilePath = path.resolve(__dirname, '../data/productsDataBase.json');
const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));

const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const { validationResult } = require('express-validator');

const newId = () => {
	let ultimo = 0;
	products.forEach(product => {
		if (product.id > ultimo) {
			ultimo = product.id;
		};
	});
	return ultimo + 1;
};

const controller = {
	// Root - Show all products
	index: (req, res) => {
		res.render('products', { products });
	},

	// Detail - Detail from one product
	detail: (req, res) => {
		let product = products.find(product => product.id == parseInt(req.params.id));
		res.render('detail', { product });
	},

	// Create - Form to create
	create: (req, res) => {
		res.render('create');
	},

	// Create -  Method to store
	store: (req, res) => {
		// Lógica de creado
		const resultValidation = validationResult(req);

		if (resultValidation.errors.length > 0) {
			return res.render('create',
				{
					errors: resultValidation.mapped(),
					oldData: req.body				
				});
		} else {
			const file = req.file;
			let product = {};
			if (!file) {
				product = {
					id: newId(),
					...req.body,
					image: 'default-image.png'
				}
			} else {
				product = {
					id: newId(),
					...req.body,
					image: req.file.filename
				}
			};

			//Guardar el producto en el array de productos (Push)
			products.push(product);

			let jsonProducts = JSON.stringify(products, null, 4);
			fs.writeFileSync(productsFilePath, jsonProducts);

			res.redirect('/')
		}
	},

	// Update - Form to edit
	edit: (req, res) => {
		let product = products.find(product => product.id == parseInt(req.params.id));
		res.render('edit', { product });
	},
	// Update - Method to update
	update: (req, res) => {
		let id = req.params.id;
		let asignaid = parseInt(req.params.id);
		const file = req.file;
		let updatedFile = products.filter(product => product.id != req.params.id);
		let productToedit = products.filter(product => product.id == parseInt(req.params.id));

		if (!file) {
			productToedit = {
				id: asignaid,
				...req.body,
				image: productToedit[0].image
			}
		} else {
			productToedit = {
				id: asignaid,
				...req.body,
				image: req.file.filename
			}
		}

		updatedFile.push(productToedit);

		let jsonProducts = JSON.stringify(updatedFile, null, 4);
		fs.writeFileSync(productsFilePath, jsonProducts);

		console.log(productToedit);

		res.redirect(`/products/${id}`)

	},

	// Delete - Delete one product from DB
	destroy: (req, res) => {
		let id = parseInt(req.params.id);
		let updatedFile = products.filter(article => article.id != id);

		let jsonProducts = JSON.stringify(updatedFile, null, 4);
		fs.writeFileSync(productsFilePath, jsonProducts);

		res.redirect('/')
	}
};

module.exports = controller;