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
        const { id } = req.body;
        const body = JSON.stringify({
           id
        });

        try {
            const apiRes = await fetch(`${API_PATH}/api/comments/delete/`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${access}`
                },
                body: body
            });

            // Django API'si 204 No Content yanıtını başarılı bir silme işlemi için döndürdüğünden,
            // yanıtın boş olduğunu kontrol ederiz, boşsa başarılı bir silme işlemi gerçekleşmiştir.
            if (apiRes.status === 204) {
                return res.status(200).json({
                    message: 'Comment deleted successfully.'
                });
            } else {
                // Yanıtta bir hata varsa, bu hatayı işleriz.
                const data = await apiRes.json();
                return res.status(apiRes.status).json({
                    error: data.error
                });
            }
        } catch (err) {
            return res.status(500).json({
                error: 'Something went wrong when deleting comment'
            });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        return res.status(405).json({
            error: `Method ${req.method} not allowed`
        });
    }
};
