import { API_PATH } from "../../../constant";
import cookie from "cookie";

export default async (req, res) => {
    if (req.method === 'POST') {
        const { name } = req.body;

        const cookies = cookie.parse(req.headers.cookie ?? '');
        const access = cookies.access ?? false;

        if (access === false) {
            return res.status(401).json({
                error: 'User unauthorized to make this request'
            });
        }

        const body = JSON.stringify({ name });

        try {
            const apiRes = await fetch(`${API_PATH}/api/create_category/`, {
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
                return res.status(201).json({ success: data });
            } else {
                return res.status(apiRes.status).json({
                    error: data
                });
            }
        } catch (err) {
            return res.status(500).json({
                error: 'Something went wrong when creating a category'
            });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        return res.status(405).json({ 'error': `Method ${req.method} not allowed` });
    }
};