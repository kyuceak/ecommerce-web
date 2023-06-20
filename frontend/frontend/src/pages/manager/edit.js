import React, {useEffect, useState} from "react";
import {getProductEdit} from "@/utils/getter";
import Link from "next/link";
import { Form, ButtonGroup, Button, Card, Col, Image, ListGroup, Row, Container, Toast } from "react-bootstrap";
import {API_PATH} from "../../../constant";
import Rating from "@/pages/components/Rating";
import {useSelector} from "react-redux";
import { useRouter } from "next/router";
import {productEditPost,priceUpdate} from "@/utils/poster";

export default function edit() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    const [product, setProduct] = useState(null)
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
    const router = useRouter();
    const [discount, setDiscount] = useState(0);
    const [showToast, setShowToast] = useState(false);
    const [price, setPrice] = useState(0);
    useEffect(() => {
        getProductEdit(id).then((res) => {
            if(res) {
                setProduct(res)
                setDiscount(res.discount)
                setPrice(res.initial_price)
                console.log(res)
            }
            else{
                router.push("/loginRegisterPage")
            }
        })

    }, [])

    function setDiscountAmount(value) {
        setDiscount(value)
    }
    function setPriceAmount(value) {
        setPrice(value)
    }
    function createDiscount(e) {
        e.preventDefault();
        console.log(discount);
        productEditPost(id, discount).then((res) => {
            console.log(res);
            if (true) {
                setShowToast(true); // show the toast
                setTimeout(() => setShowToast(false), 3000); // hide the toast after 3 seconds
                router.reload();
            }
        });
    }
    function setNewPrice(e) {
        e.preventDefault();
        console.log(discount);
        priceUpdate(id, price).then((res) => {
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

    return (
        <Container>
            <Row>
                <Col md={3} style={{backgroundColor: '#f8f8f8'}}>
                    <h1>Sales Manager Panel</h1>
                    <br />
                    <ul style={{ listStyleType: 'none', padding: 0 }}>
                        <li>
                        <Button variant="primary" onClick={() => {
                        setCurrentView('products');
                        router.push('/sales-manager-page');
                        }}>Products</Button>
                        </li>
                        <br /> {/* Add a line break for space */}
                        <li>
                            <Button variant="primary" onClick={() => router.push('/manager/graphs')}> Graph </Button>
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
                                <Link href="/" passHref>
                                    <button className="btn btn-light my-3">Go back</button>
                                </Link>

                                <h3>{product.product_name}</h3>
                                <Row>
                                    <Col md={6}>
                                        <Image src={API_PATH+product.image} alt={product.name} fluid/>
                                    </Col>

                                    <Col md={4}>
                                        <Card>
                                            <ListGroup variant="flush">
                                                <ListGroup.Item>
                                                    <Form>
                                                        <Form.Group as={Row}>
                                                            <Form.Label column sm="6">Initial Price:</Form.Label>
                                                            <Col sm="6">
                                                                <Form.Control 
                                                                    type="number"
                                                                    value={price}
                                                                    onChange={(e) => {
                                                                        const inputValue = parseInt(e.target.value);
                                                                        setPriceAmount(inputValue);
                                                                    }}
                                                                />
                                                            </Col>
                                                        </Form.Group>
                                                        <ButtonGroup className="mb-3">
                                                            <Button onClick={setNewPrice}>Submit</Button>
                                                        </ButtonGroup>
                                                        
                                                        <Form.Group as={Row}>
                                                            <Form.Label column sm="6">Discount Percentage:</Form.Label>
                                                            <Col sm="6">
                                                                <Form.Control
                                                                    type="number"
                                                                    value={discount}
                                                                    onChange={(e) => {
                                                                        const inputValue = parseInt(e.target.value);
                                                                        if (inputValue >= 1 && inputValue <= 100) {
                                                                            setDiscountAmount(inputValue);
                                                                        }
                                                                    }}
                                                                />
                                                            </Col>
                                                        </Form.Group>
                                                        <ButtonGroup className="mb-3">
                                                            <Button onClick={createDiscount}>Submit</Button>
                                                        </ButtonGroup>

                                                        <Form.Group as={Row}>
                                                            <Form.Label column sm="6">Final Price:</Form.Label>
                                                            <Col sm="6">{product.price}</Col>
                                                        </Form.Group>
                                                    </Form>
                                                </ListGroup.Item>
                                                <ListGroup.Item>
                                                    <Row>
                                                        <Col>Stock: </Col>
                                                        <Col><strong>{product.count_in_stock}</strong></Col>
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

                                   

                                </Row>


                            </div>
                        </>
                        :<div>loading</div>
                    }
                </Col>
            </Row>
        </Container>
    );
}
