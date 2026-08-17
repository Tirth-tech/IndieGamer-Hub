import nodemailer from 'nodemailer';

const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
  });
};

// ── Send developer approval request to admin ──────────────────────────────────
export const sendDeveloperApprovalEmail = async ({ developerId, developerName, developerEmail }) => {
  const baseUrl = process.env.BASE_URL || 'http://localhost:5000';
  const approveUrl = `${baseUrl}/api/auth/approve/${developerId}?action=approve`;
  const rejectUrl  = `${baseUrl}/api/auth/approve/${developerId}?action=reject`;
  const adminEmail = process.env.ADMIN_EMAIL || 'tirthkapuriya18@gmail.com';

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    </head>
    <body style="font-family: 'Segoe UI', Arial, sans-serif; background-color: #0D0D0D; color: #E0E0E0; margin: 0; padding: 20px;">
      <div style="max-width: 580px; margin: 20px auto; background-color: #17130F; border: 1px solid #3A2818; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.5);">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #FF6B00, #FFB000); padding: 28px 32px;">
          <h1 style="color: #ffffff; font-size: 1.4rem; margin: 0; font-weight: 800;">🎮 New Developer Registration</h1>
          <p style="color: rgba(255,255,255,0.9); margin: 6px 0 0; font-size: 0.9rem;">IndieGamer Hub — Admin Action Required</p>
        </div>

        <!-- Body -->
        <div style="padding: 28px 32px;">
          <p style="font-size: 0.95rem; color: #C4B5A5; margin: 0 0 16px; line-height: 1.5;">
            A new user has registered and requested <strong style="color: #FF6B00;">Indie Developer</strong> access on IndieGamer Hub. Please review their application below and select an action to Approve or Reject.
          </p>

          <!-- Info Box -->
          <div style="background-color: rgba(255,107,0,0.08); border: 1px solid rgba(255,107,0,0.25); border-radius: 8px; padding: 18px 20px; margin: 20px 0;">
            <p style="margin: 6px 0; font-size: 0.92rem; color: #C4B5A5;">👤 <strong style="color: #ffffff;">Name:</strong> ${developerName}</p>
            <p style="margin: 6px 0; font-size: 0.92rem; color: #C4B5A5;">📧 <strong style="color: #ffffff;">Email:</strong> ${developerEmail}</p>
            <p style="margin: 6px 0; font-size: 0.92rem; color: #C4B5A5;">🆔 <strong style="color: #ffffff;">User ID:</strong> ${developerId}</p>
            <p style="margin: 6px 0; font-size: 0.92rem; color: #C4B5A5;">⏰ <strong style="color: #ffffff;">Requested At:</strong> ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST</p>
          </div>

          <p style="font-size: 0.88rem; color: #9B9B9B; margin: 0 0 20px; line-height: 1.4;">
            As an approved Developer, this account will be authorized to submit, publish, and manage indie games on the platform.
          </p>

          <!-- Action Buttons with pure inline styles for Gmail compatibility -->
          <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin: 24px 0;">
            <tr>
              <td align="center" style="padding-right: 8px;">
                <a href="${approveUrl}" target="_blank" style="display: inline-block; padding: 14px 24px; background: #FF6B00; background: linear-gradient(135deg, #FF6B00, #FFB000); color: #ffffff !important; text-decoration: none !important; font-weight: 800; font-size: 0.95rem; border-radius: 8px; text-align: center; border: 1px solid #FF6B00;">
                  ✅ Approve Developer
                </a>
              </td>
              <td align="center" style="padding-left: 8px;">
                <a href="${rejectUrl}" target="_blank" style="display: inline-block; padding: 14px 24px; background-color: #2A1515; color: #FF6B6B !important; text-decoration: none !important; font-weight: 800; font-size: 0.95rem; border-radius: 8px; text-align: center; border: 1px solid rgba(255,68,68,0.5);">
                  ❌ Reject Request
                </a>
              </td>
            </tr>
          </table>

          <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #2D2218; font-size: 0.78rem; color: #777777; line-height: 1.6;">
            Direct links if buttons are disabled by your mail client:<br/>
            <strong>Approve:</strong> <a href="${approveUrl}" style="color: #FF6B00; word-break: break-all;">${approveUrl}</a><br/>
            <strong>Reject:</strong> <a href="${rejectUrl}" style="color: #FF6B6B; word-break: break-all;">${rejectUrl}</a>
          </div>
        </div>

        <div style="padding: 16px 32px; background-color: #110E0B; border-top: 1px solid #2D2218; font-size: 0.78rem; color: #666666; text-align: center;">
          IndieGamer Hub Admin Panel · Automated Notification
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    const transporter = createTransporter();
    const info = await transporter.sendMail({
      from: `"IndieGamer Hub" <${process.env.EMAIL_USER}>`,
      to: adminEmail,
      subject: `🎮 Developer Request: ${developerName} wants Developer access`,
      html,
    });
    console.log(`✅ Admin approval email sent to ${adminEmail} (MsgID: ${info.messageId})`);
    return info;
  } catch (err) {
    console.error(`❌ Failed to send admin approval email to ${adminEmail}:`, err.message);
    throw err;
  }
};

