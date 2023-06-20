import puppeteer from 'puppeteer';

export default async (req, res) => {
    const html = req.body['html'];
    console.log(html,req.body)
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.setContent(html, { waitUntil: 'networkidle0' });
    const pdfBuffer = await page.pdf({ format: 'A4' });

    await browser.close();
    console.log(html)
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Length', pdfBuffer.length);
    res.setHeader('Content-Disposition', 'attachment; filename=invoice.pdf');

    return res.end(pdfBuffer, 'binary');

};
