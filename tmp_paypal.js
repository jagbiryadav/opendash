const fs = require('fs');
const csv = fs.readFileSync('C:\\Users\\jagbi\\Downloads\\sales.csv', 'utf-8');
const lines = csv.trim().split('\n');
const header = lines[0].split(',');
// Find total_amount and payment_method column indices
const totalIdx = header.indexOf('total_amount');
const pmtIdx = header.indexOf('payment_method');
console.log('Columns:', header.join('|'));
console.log('total_amount index:', totalIdx, 'payment_method index:', pmtIdx);

let sum = 0;
let count = 0;
let rows = [];
for (let i = 1; i < lines.length; i++) {
  // Split carefully - but the addresses have commas. Let's parse differently.
  const line = lines[i];
  // Find PayPal by searching the line
  if (line.includes(',PayPal,')) {
    const parts = line.split(',');
    // total_amount is the 10th field (0-indexed: 9), payment_method is 11th (index 10)
    const amtStr = parts[9];
    const id = parts[0];
    if (amtStr && amtStr.trim() !== '') {
      const amt = parseFloat(amtStr);
      if (!isNaN(amt)) {
        sum += amt;
        count++;
      }
    }
  }
}
console.log('PayPal transaction count with amounts:', count);
console.log('Total:', sum);
