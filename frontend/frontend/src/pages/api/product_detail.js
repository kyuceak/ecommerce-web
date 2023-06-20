import { API_PATH } from "../../../constant";
import cookie from "cookie";

export default async (req, res) => {
    if (req.method === "GET") {
        const cookies = cookie.parse(req.headers.cookie ?? '');
        const access = cookies.access ?? false;
        const productId = req.query.id;
        try {
            let apiRes = await fetch(`${API_PATH}/api/products/detail/?id=${productId}`, {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    'Authorization': `Bearer ${access}`

                },
            });

            const data = await apiRes.json();
            console.log(apiRes);
            if (apiRes.status === 200) {
                return res.status(200).json(data);
            } else {
                return res.status(apiRes.status).json({
                    error: data.error,
                });
            }
        } catch (err) {
            return res.status(500).json({
                error: err,
            });
        }
    } else {
        res.setHeader("Allow", ["GET"]);
        return res.status(405).json({
            error: `Method ${req.method} not allowed`,
        });
    }
};
