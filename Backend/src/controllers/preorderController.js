import Preorder from "../models/Preorder.js";
import MenuItem from "../models/MenuItem.js";
import asyncHandler from "../utils/asyncHandler.js";
import { sendError, sendSuccess } from "../utils/responseHelper.js";

//1. CreatePreorder
const createPreorder = asyncHandler(async (req, res) => {
    const { studentName, classSection, phone, items, pickupTime, note } = req.body;

    const builtItems = []; //to store the built items with their details and total price
    let totalAmount = 0; // to calculate the total amount of the preorder

    //yesle chai preorder ma item haru ko details haru lai build garna madat garcha, jasma menu item ko price at order time calculate garna parcha
    for (const item of items) {
        const quantity = Number(item.quantity);
        const foundMenuItem = await MenuItem.findById(item.menuItem);

        if (!foundMenuItem) {
            return sendError(res, "One or more selected menu items do not exist", 400);
        }
        if (!foundMenuItem.isAvailable) {
            return sendError(res, `${foundMenuItem.name} is currently unavailable`, 400);
        }
        const priceAtOrderTime = foundMenuItem.price;

        builtItems.push({
            menuItem: foundMenuItem._id,
            name: foundMenuItem.name,
            quantity,
            priceAtOrderTime,
        });
        totalAmount += priceAtOrderTime * quantity;
    }
    const preorder = await Preorder.create({
        studentName: studentName.trim(),
        classSection: classSection.trim(),
        phone: phone.trim(),
        items: builtItems,
        pickupTime: pickupTime.trim(),
        note: note ? note.trim() : "",
        totalAmount,
        status: "pending",
    });
    sendSuccess(res, "Preorder created successfully", preorder, 201);
});

//2. GetPreorders
const getPreorders = asyncHandler(async (req, res) => {
    const { status } = req.query;
    const filter = {};
    if (typeof status === "string" && status.trim()) {
        filter.status = status.trim().toLowerCase();
    }
    const preorders = await Preorder.find(filter)
        .populate("items.menuItem", "name price slug image")
        .sort({ createdAt: -1 });
    sendSuccess(res, "Preorders retrieved successfully", preorders);
});

//3. GetPreorderById
const getPreorderById = asyncHandler(async (req, res) => {
    const preorder = await Preorder.findById(req.params.id).populate("items.menuItem", "name price slug image");

    if (!preorder) {
        return sendError(res, "Preorder not found", 404);
    }
    sendSuccess(res, "Preorder retrieved successfully", preorder);
});

//4. UpdatePreorderStatus
const updatePreorderStatus = asyncHandler(async (req, res) => {
    const { status } = req.body;
    const preorder = await Preorder.findById(req.params.id);
    if (!preorder) {
        return sendError(res, "Preorder not found", 404);
    }
    preorder.status = status.trim().toLowerCase();
    const updatedPreorder = await preorder.save();
    sendSuccess(res, "Preorder status updated successfully", updatedPreorder, 200);

});

export { createPreorder, getPreorders, getPreorderById, updatePreorderStatus };
