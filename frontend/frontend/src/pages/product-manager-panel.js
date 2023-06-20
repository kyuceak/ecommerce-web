import { getProducts, getCategories } from "@/utils/getter";
import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Modal, Form, Table, Card, Image } from 'react-bootstrap';
import WideCard from "@/pages/components/exampleCard";
import { useRouter } from "next/router";
import { productAddPost, categoryAddPost } from '@/utils/poster';
import { getOrders } from '@/utils/getter';
import styles from './orders.module.css';
import { API_PATH } from "../../constant";
import { Select } from "@mui/material";
import CommentApprovalPage from "./commentApprovalPage";






const ProductManagerPanel = () => {
    // State variables for managing products, categories, stock, invoices, deliveries, and comments
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [stock, setStock] = useState([]);
    const [invoices, setInvoices] = useState([]);
    const [deliveries, setDeliveries] = useState([]);
    const [comments, setComments] = useState([]);
    const [productName, setProductName] = useState('');
    const [categoryName, setCategoryName] = useState('');
    const [currentView, setCurrentView] = useState('products'); // default view is 'products'
    const [showModal, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState('');
    const [file, setFile] = useState('');
    const [product, setProduct] = useState({
        product_name: '',
        brand: '',
        category: '',
        stock: 0,
        image: null,
        price: 0.0,
        warranty: 0,
        description: ''
    });



    const fileChangeHandler = (event) => {
        setFile(event.target.files[0]);
    };
    const handleClose = () => {
        setShowModal(false);
        setModalContent('');  // clear modal content when modal is closed
    };
    const handleShow = (content) => {
        setModalContent(content);
        setShowModal(true);
    };
    const router = useRouter();
    const { query } = router;

    const view = query.view || 'products'; // Use 'products' as the default value if 'view' is undefined

    useEffect(() => {
        // Handle the view change or initial value
        if (view === 'categories') {
            setCurrentView('categories');
        }
        else if (view === 'products') {
            setCurrentView('products');
        }
        else {
            setCurrentView(view);
        }

        // Update localStorage if needed
        window.localStorage.setItem('currentView', view);
    }, [view]);


    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(product);
        const formData = new FormData();
        Object.keys(product).forEach((key) => {
            formData.append(key, product[key]);
        });
        formData.append('image', file); // appending the file to FormData

        productAddPost(formData).then((res) => {
            if (res) {
                router.push({
                    pathname: router.pathname,
                    query: { ...router.query, view: 'products' },
                }, undefined, { scroll: false })
                    .then(() => router.reload())
            }
        });



        //Ürünü burdan gönder server

        setProduct({
            product_name: '',
            brand: '',
            category: '',
            stock: 0,
            image: '',
            price: 0.0,
            warranty: 0,
            description: ''

        });

        switchView('products')

        handleClose();
    };

    const handleSubmitCat = (event) => {
        event.preventDefault();
        console.log(categoryName);


        categoryAddPost(categoryName);
        // categoryi servera at


        setCategoryName('');
        handleClose();

        switchView('categories');

        window.location.reload();
    }

    // Fetch products, categories, stock, invoices, deliveries, and comments from the server
    useEffect(() => {
        const fetchData = async () => {
            // Fetch products
            const productsData = await getProducts();
            setProducts(productsData);

            // Fetch categories
            const uniqueCategories = await getCategories();
            console.log(uniqueCategories);
            setCategories(uniqueCategories);
            setProduct({ ...product, category: uniqueCategories[0]['name'] });

            //     // Fetch stock
            //     const stockData = await fetchStock();
            //     setStock(stockData);

            //     // Fetch invoices
            //     const invoicesData = await fetchInvoices();
            //     setInvoices(invoicesData);

            //     // Fetch deliveries
            //     const deliveriesData = await fetchDeliveries();
            //     setDeliveries(deliveriesData);

            //     // Fetch comments
            //     const commentsData = await fetchComments();
            //     setComments(commentsData);
            // 
        };

        fetchData();
    }, []);



    useEffect(() => {

        const savedView = window.localStorage.getItem('currentView');
        if (savedView) {
            setCurrentView(savedView);
        } else {
            setCurrentView('products');
        }
    }, []);

    const [userOrders, setUserOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchUserOrders() {
            try {
                const data = await getOrders();
                setLoading(false);
                console.log(data.data)
                setUserOrders(data.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchUserOrders();
    }, []);

    const switchView = (view) => {
        setCurrentView(view);
        window.localStorage.setItem('currentView', view);
    };

    // Functions for adding/removing products, managing categories, managing stock, approving/disapproving comments





    const addProduct = async (newProduct) => {
        // Add the new product to the server
        const addedProduct = await addProductToServer(newProduct);
        // Update the local state with the new product
        setProducts([...products, addedProduct]);
    };

    const removeProduct = async (productId) => {
        // Remove the product from the server
        await removeProductFromServer(productId);
        // Update the local state by filtering out the removed product
        setProducts(products.filter((product) => product.id !== productId));
    };




    const updateStock = async (productId, newQuantity) => {
        // Update the stock for the given product on the server
        await updateStockOnServer(productId, newQuantity);
        // Update the local state with the updated stock quantity
        setStock(
            stock.map((item) =>
                item.productId === productId ? { ...item, quantity: newQuantity } : item
            )
        );
    };



    const approveComment = async (commentId) => {
        // Approve the comment on the server
        await approveCommentOnServer(commentId);
        // Update the local state by marking the comment as approved
        setComments(
            comments.map((comment) =>
                comment.id === commentId ? { ...comment, approved: true } : comment
            )
        );
    };

    const disapproveComment = async (commentId) => {
        // Disapprove the comment on the server
        await disapproveCommentOnServer(commentId);

        // Update the local state by marking the comment as disapproved
        setComments(
            comments.map((comment) =>
                comment.id === commentId ? { ...comment, approved: false } : comment
            )
        );
    };

    const handleChangeStatus = async (orderId, newStatus) => {
        // Here send a request to the backend with new status and order id
        try {
            const response = await fetch(`/api/updateOrderStatus`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ orderId: orderId, status: newStatus })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log(data);

            setUserOrders(prevUserOrders =>
                prevUserOrders.map(order =>
                    order.id === orderId ? { ...order, status: newStatus } : order
                )
            );
            // Here you may want to update the order status in your state as well

        } catch (error) {
            console.error('Failed to update order status:', error);
        }
    }

    const renderView = () => {
        switch (currentView) {
            case 'products':
                return (
                    products.length === 0 ? <div>Loading...</div> :
                        <Container>
                            <Row>
                                <Col>
                                    <Button onClick={() => handleShow('product')}>Add Product</Button>
                                </Col>

                            </Row>
                            <Row>
                                {products.map((product) => (
                                    <Col md={4} sm={12} lg={3} key={product.id}>
                                        <WideCard
                                            item={product}
                                            click={() => router.push(`/manager/edit_pro/?id=${product.id}`)}
                                            buttonText="Detail"
                                            buttonDisabled={false}
                                        />

                                    </Col>
                                ))}
                            </Row>


                        </Container >
                );

            case 'categories':
                return (
                    <Container>
                        <Row>
                            <Col>
                                <Button onClick={() => handleShow('category')} style={{ marginBottom: '10px' }}>Add Category</Button>
                                <Table striped bordered hover>
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Category Name</th>

                                        </tr>
                                    </thead>
                                    <tbody>
                                        {categories.map((category, index) => (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>{category.name}</td>

                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>

                            </Col>
                        </Row>
                    </Container>

                );

            // case 'invoices':
            // return (Your invoices related JSX)
            case 'deliveries':
                return (
                    loading ? <></> :
                        <>
                            {userOrders.map((order, index) => (
                                <Card key={order.id} className={`styles.cardContainer ${index !== 0 ? styles.notFirstCard : ''}`} >
                                    <Card.Header className={styles.cardHeader}>
                                        <div>
                                            <Card.Title className={styles.cardTitle}>Delivery ID #{order.id}</Card.Title>
                                            <Card.Subtitle className={styles.cardSubtitle}>Date: {order.createdAt.slice(0, 10)}</Card.Subtitle>
                                            <Card.Subtitle className={styles.cardSubtitle}>Delivery Address: {order.user.address}</Card.Subtitle>
                                            <Card.Subtitle className={styles.cardSubtitle}>Customer ID: {order.user.id}</Card.Subtitle>
                                        </div>
                                        {order.status === 'in-transit' || order.status === "processing" ? <Card.Title className={styles.statusWrapper}><span className={styles.status}>  STATUS: <select
                                            id="status"
                                            name="status"
                                            value={order.status}
                                            onChange={(e) => handleChangeStatus(order.id, e.target.value)}
                                        >
                                            <option value="in-transit">In-Transit</option>
                                            <option value="delivered">Delivered</option>
                                            <option value="processing">Processing</option>

                                        </select></span></Card.Title> : <Card.Title className={styles.statusWrapper}>{order.status}</Card.Title>}
                                    </Card.Header>
                                    <Card.Body className={styles.cardBody}>
                                        <ul className={styles.listGroup}>
                                            {order.orders.map((item) => (
                                                <li key={item.product} className={styles.listGroupItem}>
                                                    <Image src={API_PATH + item.image} alt="My Image" className={styles.image}></Image>
                                                    <div>
                                                        <span style={{ fontWeight: 'bold' }}>Product Name:</span>
                                                        <span style={{ display: 'block' }}>{item.product_name}</span>
                                                    </div>
                                                    <div>
                                                        <span style={{ fontWeight: 'bold' }}>Product ID:</span>
                                                        <span style={{ display: 'block' }}>{item.product}</span>
                                                    </div>
                                                    <div>
                                                        <span style={{ fontWeight: 'bold' }}>Quantity:</span>
                                                        <span style={{ display: 'block' }}>{item.qty}</span>
                                                    </div>
                                                </li>
                                            ))}
                                            <li>
                                                <Card.Text className={styles.totalPrice}>Total price: ${order.total_price}</Card.Text>
                                            </li>
                                        </ul>


                                    </Card.Body>
                                </Card>
                            ))}
                        </>
                );

            case 'comments':
                return (<CommentApprovalPage />)
            default:
                return null;
        }
    };


    const renderModal = () => (
        <Modal show={showModal} onHide={handleClose} size="lg" >
            <Modal.Header closeButton>
                {modalContent === 'product' ? (
                    <Modal.Title>Product Form</Modal.Title>
                ) : modalContent === 'category' ? (<Modal.Title>Category Form</Modal.Title>) : null}
            </Modal.Header>
            <Modal.Body>
                {modalContent === 'product' ? (
                    <Form onSubmit={handleSubmit}>
                        <Row>
                            <Col md={6}>
                                <Form.Group controlId="productDetails">
                                    <Form.Label>Product Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter product name"
                                        value={product.name}
                                        onChange={(e) => setProduct({ ...product, product_name: e.target.value })}
                                    />
                                    <Form.Label>Product Brand</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter product brand"
                                        value={product.brand}
                                        onChange={(e) => setProduct({ ...product, brand: e.target.value })}
                                    />
                                    <Form.Label>Product Category</Form.Label>
                                    <Form.Control
                                        as="select"
                                        value={product.category}
                                        onChange={(e) => setProduct({ ...product, category: e.target.value })}
                                    >
                                        {categories.map((category) => (
                                            <option key={category.name} value={category.name}>
                                                {category.name}
                                            </option>
                                        ))}
                                        {/* Add more options as needed */}
                                    </Form.Control>
                                    <Form.Label>Stock Quantity</Form.Label>
                                    <Form.Control
                                        type="number"
                                        defaultValue="0"
                                        placeholder="Enter stock quantity"
                                        step="1"
                                        value={product.stock}
                                        onChange={(e) => setProduct({ ...product, stock: e.target.value })}
                                    />
                                </Form.Group>
                                <Button variant="primary" type="submit" style={{ marginTop: '10px' }}>
                                    Add Product
                                </Button>
                            </Col>
                            <Col md={6}>
                                <Form.Group controlId="productExtras">
                                    <Form.Label>Upload Product Photo</Form.Label>
                                    <Form.Control
                                        type="file"

                                        onChange={fileChangeHandler}

                                    />
                                    <Form.Label>Price</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter product price"
                                        value={product.initial_price}
                                        onChange={(e) => setProduct({ ...product, initial_price: e.target.value })}
                                    />
                                    <Form.Label>Warranty</Form.Label>
                                    <Form.Control
                                        type="number"

                                        placeholder="Enter warranty"
                                        step="1"
                                        value={product.warranty}
                                        onChange={(e) => setProduct({ ...product, warranty: e.target.value })}
                                    />
                                    <Form.Label> Product Description</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        placeholder="Enter product description"
                                        value={product.description}
                                        onChange={(e) => setProduct({ ...product, description: e.target.value })}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                    </Form>

                ) : modalContent === 'category' ? (
                    <Form onSubmit={handleSubmitCat}>
                        <Row>
                            <Form.Group controlId="categoryName">
                                <Form.Label>Category Name</Form.Label>
                                <Form.Control type="text" placeholder="Enter category name" value={categoryName}
                                    onChange={(e) => setCategoryName(e.target.value)} ></Form.Control>
                            </Form.Group>
                            <Button variant="primary" type="submit" style={{ marginTop: '10px' }}>
                                Add Category
                            </Button>
                        </Row>

                    </Form>

                ) : null}
            </Modal.Body>
        </Modal >
    )

    return (
        <div style={{ display: 'flex' }}>
            <div
                style={{
                    width: '20%',
                    background: '#f8f8f8',
                    minHeight: '100vh',
                    padding: '20px',
                }}
            >
                <h1>Product Manager Panel</h1>
                <ul style={{ listStyleType: 'none', padding: 0 }}>
                    <li>
                        <Button onClick={() => switchView('products')} style={{ margin: "10px", width: "200px" }}>Products</Button>
                    </li>

                    <li>
                        <Button onClick={() => switchView('categories')} style={{ margin: "10px", width: "200px" }}>Categories</Button>
                    </li>
                    <li>
                        <Button onClick={() => switchView('deliveries')} style={{ margin: "10px", width: "200px" }}>Delivery List</Button>
                    </li>
                    <li>
                        <Button onClick={() => switchView('comments')} style={{ margin: "10px", width: "200px" }}>Comments</Button>
                    </li>
                </ul>

            </div>
            <div style={{ width: '80%', padding: '20px' }}>{renderView()}
                {renderModal()}</div>
        </div>
    );
};


export default ProductManagerPanel;