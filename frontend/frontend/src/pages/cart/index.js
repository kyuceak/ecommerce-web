import React, {useEffect, useState} from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import {API_PATH} from "../../../constant";
import { useDispatch } from "react-redux";
import { removeItem } from "@/cartSlice";
import { Container, Row, Col, Image, FormControl, Button, ListGroup, ListGroupItem,  } from "react-bootstrap";
export default function CartPage(){
    const cartItems = useSelector((state) => state.cart.items);
    const dispatch = useDispatch();
    const router = useRouter();
    const [quantity, setQuantity] = useState(1);

    const handleRemoveItem = (itemId, quantityToRemove) => {
        dispatch(removeItem({ id: itemId, quantity: quantityToRemove }));
    };
    const handleQuantityChange = (itemId, event) => {
        const value = parseInt(event.target.value) || 0;
        setQuantity({ ...quantity, [itemId]: value });
    };

    const handleContinueShopping = () => {
        router.push('/');
    };

    function handlePayment() {
        router.push('/cart/payment');
    }

    return (
        <Container>
        <h1>Shopping Cart</h1>
        {cartItems.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <ListGroup>
            {cartItems.map((item) => (
              <ListGroupItem key={item.id}>
                <Row>
                  <Col md={2}>
                    <Image
                      src={API_PATH + item.image}
                      alt={item.name}
                      width="150"
                      height="150"
                      rounded
                    />
                  </Col>
                  <Col md={7}>
                    <h4>{item.product_name}</h4>
                    <p>Price: ${item.price}</p>
                    <p>Quantity: {item.quantity}</p>
                  </Col>
                  <Col md={3}>
                    <Row>
                        <Col xs={6}>
                        <FormControl
                            onChange={(event) => handleQuantityChange(item.id, event)}
                            type={"number"}
                            placeholder="1"
                            aria-label="1"
                            value={quantity[item.id] || ""}
                        />
                        </Col>
                        <Col xs={6}>
                        <Button
                            onClick={() => handleRemoveItem(item.id, quantity[item.id] || 0)}
                            variant="danger"
                        >
                            Remove
                        </Button>
                        </Col>
                    </Row>
                    </Col>
                </Row>
              </ListGroupItem>
            ))}
          </ListGroup>
        )}
        <div className="mt-3">
          <Button onClick={handleContinueShopping} variant="secondary">
            Continue Shopping
          </Button>
          <Button onClick={handlePayment} className="ml-2" variant="primary">
            Proceed to Payment
          </Button>
        </div>
      </Container>
    );
};
