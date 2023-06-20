import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box} from "@mui/material";
import {Button} from "@mui/material";
import {getAllInvoices} from '@/utils/getter';
import {useState, useEffect} from 'react';
import ReactDOMServer from 'react-dom/server';
import { DatePicker } from "@mui/lab";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { subDays, format } from 'date-fns';
import { TextField } from "@mui/material";


export default function Graph() {
    const [invoices, setInvoices] = useState([]);
    const [selectedInvoice, setSelectedInvoice] = useState([]);
    const [startDate, setStartDate] = useState(subDays(new Date(), 30)); // default to last 30 days
    const [endDate, setEndDate] = useState(new Date());
    const [filteredInvoices, setFilteredInvoices] = useState([]);

const revenueData = invoices.reduce((arr, invoice) => {
    const date = new Date(invoice.createdAt).toISOString().slice(0,10);
    if (new Date(date) >= startDate && new Date(date) <= endDate) {
        const existingDateData = arr.find(item => item.date === date);
        if (existingDateData) {
            existingDateData.revenue += invoice.orders.reduce((total, order) => total + order.qty * order.price / order.qty, 0);
        } else {
            arr.push({
                date,
                revenue: invoice.orders.reduce((total, order) => total + order.qty * order.price / order.qty, 0)
            });
        }
    }
    return arr;
}, []).sort((a, b) => new Date(a.date) - new Date(b.date));

    useEffect(() => {
        const fetchData = async () => {
            const fetchedInvoices = await getAllInvoices();
            setInvoices(fetchedInvoices);
            setSelectedInvoice(fetchedInvoices);
        };

        fetchData();
    }, []);

    console.log(invoices);


    async function handlePrint(invoice) {
        const html = ReactDOMServer.renderToString(
            <div key={invoice.id}>
                <table style={{borderCollapse: 'collapse', width: '100%'}}>
                    <tr>
                        <th style={{border: '1px solid black', padding: '8px', textAlign: 'left'}}>ID</th>
                        <th style={{border: '1px solid black', padding: '8px', textAlign: 'left'}}>Username</th>
                        <th style={{border: '1px solid black', padding: '8px', textAlign: 'left'}}>Created At</th>
                        <th style={{border: '1px solid black', padding: '8px', textAlign: 'left'}}>Total Price</th>
                        <th style={{border: '1px solid black', padding: '8px', textAlign: 'left'}}>Status</th>
                    </tr>
                    <tr>
                        <td style={{border: '1px solid black', padding: '8px', textAlign: 'left'}}>{invoice.id}</td>
                        <td style={{border: '1px solid black', padding: '8px', textAlign: 'left'}}>{invoice.user.username}</td>
                        <td style={{border: '1px solid black', padding: '8px', textAlign: 'left'}}>{new Date(invoice.createdAt).toISOString().slice(0,10)}</td>
                        <td style={{border: '1px solid black', padding: '8px', textAlign: 'left'}}>{invoice.total_price}</td>
                        <td style={{border: '1px solid black', padding: '8px', textAlign: 'left'}}>{invoice.status}</td>
                    </tr>
                </table>
                <h2 style={{marginTop: '15px'}}>Orders:</h2>
                <table style={{borderCollapse: 'collapse', width: '100%', marginTop: '15px'}}>
                    <tr>
                        <th style={{border: '1px solid black', padding: '8px', textAlign: 'left'}}>Product Name</th>
                        <th style={{border: '1px solid black', padding: '8px', textAlign: 'left'}}>Quantity</th>
                        <th style={{border: '1px solid black', padding: '8px', textAlign: 'left'}}>Price</th>
                    </tr>
                    {invoice.orders.map((order) => (
                        <tr key={order.id}>
                            <td style={{border: '1px solid black', padding: '8px', textAlign: 'left'}}>{order.product_name}</td>
                            <td style={{border: '1px solid black', padding: '8px', textAlign: 'left'}}>{order.qty}</td>
                            <td style={{border: '1px solid black', padding: '8px', textAlign: 'left'}}>{order.price}</td>
                        </tr>
                    ))}
                </table>
            </div>
        );
        console.log(html);
        const response = await fetch('/api/generate_pdf',
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 'html': html }),
            }
        )
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'invoice.pdf');
        document.body.appendChild(link);
        link.click();
    }
    const handleSubmit = (e) => {
        e.preventDefault();
    }

    useEffect(() => {
        const filterInvoices = invoices.filter(invoice => {
            const invoiceDate = new Date(invoice.createdAt);
            return invoiceDate >= startDate && invoiceDate <= endDate;
        });
        setFilteredInvoices(filterInvoices);
    }, [invoices, startDate, endDate]);

    return (
        <div>
            <h1>Invoice</h1>
            <TextField
                id="start-date"
                label="Start Date"
                type="date"
                defaultValue={format(startDate, 'yyyy-MM-dd')}
                InputLabelProps={{
                    shrink: true,
                }}
                onChange={(e) => setStartDate(new Date(e.target.value))}
            />
            <TextField
                id="end-date"
                label="End Date"
                type="date"
                defaultValue={format(endDate, 'yyyy-MM-dd')}
                InputLabelProps={{
                    shrink: true,
                }}
                onChange={(e) => setEndDate(new Date(e.target.value))}
            />
            {filteredInvoices?.map((invoice) => (
                <TableContainer component={Paper} style={{ margin: '15px' }}>
                    <Table>
                    <TableHead>
                    <TableRow>
                        <TableCell style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>ID</TableCell>
                        <TableCell style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Username</TableCell>
                        <TableCell style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Created At</TableCell>
                        <TableCell style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Total Price</TableCell>
                        <TableCell style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Status</TableCell>
                        <TableCell style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Orders</TableCell>
                    </TableRow>
                </TableHead>
                        <TableBody>
                            <TableRow key={invoice.id}>
                                <TableCell style={{ fontSize: '1.2rem' }}>{invoice.id}</TableCell>
                                <TableCell style={{ fontSize: '1.2rem' }}>{invoice.user.username}</TableCell>
                                <TableCell style={{ fontSize: '1.2rem' }}>{new Date(invoice.createdAt).toISOString().slice(0,10)}</TableCell>
                                <TableCell style={{ fontSize: '1.2rem' }}>{invoice.total_price}</TableCell>
                                <TableCell style={{ fontSize: '1.2rem' }}>{invoice.status}</TableCell>
                                <TableCell>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Product Name</TableCell>
                                                <TableCell style={{ fontSize: '1.2rem' , fontWeight: 'bold'}}>Quantity</TableCell>
                                                <TableCell style={{ fontSize: '1.2rem' , fontWeight: 'bold'}}>Price</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {invoice.orders.map((order) => (
                                                <TableRow key={order.id}>
                                                    <TableCell style={{ fontSize: '1.2rem' }}>{order.product_name}</TableCell>
                                                    <TableCell style={{ fontSize: '1.2rem' }}>{order.qty}</TableCell>
                                                    <TableCell style={{ fontSize: '1.2rem' }}>{order.price}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                    <Button variant="contained" color="primary" onClick={() => handlePrint(invoice)} style={{ margin: '15px' }}>Print</Button>
                </TableContainer>
                
            ))}

<h2>Revenue Graph</h2>
            <DatePicker
                label="Start Date"
                defaultValue = {startDate}
            />
            <DatePicker
                label="Controlled picker"
                value={endDate}
                onChange={(newDate) => setEndDate(newDate)}
            />
            

            
            <ResponsiveContainer width="100%" height={400}>
                <LineChart data={revenueData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <Line type="monotone" dataKey="revenue" stroke="#8884d8" />
                    <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}    