import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Dropdown } from 'react-bootstrap';
import { getCategories } from "@/utils/getter";

function Categories() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const fetchedCategories = await getCategories();
      setCategories(fetchedCategories);
    };

    fetchCategories();
  }, []);

  return (
    <Dropdown>
      <Dropdown.Toggle variant="light">
        Categories
      </Dropdown.Toggle>

      <Dropdown.Menu>
        {categories.map((category) => (
          <Dropdown.Item as={Link} key={category.id} href={{ pathname: '/', query: { category: category.name.toLowerCase() } }}>
            {category.name}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default Categories;
