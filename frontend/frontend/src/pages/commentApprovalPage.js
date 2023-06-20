import { getAllComments } from '@/utils/getter';
import { approveComment } from '@/utils/poster';

import { useEffect, useState } from 'react';
import { Container, Table, Button } from 'react-bootstrap';

function CommentApprovalPage() {
  const [comments, setComments] = useState([]);

  useEffect(() => {

    const data = getAllComments().then((res) => {
      setComments(res)
      console.log(res)
    });

  }, []);

  const handleApproval = async (id) => {
    try {
      await approveComment(id);
      setComments(prevComments => prevComments.map((comment) =>
        comment.id === id ? { ...comment, isApproved: !comment.isApproved } : comment
      ));
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Container>
      <h1 className="my-4">Comment Approval Page</h1>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Comment</th>
            <th>User</th>
            <th>Product</th>
            <th>Approval Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {comments && comments.map((comment) => (
            <tr key={comment.id}>
              <td>{comment.comment}</td>
              <td>{comment.from_user}</td>
              <td>{comment.to_product}</td>
              <td>{comment.isApproved ? "Approved" : "Not approved"}</td>
              <td>

                <Button variant={comment.isApproved ? "danger" : "success"} onClick={() => handleApproval(comment.id)}>
                  {comment.isApproved ? "Disapprove" : "Approve"}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}

export default CommentApprovalPage;