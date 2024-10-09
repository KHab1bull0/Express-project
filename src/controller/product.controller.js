import Product from "../model/product.model.js";
import { uploadFile } from "../common/helper/helper.js";

export const productController = {
  async getAllProducts(req, res) {
    try {
      const products = await Product.find();
      return res.json(products);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  async createProduct(req, res) {
    try {
      const { name, price, description } = req.body;
      let imageUrl = "";

      if (req.file) {
        imageUrl = await uploadFile(req.file);
      }

      console.log(imageUrl);
      const newProduct = new Product({
        name,
        price,
        description,
        imageUrl,
      });

      await newProduct.save();

      return res.status(201).json({
        message: "Mahsulot muvaffaqiyatli qo'shildi",
        product: newProduct,
      });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  },

  async updateProduct(req, res) {
    try {
      const updateData = {};
      const { name, price, description } = req.body;

      if (name !== undefined) updateData.name = name;
      if (price !== undefined) updateData.price = price;
      if (description !== undefined) updateData.description = description;

      if (req.file) {
        const imageUrl = await uploadFile(req.file);
        updateData.imageUrl = imageUrl;
      }

      const product = await Product.findByIdAndUpdate(req.params.id, updateData, {
        new: true,
        runValidators: true,
      });

      if (!product) {
        return res.status(404).json({ message: "Mahsulot topilmadi" });
      }

      return res.json({
        message: "Mahsulot muvaffaqiyatli yangilandi",
        product,
        status: 200,
        success: true,
      });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  },

  async deleteProduct(req, res) {
    try {
      const product = await Product.findByIdAndDelete(req.params.id);
      if (!product) {
        return res.status(404).json({ message: "Mahsulot topilmadi" });
      }
      return res.status(204).send({message: "Mahsulot muvaffaqiyatli o'chirildi", product, status: 204, success: true   });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
};
