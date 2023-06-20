import React, { useEffect, useState } from "react";
import { getProductDetail } from "@/utils/getter";
import { addToWishlist, commentPost } from "@/utils/poster";
import styles from './ProductCard.module.css';
import { useDispatch, useSelector } from "react-redux";
import { addItem } from "@/cartSlice";
import Link from "next/link";
import { API_PATH } from "../../../constant";
import { Row, Col, Image, ListGroup, Card, Button, Form } from "react-bootstrap";
import Rating from "../components/Rating";
import { useRouter } from "next/router";



export default function ProductDetailPage() {
    const [product, setProduct] = useState(null)
    const urlParams = new URLSearchParams(window.location.search);
    const [quantity, setQuantity] = useState(1);
    const id = urlParams.get('id');
    const [showPopup, setShowPopup] = useState(false);
    const [showPopup2, setShowPopup2] = useState(false);
    const [doesExist, setDoesExist] = useState(false);
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
    const router = useRouter();


    useEffect(() => {
        getProductDetail(id).then((res) => {
            setProduct(res.product)
            setDoesExist(res.doesExist)
        })
        console.log(product);
    }, [])

    const dispatch = useDispatch();
    const handleAddItem = (item, quantityToAdd) => {
        dispatch(addItem({ item, quantity: quantityToAdd }));
    };


    const handleQuantityChange = (e) => {
        setQuantity(e.target.value);
    };



    const handleAddToCart = (item, quantityToAdd) => {
        console.log(quantityToAdd);
        if (quantityToAdd > item.count_in_stock || quantityToAdd < 1) {
            setShowPopup2(true);
            setTimeout(() => {
                setShowPopup2(false);
            }, 3000);

            return;
        }
        handleAddItem(item, quantityToAdd);
        setShowPopup(true);
        setTimeout(() => {
            setShowPopup(false);
        }, 3000);
    };


    function handleAddToWishlist(product) {
        console.log(product)
        addToWishlist(product.id).then((res) => {
            if (res) {
                router.reload()
            }
        })
    }

    return <>
        {product ?
            <>
                <div>
                    <Link href="/" passHref>
                        <button className="btn btn-light my-3">Go back</button>
                    </Link>


                    <h3>{product.product_name}</h3>
                    {showPopup2 && (
                        <div className="alert alert-danger" role="alert">
                            Product cannot added to cart
                        </div>
                    )}

                    {showPopup && (
                        <div className="alert alert-success" role="alert">
                            Product added to cart!
                        </div>
                    )}




                    <Row>
                        <Col md={6}>
                            <Image src={API_PATH + product.image} alt={product.name} fluid />
                        </Col>

                        <Col md={3}>
                            <Card>
                                <ListGroup variant="flush">
                                    <ListGroup.Item>
                                        <Row>
                                            <Col>Price: </Col>
                                            <Col>
                                                <strong style={product.discount > 0 ? { textDecoration: "line-through" } : {}} >
                                                    ${product.initial_price}
                                                </strong>
                                            </Col>
                                        </Row>
                                    </ListGroup.Item>

                                    {product.discount > 0 && // If discount is greater than 0, show the discount tag.
                                        <ListGroup.Item>
                                            <Row>
                                                <Col>Discounted Price: </Col>
                                                <Col><strong>${product.price}</strong></Col>
                                            </Row>
                                        </ListGroup.Item>

                                    }
                                    <ListGroup.Item>
                                        <Row>
                                            <Col>Stock: </Col>
                                            <Col><strong>{product.count_in_stock}</strong></Col>
                                        </Row>
                                    </ListGroup.Item>

                                    <ListGroup.Item>
                                        <Row>
                                            <Col md={5}>Quantity: </Col>
                                            <Col md={7}><input onChange={handleQuantityChange} min="1" step="1" type={'number'}
                                                className="form-control"
                                                placeholder="1"
                                                aria-label="1" /></Col>

                                        </Row>
                                        <div>
                                            <Row>
                                                <Button className='btn-block' disabled={product.count_in_stock == 0} type='button' onClick={() => handleAddToCart(product, quantity)}>Add To Cart</Button>
                                                {isAuthenticated && (<Button variant="secondary" onClick={() => handleAddToWishlist(product)}>{doesExist ? "Remove From Wishlist" : "Add to Wishlist"}</Button>)}
                                            </Row>
                                        </div>
                                    </ListGroup.Item>
                                </ListGroup>

                            </Card>
                            <ListGroup variant="flush">


                                <ListGroup.Item>
                                    <Rating value={product.rating} text={`${product.numReviews} reviews`} color={'#f8e825'} />
                                </ListGroup.Item>

                                <ListGroup.Item>
                                    Brand: {product.brand}
                                </ListGroup.Item>

                                <ListGroup.Item className="break-words">
                                    Description: {product.description}
                                </ListGroup.Item>

                                <ListGroup.Item className="break-words">
                                    Category: {product.category}
                                </ListGroup.Item>
                                <ListGroup.Item className="break-words">
                                    Warranty: {product.warranty}
                                </ListGroup.Item>
                                <ListGroup.Item className="break-words">
                                    ID: {product.id}
                                </ListGroup.Item>

                            </ListGroup>
                        </Col>

                        <Col md={3}>
                            <h4>Reviews</h4>
                            <ListGroup variant="flush">
                                {product.reviews.length > 0 ? (
                                    product.reviews.map((review, index) => (
                                        <ListGroup.Item key={index}>
                                            <strong>{review.from_user.username}</strong>
                                            <Rating value={review.rating} color="#f8e825" />
                                            <p>{review.created_date}</p>
                                            <p>{review.comment}</p>
                                        </ListGroup.Item>
                                    ))
                                ) : (
                                    <p>There is no review for this product</p>
                                )}
                            </ListGroup>
                        </Col>
                    </Row>



                </div>
            </>
            : <div>loading</div>
        }</>
}

