const fs = require('fs');
const path = require('path');

const API_URL = "http://127.0.0.1:5000";
const REPLACEMENT = "${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000'}";
const REPLACEMENT_STR = "process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000'";

const filesToUpdate = [
  "frontend-next/src/components/admin/EditProductModal.tsx",
  "frontend-next/src/app/admin/page.tsx",
  "admin-next/src/app/page.tsx",
  "admin-next/src/app/reviews/page.tsx",
  "admin-next/src/app/stock/page.tsx",
  "admin-next/src/app/products/page.tsx",
  "admin-next/src/app/orders/page.tsx",
  "admin-next/src/app/add-product/page.tsx",
  "admin-next/src/components/EditProductModal.tsx",
  "frontend-next/next.config.ts"
];

filesToUpdate.forEach(file => {
  const fullPath = path.join(__dirname, file);
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf8');
    
    // Replace 'http://127.0.0.1:5000/api/...' -> `${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000'}/api/...`
    content = content.replace(/'http:\/\/127\.0\.0\.1:5000(.*?)'/g, (match, p1) => {
        return "`" + REPLACEMENT + p1 + "`";
    });

    // Replace "http://127.0.0.1:5000/api/..." -> `${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000'}/api/...`
    content = content.replace(/"http:\/\/127\.0\.0\.1:5000(.*?)"/g, (match, p1) => {
        return "`" + REPLACEMENT + p1 + "`";
    });

    // Replace `http://127.0.0.1:5000/api/...` -> `${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000'}/api/...`
    content = content.replace(/`http:\/\/127\.0\.0\.1:5000(.*?)`/g, (match, p1) => {
        return "`" + REPLACEMENT + p1 + "`";
    });

    // Replace 'http://127.0.0.1:5000' + product.image -> (process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000') + product.image
    content = content.replace(/'http:\/\/127\.0\.0\.1:5000'\s*\+/g, "(" + REPLACEMENT_STR + ") +");

    fs.writeFileSync(fullPath, content);
    console.log("Updated", file);
  }
});
