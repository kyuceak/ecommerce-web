import Head from 'next/head';
import { useEffect, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import WideCard from './components/exampleCard';
import "../styles/styles.module.css";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { getProducts } from "@/utils/getter";
import SortProducts from './components/SortProducts.js'
import ProductCarousel from './components/ProductCarousel';
import { addItem } from "@/cartSlice";

export default function Home() {
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const router = useRouter();
  const { search, category } = router.query;
  const searchFilter = search || '';
  const categoryFilter = category || '';

  const [showPopup, setShowPopup] = useState(false);


  const dispatch = useDispatch();
  const isAuthenticated = useSelector(state => state.isAuthenticated);

  const handleSortProducts = (sortType) => {
    if (sortType === 'asc') {
      filteredProducts.sort((a, b) => a.price - b.price);
    }
    else if (sortType === 'desc') {
      filteredProducts.sort((a, b) => b.price - a.price);
    }
    else if (sortType === 'mostp') {
      filteredProducts.sort((a, b) => b.reviews.length - a.reviews.length);
    }
    else if (sortType === 'leastp') {
      filteredProducts.sort((a, b) => a.reviews.length - b.reviews.length);
    }





    setFilteredProducts([...filteredProducts]);

  };

  const handleContinueShopping = () => {
    router.push('/');
  };

  const handleAddToCart = (item, quantityToAdd) => {
    handleAddItem(item, quantityToAdd);
    setShowPopup(true);
    setTimeout(() => {
      setShowPopup(false);
    }, 1000);
  };

  const handleAddItem = (item, quantityToAdd) => {
    dispatch(addItem({ item, quantity: quantityToAdd }));
  };


  useEffect(() => {
    const fetchData = async () => {
      let filteredProducts = await getProducts();

      if (searchFilter) {
        filteredProducts = filteredProducts.filter(
          (product) =>
            (product.product_name && product.product_name.toLowerCase().includes(searchFilter.toLowerCase())) ||
            (product.description &&
              product.description.toLowerCase().includes(searchFilter.toLowerCase()))
        );
      }


      if (categoryFilter) {
        filteredProducts = filteredProducts.filter(
          (product) =>
            product.category && product.category.toLowerCase() === categoryFilter.toLowerCase()
        );
      }


      setFilteredProducts(filteredProducts);
    };
    fetchData();
  }, [search, router.asPath]);


  useEffect(() => {
    const fetchTopProducts = async () => {
      const response = await fetch('http://localhost:8000/api/top/');
      const data = await response.json();
      setTopProducts(data);
    };

    fetchTopProducts();
  }, []);

  return (
    <>
      <Head>

        <title>E-commerce</title>
        <meta name="description" content="App Home page" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div >
        {!search && <ProductCarousel topProducts={topProducts} />}
        <div className="d-flex align-items-center justify-content-between w-100 mt-4">
          <h1>All Products</h1>
          <SortProducts onSort={handleSortProducts} className="mb-3" />
        </div>
      </div>
      <Container>
        <Row>
          {filteredProducts.map((item) => (
            <Col md={4} sm={12} lg={3} key={item.id}>
              <WideCard
                item={item}
                click={() => router.push(`/products/detail/?id=${item.id}`)}
                addToCart={() => handleAddToCart(item, 1)}
                buttonText="Buy"
                buttonDisabled={item.count_in_stock == 0}
              />
            </Col>
          ))}
        </Row>
      </Container>
      {showPopup && (
        <div className="popup">
          Product added to cart!
        </div>
      )}
    </>
  );
}