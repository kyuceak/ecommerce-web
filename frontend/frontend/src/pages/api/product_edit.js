import { API_PATH } from "../../../constant";
import cookie from "cookie";

export default async (req, res) => {
    if (req.method === "GET") {
        const productId = req.query.id;
        const cookies = cookie.parse(req.headers.cookie ?? '');
        const access = cookies.access ?? false;

        if (access === false) {
            return res.status(401).json({
                error: 'User unauthorized to make this request'
            });
        }

        try {
            const apiRes = await fetch(`${API_PATH}/api/products/discounts/?id=${productId}`, {
                method: "GET",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${access}`
                },
            });

            const data = await apiRes.json();

            if (apiRes.status === 200) {
                return res.status(200).json(data);
            } else {
                return res.status(apiRes.status).json({
                    error: data.error,
                });
            }
        } catch (err) {
            return res.status(500).json({
                error: "Something went wrong when retrieving products",
            });
        }
    } else if (req.method === "POST") {
        const cookies = cookie.parse(req.headers.cookie ?? '');
        const access = cookies.access ?? false;

        if (access === false) {
            return res.status(401).json({
                error: 'User unauthorized to make this request'
            });
        }

        const {
            id,discount
        } = req.body;
        const body = JSON.stringify({
            "id": id,
            "discount": (discount)
        });
        try {
            const apiRes = await fetch(`${API_PATH}/api/products/discounts/`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${access}`,
                    'Content-Type': 'application/json'
                },
                body: body
            });

            const data = await apiRes.json();
            console.log(data)
            if (apiRes.status === 201) {
                return res.status(201).json({ success: data.success });
            } else {
                return res.status(apiRes.status).json({
                    error: data.error
                });
            }
        } catch (err) {
            return res.status(500).json({
                error: 'Something went wrong when editing product '
            });
        }

    } else {
        res.setHeader("Allow", ["GET","POST"]);
        return res.status(405).json({
            error: `Method ${req.method} not allowed`,
        });
    }
};
