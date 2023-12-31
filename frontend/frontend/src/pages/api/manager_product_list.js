import { API_PATH } from "../../../constant";
import cookie from "cookie";

export default async (req, res) => {
    if (req.method === "GET") {
        console.log("abc2")
        const cookies = cookie.parse(req.headers.cookie ?? '');
        const access = cookies.access ?? false;

        if (access === false) {
            return res.status(401).json({
                error: 'User unauthorized to make this request'
            });
        }

        try {
            const apiRes = await fetch(`${API_PATH}/api/users/products/`, {
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
    } else {
        res.setHeader("Allow", ["GET"]);
        return res.status(405).json({
            error: `Method ${req.method} not allowed`,
        });
    }
};
