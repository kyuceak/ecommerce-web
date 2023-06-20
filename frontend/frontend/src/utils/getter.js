async function getUser() {
    const res = await fetch('/api/user', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }

    });
    return await res.json()
}


async function getCategories() {
    const res = await fetch('/api/category_list', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });
    return await res.json();
}

async function getProducts(caseParam) {
    const params = new URLSearchParams({ case: caseParam });

    const res = await fetch('/api/product_list', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });
    return await res.json()
}
export async function getManager() {
    console.log("abc")
    const res = await fetch('/api/manager_product_list', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });
    if (res.status === 401) {
        return false
    }
    return await res.json()
}

async function getProductDetail(id) {
    const res = await fetch(`/api/product_detail?id=${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });
    const response = await res.json()
    console.log(response)
    return response
}
export async function getProductEdit(id) {
    const res = await fetch(`/api/product_edit?id=${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });
    if (res.status === 401) {
        return false
    }
    const response = await res.json()
    console.log(response)
    return response
}

async function getOrders() {
    const res = await fetch('/api/order_list', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }

    });
    return await res.json()
}

async function getOrdersByUser() {
    const res = await fetch('/api/order', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }

    });
    return await res.json()
} async function getWishlist() {
    const res = await fetch('/api/wishlist', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }

    });
    return await res.json()
}

async function getRefundRequestedOrders() {
    const res = await fetch('/api/refunds', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });

    console.log(res.status)
    return await res.json()
}

async function getAllInvoices() {
    const res = await fetch('/api/invoice_list', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });

    console.log(res.status)
    return await res.json()
}

const getTopProducts = async () => {
    try {
        const { data } = await axios.get('/api/top/');
        return data;
    } catch (error) {
        console.error('Error fetching top products:', error);
        return [];
    }
};

async function getAllComments() {
    const res = await fetch('/api/comments/', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });
    const resp = await res.json()
    console.log(resp)

    return resp
}

export { getRefundRequestedOrders, getWishlist, getUser, getProducts, getProductDetail, getTopProducts, getOrdersByUser, getOrders, getCategories, getAllInvoices, getAllComments }
