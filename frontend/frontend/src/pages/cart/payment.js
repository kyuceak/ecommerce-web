import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { API_PATH } from "../../../constant";
import React, { useEffect, useState } from "react";
import { paymentPost } from "@/utils/poster";
import OrderSuccessPopup from './OrderSuccessPopup';
import { clearCart } from "@/cartSlice";




export default function CartPage() {
    const cartItems = useSelector((state) => state.cart.items);
    const dispatch = useDispatch();
    const router = useRouter();
    const totalPrice = cartItems.reduce((total, item) => {
        return total + item.price * item.quantity;
    }, 0);
    const [showOrderSuccess, setShowOrderSuccess] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState("");
    const [cardNo, setCardNo] = useState("");
    const [cardCvk, setCardCvk] = useState("");
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/loginRegisterPage?redirect=payment');
        }
        else {
            router.push('/cart/payment');
        }
    }, []);

    const handlePayment = async () => {
        const orderitems = cartItems.map((item) => ({
            product: parseInt(item.id),
            qty: parseInt(item.quantity),
        }));

        console.log('Order Items:', orderitems);
        console.log('Payment Method:', paymentMethod);
        console.log('Card Number:', cardNo);
        console.log('Card CVK:', cardCvk);

        console.log('Before paymentPost'); // Debugging line

        await paymentPost(paymentMethod, cardNo, cardCvk, orderitems,totalPrice);

        setShowOrderSuccess(true);

        console.log('After paymentPost'); // Debugging line
    };


    


    return (
        <>
            <div className="container">
                <ul className="list-unstyled">
                    {cartItems.map((item) => (
                        <li key={item.id} className="mb-3">
                            <div className="d-flex align-items-center">
                                <img
                                    src={API_PATH + item.image}
                                    alt={item.name}
                                    width="100"
                                    height="100"
                                    className="mr-3"
                                />
                                <div>
                                    <h3>{item.product_name}</h3>
                                    <p>Price: ${item.price}</p>
                                    <p>Quantity: {item.quantity}</p>
                                </div>
                            </div>
                        </li>
                    ))}
                    <li>
                        <p>Total Price: ${totalPrice.toFixed(2)}</p>
                    </li>
                </ul>
                <div>
                    <form>
                        <div className="form-group">
                            <label htmlFor="paymentMethod">Payment Method</label>
                            <input
                                type="text"
                                className="form-control"
                                id="paymentMethod"
                                placeholder="Payment Method"
                                value={paymentMethod}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                            />
                        </div>
                        <br />
                        <div className="form-group">
                            <label htmlFor="cardNumber">Card Number</label>
                            <input
                                type="text"
                                className="form-control"
                                id="cardNumber"
                                placeholder="Card Number"
                                value={cardNo}
                                onChange={(e) => setCardNo(e.target.value)}
                            />
                        </div>
                        <br />
                        <div className="form-group">
                            <label htmlFor="cardCvk">Card CVK</label>
                            <input
                                type="text"
                                className="form-control"
                                id="cardCvk"
                                placeholder="Card CVK"
                                value={cardCvk}
                                onChange={(e) => setCardCvk(e.target.value)}
                            />
                        </div>
                        <br />
                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={handlePayment}
                        >
                            Finish Payment
                        </button>
                    </form>
                    <OrderSuccessPopup
    show={showOrderSuccess}
    handleClose={() => {
        setShowOrderSuccess(false);
        dispatch(clearCart());
        router.push('/');
    }}
    cartItems={cartItems}
/>
                </div>
            </div>
        </>
    );

}
