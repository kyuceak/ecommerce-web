import React, { useEffect, useState } from "react";
import { getProductEdit } from "@/utils/getter";
import Link from "next/link";
import { Button, Card, Col, Image, ListGroup, Row, Container, Toast } from "react-bootstrap";
import { API_PATH } from "../../../constant";
import Rating from "@/pages/components/Rating";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { productStockEditPost, productEditPost, deleteProduct, deleteComment, approveComment } from "@/utils/poster";


export default function edit_pro() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    const [product, setProduct] = useState(null)
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
    const router = useRouter();
    const [discount, setDiscount] = useState(0);
    const [showToast, setShowToast] = useState(false);
    const [price, setPrice] = useState(product ? product.price : 0);
    const [stock, setStock] = useState(product ? product.count_in_stock : 0);


    useEffect(() => {
        getProductEdit(id).then((res) => {
            if (res) {
                setProduct(res)
            }
            else {
                router.push("/loginRegisterPage")
            }
        })

    }, [])

    const handleButtonClickCategories = () => {
        router.push({
            pathname: '/product-manager-panel',
            query: { view: 'categories' },
        });
    };

    const handleButtonClickProduct = () => {
        router.push({
            pathname: '/product-manager-panel',
            query: { view: 'products' },
        });
    };

    const handleButtonClickDelivery = () => {
        router.push({
            pathname: '/product-manager-panel',
            query: { view: 'deliveries' },
        });
    };

    const handleButtonClickComments = () => {
        router.push({
            pathname: '/product-manager-panel',
            query: { view: 'comments' },
        });
    };

    function setDiscount2(value) {
        setDiscount(value)
    }

    function setPriceValue(value) {
        setPrice(value);
    }

    function setStockValue(value) {
        setStock(value);
    }

    function stockEdit(e) {
        e.preventDefault();
        console.log(discount);
        productStockEditPost(id, stock).then((res) => {
            console.log(res);
            if (true) {
                setShowToast(true); // show the toast
                setTimeout(() => setShowToast(false), 3000); // hide the toast after 3 seconds
                router.reload();
            }
        });
    }

    function setCurrentView(view) {
        // Set your current view here...
    }

    async function deleteCurrentProduct() {
        try {
            const deleted = await deleteProduct(id);
            if (deleted) {
                router.push("/product-manager-page");
            }
        } catch (err) {
            console.error(err);
        }
    }


    async function deleteCurrentComment(revId) {
        try {
            const deleted = await deleteComment(revId);
            if (deleted) {
                console.log("deleted")
                router.reload();
            }
        } catch (err) {
            console.error(err);
        }
    }

    async function approveCurrentComment(revId) {
        try {
            const approved = await approveComment(revId);
            if (approved) {
                console.log("approved")
                router.reload();
            }
        } catch (err) {
            console.error(err);
        }
    }

    function updateProduct(e) {
        e.preventDefault();
        console.log(price, stock, discount);
        productEditPost(id, discount, price, stock).then((res) => {
            console.log(res);
            if (true) {
                setShowToast(true); // show the toast
                setTimeout(() => setShowToast(false), 3000); // hide the toast after 3 seconds
                router.push("/product-manager-page");
            }
        });
    }

    return (
        <Container>
            <Row>
                <Col md={3} style={{ backgroundColor: '#f8f8f8' }}>
                    <h1>Product Manager Panel</h1>
                    <br />
                    <ul style={{ listStyleType: 'none', padding: 0 }}>
                        <li>
                            <Button variant="primary" onClick={handleButtonClickProduct} style={{ margin: "10px", width: "200px" }}>Products</Button>
                        </li>
                        <li>
                            <Button variant="primary" onClick={handleButtonClickCategories} style={{ margin: "10px", width: "200px" }}>Categories</Button>
                        </li>
                        <li>
                            <Button variant="primary" onClick={handleButtonClickDelivery} style={{ margin: "10px", width: "200px" }}>Delivery List</Button>
                        </li>
                        <li>
                            <Button variant="primary" onClick={handleButtonClickComments} style={{ margin: "10px", width: "200px" }}>Comments</Button>
                        </li>
                        {/* Add more navigation buttons here */}
                    </ul>
                </Col>
                <Col md={9}>
                    {product ?
                        <>
                            <Toast onClose={() => setShowToast(false)} show={showToast} delay={3000} autohide style={{
                                position: 'absolute',
                                top: 0,
                                right: 0,
                                minWidth: '200px',
                                backgroundColor: 'green',
                                color: 'white',
                            }}>
                                <Toast.Body>Edit Saved!</Toast.Body>
                            </Toast>

                            <div>
                                <Link href="/product-manager-panel" passHref>
                                    <button className="btn btn-light my-3">Go back</button>
                                    <Button variant="danger" onClick={deleteCurrentProduct}>Delete Product</Button>

                                </Link>

                                <h3>{product.product_name}</h3>
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
                                                        <Col><strong>${product.price}</strong></Col>
                                                        <Col>

                                                        </Col>

                                                    </Row>

                                                </ListGroup.Item>
                                                <ListGroup.Item>
                                                    <Row>
                                                        <br />
                                                        <Col>Stock: </Col>
                                                        <Col><strong>{product.count_in_stock}</strong></Col>
                                                        <Col>
                                                            <input
                                                                type="number"
                                                                id="stockInput"
                                                                name="stockInput"
                                                                value={stock}
                                                                onChange={(e) => {
                                                                    const inputValue = parseInt(e.target.value);
                                                                    if (inputValue >= 0) {
                                                                        setStockValue(inputValue);
                                                                    }
                                                                }
                                                                }
                                                            />
                                                            <br />
                                                            <br />
                                                            <Row>

                                                                <Button onClick={stockEdit} >Submit</Button>
                                                            </Row>
                                                        </Col>
                                                    </Row>
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
                                                    <ListGroup.Item key={review.id}>
                                                        <strong>{review.from_user.username}</strong>
                                                        <Rating value={review.rating} color="#f8e825" />
                                                        <p>{review.created_date}</p>
                                                        <p>{review.comment}</p>
                                                        <div className="d-flex justify-content-around">
                                                            <Button variant="danger" onClick={() => deleteCurrentComment(review.id)}>Delete</Button>
                                                            {review.isApproved
                                                                ? <Button variant="success" onClick={() => approveCurrentComment(review.id)}>Deapprove</Button>
                                                                : <Button variant="success" onClick={() => approveCurrentComment(review.id)}>Approve</Button>}
                                                        </div>
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
                    }
                </Col>
            </Row>
        </Container >
    );
}
