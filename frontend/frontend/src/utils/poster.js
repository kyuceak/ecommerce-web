import { API_PATH } from "../../constant";

async function loginPost(username, password) {
    const res = await fetch('api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password }),
    });
    return [await res.json(), res.status]
}
async function commentPost(comment, rating, to_product) {
    const res = await fetch(`/api/comment`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ comment, rating, to_product }),
    });
    return [await res.json(), res.status]
}

async function paymentPost(paymentMethod, card_no, card_cvk, orderitems, total_price) {
    console.log(paymentMethod, card_no, card_cvk, orderitems, total_price)
    console.log("abc")
    await fetch('../api/payment', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ paymentMethod, card_no, card_cvk, orderitems, total_price }),
    });
}

async function cancelOrder(id) {
    console.log(id);
    const res = await fetch('api/cancel_order', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
    });
    return await res.json()
}

async function addToWishlist(prod) {
    const res = await fetch('../api/add_wishlist', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prod }),
    }
    )
    return await res.json()
}

async function registerPost(username, email, password, password1, nameSurname, address, taxID) {
    const res = await fetch('api/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password, password1, nameSurname, address, taxID }),
    });
    console.log(res.status, await res.json())
}
async function productEditPost(id, discount) {
    const res = await fetch(`/api/product_edit`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, discount }),
    });
    const response = await res.json()
    console.log(response)
    return response
}
async function productStockEditPost(id, stock) {
    const res = await fetch(`/api/product_stock_update`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, stock }),
    });
    const response = await res.json()
    console.log(response)
    return response
}


async function productAddPost(product) {
    const res = await fetch(`${API_PATH}/api/products/create/`, {
        method: 'POST',
        body: product,
    });
    const response = await res.json();
    console.log(response);
    return response;
}

async function deleteProduct(id) {
    console.log(id)
    const res = await fetch('/api/delete_product', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id }),
    });

}
async function approveRefund(msg, id) {
    console.log(id)
    const res = await fetch('/api/approve_refund', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id, msg }),
    });
    return await res.json()
}

async function deleteComment(id) {
    console.log(id)
    const res = await fetch('/api/delete_comment', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id }),
    });
    return await res.json()
}

async function approveComment(id) {
    console.log(id)
    const res = await fetch('/api/comment_approve', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id }),
    });
    return await res.json()
}

async function categoryAddPost(categoryName) {
    const res = await fetch('/api/add_category', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: categoryName }),
    });
    const response = await res.json();
    console.log(response);
    return response;
}

async function refundOrder(id) {
    console.log(id)
    const res = await fetch('/api/refund_order', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id }),
    });
    return await res.json()
}

async function priceUpdate(id, price) {
    console.log(id)
    const res = await fetch('/api/update_price', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id, price }),
    });
    return await res.json()
}
export { priceUpdate,approveRefund, refundOrder, productStockEditPost, approveComment, loginPost, registerPost, paymentPost, commentPost, cancelOrder, addToWishlist, productAddPost, productEditPost, deleteProduct, deleteComment, categoryAddPost }

