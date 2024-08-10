// bill.controller.js
const Bill = require('../models/bill');
const Item = require('../models/item');

class BillController {
    static async getAllBills(req, res) {
        try {
            const bills = await Bill.find().populate('items.item').exec();
            res.json(bills);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching bills' });
        }
    }

    static async getBill(req, res) {
        try {
            const id = req.params.id;
            const bill = await Bill.findById(id).populate('items.item').exec();
            if (!bill) {
                res.status(404).json({ message: 'Bill not found' });
            } else {
                res.json(bill);
            }
        } catch (error) {
            res.status(500).json({ message: 'Error fetching bill' });
        }
    }

    

static async createBill(req, res) {
    const { customerName, items } = req.body;

    if (!customerName) {
        return res.status(400).json({ message: 'Customer name is required' });
    }

    if (!items || items.length === 0) {
        return res.status(400).json({ message: 'No items provided for the bill' });
    }

    let updatedItems = [];

    try {
        for (const item of items) {
            if (!item.id || item.quantity === undefined) {
                return res.status(400).json({ message: 'Item ID and quantity must be provided for each item' });
            }
            const foundItem = await Item.findById(item.id).exec();
            if (!foundItem) {
                return res.status(400).json({ message: `Item with ID ${item.id} not found` });
            }
            if (foundItem.quantity < item.quantity) {
                return res.status(400).json({ message: `Not enough inventory for item ${foundItem.name}` });
            }
            await Item.findByIdAndUpdate(item.id, {
                $inc: { quantity: -item.quantity }
            }).exec();
            updatedItems.push({
                _id: item.id,
                quantity: item.quantity,
                price: foundItem.price,
                name: foundItem.name,
            });
        }
    } catch (error) {
        console.error("Error updating items in bill:", error);
        return res.status(500).json({ message: `Failed to update inventory: ${error.message}` });
    }

    const totalAmount = updatedItems.reduce((acc, curr) => acc + (curr.quantity * curr.price), 0);

    const newBill = new Bill({
        customerName,
        items: updatedItems,
        totalAmount
    });

    try {
        const savedBill = await newBill.save();
        res.status(201).json(savedBill);
    } catch (error) {
        res.status(500).json({ message: 'Failed to create bill due to error: ' + error.message });
    }
}










static async updateBill(req, res) {
    const billId = req.params.id;
    const { items } = req.body; // Assuming items is an array of {id, quantity} objects representing the new quantities

    if (!items || items.length === 0) {
        return res.status(400).json({ message: 'No items provided for the bill update' });
    }

    try {
        const bill = await Bill.findById(billId);
        if (!bill) {
            return res.status(404).json({ message: 'Bill not found' });
        }

        let updatedItems = [];
        for (const newItem of items) {
	    if (!newItem.id || newItem.quantity === undefined) {
                return res.status(400).json({ message: 'Item ID and quantity must be provided for each item' });
            }
            const oldItem = bill.items.find(item => item.id === newItem.id);
            if (!oldItem) {
                return res.status(400).json({ message: `Item with ID ${newItem.id} not found in bill` });
            }

            const foundItem = await Item.findById(newItem.id).exec();
            if (!foundItem) {
                return res.status(404).json({ message: `Inventory item with ID ${newItem.id} not found` });
            }

            const quantityChange = newItem.quantity - oldItem.quantity;

            if (foundItem.quantity + quantityChange < 0) {
                return res.status(400).json({ message: `Not enough inventory for item ${foundItem.name}` });
            }

            await Item.findByIdAndUpdate(newItem.id, {
                $inc: { quantity: -quantityChange }
            }).exec();

            updatedItems.push({
                _id: newItem.id,
                quantity: newItem.quantity,
                price: foundItem.price,
                name: foundItem.name,
            });
        }

        // Update the bill with the new items array and possibly a new total amount
        const totalAmount = updatedItems.reduce((acc, curr) => acc + (curr.quantity * curr.price), 0);

        await Bill.findByIdAndUpdate(billId, {
            items: updatedItems,
            totalAmount
        }, { new: true });

        res.status(200).json({ message: 'Bill updated successfully' });

    } catch (error) {
        console.error("Error updating the bill:", error);
        return res.status(500).json({ message: `Failed to update bill: ${error.message}` });
    }
}







static async deleteBill(req, res) {
     const { id } = req.params;

    try {
        const deletedBill = await Bill.findOneAndDelete({ _id: id });

        if (!deletedBill) {
            return res.status(404).json({ message: 'Bill not found' });
        }

        res.status(200).json({ message: 'Bill deleted successfully' });
    } catch (error) {
        console.error("Error deleting bill:", error);
        res.status(500).json({ message: `Failed to delete bill: ${error.message}` });
    }
}





}

module.exports = BillController;

