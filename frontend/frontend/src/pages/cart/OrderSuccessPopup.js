// components/OrderSuccessPopup.js
import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { clearCart } from "@/cartSlice";



const OrderSuccessPopup = ({ show, handleClose, cartItems }) => {
    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Order Success</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>Your order has been placed successfully!</p>
                {cartItems.map((item) => (
                    <div key={item.id} className="mb-3">
                        <h4>{item.product_name}</h4>
                        <p>Price: ${item.price}</p>
                        <p>Quantity: {item.quantity}</p>
                    </div>
                ))}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default OrderSuccessPopup;
