import * as admin from 'firebase-admin';

import serviceAccount from '../../config/FirebaseConfig/index';

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export default admin;
