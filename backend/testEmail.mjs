import dotenv from 'dotenv';
import { sendDeveloperApprovalEmail, sendApprovalResultEmail } from './services/emailService.js';

dotenv.config();

console.log('Testing Developer Approval Email to Admin...');

async function runTest() {
  try {
    // 1. Test Admin Email Notification when Developer Registers
    console.log('1. Sending Developer Registration Approval Request Email to Admin...');
    await sendDeveloperApprovalEmail({
      developerId: 'test_dev_id_12345',
      developerName: 'John Indie Dev',
      developerEmail: 'testdev_sample@example.com'
    });
    console.log('✅ Step 1 Success: Admin Email Sent!');

    // 2. Test Developer Approval Email Notification
    console.log('2. Sending Approval Result Email to Developer (Approved = true)...');
    await sendApprovalResultEmail({
      developerEmail: process.env.ADMIN_EMAIL, // sending to self for verification
      developerName: 'John Indie Dev',
      approved: true
    });
    console.log('✅ Step 2 Success: Developer Approval Email Sent!');

    // 3. Test Developer Rejection Email Notification
    console.log('3. Sending Approval Result Email to Developer (Approved = false)...');
    await sendApprovalResultEmail({
      developerEmail: process.env.ADMIN_EMAIL,
      developerName: 'John Indie Dev',
      approved: false
    });
    console.log('✅ Step 3 Success: Developer Rejection Email Sent!');

    console.log('\n🎉 ALL EMAIL WORKFLOW TESTS PASSED SUCCESSFULLY!');
  } catch (err) {
    console.error('❌ Email Workflow Test Error:', err);
  }
}

runTest();
