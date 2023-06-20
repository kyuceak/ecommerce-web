import { API_PATH } from "../../../constant";

export default async (req, res) => {
    if (req.method === "GET") {
        try {
            const apiRes = await fetch(`${API_PATH}/api/products/list/`, {
                method: "GET",
                headers: {
                    Accept: "application/json",
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
