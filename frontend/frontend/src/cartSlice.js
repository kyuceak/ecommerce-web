import { createSlice } from "@reduxjs/toolkit";

const initialState = { items: [], totalQuantity: 0 };

export const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addItem: (state, action) => {
            const newItem = action.payload.item;
            const quantityToAdd = action.payload.quantity || 1;
            const existingItemIndex = state.items.findIndex(
                (item) => item.id === newItem.id
            );

            if (existingItemIndex >= 0) {
                state.items[existingItemIndex].quantity += parseInt(quantityToAdd);
            } else {
                // Add price and image link to the item object
                state.items.push({
                    ...newItem,
                    quantity: parseInt(quantityToAdd),
                    price: newItem.price,
                    image: newItem.image,
                });
            }

            state.totalQuantity += parseInt(quantityToAdd)
        },
        removeItem: (state, action) => {
            const { id, quantity } = action.payload;
            const existingItemIndex = state.items.findIndex((item) => item.id === id);

            if (existingItemIndex >= 0) {
                const existingItem = state.items[existingItemIndex];
                state.totalQuantity -= quantity;

                if (existingItem.quantity > quantity) {
                    state.items[existingItemIndex].quantity -= quantity;
                } else {
                    state.items.splice(existingItemIndex, 1);
                }
            }
        },

        clearCart: (state) => {
            state.items = [];
            state.totalQuantity = 0;
        },
    },
});

export const { addItem, removeItem, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
