// item.controller.js
const Item = require('../models/item');

class ItemController {
  static async getAllItems(req, res) {
    try {
      const items = await Item.find().exec();
      res.json(items);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching items' });
    }
  }

  static async getItem(req, res) {
    try {
      const id = req.params.id;
      const item = await Item.findById(id).exec();
      if (!item) {
        res.status(404).json({ message: 'Item not found' });
      } else {
        res.json(item);
      }
    } catch (error) {
      res.status(500).json({ message: 'Error fetching item' });
    }
  }

  static async addItem(req, res) {
    const { name, quantity, price } = req.body;
   
    if (!name || !quantity || !price) {
	return res.status(401).send({ message: 'all parameters are required' });	
    }

    const newItem = new Item({
      name,
      quantity,
      price
    });

    try {
      const savedItem = await newItem.save();

      res.status(201).json(savedItem);
    } catch (error) {
      res.status(500).json({ message: 'Failed to add item due to error: ' + error.message });
    }
  }

  static async updateItem(req, res) {
    try {
      const id = req.params.id;
      const item = await Item.findByIdAndUpdate(id, req.body, { new: true }).exec();
      if (!item) {
        res.status(404).json({ message: 'Item not found' });
      } else {
        res.json(item);
      }
    } catch (error) {
      res.status(500).json({ message: 'Error updating item' });
    }
  }

  static async deleteItem(req, res) {
     const { id } = req.params;

    try {
        const deletedItem = await Item.findOneAndDelete({ _id: id });

        if (!deletedItem) {
            return res.status(404).json({ message: 'Item not found' });
        }

        res.status(200).json({ message: 'Item deleted successfully' });
    } catch (error) {
        console.error("Error deleting item:", error);
        res.status(500).json({ message: `Failed to delete item: ${error.message}` });
    }
  }
}

module.exports = ItemController;


