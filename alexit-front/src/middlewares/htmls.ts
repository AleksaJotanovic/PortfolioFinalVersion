import { Category } from "../models/category.model";
import { Courier } from "../models/courier.model";
import { User } from "../models/user.model";


export const salesReportHtml = (date: any, sales: any[], totals: any, groups: Category[]) => {

    const getGroupName = (group_id: string) => {
        return groups.find(g => g._id === group_id)?.name;
    }

    return (
        `
        <!DOCTYPE html>
    <html lang="en">
    
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Sales report</title>
        <style type="text/css">
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
            }
    
            a {
                text-decoration: none;
            }
    
            ul {
                list-style: none;
            }
    
            html {
                scroll-behavior: smooth;
                overflow-x: hidden;
                font-size: 16px;
                height: 297mm;
                width: 210mm;
                margin: auto;
            }
    
            body {
                width: 210mm;
                height: 297mm;
                background-color: #ffffff;
                display: flex;
                flex-direction: column;
                justify-content: start;
                align-items: stretch;
                gap: 1.5rem;
            }
    
            header {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: stretch;
                gap: 1.5rem;
            }
    
            footer {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: end;
            }
    
            header>h1 {
                text-align: center;
            }
    
            header>ul {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: stretch;
                gap: 0.8rem;
                background-color: #eff1f6;
                padding: 1.5rem;
            }
    
            header>ul>li {
                border-bottom: 1px solid;
                padding-bottom: 0.5rem;
            }
    
            table {
                border-collapse: collapse;
                width: 100%;
            }
    
            table th {
                font-size: 0.6rem;
                padding: 0.5rem;
                font-weight: 700;
                text-align: center;
                letter-spacing: 1px;
                background-color: #eff2f6;
                text-transform: uppercase;
            }
    
            table td {
                padding: 0.4rem;
                font-size: 0.65rem;
                font-weight: 300;
                text-align: center;
                color: rgb(56, 57, 87);
            }
    
            table tbody tr:nth-child(even) {
                background-color: #eff2f6;
            }
    
    
            footer>div {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: stretch;
                gap: 1rem;
                width: 50%;
            }
    
            footer span {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 0.3rem;
            }
    
            footer span h3 {
                line-height: 100%;
                font-size: 0.8rem;
                color: rgb(48, 51, 77);
            }
    
            footer span h4 {
                line-height: 100%;
                font-size: 0.8rem;
                text-transform: uppercase;
            }
        </style>
    </head>
    
    <body>
        <header>
            <h1>Sales report for period from ${date.start} to ${date.end}</h1>
            <ul>
                <li>Company: <b>Alexit</b></li>
                <li>Address: <b>California, Huntington Beach, Springfield Ave 368</b></li>
                <li>PIB: 0892387901</li>
            </ul>
        </header>
        <main>
            <table>
                <thead>
                    <tr>
                        <th>Group</th>
                        <th>UOM</th>
                        <th>Code</th>
                        <th>Name</th>
                        <th>Qty</th>
                        <th>Purchase price</th>
                        <th>Margin</th>
                        <th>UOM price</th>
                        <th>Tax base</th>
                        <th>VAT%</th>
                        <th>VAT</th>
                        <th>Sale value</th>
                    </tr>
                </thead>
                <tbody>
                    ${sales.map((sale: any) => {
            return (`
                            <tr>
                                <td>${getGroupName(sale.group_id)}</td>
                                <td>${sale.uom}</td>
                                <td>${sale.articleCode}</td>
                                <td>${sale.articleName}</td>
                                <td>${sale.quantity}</td>
                                <td>${sale.purchasePrice}</td>
                                <td>${sale.margin}%</td>
                                <td>${sale.pricePerUom}</td>
                                <td>${sale.taxBase}</td>
                                <td>${sale.vatRate}%</td>
                                <td>${sale.vat}</td>
                                <td>${sale.saleValue}</td>
                            </tr>
                            `)
        }).join("")}
                </tbody>
            </table>
        </main>
        <footer>
            <div>
                <span>
                    <h4>The total number of items sold</h4>
                    <h3>${totals.quantity}</h3>
                </span>
                <span>
                    <h4>Total tax base</h4>
                    <h3>${totals.taxBase}</h3>
                </span>
                <span>
                    <h4>Total VAT</h4>
                    <h3>${totals.vatAmount}</h3>
                </span><span>
                    <h4>Total income</h4>
                    <h3>${totals.saleValue}</h3>
                </span>
            </div>
        </footer>
    </body>
    
    </html>
        `
    )


};

