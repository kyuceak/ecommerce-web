

import { Col, Dropdown } from 'react-bootstrap';

function SortProducts({ onSort }) { // Destructure onSort from props



    function sortProductsByPriceAsc() {
        if (onSort) {
            onSort('asc');
        }
    }

    function sortProductsByPriceDesc() {
        if (onSort) {
            onSort('desc');
        }
    }


    function sortProductsByMostPopular() {
        if (onSort) {
            onSort('mostp');
        }
    }

    function sortProductsByLeastPopular() {
        if (onSort) {
            onSort('leastp');
        }
    }




    return (
        <Col className="d-flex justify-content-end pt-3">
            <Dropdown>
                <Dropdown.Toggle className="btn  btn-outline-hover" variant="primary" >
                    SORT PRODUCTS BY
                </Dropdown.Toggle>
                <Dropdown.Menu>
                    <Dropdown.Item onClick={sortProductsByPriceAsc}> Lowest to Highest Price</Dropdown.Item>
                    <Dropdown.Item onClick={sortProductsByPriceDesc}> Highest to lowest Price</Dropdown.Item>
                    <Dropdown.Item onClick={sortProductsByMostPopular}> Most Popular</Dropdown.Item>
                    <Dropdown.Item onClick={sortProductsByLeastPopular}> Least Popular </Dropdown.Item>

                </Dropdown.Menu>
            </Dropdown>

        </Col>
    );
}

export default SortProducts;
