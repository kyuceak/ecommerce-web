import cookie from 'cookie';
import { API_PATH } from "../../../constant";

export default async (req, res) => {
    if (req.method === 'POST') {
        const cookies = cookie.parse(req.headers.cookie ?? '');
        const access = cookies.access ?? false;

        if (access === false) {
            return res.status(401).json({
                error: 'User unauthorized to make this request'
            });
        }
        const { paymentMethod, card_no, card_cvk, orderitems ,total_price} = req.body;

        const body = JSON.stringify({
            paymentMethod, card_no, card_cvk, orderitems,total_price
        });

        try {
            console.log(req.body);
            const apiRes = await fetch(`${API_PATH}/api/orders/create/`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${access}`
                },
                body: body
            });

            const data = await apiRes.json();

            if (apiRes.status === 201) {

                return res.status(201).json(data);
            } else {
                return res.status(apiRes.status).json({
                    error: data.error
                });
            }
        } catch (err) {

            return res.status(500).json({
                error: 'Something went wrong when creating order'
            });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        return res.status(405).json({
            error: `Method ${req.method} not allowed`
        });
    }
};