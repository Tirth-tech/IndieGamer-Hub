import nodemailer from 'nodemailer';

const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

// ── Send developer approval request to admin ──────────────────────────────────
export const sendDeveloperApprovalEmail = async ({ developerId, developerName, developerEmail }) => {
  const baseUrl = process.env.BASE_URL || 'http://localhost:5000';
  const approveUrl = `${baseUrl}/api/auth/approve/${developerId}?action=approve`;
  const rejectUrl  = `${baseUrl}/api/auth/approve/${developerId}?action=reject`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8" />
      <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; background: #0D0D0D; color: #E0E0E0; margin: 0; padding: 0; }
        .container { max-width: 580px; margin: 40px auto; background: #17130F; border: 1px solid #3A2818; border-radius: 12px; overflow: hidden; }
        .header { background: linear-gradient(135deg, #FF6B00, #FFB000); padding: 28px 32px; }
        .header h1 { color: #fff; font-size: 1.4rem; margin: 0; font-weight: 800; }
        .header p { color: rgba(255,255,255,0.85); margin: 6px 0 0; font-size: 0.9rem; }
        .body { padding: 28px 32px; }
        .info-box { background: rgba(255,107,0,0.08); border: 1px solid rgba(255,107,0,0.25); border-radius: 8px; padding: 16px 20px; margin: 20px 0; }
        .info-box p { margin: 4px 0; font-size: 0.92rem; color: #C4B5A5; }
        .info-box strong { color: #fff; }
        .btn-row { display: flex; gap: 14px; margin: 28px 0 8px; }
        .btn { display: inline-block; padding: 13px 28px; border-radius: 8px; text-decoration: none; font-weight: 800; font-size: 0.95rem; text-align: center; }
        .btn-approve { background: linear-gradient(135deg, #FF6B00, #FFB000); color: #fff; }
        .btn-reject  { background: rgba(255,68,68,0.15); color: #FF6B6B; border: 1px solid rgba(255,68,68,0.4); }
        .footer { padding: 16px 32px; border-top: 1px solid #3A2818; font-size: 0.78rem; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎮 New Developer Registration</h1>
          <p>IndieGamer Hub — Admin Approval Required</p>
        </div>
        <div class="body">
          <p style="font-size:0.95rem;color:#C4B5A5;margin:0 0 16px;">
            A new user has requested <strong style="color:#FF6B00">Developer</strong> access on IndieGamer Hub.
            Review their details below and approve or reject their request.
          </p>

          <div class="info-box">
            <p>👤 <strong>Name:</strong> ${developerName}</p>
            <p>📧 <strong>Email:</strong> ${developerEmail}</p>
            <p>🆔 <strong>User ID:</strong> ${developerId}</p>
            <p>⏰ <strong>Requested:</strong> ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST</p>
          </div>

          <p style="font-size:0.88rem;color:#9B9B9B;margin:0 0 8px;">
            As a Developer, this user will be able to upload and manage games on the platform.
          </p>

          <div class="btn-row">
            <a href="${approveUrl}" class="btn btn-approve">✅ Approve Developer</a>
            <a href="${rejectUrl}"  class="btn btn-reject">❌ Reject Request</a>
          </div>

          <p style="font-size:0.78rem;color:#555;margin-top:20px;">
            Or copy these links:<br/>
            Approve: <a href="${approveUrl}" style="color:#FF6B00">${approveUrl}</a><br/>
            Reject:  <a href="${rejectUrl}"  style="color:#FF6B6B">${rejectUrl}</a>
          </p>
        </div>
        <div class="footer">
          IndieGamer Hub Admin Panel · This email was sent automatically · Do not reply
        </div>
      </div>
    </body>
    </html>
  `;

  const transporter = createTransporter();
  await transporter.sendMail({
    from: `"IndieGamer Hub" <${process.env.EMAIL_USER}>`,
    to: process.env.ADMIN_EMAIL,
    subject: `🎮 Developer Request: ${developerName} wants Developer access`,
    html,
  });
};

// ── Notify developer of approval result ─────────────────────────────────────
export const sendApprovalResultEmail = async ({ developerEmail, developerName, approved }) => {
  const html = approved ? `
    <div style="font-family:Arial;background:#0D0D0D;color:#E0E0E0;padding:32px;max-width:520px;margin:auto;border:1px solid #3A2818;border-radius:12px;">
      <h2 style="color:#FF6B00;">🎉 Welcome to IndieGamer Hub, Developer!</h2>
      <p>Hi <strong>${developerName}</strong>,</p>
      <p>Great news! Your developer account has been <strong style="color:#39FF88">approved</strong> by the admin.</p>
      <p>You can now log in and start uploading your games to the platform.</p>
      <a href="${process.env.BASE_URL?.replace('5000','3000') || 'http://localhost:3000'}/login" 
         style="display:inline-block;padding:12px 24px;background:linear-gradient(135deg,#FF6B00,#FFB000);color:#fff;border-radius:8px;text-decoration:none;font-weight:800;margin-top:16px;">
        Go to IndieGamer Hub
      </a>
    </div>
  ` : `
    <div style="font-family:Arial;background:#0D0D0D;color:#E0E0E0;padding:32px;max-width:520px;margin:auto;border:1px solid #3A2818;border-radius:12px;">
      <h2 style="color:#FF6B6B;">Developer Request Rejected</h2>
      <p>Hi <strong>${developerName}</strong>,</p>
      <p>Unfortunately, your developer account request was <strong style="color:#FF6B6B">not approved</strong> at this time.</p>
      <p>If you believe this is a mistake, please contact the admin directly.</p>
    </div>
  `;

  const transporter = createTransporter();
  await transporter.sendMail({
    from: `"IndieGamer Hub" <${process.env.EMAIL_USER}>`,
    to: developerEmail,
    subject: approved ? '✅ Developer Account Approved — IndieGamer Hub' : '❌ Developer Request Update — IndieGamer Hub',
    html,
  });
};

// ── Notify developer when their submitted game is approved or rejected by admin ──
export const sendGameApprovalResultEmail = async ({ developerEmail, developerName, gameTitle, approved, gameId }) => {
  const catalogUrl = `${process.env.BASE_URL?.replace('5000','3000') || 'http://localhost:3000'}/game/${gameId}`;

  const html = approved ? `
    <div style="font-family:Arial;background:#0D0D0D;color:#E0E0E0;padding:32px;max-width:560px;margin:auto;border:1px solid #3A2818;border-radius:12px;">
      <h2 style="color:#FF6B00;">🎉 Game Published on IndieGamer Hub!</h2>
      <p>Hi <strong>${developerName}</strong>,</p>
      <p>Great news! Your game submission <strong style="color:#fff">"${gameTitle}"</strong> has been <strong style="color:#39FF88">approved</strong> by the platform admin and is now live on our public catalog!</p>
      <p>Gamers around the world can now discover, play, and review your title.</p>
      <a href="${catalogUrl}" 
         style="display:inline-block;padding:12px 24px;background:linear-gradient(135deg,#FF6B00,#FFB000);color:#fff;border-radius:8px;text-decoration:none;font-weight:800;margin-top:16px;">
        🎮 View Live Game Page
      </a>
    </div>
  ` : `
    <div style="font-family:Arial;background:#0D0D0D;color:#E0E0E0;padding:32px;max-width:560px;margin:auto;border:1px solid #3A2818;border-radius:12px;">
      <h2 style="color:#FF6B6B;">Game Submission Update</h2>
      <p>Hi <strong>${developerName}</strong>,</p>
      <p>Your game submission <strong>"${gameTitle}"</strong> was <strong style="color:#FF6B6B">not approved</strong> for publication at this time.</p>
      <p>If you have any questions or want to update details, please contact the admin.</p>
    </div>
  `;

  try {
    const transporter = createTransporter();
    await transporter.sendMail({
      from: `"IndieGamer Hub" <${process.env.EMAIL_USER}>`,
      to: developerEmail,
      subject: approved ? `🎉 Published: "${gameTitle}" is now live!` : `❌ Update on your game submission "${gameTitle}"`,
      html,
    });
  } catch (err) {
    console.warn('Failed to send game approval result email:', err.message);
  }
};
