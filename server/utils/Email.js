const nodemailer = require("nodemailer");
const { convert } = require("html-to-text");

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name ? user.name.split(" ")[0] : "Admin";
    this.url = url;
    this.from = `Madina Refrigeration <${process.env.EMAIL_FROM}>`;
  }

  newTransport() {
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  // Send the actual email
  async send(html, subject) {
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: convert(html), // Optionally convert HTML to plain text
    };

    // Create a transport and send email
    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    const html = `
      <h1>Welcome to the Madina Refrigeration Family, ${this.firstName}!</h1>
      <p>We are excited to have you onboard.</p>
      <p>Click <a href="${this.url}">here</a> to get verified.</p>
    `;

    await this.send(html, "Welcome to the Madina Refrigeration Family!");
  }

  async sendPasswordReset() {
    const html = `
    <h1>Password Reset Request</h1>
    <p>Hi ${this.firstName},</p>
    <p>You requested a password reset. Click the link below to set a new password. This link is valid for only 10 minutes.</p>
    <p><a href="${this.url}">Reset your password</a></p>
    <p>If you did not request a password reset, please ignore this email.</p>
    <p>Thanks,</p>
    <p>The Madina Refrigeration Team</p>
  `;

    await this.send(
      html,
      "Your password reset token (valid only for 10 minutes)"
    );
  }

  async sendInvoice(order) {
    const html = `
      <h1>Your Order Invoice</h1>
      <p>Hi ${this?.firstName},</p>
      <p>Thank you for your order. Here are the details:</p>
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr>
            <th style="border: 1px solid #ddd; padding: 8px;">Product</th>
            <th style="border: 1px solid #ddd; padding: 8px;">Quantity</th>
            <th style="border: 1px solid #ddd; padding: 8px;">Size</th>
            <th style="border: 1px solid #ddd; padding: 8px;">Price</th>
            <th style="border: 1px solid #ddd; padding: 8px;">Discount (Per Unit)</th>
            <th style="border: 1px solid #ddd; padding: 8px;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${order?.products
            .map((item) => {
              const originalPrice = item?.product?.price;
              const discountPrice = item?.product?.salePrice || originalPrice;
              const discountAmount = originalPrice - discountPrice;

              const discountPercentage = (
                (discountAmount / originalPrice) *
                100
              )?.toFixed(2);

              const subtotal = discountPrice * item?.quantity;

              return `
              <tr>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${
                  item?.product?.title
                }</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${
                  item?.quantity
                } Kg.</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${
                  item?.product?.size || "N/A"
                }</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">৳ ${originalPrice?.toFixed(
                  2
                )}</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">৳ ${discountAmount?.toFixed(
                  2
                )} (${discountPercentage}%)</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">৳ ${subtotal?.toFixed(
                  2
                )}</td>
              </tr>
            `;
            })
            .join("")}
        </tbody>
      </table>
      <p><strong>Sub-Total: ৳ ${order?.totalCost}</strong></p>
      <p><strong>Order Status: ${order?.orderStatus.toUpperCase()}</strong></p>
      <p>Thanks for shopping with us!</p>
    `;

    await this.send(html, "Your Order Invoice");
  }

  async sendStockAlert(product) {
    const html = `
      <h1>Stock Alert for Product: ${product.title}</h1>
      <p>Dear Admin,</p>
      <p>The stock for the product "<strong>${product.title}</strong>" (SKU: ${product.sku}) is running low or is out of stock.</p>
      <p>Current stock: <strong>${product.stock}</strong></p>
      <p>Please consider restocking the product to ensure availability for future orders.</p>
      <p>Thanks,</p>
      <p>The Madina Refrigeration System</p>
    `;

    await this.send(
      html,
      `Stock Alert: ${product.title} (SKU: ${product.sku})`
    );
  }
};
