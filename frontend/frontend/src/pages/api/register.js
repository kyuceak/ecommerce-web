import { API_PATH } from "../../../constant";


export default async (req, res) => {
    if (req.method === 'POST') {
        const {
            username,
            email,
            password,nameSurname,address,taxID
        } = req.body;
        const body = JSON.stringify({
            "username":username,
            "email":email,
            "password1":password,
            "password2":password,
            "nameSurname":nameSurname,
            "address":address,
            "taxID":taxID
        });
        console.log( body)
        try {
            const apiRes = await fetch(`${API_PATH}/api/register/`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: body
            });

            const data = await apiRes.json();

            if (apiRes.status === 201) {
                return res.status(201).json({ success: data.success });
            } else {
                return res.status(apiRes.status).json({
                    error: data.errors
                });
            }
        } catch (err) {
            return res.status(500).json({
                error: 'Something went wrong when registering for an account'
            });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        return res.status(405).json({ 'error': `Method ${req.method} not allowed` });
    }
};