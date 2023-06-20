import React from 'react';
import { Carousel, Image } from 'react-bootstrap';
import { API_PATH } from "../../../constant";

const ProductCarousel = ({ topProducts }) => {
  return (
    <Carousel pause='hover' className='bg-dark'>
      {topProducts.map((product) => (
        <Carousel.Item key={product.id}>
          <Image src={API_PATH+product.image} alt={product.product_name} fluid />
          <Carousel.Caption className='carosuel.caption'>
            <h4>{product.product_name}</h4>
          </Carousel.Caption>
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

export default ProductCarousel;
