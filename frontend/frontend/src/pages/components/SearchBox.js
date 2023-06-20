// Import the required modules
import { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useRouter } from 'next/router';

function SearchBox() {
  const [keyword, setKeyword] = useState('');
  const router = useRouter();


  const submitHandler = (e) => {
    e.preventDefault();

    if (keyword.trim()) {
      router.push(`/?search=${keyword}`);
    } else {
      router.push('/');
    }
  };

  return (
    <Form onSubmit={submitHandler} inline="true">
      <div className="input-group">
        <Form.Control
          type='text'
          name='q'
          placeholder='Search Products...'
          onChange={(e) => setKeyword(e.target.value)}
          className='mr-sm-2'
          style={{ width: '300px' }}
        />
        <Button type='submit' variant='outline-success' className='p-2'>
          Submit
        </Button>
      </div>
    </Form>
  );
}



export default SearchBox;