export const accountingMail = (orderItems: any[], order: any, orders: any[], admin: string, users: User[], couriers: Courier[]) => {
    const ordersByDate = orders.filter(o => new Date(o.creationTime).getDate() === new Date().getDate());
    const ordersByThis = orders.filter(o => new Date(o.creationTime).getDate() === new Date(order.creationTime).getDate())

    const digitIf = (val: any) => String(Math.abs(val)).charAt(0) == val;

    const serialNum = () => {
        const byDateSorted = ordersByDate.sort((a, b) => new Date(a.creationTime).getTime() - new Date(b.creationTime).getTime());
        const byDateMatch = byDateSorted.find(o => o.creationTime === order.creationTime);
        const thisSorted = ordersByThis.sort((a, b) => new Date(a.creationTime).getTime() - new Date(b.creationTime).getTime());
        const thisMatch = thisSorted.find(o => o.creationTime === order.creationTime);

        let serialNum = "";
        if (byDateMatch) {
            const num = byDateSorted.indexOf(byDateMatch) + 1
            if (digitIf(num)) {
                serialNum = String("0" + num);
            } else if (!digitIf(num)) {
                serialNum = String(num);
            }
        } else {
            const num = thisSorted.indexOf(thisMatch) + 1;
            if (digitIf(num)) {
                serialNum = String("0" + num);
            } else if (!digitIf(num)) {
                serialNum = String(num);
            }
        }
        return serialNum;
    };

    const accountingNumber = () => {
        let accountingNumber = "";
        if (new Date(order.creationTime).getDate() === new Date().getDate()) {
            const today = new Date().toLocaleDateString(undefined, { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, "");
            const sub = `${(today.substring(0, 4) + today.substring(6, today.length))}/${serialNum()}`;
            accountingNumber = sub;
        } else if (new Date(order.creationTime).getDate() !== new Date().getDate()) {
            const thisOrderDate = new Date(order.creationTime).toLocaleDateString(undefined, { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, "");
            const sub = `${(thisOrderDate.substring(0, 4) + thisOrderDate.substring(6, thisOrderDate.length))}/${serialNum()}`;
            accountingNumber = sub;
        }
        return accountingNumber
    };


    const getUserName = (user_id: string) => {
        const user = users.find(u => u._id === user_id);
        return user?.firstname + ' ' + user?.lastname;
    };

    const getCourierName = (courier_id: string) => {
        return couriers.find(c => c._id === courier_id)?.name;
    };

    // return (`
    // <!DOCTYPE html>
    // <html lang="en">

    // <head>
    //     <meta charset="UTF-8">
    //     <meta name="viewport" content="width=device-width, initial-scale=1.0">
    //     <style type="text/css">
    //         html {
    //             font-size: 100%;
    //             box-sizing: border-box;
    //             width: 210mm;
    //             height: fit-content;
    //         }

    //         body {
    //             margin: 0px;
    //             padding: 1rem;
    //             padding-bottom: 100px;
    //             width: 210mm;
    //             height: fit-content;
    //             border: 4px solid rgb(41, 41, 167);
    //             display: flex;
    //             flex-direction: column;
    //             align-items: center;
    //         }

    //         header {
    //             display: flex;
    //             justify-content: center;
    //         }

    //         img {
    //             width: 250px;
    //             height: 90px;
    //         }

    //         main,
    //         section,
    //         footer {
    //             width: 100%;
    //         }

    //         .acc-header {
    //             border: 4px solid rgb(37, 37, 37);
    //             width: 200mm;
    //             padding: 7px 1rem 7px 1rem;
    //             display: flex;
    //             justify-content: space-between;
    //             line-height: 0;
    //         }

    //         .basic-info {
    //             display: flex;
    //             flex-direction: row;
    //             justify-content: space-between;
    //         }

    //         .styled-table {
    //             border-collapse: collapse;
    //             margin: 25px 0;
    //             font-size: 0.9em;
    //             font-family: sans-serif;
    //             width: 100%;
    //             box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
    //         }

    //         .styled-table thead tr {
    //             background-color: #009879;
    //             color: #ffffff;
    //             text-align: left;
    //         }

    //         .styled-table th,
    //         .styled-table td {
    //             padding: 12px 15px;
    //         }

    //         .styled-table tbody tr {
    //             border-bottom: 1px solid #dddddd;
    //         }

    //         .styled-table tbody tr:nth-of-type(even) {
    //             background-color: #f3f3f3;
    //         }

    //         .styled-table tbody tr:last-of-type {
    //             border-bottom: 2px solid #009879;
    //         }

    //         .styled-table tbody tr.active-row {
    //             font-weight: bold;
    //             color: #009879;
    //         }

    //         .foot-container {
    //             border-top: 4px solid rgb(53, 53, 53);
    //         }

    //         .foot-container {
    //             line-height: 0;
    //             padding-left: 70%;
    //         }
    //     </style>
    //     <title>Document</title>
    // </head>

    // <body>
    //     <header>
    //         <div class="acc-header">
    //             <div class="row1"><h1>AlexIT<h1/></div>
    //             <div class="row2">
    //                 <h3>AlexIT D.O.O. za proizvodnju i trgovinu</h3>
    //                 <p>Adresa: Stateboliuvo 14, 21410 Futog, RS</p>
    //                 <p>Telefon/fax: (+381) 21 442 442</p>

    //             </div>
    //         </div>
    //     </header>
    //     <main>
    //         <section class="section-1">
    //             <div class="basic-info">
    //                 <div style="line-height: 0;">
    //                     <p>Kupac: ${order.user.firstname + ' ' + order.user.lastname}</p>
    //                     <p>Adresa: ${order.user.street}, ${order.user.city}, ${order.user.country}</p>
    //                     <p>PIB: ${order.user.email}</p>
    //                     <p>MB: ${order.user.phone}</p>
    //                 </div>
    //                 <div style="display: flex; flex-direction: column;">
    //                     <strong>U Novom Sadu</strong>
    //                     <strong>${new Date().toISOString().slice(0, 10)}</strong>
    //                     <strong>Prodavac: ${admin}<strong/>
    //                 </div>
    //             </div>
    //             <div style="display: flex; gap: 13rem;">
    //                 <h1>Profaktura br:</h1>
    //                 <h1>${accountingNumber()}</h1>
    //             </div>
    //         </section>
    //         <section class="section-2">
    //             <table class="styled-table">
    //                 <thead>
    //                     <tr>
    //                         <th>R.B.</th>
    //                         <th>Naziv proizvoda</th>
    //                         <th>JM</th>
    //                         <th>Kol.</th>
    //                         <th>Cena po JM</th>
    //                         <th>Poreska osnovica</th>
    //                         <th>Stopa PDV</th>
    //                         <th>Iznos PDV</th>
    //                         <th>Popust</th>
    //                         <th>Za naplatu</th>
    //                     </tr>
    //                 </thead>
    //                 <tbody>
    //                 ${orderItems.map((item, index) => {
    //     return (`
    //                     <tr>
    //                         <td>${index}</td>
    //                         <td>${item.name}</td>
    //                         <td>${item.uom}</td>
    //                         <td>${item.quantity}</td>
    //                         <td>${item.priceByUom}</td>
    //                         <td>${item.taxBase}</td>
    //                         <td>${item.vatRate}%</td>
    //                         <td>${item.vatAmount}</td>
    //                         <td>${item.discount}%</td>
    //                         <td>${item.totalPayment}</td>
    //                     </tr>
    //                     `)
    // }).join("")}
    //                 </tbody>
    //             </table>
    //         </section>
    //         <footer>
    //             <div class="foot-container">
    //                 <p>Ukupna poreska osnovica: ${orderItems.reduce((prev, cur) => prev + cur.taxBase, 0)}</p>
    //                 <p>Obracunati PDV 20%: ${orderItems.reduce((prev, cur) => prev + cur.vatAmount, 0)}</p>
    //                 <p>${getCourierName(order.courier_id)}(${order.weight}kg): ${order.shippingCost}<p/>
    //                 <strong>UKUPNO ZA UPLATU: ${orderItems.reduce((prev, cur) => prev + cur.totalPayment, 0) + order.shippingCost}</strong>
    //             </div>
    //         </footer>
    //     </main>
    // </body>

    // </html>
    // `)


    return (`
    
        <!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Accounting</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@300..700&display=swap" rel="stylesheet">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Bungee+Shade&family=Quicksand:wght@300..700&display=swap"
        rel="stylesheet">
    <style type="text/css">
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Courier New', Courier, monospace;
            font-optical-sizing: auto;
            font-style: normal;
        }

        .alexit-logo {
            color: var(--main-black);
            letter-spacing: 5px;
            font-size: 1.1rem;
        }

        .alexit-logo>h1 {
            line-height: 100%;
            display: flex;
            font-family: 'Bungee Shade', sans-serif;
            letter-spacing: 7px;
            font-weight: 500;
        }

        .alexit-logo>h1>span {
            color: #ffce00;
            line-height: 100%;
            font-family: 'Bungee Shade', sans-serif;
        }

        a {
            text-decoration: none;
        }

        ul {
            list-style: none;
        }

        html {
            scroll-behavior: smooth;
            overflow-x: hidden;
            font-size: 16px;
            height: 297mm;
            width: 210mm;
            margin: auto;
        }

        body {
            width: 210mm;
            height: 297mm;
            background-color: #ffffff;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: stretch;
            padding: 2rem;
            gap: 1rem;
        }

        header {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: stretch;
            gap: 1.5rem;
        }

        footer {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: stretch;
            margin-top: auto;
        }

        header>span {
            background-color: #ffce00;
            height: 15px;
        }

        footer>span {
            background-color: #ffce00;
            height: 15px;
        }

        .title {
            padding: 1rem;
        }

        .title>h1 {
            line-height: 100%;
            font-weight: 300;
            letter-spacing: 5px;
            border-bottom: 1px solid #ebf2f5;
            padding-bottom: 1rem;
            position: relative;
            color: #5b5b69;
        }

        .header-container {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            grid-template-rows: repeat(2, 1fr);
            gap: 2rem;
            padding: 1rem;
        }

        .company-info {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: start;
            gap: 1rem;
            grid-column: 1 / 2;
            grid-row: 1 / 2;
        }

        .company-info>ul {
            display: flex;
            flex-direction: column;
            justify-content: start;
            align-items: start;
            gap: 0.5rem;
        }

        .company-info>ul>li {
            letter-spacing: 2px;
            line-height: 100%;
            font-size: 0.75rem;
            color: #5b5b69;
        }

        .customer-info {
            display: flex;
            flex-direction: column;
            justify-content: start;
            align-items: stretch;
            gap: 0.8rem;
            grid-column: 1 / 2;
            grid-row-end: 2 / 3;
        }

        .customer-info>h1 {
            line-height: 100%;
            font-weight: 700;
            font-size: 1rem;
            color: #ffce00;
            letter-spacing: 2px;
        }

        .customer-info>ul {
            display: flex;
            flex-direction: column;
            justify-content: start;
            align-items: start;
            gap: 0.5rem;
        }

        .customer-info>ul>li {
            letter-spacing: 2px;
            line-height: 100%;
            font-size: 0.75rem;
            color: #5b5b69;
        }

        .invoice-info {
            grid-column: 2 / 3;
            grid-row: 2 / 3;
            border: 1px solid #ebf2f5;
            padding: 1.5rem 2rem;
            display: flex;
            justify-content: start;
            align-items: center;
        }

        .invoice-info>ul {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: stretch;
            gap: 1rem;
        }

        .invoice-info>ul>li {
            letter-spacing: 2px;
            line-height: 100%;
            font-size: 0.75rem;
            color: #5b5b69;
            display: flex;
            justify-content: start;
            align-items: baseline;
            gap: 0.5rem;
        }

        .invoice-info>ul>li>span {
            flex: 1;
            border-bottom: 1px dashed #c4cfd3;
        }


        main {
            display: flex;
            flex-direction: column;
            justify-content: start;
            align-items: stretch;
            height: fit-content;
            padding: 1rem;
        }

        .main-table {
            border-top: 3px solid #ffce00;
            border-collapse: collapse;
        }

        .main-table th {
            letter-spacing: 2px;
            font-size: .675rem;
            padding: 0.7rem 0.5rem;
            font-weight: 500;
            color: #191919;
        }

        .main-table>tbody>tr {
            border-bottom: 1px solid #ebebeb;
        }

        .main-table td {
            font-size: 0.6rem;
            text-align: center;
            padding: 0.8rem 0.5rem;
            color: #353546;
            letter-spacing: 2px;
        }

        .totals-container {
            padding-top: 2.5rem;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: end;
            gap: 2rem;
        }

        .totals-container>ul {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: stretch;
            gap: 1rem;
        }

        .totals-container>ul>li {
            font-size: 0.75rem;
            letter-spacing: 2px;
            flex: 1;
            display: flex;
            justify-content: space-between;
            gap: 5rem;
        }

        .totals-container span {
            color: #5b5b69;
            font-weight: 400;
        }

        .totals-container output {
            font-size: 0.8rem;
            font-weight: 600;
        }
    </style>
</head>

<body>
    <header>
        <span></span>

        <div class="title">
            <h1>PROFORMA INVOICE</h1>
        </div>

        <div class="header-container">
            <div class="company-info">
                <div class="alexit-logo">
                    <h1>ALEX<span>IT</span></h1>
                </div>
                <ul>
                    <li>348 Springfield Ave, Huntington Beach</li>
                    <li>California, 94751</li>
                    <li>Phone: (+381) 6377001780</li>
                </ul>
            </div>
            <div class="customer-info">
                <h1>Customer info:</h1>
                <ul>
                    <li>${order.user.firstname} ${order.user.lastname}</li>
                    <li>${order.user.street}, ${order.user.city}</li>
                    <li>${order.user.country}, ${order.user.zip}</li>
                </ul>
            </div>
            <div class="invoice-info">
                <ul>
                    <li>Date<span></span>${new Date().toISOString().slice(0, 10)}</li>
                    <li>Proforma invoice number<span></span>${accountingNumber()}</li>
                    <li>Order number<span></span>#${order.number}</li>
                    <li>Payment method<span></span>On delivery</li>
                </ul>
            </div>
        </div>

    </header>
    <main>
        <table class="main-table">
            <thead>
                <tr>
                    <th>R.B.</th>
                    <th>Name</th>
                    <th>UOM</th>
                    <th>Qty</th>
                    <th>Price per UOM</th>
                    <th>Tax base</th>
                    <th>VAT rate</th>
                    <th>VAT amount</th>
                    <th>Discount</th>
                    <th>Total</th>
                </tr>
            </thead>
            <tbody>
        ${orderItems.map((item, index) => {
        return (`
               <tr>
                   <td>${index}</td>
                   <td>${item.name}</td>
                   <td>${item.uom}</td>
                   <td>${item.quantity}</td>
                   <td>${item.priceByUom}</td>
                   <td>${item.taxBase}</td>
                   <td>${item.vatRate}%</td>
                   <td>${item.vatAmount}</td>
                   <td>${item.discount}%</td>
                   <td>${item.totalPayment}</td>
               </tr>
            `)
    }).join("")}
            </tbody>
        </table>
        <div class="totals-container">
            <ul>
                <li>
                    <span>Total tax base:</span>
                    <output>${orderItems.reduce((prev, cur) => prev + cur.taxBase, 0)}<small> RSD</small></output>
                </li>
                <li>
                    <span>Calculated VAT 20%:</span>
                    <output>${orderItems.reduce((prev, cur) => prev + cur.vatAmount, 0)}<small> RSD</small></output>
                </li>
                <li>
                    <span>${getCourierName(order.courier_id)}(${order.weight}kg):</span>
                    <output>${order.shippingCost}<small> RSD</small></output>
                </li>
                <li>
                    <span>Total:</span>
                    <output>${orderItems.reduce((prev, cur) => prev + cur.totalPayment, 0) + order.shippingCost}<small> RSD</small></output>
                </li>
            </ul>
        </div>
    </main>
    <footer>
        <span></span>
    </footer>
</body>

</html>
        
    `)


};

export const orderStatusMail = (orderStatusMessage: string, order: any) => {
    return (`
    <!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style type="text/css">
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        html {
            font-size: 100%;
        }

        main {
            width: 100%;
        }
        .alexit{
            border-style: solid;
            padding: 20px;
            margin: 20px;
            text-align: center;
            font-size: 25px;
            border-width: 10px;
        }
    </style>
    <title>Document</title>
</head>

<body>
    <main>
        <div>
            <p>Broj narudžbe ${order.number}</p>
            <p>Datum naručivanja: ${new Date(order.creationTime).toLocaleDateString()}</p>
            <br>
            <p>Vaša narudžba je ažurirana i njen status je:</p>
            <p>${order.status}</p>
            <br><br>
            ${!!orderStatusMessage ? `
            <div>
                Komentar narudžbe:
                <br><br>
                ${orderStatusMessage}
            </div>
            ` : ""}


            <br><br><br>
            Ukoliko imate bilo kakvih pitanja budite slobodni i odgovorite na ovaj email.
        </div>
    </main>
</body>

</html>
    `);
};

export const newsletterOfferMail = (title: string, link: string) => {

    return (`
    <!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Vibrant Design</title>
<style>
    body {
        margin: 0;
        padding: 0;
        font-family: Arial, sans-serif;
        background-color: #F8F8F8;
        color: #333;
    }
    .container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 50px 20px;
        text-align: center;
    }
    h1 {
        font-size: 3em;
        margin-bottom: 30px;
        color: #FF4081; /* Vibrant Pink */
    }
    .image-container {
        overflow: hidden;
        position: relative;
        max-width: 100%;
        margin-bottom: 50px;
    }
    .image-container img {
        width: 100%;
        height: auto;
    }
</style>
</head>
<body>

        <div class="container">
            <a href="${link}"><h1>${title}</h1></a>
            <div class="image-container">
                <img src="cid:offerfeaturedslika" loading="lazy" role="presentation" decoding="async" fetchpriority="high" alt="peaceandlove">
            </div>
        </div>

</body>
</html>
    
    `)
}
