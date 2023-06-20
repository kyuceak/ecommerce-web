import cookie from 'cookie';
import { API_PATH } from "../../../constant";

export default async (req, res) => {

    const cookies = cookie.parse(req.headers.cookie ?? '');
    const access = cookies.access ?? false;

    if (req.method === 'GET') {
        if (access === false) {
            return res.status(401).json({
                error: 'User unauthorized to make this request'
            });
        }

        try {
            const apiRes = await fetch(`${API_PATH}/api/comments/dashboard/`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${access}`,

                },
            });

            const data = await apiRes.json();

            if (apiRes.status === 200) {

                return res.status(200).json(data);
            } else {
                return res.status(apiRes.status).json({
                    error: data.errors
                });
            }
        } catch (err) {

            return res.status(500).json({
                error: 'Something went wrong when fetching comments'
            });
        }
    } else if (req.method === 'POST') {
        if (access === false) {
            return res.status(401).json({
                error: 'User unauthorized to make this request'
            });
        }

        const { comment, rating, to_product } = req.body;

        const body = JSON.stringify({
            comment, rating, to_product
        });
        console.log(req.body);

        try {
            const apiRes = await fetch(`${API_PATH}/api/comments/create/`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${access}`,

                },
                body: body
            });

            const data = await apiRes.json();

            if (apiRes.status === 201) {

                return res.status(201).json(data);
            } else {
                return res.status(apiRes.status).json({
                    error: data.errors
                });
            }
        } catch (err) {

            return res.status(500).json({
                error: 'Something went wrong when sending comment'
            });
        }
    } else {
        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).json({
            error: `Method ${req.method} not allowed`
        });
    }
};