// ── Notify developer of approval result ─────────────────────────────────────
export const sendApprovalResultEmail = async ({ developerEmail, developerName, approved }) => {
  const frontendUrl = process.env.FRONTEND_URL || 'https://indie-gamer-hub.vercel.app';
  const loginUrl = `${frontendUrl}/login`;
  const homeUrl = `${frontendUrl}/`;

  const html = approved ? `
    <!DOCTYPE html>
    <html>
    <body style="font-family: 'Segoe UI', Arial, sans-serif; background-color: #0D0D0D; color: #E0E0E0; margin: 0; padding: 20px;">
      <div style="max-width: 540px; margin: 20px auto; background-color: #17130F; border: 1px solid #3A2818; border-radius: 12px; padding: 32px; box-shadow: 0 4px 20px rgba(0,0,0,0.5);">
        <div style="text-align: center; margin-bottom: 20px;">
          <div style="display: inline-block; width: 60px; height: 60px; border-radius: 50%; background: linear-gradient(135deg, #39FF88, #059669); line-height: 60px; font-size: 1.8rem;">🎉</div>
        </div>
        <h2 style="color: #FF6B00; font-size: 1.5rem; margin-top: 0; text-align: center;">Welcome to IndieGamer Hub!</h2>
        <p style="font-size: 1rem; color: #FFFFFF;">Hi <strong>${developerName}</strong>,</p>
        <p style="font-size: 0.95rem; color: #C4B5A5; line-height: 1.6;">
          Great news! Your <strong style="color: #39FF88;">Developer Account</strong> has been approved by the platform administrator.
        </p>
        <p style="font-size: 0.95rem; color: #C4B5A5; line-height: 1.6;">
          You can now log in, submit your indie games to our catalog, track performance, and connect with the community.
        </p>
        <div style="text-align: center; margin-top: 28px;">
          <a href="${loginUrl}" style="display: inline-block; padding: 14px 28px; background: linear-gradient(135deg, #FF6B00, #FFB000); color: #ffffff !important; text-decoration: none !important; font-weight: 800; font-size: 1rem; border-radius: 8px;">
            🚀 Log In to Developer Portal
          </a>
        </div>
      </div>
    </body>
    </html>
  ` : `
    <!DOCTYPE html>
    <html>
    <body style="font-family: 'Segoe UI', Arial, sans-serif; background-color: #0D0D0D; color: #E0E0E0; margin: 0; padding: 20px;">
      <div style="max-width: 540px; margin: 20px auto; background-color: #17130F; border: 1px solid #3A2818; border-radius: 12px; padding: 32px; box-shadow: 0 4px 20px rgba(0,0,0,0.5);">
        <div style="text-align: center; margin-bottom: 20px;">
          <div style="display: inline-block; width: 60px; height: 60px; border-radius: 50%; background: rgba(255,68,68,0.15); border: 1px solid rgba(255,68,68,0.4); line-height: 60px; font-size: 1.8rem;">❌</div>
        </div>
        <h2 style="color: #FF6B6B; font-size: 1.4rem; margin-top: 0; text-align: center;">Developer Request Status Update</h2>
        <p style="font-size: 1rem; color: #FFFFFF;">Hi <strong>${developerName}</strong>,</p>
        <p style="font-size: 0.95rem; color: #C4B5A5; line-height: 1.6;">
          Thank you for your interest in IndieGamer Hub. Regrettably, your request for a Developer account was <strong style="color: #FF6B6B;">not approved</strong> by the admin at this time.
        </p>
        <p style="font-size: 0.95rem; color: #C4B5A5; line-height: 1.6;">
          You are still welcome to browse games, participate in community forums, and write reviews as a Gamer member.
        </p>
        <div style="text-align: center; margin-top: 28px;">
          <a href="${homeUrl}" style="display: inline-block; padding: 12px 24px; background: rgba(255,255,255,0.08); color: #ffffff !important; text-decoration: none !important; font-weight: 700; font-size: 0.9rem; border-radius: 8px; border: 1px solid rgba(255,255,255,0.2);">
            Browse IndieGamer Hub
          </a>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    const transporter = createTransporter();
    const info = await transporter.sendMail({
      from: `"IndieGamer Hub" <${process.env.EMAIL_USER}>`,
      to: developerEmail,
      subject: approved ? '✅ Developer Account Approved — IndieGamer Hub' : '❌ Developer Account Update — IndieGamer Hub',
      html,
    });
    console.log(`✅ Developer ${approved ? 'approval' : 'rejection'} email sent to ${developerEmail} (MsgID: ${info.messageId})`);
    return info;
  } catch (err) {
    console.error(`❌ Failed to send developer ${approved ? 'approval' : 'rejection'} email to ${developerEmail}:`, err.message);
    throw err;
  }
};

// ── Notify developer when their submitted game is approved or rejected by admin ──
export const sendGameApprovalResultEmail = async ({ developerEmail, developerName, gameTitle, approved, gameId }) => {
  const frontendUrl = process.env.FRONTEND_URL || 'https://indie-gamer-hub.vercel.app';
  const catalogUrl = `${frontendUrl}/game/${gameId}`;

  const html = approved ? `
    <!DOCTYPE html>
    <html>
    <body style="font-family: 'Segoe UI', Arial, sans-serif; background-color: #0D0D0D; color: #E0E0E0; margin: 0; padding: 20px;">
      <div style="max-width: 560px; margin: 20px auto; background-color: #17130F; border: 1px solid #3A2818; border-radius: 12px; padding: 32px; box-shadow: 0 4px 20px rgba(0,0,0,0.5);">
        <h2 style="color: #FF6B00; font-size: 1.4rem; margin-top: 0;">🎉 Game Published on IndieGamer Hub!</h2>
        <p style="color: #FFFFFF;">Hi <strong>${developerName}</strong>,</p>
        <p style="color: #C4B5A5; line-height: 1.6;">
          Great news! Your game submission <strong style="color: #ffffff;">"${gameTitle}"</strong> has been <strong style="color: #39FF88;">approved</strong> by the platform admin and is now live on our public catalog!
        </p>
        <p style="color: #C4B5A5; line-height: 1.6;">Gamers around the world can now discover, play, and review your title.</p>
        <div style="text-align: center; margin-top: 24px;">
          <a href="${catalogUrl}" style="display: inline-block; padding: 14px 28px; background: linear-gradient(135deg, #FF6B00, #FFB000); color: #ffffff !important; text-decoration: none !important; font-weight: 800; font-size: 0.95rem; border-radius: 8px;">
            🎮 View Live Game Page
          </a>
        </div>
      </div>
    </body>
    </html>
  ` : `
    <!DOCTYPE html>
    <html>
    <body style="font-family: 'Segoe UI', Arial, sans-serif; background-color: #0D0D0D; color: #E0E0E0; margin: 0; padding: 20px;">
      <div style="max-width: 560px; margin: 20px auto; background-color: #17130F; border: 1px solid #3A2818; border-radius: 12px; padding: 32px; box-shadow: 0 4px 20px rgba(0,0,0,0.5);">
        <h2 style="color: #FF6B6B; font-size: 1.4rem; margin-top: 0;">Game Submission Update</h2>
        <p style="color: #FFFFFF;">Hi <strong>${developerName}</strong>,</p>
        <p style="color: #C4B5A5; line-height: 1.6;">
          Your game submission <strong>"${gameTitle}"</strong> was <strong style="color: #FF6B6B;">not approved</strong> for publication at this time.
        </p>
        <p style="color: #C4B5A5; line-height: 1.6;">If you have any questions or want to update details, please contact the admin.</p>
      </div>
    </body>
    </html>
  `;

  try {
    const transporter = createTransporter();
    const info = await transporter.sendMail({
      from: `"IndieGamer Hub" <${process.env.EMAIL_USER}>`,
      to: developerEmail,
      subject: approved ? `🎉 Published: "${gameTitle}" is now live!` : `❌ Update on your game submission "${gameTitle}"`,
      html,
    });
    console.log(`✅ Game ${approved ? 'approval' : 'rejection'} email sent to ${developerEmail} (MsgID: ${info.messageId})`);
    return info;
  } catch (err) {
    console.warn('Failed to send game approval result email:', err.message);
  }
};

